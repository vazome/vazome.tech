[[Encryption and Encoding]]

# SSH
## SSH-KEYGEN

``` shell
ssh-keygen -t rsa -b 2048 -C "Comment" -f outputname
```

## SCP

## SFTP

# GPG
Download key, import it and check it's Public ID 
``` shell
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg  --imp
ort -
gpg --list-keys
```