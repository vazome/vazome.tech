Related: [[EBS Encryption]],[[EC2 Storage Terminology]]

It's a storage type you connect to an instance, is considered a network drive.
Can function as main drive and be reattached to other instance.
By default can be connected to one instance at a time, but there is a multi-attach feature
Instances create FS on storages.

Locked to Availability Zone but can be moved via [[EBS Snapshot]]
Limited to capacity – Size/IOPS

**AZ Resilient, 1 AZ!
Generally attached to 1 Instance at a time.** Can be detached. Persistent until you delete.
You can backup EBS Volume into S3 in a form of a snapshot to have region resilience.

Provide SSD, HiPerf-SSD, etc.
Billed GB-month, in some cases performance.
![[Pasted image 20230122002215.png]]
# EBS Snapshoting
EBS Snapshooting, also available as:
Archive – 75% cheaper than normal EBS snaphot,  but takes 24/72 hours to restore
Recycle bin for EBS Snapshots – allows so set retention rules for deleted snapshots