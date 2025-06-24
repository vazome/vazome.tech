---
date created: 2025-06-24T21:42:32+04:00
date modified: 2025-06-24T23:38:57+04:00
tags:
  - os/linux
---
A popular syntax to define scheduled jobs programmatically. Used in Linux, open-source tools and many cloud providers' tools.
``` shell
0 * * * * /opt/scripts/worldpay/sftp_worldpay.py >> /var/log/sftp_worldpay.log
*5/ * * * * /opt/scripts/worldpay/sftp_worldpay.py >> /var/log/sftp_worldpay.log
```

Play with it here:
[Crontab.guru - The cron schedule expression generator](https://crontab.guru/)
