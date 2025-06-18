Related: [[S3]]

Can enable for new buckets.
For old buckets, contact support.

Object lock enables versioning. Object lock feature cannot be disable it.
It implements a concept Write-Once-Read-Many (WORM) – No Delete, No Override
- **Retention Period** (specify Days&Years)
	- Mode: **Governance** – retention period set and objects cannot be affected, but special permission can be provided to change that:
		- [[IAM]] permission - s3:BypassGovernanceRetention
		- Request: x-amz-bypass-governance-retention:true (console UI default)
		- You might use it, to prevent for accidental deletion, process/governance req, testing before Complicance mode.
	- Mode: **Compliance** – object version and retention period settings cannot be removed, adjusted, deleted during retention period (including Root).
	**-  minimum being 1-day and no maximum limit.**
	==Do NOT enable it just because, it's important.==
- Legal Holds (ON/OFF)
	- Prevents accidental deletion of critical, for a purpose, objects
	- Object cannot be deleted or changed until the hold is removed.
	- Does not have time, you disable it when you need to.!
An object version can have both of these, one/other, none.
Bucket default of object lock features can be defined.
![[Pasted image 20230122231210.png]]