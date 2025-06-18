Related: [[RDS]]

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

# Replication
You can replicate backups and transaction logs
Get charged for cross-region data copy and the storage in destination region.
Not enabled by default, can be configured in automated backups

# Restores
When you restore it creates a new RDS instance, i.e. new address
You restore to specific point in time
	RPO – good result can be achieved with minimal data loss
	RTO –  recovery is not instant, account that.