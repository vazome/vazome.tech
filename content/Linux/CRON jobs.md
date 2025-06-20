A popular syntax to define scheduled jobs programmatically. Used in Linux, open-source tools and many cloud providers' tools.
``` shell
0 * * * * /opt/scripts/worldpay/sftp_worldpay.py >> /var/log/sftp_worldpay.log
*5/ * * * * /opt/scripts/worldpay/sftp_worldpay.py >> /var/log/sftp_worldpay.log
```

