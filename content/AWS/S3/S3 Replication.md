Related: [[S3]]

Definable: Storage class in destination, ownership, Replication Time Control (RTC)

Replication is not retroactive, requires versioning ON, supports encryption (but not SSE-C)
Source account should own objects.
No system events (life cycle management), can't replicated Glacier/Glacier Deep Archive, delete
Markers are not replicated by default.
To replicate existing files you can user one-time Batch Operations job

# Cross-Region Replication (CRP)
IAM is not trusted by other account, S3 bucket policy is require
Purpose:
	CRP - Global Resilience
	CRP - Latency Reduction
# Same-Region Replication (SRP)
Tries both trust [[IAM Role]] by default
Purpose:
	SRP- Log aggregation
	SRP - PROD and TEST Sync
	SRP - Resilience with strict sovereignty


