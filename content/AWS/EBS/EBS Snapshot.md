Related: [[EBS]], [[AWS/EC2/EC2]]

Regionally resilient, hosted on S3

They copy **used** data, future snapshots are incremental.
If you delete incremental EBS snapshot, AWS [[EBS]] "moves" necessary data, so snaphots are kind of self-sufficient.
Great way to copy/move EBS volumes between AZ and Regions
![[Pasted image 20230122011123.png|500]]
You billed gigabyte-month for **only USED** data and incremental data you billed for **changed** data.
# Snapshot Performance
-   When you create a new EBS volume w/o snapshot = EBS ready immidiately
-   If you restore EBS volume from snapshot:
	-   Lazy restore, data fetched from S3 gradually, if you request data which is not yet fetched, it will be pulled directly from S3.
- You can force to system to read (dd in Linux) all block from the volume, which will force S3 to move all data to EBS quicker.
- Fast Snapshot Restore (FSR) – immediate restore from AWS, costs. each combination of FSR + AZ means 1 instance of restore, up to 50 per region.