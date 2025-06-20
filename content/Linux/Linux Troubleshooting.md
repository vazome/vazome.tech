---
date created: 2025-06-21T01:02:28+04:00
date modified: 2025-06-21T03:04:16+04:00
---

# File system
CIFS: Unable to determine destination address
Just install cifs-utils

# Make VM unique

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
# Launch script at startup or reboot
place absolute path to `/etc/rc.local`
or add `@reboot` with your script path intro `/etc/crontab`