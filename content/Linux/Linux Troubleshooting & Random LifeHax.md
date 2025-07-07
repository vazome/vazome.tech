---
tags:
  - os/linux
created: 2025-07-01T14:17:04+04:00
modified: 2025-07-02T09:58:43+04:00
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
Start ssh-agent with env vars:
`eval ssh-agent`
## Launch script at startup or reboot
Place absolute path to `/etc/rc.local`
or add `@reboot` with your script path intro `/etc/crontab`
# Troubleshooting
## Warning: unable to delete old directory 
This can happen if we have residual files that were not deleted for some reason. Though sometimes responsible packages are present, meaning we have leftover from previous versions or some manually placed configurations, which aren't tracked by `dpkg`:
``` shell
dpkg: warning: unable to delete old directory '/lib/systemd/system-generators': Directory not empty dpkg: warning: unable to delete old directory '/lib/systemd/system/sshd-keygen@.service.d': Directory not empty
```
To check which installed packages are responsible for the files in path:
```shell
sudo dpkg -S /lib/systemd/system-generators/*
sudo dpkg -S /lib/systemd/system/sshd-keygen@.service.d/*
```
In my case all of files were unrelated to installed packages
![[Pasted image 20250702093512.png]]
To check which repo (online) packages are associated with files in path:
```shell
sudo apt install apt-file
sudo apt-file update
apt-file search /lib/systemd/system-generators
apt-file search /lib/systemd/system/sshd-keygen@.service.d
```
We found repo packages responsible for all the files, we should cross reference this output with folder contents.
![[Pasted image 20250702093405.png]]
So far we figured that packages seem to be not installed, but their files remain, strange! Let's actually check if we have these packages:
`dpkg-query --no-pager -l '*systemd*' '*cloud-init*' '*netplan*' '*snapd*' '*openssh*'{:python}`
![[Pasted image 20250702094309.png]]
*Please note that in my original output netplan and cloud-init were actually installed, lost that screenshot*

From all these package we don't need, there is netplan and cloud-init, these are unrelated to WSL, let's remove them:
```shell
sudo apt-get purge cloud-init netplan-generator netplan.io python3-netplan
sudo apt-get update
sudo apt-get install -f
sudo apt-get autoremove
sudo apt-get autoclean
```
## File system
CIFS: Unable to determine destination address
Just install `cifs-utils`

## Make VM unique (CentOS/RHEL)
``` shell
rm /etc/machine-id
# also remove any monitoring software packages and folders
```
- Remove existing machine ID
```shell
sudo rm /etc/machine-id
sudo rm /var/lib/dbus/machine-id
sudo init 6
```
- Regenerate machine ID
```shell
sudo dbus-uuidgen --ensure
sudo systemd-machine-id-setup
```
- Verify machine ID
```shell
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