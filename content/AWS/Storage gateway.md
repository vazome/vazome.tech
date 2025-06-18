Related: [[]]

Runs as virtual machine or as a hardware appliance-(rare)
Acts as a bridge between on-premise storage and AWS.
Uses iSCASI (ай-скази), NFS and SMB

On AWS Side: [[EBS]], [[S3]] and S3 + Glacier

Used for Migrations to AWS, Extensions of DC to AWS, Storage Tiering, DR and Replacement of backup solutions.

# Volume
## Stored Mode
Volume appliance presents volumes over iSCASI (perceived as disks) to VMs. 
	Everything is stored locally, the provisioned volumes use a physical storage connected to Volume appliance.
Also, Upload buffer temporarily stores data for further asynchronous upload to S3 with Storage Gateway Endpoint on AWS side in form of [[EBS Snapshot]] (so copies of VMs provisioned volumes on-premise and in AWS)
![[Pasted image 20230301023749.png]]
1. Good for full disk backup, migration, excellent [[RPO]] and [[RTO]] since disk snapshots can be quickly restored
	1. Somehow assists in DR, you can restore EBS snapshots to EBS volumes and provision same VMs, but in AWS.
2. Does not allow data capacity extensions, because main storage location is on-premise.

## Cached mode
Now primary location of data is in [[S3]]. The only local thing is cache.
	Upload cache and Cache storage. Frequent data is in Cache storage
Data in S3 is AWS Managed, you don't see it. It's RAW block storage.
You can still restore data to EBS Snapshots and then if needed to EBS Volumes
Enable data center extension.
![[Pasted image 20230301024440.png]]
1. Good for data center extension, scaling of storage.



# Tape (VTL)
Usually tapes are made on 3rd party off-site or in cloud.
Virtual Tape Library (**VTL**) hosts on S3 and Virtual Tape Shelf (**VTS**) hosts on S3 Glacier
Exported tape means it's moved to Glacier for Archival…
Can be used if you have expensive back up system, and you want to replace want to offload expensive parts to AWS. Or as back up extension or help in migration of tapes to AWS.
![[Pasted image 20230304220330.png]]




# File
**Helps in bridging on-premise storage to S3, but via NFS or SMB.**

Files stored on either side are visible to other side.
Read and write caching ensure LAN-like performance.
Primary data is held in S3, local data is mostly cache 

Also support multiple contributions (on-premise shares mapped to one bucket). 
Can be [[HA vs FT vs DR#Disaster Recovery (DR)]] if you implement [[S3 Replication#Cross-Region Replication (CRP)]]

>[!Warning]
> 1. Does not support object locking, use Read only mode on other shares or tight controll file access.
> 2. Be aware that storage gateway may not immediately update listing information from S3. 
> 	1. But you can enable it [NotifyWhenUploaded - Storage Gateway](https://docs.aws.amazon.com/storagegateway/latest/APIReference/API_NotifyWhenUploaded.html) and alert your application/system/integration

![[Pasted image 20230304222816.png]]

Also, can be tied with [[S3 Lifecycle configuration]],  ![[Screenshot 2023-03-04 at 22.30.28.png]]