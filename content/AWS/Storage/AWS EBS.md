---
date created: 2025-06-21T01:26:01+04:00
date modified: 2025-06-21T03:08:04+04:00
---
EBS (Elastic Block Store) is a storage type you connect to an instance, considered a network drive. Can function as main drive and be reattached to other instance. By default can be connected to one instance at a time, but there is a multi-attach feature. Instances create FS on storages.

Locked to Availability Zone but can be moved via [[EBS Snapshot]]. Limited to capacity – Size/IOPS.

**AZ Resilient, 1 AZ! Generally attached to 1 Instance at a time.** Can be detached. Persistent until you delete. You can backup EBS Volume into S3 in a form of a snapshot to have region resilience.

Provides SSD, HiPerf-SSD, etc. Billed GB-month, in some cases performance.
![[Pasted image 20230122002215.png]]

# EBS General Purpose (GP)

Related: [[EBS]]

## GP2
Good for boot volumes and initial workloads, desktop envs. Can be as small as 1 GB and as big as 16 TB
- Has IO credit allocation:
  - 1 IO credit is 16 KB of data
  - 1 IOPS is 1 IO in 1 Second
- Each GP2 has baseline performance:
  - IO 'credit bucket' capacity is 5.4 million IO credits, starts with 5.4 million
  - The bucket fills with 100 IO credits per second.
  - Beyond minimum 100 IO credit it increases per 3 IO cr. per second, per GB of volume size.
  - Fill rate of 16,000 IOPS per second is max.
  - Burst up to 3,000 IOPS by depleting the bucket
  - Volumes over 1TB don't use credit system

## GP3
Good for boot volumes and initial workloads, desktop envs, single instance DBs. Benefits of both GP2 and IO1. 3,000 IOPS & 125MiB/s – Standard. Extra cost for up to 16,000 IOPS & 1000MiB/s (4x Faster Max throughput than GP2). GP3 is 20% cheaper than GP2, for standard-base price.

# EBS HDD-Based

Related: [[EBS]]

## st1 - Throughput Optimized
Cheap. 1 IO block size is 1MB. MAX is 500 IOPS = 500 MB/s. 40 MB/s/TB Base, 250 MB/s/TB Burst. Works like GP2 credit bucket. Frequent access with cost concern. Big data, data warehouses, log processing.

## sc1 - Cold HDD
Cheap. 1 IO block size is 1MB. MAX is 250IOPS = 250MB/s. 12 MB/s/TB Base, 80 MB/s/TB Burst. Works like GP2 credit bucket. Cold data requiring few scans per day.

# EBS Provisioned IOPS (io1/io2)

Related: [[EBS]]

Provides consistent low latency. 4GB - 16TB (io1), 4GB - 64TB (Block Express). With Block Express, IOPS can be adjusted independently from storage size. Up to 64,000 IOPS per volume, up to 256,000 IOPS per volume (Block Express), up to 1,000 MB/s throughput, up to 4,000 MB/s throughput (Block Express). io1/io2 50IOPS/GB (MAX). Also there are caps on instance level. ![[Pasted image 20230122005446.png|600]]

# EBS Encryption

Related: [[Encryption and Encoding]], [[EBS]]

Provides at rest encryption for volumes and snapshots. Uses [[AWS KMS]] either AWS managed or customer managed. Encrypted DEK is stored on empty EBS Volume, for EBS encryption the key gets decrypted and loaded on to memory of EC2 Host which will be using it to encrypt data on EC2 Instance's EBS volume. DEK are per volume, unique. Snapshots from EBS, EBS from Snapshot use same DEK. No way to remove encryption from volume.

# EBS Snapshot

Related: [[EBS]], [[public/AWS/EC2/EC2]]

Regionally resilient, hosted on S3. They copy used data, future snapshots are incremental. If you delete incremental EBS snapshot, AWS "moves" necessary data, so snapshots are kind of self-sufficient. Great way to copy/move EBS volumes between AZ and Regions. ![[Pasted image 20230122011123.png|500]]
You are billed gigabyte-month for **only USED** data and incremental data you are billed for **changed** data.

## Snapshot Performance
- When you create a new EBS volume w/o snapshot = EBS ready immediately
- If you restore EBS volume from snapshot:
  - Lazy restore, data fetched from S3 gradually, if you request data which is not yet fetched, it will be pulled directly from S3.
- You can force the system to read (dd in Linux) all block from the volume, which will force S3 to move all data to EBS quicker.
- Fast Snapshot Restore (FSR) – immediate restore from AWS, costs. Each combination of FSR + AZ means 1 instance of restore, up to 50 per region.

## EBS Snapshotting
EBS Snapshooting, also available as:
- Archive – 75% cheaper than normal EBS snapshot, but takes 24/72 hours to restore
- Recycle bin for EBS Snapshots – allows to set retention rules for deleted snapshots