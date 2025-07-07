---
tags: [code/python, practice, code/python/mlflow, code/python/jupyter, concept/mlops]
created: 2025-06-29T20:03:44+04:00
modified: 2025-07-07T23:06:48+04:00
---
We will create a project to run PyTorch for our #concept/mlops project 
# Setup
> [!Tip] Use UV
> I cannot recommend enough to use UV, install it and use it instead of poetry, pip, and others. It is multiple times faster and more convenient, and you can swap python versions like gloves.
> [Installation \| uv](https://docs.astral.sh/uv/getting-started/installation)

Let's create the environment, the following will
1. Create a directory
2. Initiate a proper python project there
3. Install necessary packages
``` shell
mkdir pytorch-sandbox && cd pytorch-sandbox
uv init
uv add mlflow torch torchvision torchaudio  --index https://download.pytorch.org/whl/cu128 
```

`uv add` creates `.venv` for us, so it auto executes `uv venv [--python x.xx]`
, but if we don't want to use `uv add`, you may go with old school `uv pip install`.
![[Pasted image 20250605180529.png]]
Our initial directory will contain all necessary boilerplate environment configurations to begin with coding:
![[Pasted image 20250605194251.png]]
For more info on `pyproject.toml` and other environment files, refer to: [Working on projects \| uv](https://docs.astral.sh/uv/guides/projects/)
## Enabling Jupyter
[Using uv with Jupyter \| Using Jupyter from VS Code \| uv](https://docs.astral.sh/uv/guides/integration/jupyter/#using-jupyter-from-vs-code)
I do my work in VSCode, UV has instructions on how to enable Jupyter for UV environment, it's simply:
`uv add --dev ipykernel{:shell}`
## Install MLFlow for experiment tracking
![[MLOps in Process — Jupyter, MLFlow, Airflow#^608101]]

## If you use WSL 2 and Nvidia 
To enable CUDA on WSL Ubuntu 24.04, install the following:
``` shell
wget https://developer.download.nvidia.com/compute/cuda/repos/wsl-ubuntu/x86_64/cuda-wsl-ubuntu.pin
sudo mv cuda-wsl-ubuntu.pin /etc/apt/preferences.d/cuda-repository-pin-600
wget https://developer.download.nvidia.com/compute/cuda/12.9.0/local_installers/cuda-repo-wsl-ubuntu-12-9-local_12.9.0-1_amd64.deb
sudo dpkg -i cuda-repo-wsl-ubuntu-12-9-local_12.9.0-1_amd64.deb
sudo cp /var/cuda-repo-wsl-ubuntu-12-9-local/cuda-*-keyring.gpg /usr/share/keyrings/
sudo apt-get update
sudo apt-get -y install cuda-toolkit-12-9
```

Then place the following variables in your `~/.bashrc` or `~/.zshrc`:
``` shell
export PATH=${PATH}:/usr/local/cuda-12.9/bin
export LD_LIBRARY_PATH=${LD_LIBRARY_PATH}:/usr/local/cuda-12.9/lib64
```

So you can run this to check your graphic card visibility and CUDA information
```shell
nvidia-smi && nvcc --version
```