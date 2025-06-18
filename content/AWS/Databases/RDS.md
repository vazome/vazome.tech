Relational DB Service with backups and scaling (vertical/horizontal)
Key thing is that it does not appear as a DBaaS but as Database Server as a Service (DBSaaS)
Multiple databases can be setup on one DB server. There is not SSH/OS access.

Multi-AZ setup for ONLY DR. [Amazon RDS Multi AZ Deployments | Cloud Relational Database | Amazon Web Services](https://aws.amazon.com/rds/features/multi-az/)
[[Amazon Aurora]] is not RDS, but has similarities and integrates with RDS.
![[Pasted image 20230122215226.png|500]]

# RDS Proxy
It maintains a pools of connections which are open and closing, but your applications only access the proxy. Your application won't need to establish new TCP/UDP connections to a DB. Fully managed (for you), has autoscaling, [[HA vs FT vs DR#High availability (HA)]] by default, ==only accessible from VPC==, access vi proxy endpoing, can enforce [[TLS and SSL]], can reduce failover time by over 60% for [[Amazon Aurora]], abstracts failure for application (application will just wait until Proxy makes a connection to the other DB in case of DB fail)
![[Pasted image 20230128234424.png|500]]
On can help to reduce number of **direct** connections to DB by using [Multiplexing - Wikipedia](https://en.wikipedia.org/wiki/Multiplexing)
Useful when:
- ﻿Too many connections errors...
- DB Instances using T2/T3 (i.e smaller/burst) instances
- ﻿﻿AWS Lambda ... time saved/connection reuse & IAM Auth
- ﻿﻿Long running connections (SAAS apps) - low latency
- ﻿﻿Where resilience to database failure is a priority...
- ﻿﻿... RDS proxy can reduce the time for failover
- .. and make it transparent to the application
# Billing

Billed per Instance size/type (like in EC2) – hourly per second
Multi-AZ extra additional costs
Storage type & amount (like EBS)
Data transfer
Backups & Snapshots (you receive free storage for backup which equal to your storage disk size)
	GB per month
Licensing, commercial plans