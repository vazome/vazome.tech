---
date created: 2025-06-18T05:03:58+04:00
date modified: 2025-06-18T05:08:48+04:00
---
Good comparison of AWS vs AZURE options: [Compare storage services on Azure and AWS - Azure Architecture Center | Microsoft Learn](https://learn.microsoft.com/en-us/azure/architecture/aws-professional/storage)

**Public by default**, needs unique name. yep

LRS - local replication, less redundant, less expensive
GRS - global replication, more redundant, more expensive

**Container vs Blob**
TL;DR container is a bucket within storage account.
> A container organizes a set of blobs, similar to a directory in a file system. A storage account can include an unlimited number of containers, and a container can store an unlimited number of blobs.
![[Pasted image 20240820020214.png]]

**Table storage?**
Allows NoSQL, like [[AWS DynamoDB]]

**Queue storage?**
For messaging, I spose it is like [[AWS SQS]]

**Append Blobs?**
Optimized for appeding data, good for logging.

Azure Files (File Storage)?
It is like [[AWS EFS]].

**Page Blobs?**
It is can function like [[AWS EBS]](though for VM better use [Azure Disk Storage overview - Azure Virtual Machines | Microsoft Learn](https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview)) block storage for VMs. Cos better for index based data.
![[Pasted image 20240820020506.png]]