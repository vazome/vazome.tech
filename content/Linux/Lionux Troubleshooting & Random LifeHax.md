---
date created: 2025-06-17T04:17:58+04:00
date modified: 2025-06-24T23:42:09+04:00
tags:
  - os/linux
---
# Lifehack
I don't use `which`, I rely `type` or even `type -a` to list all possible interpretations.
## BASHRC
Powerline10k 
``` bash
if [ -f /usr/share/powerline/bindings/bash/powerline.sh ]; then
  powerline-daemon -q
  POWERLINE_BASH_CONTINUATION=1
  POWERLINE_BASH_SELECT=1
  source /usr/share/powerline/bindings/bash/powerline.sh
fi
```
1Password SSH integration
``` bash
export PATH="/home/daniel/.local/bin:$PATH"
SSH_AUTH_SOCK=~/.1password/agent.sock
```
## PROFILE
Fucking ssh-agent mate
`eval ssh-agent`
## Launch script at startup or reboot
Place absolute path to `/etc/rc.local`
or add `@reboot` with your script path intro `/etc/crontab`
# Troubleshooting
## File system
CIFS: Unable to determine destination address
Just install cifs-utils

## Make VM unique

``` shell
rm /etc/machine-id
sudo rm -rf /etc/fusioninventory/ /var/lib/fusioninventory-agent/ /etc/machine-id /etc/tenable_tag /var/lib/dbus/machine-id /opt/nessus_agent/

sudo yum remove fusion* nessus* wazuh* ossec* zabbix*
```
- remove machine id
    ```
    rm /etc/machine-id
    rm /var/lib/dbus/machine-id
    init 6
    ```
- regenerate machine id   
    ```
    dbus-uuidgen --ensure
    systemd-machine-id-setup
    ```
- verify
    ```
    cat /etc/machine-id
    hostnamectl
    ```

## Key is stored in legacy trusted.gpg keyring
Example of the output:
``` shell
13 packages can be upgraded. Run 'apt list --upgradable' to see them.
W: https://aquasecurity.github.io/trivy-repo/deb/dists/noble/InRelease: Key is stored in legacy trusted.gpg keyring (/etc/apt/trusted.gpg), see the DEPRECATION section in apt-key(8) for details.
➜  ~ sudo apt-key list
Warning: apt-key is deprecated. Manage keyring files in trusted.gpg.d instead (see apt-key(8)).
/etc/apt/trusted.gpg
--------------------
pub   rsa3072 2019-05-06 [SC] [expires: 2029-05-03]
      2E2D 3567 4616 32C8 4BB6  CD6F E9D0 A361 6276 FA6C
uid           [ unknown] trivy

/etc/apt/trusted.gpg.d/ubuntu-keyring-2012-cdimage.gpg
```
Solution:
`sudo apt-key list`
`sudo apt-key export 6276FA6C | sudo gpg --dearmour -o /etc/apt/trusted.gpg.d/trivy.gpg`