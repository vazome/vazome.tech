To transition a classic wordpress instance into a scaleable and HA workload

We need to migrate its DB into AWS RDS, then should make Launch Template which will include deployment of a WordPress instance but without creating internal DB.

Then we create an ALB in 3 AZs+ and use its endpoint as instance's address in our MySQL RDS – this is done by User Mode, but can be accomplished without it too.

Next is an ASG which is connected to our ALB target group and configure CloudWatch Alarms for monitoring EC2 CPULOAD metric, which will trigger scaling automation.
![[telegram-cloud-photo-size-2-5400282825208482608-y.jpg]]