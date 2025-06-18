Related: [[RDS]]

# Instance architecture
One primary and one stand-by RDS instance with (commitment) synchronous replication
Not being a free tier
One StandBy only.. Which can't be used for read and write
Failover 60-120 seconds (Changing DNS CNAME)
Backups are taken from the standby server.
![[Pasted image 20230122215413.png|600]]

# Cluster architecture
One writer to two readers standby servers. Writer can be used for writes and reads. Readers only reads.
The data is committed when +1 reader finished writing
Has endpoint
	Cluster endpoint points to the writer db used by RW and administrative functions
	Read endpoint directs read operations to read db replicas
	Instance endpoint points to a specific instance (used for testing and fault finding)
Readers can be in different Azs
Faster hardware, Graviton + NVME
	Writes stored on local fast storage and then flushed to EBS
Replication is via transaction logs (more efficient)
Failover ~35 seconds to failover + time required to apply transaction logs to reader instance.
![[Pasted image 20230122215635.png|600]]