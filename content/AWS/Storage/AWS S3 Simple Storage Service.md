---
date created: 2025-06-21T01:26:01+04:00
date modified: 2025-06-29T17:12:28+04:00
---

S3 is a region-based, resilient object storage service. Bucket names are unique, can't represent IP addresses. Soft limit 100 per account, hard limit 1000 per account. Does not have "folders", it represents folders but it's actually a prefix + key (filename). Object size 0B to 5TB. S3 does not have a filesystem (no files or blocks), can't mount to it, just holds files. Great for offload and distribution. S3 is a default to store data in large quantities. 

==S3 charges you for unauthorized requests including 4xx, but now [only the ones you initiated](https://aws.amazon.com/about-aws/whats-new/2024/05/amazon-s3-no-charge-http-error-codes/) after an [incident](https://medium.com/@maciej.pocwierz/how-an-empty-s3-bucket-can-make-your-aws-bill-explode-934a383cb8b1)..., when executing many S3 requests specify region explicitly, so you don't pay for API redirects ==

![[Pasted image 20230122224511.png|500]]
Also AWS Objects can have Metadata (key/value pair), Tags, Version ID.

# S3 Storage Classes

S3 Objects are replicated over 3 AZs and Content-MD5 checksum and CRC are implemented to fix any data corruption. 1 file lost per 10,000 years. Objects are replicated at least across 3 AZs. If object is stored durably, HTTP/1.1 200 OK response is provided by S3 API Endpoint. 
![[Pasted image 20230122224831.png|500]]

- **S3 Standard** – for frequent access to important data. IN is free. No retrieval fee, no minimum size.
- **S3 Standard-IA** – reduction in storage cost, but has retrieval fee. Design for infrequent storage of important data. It's effective to store large files instead of small to optimize the cost. Minimal storage duration 30 days.
- **S3 One Zone-IA** – like Standard IA, but does not replicate data between multiple zones. Do not use for critical data, do not use for frequent access data. May be used for replaceable and infrequent data.
- **S3 Glacier Instant** – Standard IA but for accessing data once per quarter of the year, minimal storage duration for 90 days
- **S3 Glacier Flexible** – holds objects in cold state, you can see them in bucket but you need to start retrieval process, during retrieval your files are stored in Standard IA storage class (temp), you access them, then they are removed. Objects cannot be publicly accessible. For archival data accessible per annual basis. Retrieval job types by warming speed: Expedited 1-5 minutes, Standard 3-5 hours, Bulk 5-12 hours
- **S3 Glacier Deep Archive** – hold objects in frozen state, 180 days minimum storage bill duration, 40KB minimum size. Objects cannot be publicly accessible. Retrieval jobs take longer. For archival data accessible per annual basis. Retrieval job types by warming speed: Standard 12 hours, Bulk up to 48 hours.
- **S3 Intelligent-Tiering** – multiple tiers, analyzes data usage and moves it to appropriate tiers. You pay for used tiers as before and additionally management fee. Used for long-lived data when usage and change rate is unpredictable. ![[Pasted image 20230122224920.png|500]]

# S3 Versioning and MFA

You can enable S3 Bucket Versioning. Any file prior the enablement will get "null" version displayed. Suspending versioning does not delete older versions. Bucket level. You cannot delete versioning if it was enabled. You can suspend versioning. You consume for each version, you pay for versions. Every object has an ID. By default id is NULL. New version has new ID. But you can request specific version by ID. If we try to delete a file without providing ID it will just place a delete marker and all other versions unavailable. You can delete the delete marker, ergo undelete the object. To delete particular file, provide ID. MFA Delete if enabled, requires MFA to delete file versions or change bucket versioning state. Requires MFA Serial number + code via API CALLS

# S3 Encryption

Related: [[S3 Simple Storage Service]], [[Encryption and Encoding]]

## Default bucket encryption
Buckets are not encrypted, but objects are. When you upload an object, it's PutObject operation, which can have a specified header string: `x-amz-server-side-encryption` – AES256, aws:kms. But you can set default encryption, which will be applied if you don't specify header.

(at Transit) When data is moved to/from S3, by default.

(at Rest) Client-side encryption – you generate the key, you provide encrypted data in already encrypted tunnel. AWS does not know contents of your data. Server-side encryption – AWS generates the key and encrypts data in the Cloud. ![[Pasted image 20230122225442.png|500]]

Role separation in data encryption (Example):
- Financiers need access to the keys and data and access to decrypt ciphertext data.
- Administrators even though logically may have access to the keys and encrypted data, must not have access to such resources because this is not within theirs responsibilities.

**Server-side has 3 types:**
## SSE-C
Server-side encryption with customer-provided keys
- Customer manages keys and data.
- S3 Endpoint manages encryption (offload your CPU resources)
- Object is encrypted with your key, key hash is made, key is discarded,
- Object is decrypted with your key, verifies key by comparing hashes, then decrypts data, discards keys and provides plaintext data.
- S3 Storage stores encrypted data and key hash
- Nuances: you manage keys, which can be applicable for regulated environments

## SSE-S3
Server-side encryption with Amazon S3 managed keys
- Customer manages data
- S3 Endpoint generates Root key (invisible for Customer)
- S3 generates unique key per one object and encrypts that object, then Root key encrypts that key and discards plaintext version of it.
- AES256 by default
- S3 Storage stores encrypted data and encrypted unique keys for each object.
- Nuances: you do not manage keys in any way, ergo role separation is not available.

## SSE-KMS
Server-side encryption with KMS keys stored in AWS Key Management Service
- Customer manages data
- KMS generates Root key
- S3 generates unique DEK key per one object and encrypts that object, then Root key encrypts that key and discards plaintext version of it.
- AES256 by default
- S3 Storage stores encrypted data and encrypted DEK unique keys for each object.
- Nuances: you manage KMS key and have logging + fine grained control is available.

# S3 Lifecycle Configuration

Set of rules, they consist of actions. Actions are applied on buckets and objects. There are transition actions and expiration actions (like after 40 days, delete or transition the object.) If first upload object as S3 Standard, you must wait 30 days to transition it, to transition from infrequent to glacier, wait 30 days. Not possible to transition S3 One Zone-IA to Glacier.

# S3 Logging

## Events
Events can be delivered to SNS, SQS and Lambda. Events are implemented with Event notification configuration. Events when objects are created, deleted, restored or replicated. 
![[Pasted image 20230122230722.png|500]] But you may prefer event bridge.

## Access Logging
Logging should be enabled via UI/CLI/API and apply log policy. ![[Pasted image 20230122231408.png|500]] Logging is managed by S3. Logging can be delivered to other bucket. Allows understanding access/audit/usage pattern.

# S3 Access Points & Multi-Region Access Points

Bucket now can have access points which will have its own policies and network access control. Permissions in access point and bucket policy must match. Like bucket allowing access policy, and access policy manages specific permissions. Created via Console or:
`aws s3control create-access-point --name secretcats --account-id 123456789012 --bucket catpics`

[Creating access points - Amazon Simple Storage Service](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-points-policies.html)

Multi-Region Access Points (MRAP): Single S3 endpoint to route request to multiple buckets in different regions. Goes with [[S3 Replication]].

# S3 Object Lock

Can enable for new buckets. For old buckets, contact support. Object lock enables versioning. Object lock feature cannot be disabled. It implements a concept Write-Once-Read-Many (WORM) – No Delete, No Override
- **Retention Period** (specify Days&Years)
  - Mode: **Governance** – retention period set and objects cannot be affected, but special permission can be provided to change that:
    - [[AWS IAM]] permission - `s3:BypassGovernanceRetention`
    - Request: `x-amz-bypass-governance-retention:true` (console UI default)
    - You might use it, to prevent for accidental deletion, process/governance req, testing before Compliance mode.
  - Mode: **Compliance** – object version and retention period settings cannot be removed, adjusted, deleted during retention period (including Root).
  - Minimum being 1-day and no maximum limit.
  ==Do NOT enable it just because, it's important.==
- Legal Holds (ON/OFF)
  - Prevents accidental deletion of critical, for a purpose, objects
  - Object cannot be deleted or changed until the hold is removed.
  - Does not have time, you disable it when you need to.
An object version can have both of these, one/other, none. Bucket default of object lock features can be defined.

# S3 Performance Optimization

[Amazon S3 Transfer Acceleration Tool](https://s3-accelerate-speedtest.s3-accelerate.amazonaws.com/en/accelerate-speed-comparsion.html)
# S3 Uploads

## Single PUT upload
Default is single data stream via PUT method. If a stream fails – upload fails, so restart is required. 5GB data limit.

## Multipart-upload PUT upload
Data is broken up. Required data size is at least 100 mb. Multipart-upload can split max 10,000 part, parts vary 5MB>5GB. Each part is isolated, transfer rates are better.

## S3 Accelerated transfer
Uses edge locations. Bucket name cannot contain periods and it needs to be DNS compatible. Uses closest location edge location. ![[Pasted image 20230122225324.png|500]]

# S3 Pre-signed URL

Provide access to an object in a bucket from public in a limited time. Pre-signed URL require an IAM user. You can do it with role, but it will expire too fast, not good. You can create pre-signed urls for objects you don't have access to. When you use pre-signed url, it has same permissions as identity generated it.

At least:
``` bash
aws s3 presign s3://animals-dv-12323-83/all5.jpg --expires-in 180
```

# S3 Replication

Definable: Storage class in destination, ownership, Replication Time Control (RTC). Replication is not retroactive, requires versioning ON, supports encryption (but not SSE-C). Source account should own objects. No system events (life cycle management), can't replicate Glacier/Glacier Deep Archive, delete markers are not replicated by default. To replicate existing files you can use one-time Batch Operations job.

## Cross-Region Replication (CRP)
IAM is not trusted by other account, S3 bucket policy is required. Purpose: CRP - Global Resilience, CRP - Latency Reduction

## Same-Region Replication (SRP)
Tries both trust [[AWS IAM Role]] by default. Purpose: SRP- Log aggregation, SRP - PROD and TEST Sync, SRP - Data sovereignty

# S3 Resource Policies and Features

A bucket can be used as static website hosting (by enabling the feature). When you delete a specific version of file (by toggling "Show Versions") you delete it permanently, but when you toggle off "Show Versions" you place a delete marker. Can be:
- User-Based
	- [[AWS IAM]] Policies (JSON)
- Resource-Based
- S3 Bucket Policies (JSON too)
	- 1 policy object per bucket
	- Actively uses Principal Element
	- Can allow/deny access to other account
	- Allow/Deny anonymous principals
- ACL (Bucket/Object) 
	- Is LEGACY

**Block Public Access** 
Works over permissions, you must explicitly disable settings to allow settings.![[Pasted image 20230122224748.png|500]]  
We can user policy generator to help us create needed policy