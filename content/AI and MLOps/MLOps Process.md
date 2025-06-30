---
tags:
  - concept/mlops
  - practice
  - code/python/mlflow
  - code/python/jupyter
created: 2025-06-29T20:03:44+04:00
modified: 2025-06-30T06:30:38+04:00
---
Very basic ML Experiment:
[03-training-ride-prediction.ipynb](https://raw.githubusercontent.com/vazome/mlops-zoomcamp-epam/main/01-intro/03-training-ride-prediction.ipynb)

# Tracking and Management with MLFlow
Use ml flow for experiment: tracking, logging and statistical insights.
You can start UI and provide different backend db with: `mlflow ui --backend-store-uri sqlite:///mlflow.db{:shell}`
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

