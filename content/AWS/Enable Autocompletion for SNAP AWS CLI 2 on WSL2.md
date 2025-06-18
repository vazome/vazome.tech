---
date created: 2025-06-13T02:28:49+04:00
date modified: 2025-06-13T02:32:21+04:00
tags:
  - "#aws/cli"
  - aws
  - shell
  - "#wsl"
---
> [!question] Issue
> AWS documentation does explain how to enable autocompletition for AWS CLI installed via official snap package.

Suppose you install AWS CLI the following way (with or without sudo):
```shell
snap install aws-cli --classic
```
Snap autocompletition would be located here:
``` shell
/snap/aws-cli/current/bin/aws_completer  
```
Add this to `~/.zshrc` :
``` shell
autoload -U +X bashcompinit && bashcompinit
autoload -Uz compinit && compinit
complete -C '/snap/aws-cli/current/bin/aws_completer' aws
```
Then source the environment:
```shell
source ~/.zshrc
```

You may encounter:
```
_zsh_highlight_widget_orig-s000-r241-orig-s000-r869-orig-s000-r479-accept-line:3: maximum nested function level reached; increase FUNCNEST?
```
As reported here [\[bug\]: maximum nested function level reached · Issue #65 · zdharma-continuum/fast-syntax-highlighting](https://github.com/zdharma-continuum/fast-syntax-highlighting/issues/65) which can be temporary fixed by:
``` shell
export FUNCNEST=1000
```