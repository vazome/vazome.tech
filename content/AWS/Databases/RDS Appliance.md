Related: [[RDS]]

AWS RDS has subnet groups
For RDS each instance requires EBS storage
Each AWS RDS Instance can have multiple Database

**StandBy server will sync updates with the Primary as soon it was received by the Primary (cross-AZ)
	Read Replicas are also available, can be scaled out also in the same AZ or even different region**
If backups are created they to be stored in S3 – AWS managed bucket, you won't see it.

|Read Replicas                                                    |Multi-AZ                                                                   |Multi Region (Read)                              |
|-----------------------------------------------------------------|---------------------------------------------------------------------------|-------------------------------------------------|
|If the DB is read-loaded than up to 5 DB Replicas can be deployed|Replication of main DB to other AZ in case of AZ outage, for failover (HA).|Read replicas deployed in other regions          |
|Data is only written to the main DB                              |Data is only read/written to the main DB                                   |Changes written to the main DB                   |
|                                                                 |Can failover only to a single AZ                                           |Optimizes read performance for global connections|
![[Pasted image 20230122215139.png]]
