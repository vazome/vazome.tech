---
tags:
  - concept/mlops
  - practice
  - code/python/mlflow
  - code/python/jupyter
created: 2025-06-29T20:03:44+04:00
modified: 2025-07-01T09:00:44+04:00
---
Very basic ML Experiment:
[03-training-ride-prediction.ipynb](https://raw.githubusercontent.com/vazome/mlops-zoomcamp-epam/main/01-intro/03-training-ride-prediction.ipynb)

# Tracking and Management with MLFlow
Use MLFlow for experiment: tracking, logging and statistical insights, it is integrated within [[Databricks]]. Modern way to install it in a python project is `uv add mlflow{:shell}` ^608101

You can start UI and provide different backend like: `mlflow ui --backend-store-uri sqlite:///mlflow.db{:shell}`
![[Pasted image 20250628113950.png]]
Within your experiment, to log with mlflow you track specific parameters with `mlflow.log*{:python}` method and to automatically log most of the stuff with [MLFlow autolog](https://mlflow.org/docs/latest/ml/tracking/autolog). Ideally combine both, for explicit logging, utilize `mlflow.log_params(params_dict){:python}`
![[Pasted image 20250629201041.png]]

You can load a saved model via:
``` python
import mlflow.pyfunc
model = mlflow.pyfunc.load_model(model_uri="models:/<model_name>/<version_or_alias>")
result = model.predict(data)
```
more options here: [Load a Registered Model \| MLflow](https://mlflow.org/docs/latest/ml/getting-started/registering-first-model/step3-load-model)

You can control MLFlow within python via 

```python
from mlflow.tracking import MlflowClient
client = MlflowClient()
```

![[Pasted image 20250701081724.png]]

`client.search_runs` does not return `runs[0].outputs{:python}` even though in Jupyter I can see for some reason, the following on the bottom **will not** work:
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