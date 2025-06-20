---
date created: 2025-06-17T04:17:58+04:00
date modified: 2025-06-17T04:18:42+04:00
tags:
  - linux
---
I don't use `which`, I rely `type` or even `type -a` to list all possible interpretations.
### BASHRC
``` bash
if [ -f /usr/share/powerline/bindings/bash/powerline.sh ]; then
  powerline-daemon -q
  POWERLINE_BASH_CONTINUATION=1
  POWERLINE_BASH_SELECT=1
  source /usr/share/powerline/bindings/bash/powerline.sh
fi

export PATH="/home/daniel/.local/bin:$PATH"
GSH_AUTH_SOCK=~/.1password/agent.sock
```
### PROFILE
Fucking ssh-agent mate
`eval ssh-agent`