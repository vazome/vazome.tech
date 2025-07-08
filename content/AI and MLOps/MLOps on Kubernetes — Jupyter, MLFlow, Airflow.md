---
tags:
  - concept/mlops
  - practice
  - code/python/mlflow
  - code/python/jupyter
  - dataeng/airflow
  - code/jupyter
aliases:
  - "mlops-kubernetes-setup"
created: 2025-06-29T20:03:44+04:00
modified: 2025-07-08T13:05:22+04:00
---
This setup mostly fits for the development environment, in the future articles we will discuss production deployment.
# Experiments in Jupyter
At first we start with Jupyter, but Jupyter does not scale well if we are on to model deployment.
![[Boilerplate of an ML Python Project#Enabling Jupyter]]

Here is Jupyter note showcasing linear regression model.
[03-training-ride-prediction.ipynb](https://github.com/vazome/mlops-zoomcamp-epam/blob/main/01-intro/03-training-ride-prediction.ipynb)

# A Brief Into MLFlow
Use MLFlow for experiment: tracking, logging and statistical insights and it is supported by within [[Databricks]]. You can install it in a python project via `uv add mlflow{:shell}` ^608101

To start MLFlow tracking server: `mlflow ui --backend-store-uri sqlite:///mlflow.db{:shell}` — MLFlow supports remote artifact stores, such as AWS S3 [Artifact Stores \| MLflow](https://mlflow.org/docs/latest/ml/tracking/artifact-stores/)
![[Pasted image 20250628113950.png]]
Within your experiment, MLFlow provides a way to log parameters, models, and artifacts with `mlflow.log*{:python}` methods (like `mlflow.log_params(params_dict){:python}`) and to automatically log variety of the data utilize [MLFlow autolog](https://mlflow.org/docs/latest/ml/tracking/autolog). But keep in mind that autolog won't register a model for you.
![[Pasted image 20250629201041.png]]

You can load a saved model with:
``` python
import mlflow.pyfunc
model = mlflow.pyfunc.load_model(model_uri="models:/<model_name>/<version_or_alias>")
result = model.predict(data)
```
more options here: [Load a Registered Model \| MLflow](https://mlflow.org/docs/latest/ml/getting-started/registering-first-model/step3-load-model)

You can control MLFlow within python with:
```python
from mlflow.tracking import MlflowClient
client = MlflowClient()
```

![[Pasted image 20250701081724.png]]

`client.search_runs` does not return `runs[0].outputs{:python}` even though in Jupyter I can see for some reason, the following on the bottom **may not** work:
``` python
experiment_id = client.get_experiment_by_name("random-forest-hyperopt").experiment_id

runs = client.search_runs(experiment_ids=experiment_id, order_by=["metrics.rmse ASC"])

model_id = runs[0].outputs.model_outputs
```

Instead get a run directly:
``` python
experiment_id = client.get_experiment_by_name("random-forest-hyperopt").experiment_id

runs = client.search_runs(experiment_ids=experiment_id, order_by=["metrics.rmse ASC"])

run_id = runs[0].info.run_id

model_id = client.get_run(run_id).outputs.model_outputs[0].model_id
```

Permanently delete an experiment:
``` shell
mlflow gc --backend-store-uri sqlite:///mlflow.db --experiment-ids 4 --tracking-uri http://127.0.0.1:5000
```

## Kubernetes Deployment
Kubernetes comes in handy in implementation of MLOps.
Firstly we would need an image, let's create a dockerfile. This way we can have more granular control of what goes into it, instead of relying on developer images.
``` dockerfile
FROM python:3.12-slim-bookworm
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

RUN apt-get -y update && \
    apt-get -y install python3-dev build-essential curl pkg-config

RUN uv init

RUN uv add mlflow boto3 psycopg2-binary

CMD ["bash"]
```

Build it: `docker build  --tag mlflow:0.0.1 . -f 03-orchestration/mlflow.dockerfile{:python}`

![[Apache Airflow#^330462]]

We will assume we are deploying it along side [pre-existing PostgreSQL Database](https://www.digitalocean.com/community/tutorials/how-to-deploy-postgres-to-kubernetes-cluster) within the same namespace:
``` yaml title="mlflow-deployment.yaml"
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mlflow-artifacts-pvc
  namespace: mlflow
spec:
  storageClassName: standard
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mlflow-deployment
  namespace: mlflow
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mlflow
  template:
    metadata:
      labels:
        app: mlflow
    spec:
      containers:
      - name: mlflow
        image: mlflow:0.0.1
        ports:
        - containerPort: 5000
        env:
          #- name: MLFLOW_S3_IGNORE_TLS
           # value: "true"
          - name: POSTGRES_USER
            valueFrom:
              secretKeyRef:
                name: postgres-secret
                key: postgres-user
          - name: POSTGRES_PASSWORD
            valueFrom:
              secretKeyRef:
                name: postgres-secret
                key: postgres-password
          - name: POSTGRES_DB
            valueFrom:
              secretKeyRef:
                name: postgres-secret
                key: postgres-db
        command: ["uv", "run", "mlflow", "server", "--host", "0.0.0.0", "--port", "5000", "--backend-store-uri", "postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@postgres-service:5432/$(POSTGRES_DB)"]
        volumeMounts:
          - name: mlflow-artifacts
            mountPath: /mlflow/artifacts
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
      volumes:
        - name: mlflow-artifacts
          persistentVolumeClaim:
            claimName: mlflow-artifacts-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: mlflow
  namespace: mlflow
spec:
  selector:
    app: mlflow
  ports:
  - port: 5000
    targetPort: 5000
  type: ClusterIP
```

# Orchestration via Apache Airflow
> [!Error] Orchestrator not Executor
> It is recommended to avoid learning, transforming and generally working with large data in Apache Airflow and utilize [[Apache Spark]] or alternatives instead.
> 
> If we work with large datasets they may overload XCom and crash the DAG. For me 1GB in-memory was large enough to consider alternatives. 

![[Apache Airflow#Deploy via Helm]]

## Communication: Airflow to MLFlow
We can we provide tracking server URL like we did normally and fully communicate with MLFlow. 
``` python title="taxi_predicton"
@task
def train_model(x_train, y_train, x_val, y_val, dv):
	log = logging.getLogger("airflow.task")
	log.info("Starting model training.")
	mlflow.set_tracking_uri(MLFLOW_TRACKING_URI)
	mlflow.set_experiment("nyc-taxi-experiment")
	#...
	mlflow.sklearn.log_model(
		sk_model=lr,
		artifact_path="model",
		registered_model_name="nyc-taxi-yellow-prediction",
	)
```
![[Pasted image 20250707191809.png]]
Though there is a concern, considering isolated nature of tasks, we pass data between them with XCom. 

At [[Apache Airflow]] article you can find more info on deployment and configuration.