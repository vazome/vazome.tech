---
date created: 2025-06-20T15:55:51+04:00
date modified: 2025-06-21T01:52:59+04:00
---

# RDS

Relational DB Service with backups and scaling (vertical/horizontal)
Key thing is that it does not appear as a DBaaS but as Database Server as a Service (DBSaaS)
Multiple databases can be setup on one DB server. There is not SSH/OS access.

Multi-AZ setup for ONLY DR. [Amazon RDS Multi AZ Deployments | Cloud Relational Database | Amazon Web Services](https://aws.amazon.com/rds/features/multi-az/)
[[AWS Amazon Aurora]] is not RDS, but has similarities and integrates with RDS.
![[Pasted image 20230122215226.png|500]]

# RDS Appliance
AWS RDS has subnet groups
For RDS each instance requires EBS storage
Each AWS RDS Instance can have multiple Database

**StandBy server will sync updates with the Primary as soon it was received by the Primary (cross-AZ). Read Replicas are also available, can be scaled out also in the same AZ or even different region**

If backups are created they to be stored in S3 – AWS managed bucket, you won't see it.

|Read Replicas                                                    |Multi-AZ                                                                   |Multi Region (Read)                              |
|-----------------------------------------------------------------|---------------------------------------------------------------------------|-------------------------------------------------|
|If the DB is read-loaded than up to 5 DB Replicas can be deployed|Replication of main DB to other AZ in case of AZ outage, for failover (HA).|Read replicas deployed in other regions          |
|Data is only written to the main DB                              |Data is only read/written to the main DB                                   |Changes written to the main DB                   |
|                                                                 |Can failover only to a single AZ                                           |Optimizes read performance for global connections|
![[Pasted image 20230122215139.png]]

# RDS Backup, Snapshots and Restore

If backups are created they to be stored in S3 AWS managed bucket, you won't see it.
S3 Backups are regionally resilient.
[https://aws.amazon.com/rds/faqs/](https://aws.amazon.com/rds/faqs/)

Affects IO in occurred on primary.
Transaction logs (operations on DB) written to S3 every 5 minutes. In theory RPO 5 minutes.

Backups taken from StandBy if MultiAz is enabled.
	Backups allow point in time recovery. Basically scheduler snapshots
	Retention 0 to 35 days (0 - auto backups are disabled, 35 - restore at any point in time within this window)
	When you delete instance you can choose to retain auto backups but they are still subjected to retention. But you can create final snapshot when you delete instance, which can be deleted only manual
Snapshots are not automatic
	Don't allow point in time recovery
	Incremental.
	Live separately from instance

## Replication
You can replicate backups and transaction logs
Get charged for cross-region data copy and the storage in destination region.
Not enabled by default, can be configured in automated backups

## Restores
When you restore it creates a new RDS instance, i.e. new address
You restore to specific point in time
	RPO – good result can be achieved with minimal data loss
	RTO –  recovery is not instant, account that.

# RDS Multi-AZ

## Instance architecture
One primary and one stand-by RDS instance with (commitment) synchronous replication
Not being a free tier
One StandBy only.. Which can't be used for read and write
Failover 60-120 seconds (Changing DNS CNAME)
Backups are taken from the standby server.
![[Pasted image 20230122215413.png|600]]

## Cluster architecture
One writer to two readers standby servers. Writer can be used for writes and reads. Readers only reads.
- The data is committed when +1 reader finished writing
- Has endpoint
	- Cluster endpoint points to the writer db used by RW and administrative functions
	- Read endpoint directs read operations to read db replicas
	- Instance endpoint points to a specific instance (used for testing and fault finding)
- Readers can be in different Azs
- Faster hardware, Graviton + NVME
	- Writes stored on local fast storage and then flushed to EBS
- Replication is via transaction logs (more efficient)
- Failover ~35 seconds to failover + time required to apply transaction logs to reader instance.
![[Pasted image 20230122215635.png|600]]

# RDS Read Replicas (RR)

- 5 read replicas can be created per DB instance
- Can be cross-regional
- Read replicas can have read replicas (but can eventually become laggy)
- Global performance improvement
- [[RTO]] are still a problem
- [[RPO]] are near 0, quick promotion
- Can be promoted quickly
- Failover works out when there is no data corruption, if data corruption happened, then it is replicated to read replica and read replica becomes corrupted too.

# RDS Custom
Is an RDS Instance, but some system level access as in [[EC2]] is preserved. Fills the gap between RDS and EC2 DB. You can connect with SSH, RDP, Session Manager.
Supports only MS SQL/Oracle. 

==Actually present on account, you will see EBS volumes and EC2 instances.==

For customization of RDS Custom requires pausing **RDS Custom Database Automation** at the time customization is made
![[Screenshot 2023-01-24 at 02.09.30.png]]

# RDS Proxy

It maintains a pools of connections which are open and closing, but your applications only access the proxy. Your application won't need to establish new TCP/UDP connections to a DB. 
- Fully managed (for you)
- Has autoscaling, [[Resilience and Reliability#High availability (HA)]] by default
- ==Only accessible from VPC==, access vi proxy endpoint,
- Can enforce [[TLS and SSL]],
- Can reduce failover time by over 60% for [[AWS Amazon Aurora]]
- Abstracts failure for application (application will just wait until Proxy makes a connection to the other DB in case of DB fail)
![[Pasted image 20230128234424.png|500]]
On can help to reduce number of **direct** connections to DB by using [Multiplexing - Wikipedia](https://en.wikipedia.org/wiki/Multiplexing)
Useful when:
- ﻿Too many connections errors...
- DB Instances using `T2`/`T3` (i.e smaller/burst) instances
- ﻿﻿AWS Lambda ... time saved/connection reuse & IAM Auth
- ﻿﻿Long running connections (SAAS apps) - low latency
- ﻿﻿Where resilience to database failure is a priority...
- ﻿﻿... RDS proxy can reduce the time for failover
- .. and make it transparent to the application
# Billing
- Billed per Instance size/type (like in EC2) – hourly per second
- Multi-AZ extra additional costs
- Storage type & amount (like EBS)
- Data transfer
- Backups & Snapshots (you receive free storage for backup which equal to your storage disk size). GB per month.
- Licensing, commercial plans