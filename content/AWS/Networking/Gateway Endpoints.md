Related: [[VPC]], [[VPC Routing]]

HA on all subnets (regionally available), not cross-regional

Provides private network access to [[S3 Simple Storage Service]] and [[DynamoDB]], without public IP addressing. Per service per region, associated with one or more subnets.
	Prefix List added to route table which points to Gateway Endpoint![[Pasted image 20230226004244.png]]
	``` bash 
	[ssm-user@ip-10-16-42-141 usr]$ aws s3 ls
	2023-02-25 20:04:34 a4lsecretvpc-bucket-9lb0l3t8cmg9
	[ssm-user@ip-10-16-42-141 usr]$```

Endpoint policy allows finer graded service access.

Also helps enforcing private buckets architecture – creating bucket policy explicitly allow only Gateway Endpoint to connect.

**BEFORE**
![[Pasted image 20230225054359.png]]

**AFTER**
![[Pasted image 20230225054501.png]]