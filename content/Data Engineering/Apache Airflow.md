---
created: 2025-07-07T14:31:02+04:00
modified: 2025-07-07T23:04:26+04:00
tags:
  - practice
  - dataeng/airflow
  - code/python
---
# Theory
==TBD==
## Execution
![[Apache Spark#DAG and how it works]]
# Deploy

> [!info]
> Screenshots were taken at different hours, so expect light/dark modes switches.

## Prepare Airflow DAGs 
We can use TaskFlow API to create DAG instead of "old school" `PythonOperator`, `BashOperator`, etc; use wrappers to create tasks.

We define `@dag{:python}` wrapper and there we can also [parameterize](https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/params.html) the script, this especially comes useful when we intend to reuse the script. Set `render_template_as_native_obj=True{:python}` to preserve parameter types, by default airflow converts them to strings.
``` python title="dags/s3_upload_test.py"
# ...
default_args = {"owner": "airflow", "start_date": datetime.now(timezone.utc), "retries": 0}

@dag(
    dag_id="upload_to_s3_test",
    default_args=default_args,
    schedule=None,  # Manual trigger only
    catchup=False,
    start_date=datetime.now(timezone.utc),
    tags=["s3", "upload", "test"],
    params={
        "name": Param(
            "Hello",
            type="string",
            title="Name",
            description="Name of the file to upload to S3",
        ),
        "contents": Param(
            "Hi! I'm a test file",
            type="string",
            title="Contents",
            description="Contents of the file to upload to S3",
        ),
    },
    render_template_as_native_obj=True,
)
```

Functions are wrapped in tasks, which reside under main function, in this case `upload_to_s3_test(){:python}`. 

> [!tip]
> If we need custom logging we must define `log = logging.getLogger("airflow.task"){:python}` at the beginning of each task and then log what we need. ![[Pasted image 20250707175814.png]]*Such logs will be marked by source=airflow.task*

`get_params(){:python}` - Here we implement parameter processing function, so that we can use them like `argparse` for continuous tasks. Notice the usage of `multiple_outputs=True`, this tells Airflow to process each return object separately within XCom.

`save_objects_to_s3(){:python}` - With S3Hook we can use previously created S3 Connection within Airflow. This script assumes we provided bucket_name during connection creation.![[Pasted image 20250707174629.png]]
``` python title="dags/s3_upload_test.py"
# ...
@dag(
# ...
)
def upload_to_s3_test():
    @task(multiple_outputs=True)
    def get_params(**context):
        log = logging.getLogger("airflow.task")
        params = context["params"]
        name = params["name"]
        contents = params["contents"]
        log.info("Extracted parameters: name=%s, contents=%s", name, contents)
        return {"name": name, "contents": contents}

    @task
    def save_objects_to_s3(name: str, contents: str):
        log = logging.getLogger("airflow.task")
        hook =  S3Hook(aws_conn_id="S3")
        conn = Connection.get_connection_from_secrets("S3")
        bucket_name = conn.extra_dejson.get('bucket_name') #get('service_config', {}).get('s3', {}).
        hook.load_string(
                    string_data=f"{contents}",
                    key=f"{name}.txt",
                    bucket_name=bucket_name,
                )
        log.info(f"Uploaded to s3://{bucket_name}/{name}.txt")

    # Define task instances and dependencies
    params = get_params()
    save_to_s3 = save_objects_to_s3(name=params["name"], contents=params["contents"])


# Instantiate the DAG
dag_instance = upload_to_s3_test()

if __name__ == "__main__":
    dag_instance.test()
```

Lastly we define task instance order by simply executing them. The `dag_instance.test(){:python}` part is useful if we want to execute script in local environment e.g. from terminal.
![[Pasted image 20250707175552.png]]
``` python title="dags/s3_upload_test.py"
# ...
@dag(
# ...
)
def upload_to_s3_test():
    @task(multiple_outputs=True)
    def get_params(**context):

    @task
    def save_objects_to_s3(name: str, contents: str):

    # Define task instances and dependencies
    params = get_params()
    save_to_s3 = save_objects_to_s3(name=params["name"], contents=params["contents"])


# Execute the DAG
dag_instance = upload_to_s3_test()

# Enable local execuition and testing
if __name__ == "__main__":
    dag_instance.test()
```
## Deploy via Helm
Airflow allows us to [extend image](https://airflow.apache.org/docs/docker-stack/build.html) to add more python packages or additional configurations. Let's do both. 

Suppose we need `mlflow` and couple of other libraries we have in our project:
``` toml title="pyproject.toml"
# ...
airflow-server = [
    "mlflow>=3.1.1",
    "xgboost>=3.0.2",
    "pandas>=2.3.0",
    "hyperopt>=0.2.7",
    "scikit-learn>=1.7.0",
]
# ...
```

Let's extend image with `uv pip`.
``` dockerfile title="airflow.dockerfile"
FROM apache/airflow:3.0.2

# Another way is to define image as argument variable
# ARG AIRFLOW_IMAGE_NAME 
# FROM ${AIRFLOW_IMAGE_NAME}
# and then pass the arg docker build ... --build-arg AIRFLOW_IMAGE_NAME=$AIRFLOW_IMAGE_NAME 

COPY pyproject.toml ./
RUN uv pip install --no-cache --group airflow-server
```

Now we can build the image from dockerfile.
``` shell
docker build --pull --tag my-airflow:0.0.1 . -f airflow.dockerfile
```

> [!attention]
> If your K8S is setup via kind you can load extended image into K8S as such:
> ``` shell
> kind load docker-image name:version
> ```

^330462

To provide additional configuration, since we deploy though Helm in K8S we would extend the chart. We can let's learn more from the docs: 
- [Extending the Chart — helm-chart Documentation](https://airflow.apache.org/docs/helm-chart/stable/extending-the-chart.html) 
- [Production Guide — helm-chart Documentation](https://airflow.apache.org/docs/helm-chart/stable/production-guide.html#values-file)
One simple way to extend it is to use [Helm \| Values Files](https://helm.sh/docs/chart_template_guide/values_files/) `values.yaml` to store configuration information, lets point Airflow to look for DAGs in remote GitHub (you would need to specify credentials for private).
``` yaml title="airflow-values.yaml"
dags:
  gitSync:
    enabled: true
    repo: repo_url.git
    branch: main
    subPath: folder/sub_folder
    period: 5s
    #sshKeySecret:
```

Configuration is ready for deployment, this will create airflow deployment and the boilerplate:
``` shell
helm upgrade --install airflow apache-airflow/airflow --namespace airflow --create-namespace \
    --set images.airflow.repository=my-airflow \
    --set images.airflow.tag=0.0.1 \
    -f aifrflow-values.yaml
```

![[Pasted image 20250707145834.png]]
## Access Airflow UI
To access Airflow API Server from host we need to port forward:
``` shell
kubectl port-forward svc/airflow-api-server 8080:8080 --namespace airflow
```

![[Screenshot 2025-07-03 090436.png]]
First thing I saw once logged in the console were DAG Import errors, these came from `tests_common` module provided by Airflow. One script couldn't load a module. Generally DAG import errors are easily fixable, for me usually it's either me forgetting to remove and argument after refactoring or TaskFlow task order issue.
![[Screenshot 2025-07-03 091245.png]]*Airflow would print status of import and stack trace.*

The task interface is friendly.![[Pasted image 20250707165322.png]]