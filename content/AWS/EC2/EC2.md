**Instances** are run on **EC2 Hosts**

EC2 Hosts can be shared (share hardware with other people) and dedicated (you have dedicated hardware)
Can have multiple network interfaces.
**Instance is an AZ resilient.**

Instance is relocated to different host in same AZ if it was stopped/started (not reboot) or AWS having maintenance on hardware.

Good for traditional for OS+App compute.
Long-running compute.
For Server style compute
Burst/steady-state load.
Monolithic app stack.
Migrated applications and workload, DR.
