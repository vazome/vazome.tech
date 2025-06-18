---
date created: 2025-06-05T17:16:06+04:00
date modified: 2025-06-18T09:09:25+04:00
tags: [ml, code/python]
---
We will create a project to run PyTorch for our #ml project
# Setup
> [!Tip] Use UV
> I cannot recommend enough to use UV, install it and use it instead of poetry, pip, and others. It is multiple times faster and more convenient, and you can swap python versions like gloves.
> [Installation \| uv](https://docs.astral.sh/uv/getting-started/installation)

Let's create the environment, the following will
1. Create a directory
2. Initiate a proper python project there
3. Install PyTorch
``` shell
mkdir pytorch-sandbox && cd pytorch-sandbox
```
---
``` python-r
uv init
uv add torch torchvision torchaudio  --index https://download.pytorch.org/whl/cu128 
```

`uv add` creates `.venv` for us, so it auto executes `uv venv [--python x.xx]`
, but if we didn't want to use `uv add`, we could go with `uv pip install` .
![[Pasted image 20250605180529.png]]
## Enabling Jupyter
[Using uv with Jupyter \| Using Jupyter from VS Code \| uv](https://docs.astral.sh/uv/guides/integration/jupyter/#using-jupyter-from-vs-code)
I work in VSCode, UV has instruction on how we can enable Junyper to work with UV environment.
in
``` python-r
uv add --dev ipykernel
```

Our initial directory will contain all necessary boilerplate environment configurations to begin with coding:
![[Pasted image 20250605194251.png]]
## If you use WSL 2 
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