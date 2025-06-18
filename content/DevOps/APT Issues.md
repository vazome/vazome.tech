## Key is stored in legacy trusted.gpg keyring
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

`sudo apt-key list`

`sudo apt-key export 6276FA6C | sudo gpg --dearmour -o /etc/apt/trusted.gpg.d/trivy.gpg`