Related: [[S3 Simple Storage Service]], [[EBS]], [[EFS]], [[content/AWS/RDS/RDS]], [[Amazon Aurora]], [[public/AWS/EC2/EC2]] 

Multi-account, multi-region backup service.
Consolidates management of backups in one place.

Consists of:

- Backup plans -  frequency, windows, cycles, vault, region to region copy, cron..
- Resources - ditto that are backed up
- Vaults - destination container for backups (assign KMS key for encryption)
- Vault Lock - [Write once read many - Wikipedia](https://en.wikipedia.org/wiki/Write_once_read_many) for compliance, 72 hours cool off before enable, then even AWS can't delete
- On-demand backups
- PITR - Point in time recovery

[Backup & Restore Services | Amazon Web Services](https://aws.amazon.com/backup-restore/services/)