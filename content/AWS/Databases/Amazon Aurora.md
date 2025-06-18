Related: [[RDS]]
- Proprietary to AWS, uses PostgreSQL and MySQL.
- "Cloud Optimised", up to 3x+ faster than RDS, costs more.
- Storage grows incrementally from 10gb to 64TB, not free tier
- Unlike RDS has multiple endpoints
	- Cluster endpoint - points to the main R/W inst
	- Reader endpoint
		- if no replicas to the main R/W instance (as READ)
		- if there are replicas, load balances between them.
	- Custom endpoints
- No free tier.
- Static provisioning.
=="Aurora Provisioned" relates to this exact article and product.== 

# Architecture

Uses a "Cluster". Cluster consists of main instance and replicas. Alike RDS Standby replicas, can be used in READ operations. Up to 15 replicas. Replicas can be added and removed without provisioning new storage.

Incorporate both [[RDS Multi-AZ]] and [[RDS Read Replicas (RR)]] (yes, failover too) concepts, you don't choose between the options which is a plus.

**Does not use local storage, but shared cluster storage available for every compute instance in Aurora**. It's SSD based with max size of 128 TiB, has 6 replicas across multiple AZs, synchronous replication. If disk segment fails, Aurora repair that area of disk by using data from other disks

## Multi-Master
All replica instances are capable at both read and write. Denies the concept of lengthy failover because each instance is like a master.
There is no load balancing as a concept. Application can connect to more than one instance at a time.![[Pasted image 20230128231634.png]]
Write operation requires quorum of nodes to agree on the change, i.e. proposes to write across all storages if quorum agrees changes also get replicated to other instances' in-memory cache![[Pasted image 20230128231134.png]]
Does not grate [[HA vs FT vs DR#Fault Tolerance (FT)]] but can be and in some cases best option for building Fault Tolerant applications, but the application must load balance between instances, 


## Restore, Clone & Backtrack
Backups works the same way as in [[RDS Backup, Snapshots and Restore]]
Restores create a new cluster
**Backtrack** enabled on per cluster basis, allows you to in-place rewind to a certain point in time.
Fast clones reference original data from the main, and generate data for the difference between clone and DB. Saves space than basic clones.

## Billing
Billing is based around High water mark if you consumed 50 GiB, you billed for 50 GiB.
If you free up 10 GiB, you still billed for the high water mark i.e. 50 GiB.
==To decrease high water mark: to free up space, create a new cluster, move old data into it== 
![[Pasted image 20230124022547.png|400]]

### Costs
Offers much better value beyond RDS Single-AZ (micro)
Compute is hourly, per second, 10 minutes minimum
Storage GB per month, IO cost per request to cluster storage

100% DB Backup storage is included

