---
created: 2025-06-30T06:32:04+04:00
modified: 2025-06-30T06:35:20+04:00
---
Related: [[NoSQL]]
**IS NOT A RELATIONAL DB**
Flagship **NoSQL**, a key value DB. Serverless.
HA in 3 AZ, can be scaled massively (to global resilience)
Supports millions requests per second, trillion rows, 100TB storage
Single digit (0-9) latency
Cost saving: Standard or Infrequent Access Table Class
Backups points in time when enabled.

PK – Partition Key...
SK – Sort Key
**high-cardinality** = more unique
 
**Capacity** is set by units, can be Read (RCU) and Write (WCU). Pay for resources consumed.
Max Item, row.. 400KB
![[Pasted image 20230311152337.png]]

# Consistency Model
Has leader mode and storage mode architecture. 
This affects **eventual** and **strong reads**. Eventual are 50% price, but small chance of stale data from not updated node. Is application can tolerate non-current data, than consider eventual. If it's something important, like stock level or medical research, 

# Modes
**On-Demand** - unknown, unpredictable, low admin
**On-Demand** - price per million R or W units.
**Provisioned** ...  uses RCU and WCU set on a per table basis
Every operation consumes at least 1 RCU/WCU(\*)
1 RCU is 1 x 4KB read operation per second (\*) (up to per RCU 4 kb)
1 WRU is 1 x 1KB write operation per second 
Every table has RCU and WCU burst pool (300 second)
	Try using it infrequently, by using it to much may lead to a throttle

# WCU and RCU Calculation
[Managing settings on DynamoDB provisioned capacity tables - Amazon DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ProvisionedThroughput.html#ItemSizeCalculations.Writes)
## WCU
1. If you need to store 10 ITEMS per second ... 2.5K average size per ITEM
	1. Calculate WCU per item ... ROUND UP (ITEM SIZE / 1 KB) (3)
		1. Multiply by average number per second (30)
			1. WCU required (30)
## RCU
1. If you need to retrieve 10 ITEMS per second .. 2 5K average size
	1. Calculate RCU per item... ROUND UP (ITEM SIZE / 4 KB) (1)
		1. Multiply by average read ops per second (10)
			1. = Strongly Consistent RCU Required (10)
				1. (50% of strongly consistent) = Eventually Consistent RCU Required 5)

# Indexes
## Local secondary indexes (LSI)
Only when strong consistency is required 
Provides alt view for a table.
Both can have attributes, ALL, KEYS_ONLY and INCLUDE
**Must be created when the table is created**
Max 5 LSI
![[Pasted image 20230311162629.png]]

## Global secondary indexes (GSI)
Use as default
Give alt PK and SK, own capacity
Can be created any time,
Default limit 20.
Have their own RCU and WCU allocation.
Eventually consistent.
![[Pasted image 20230311163010.png]]

# Query
You can only query for PK and PK and SK.
It always better to pull more needed data in single operation for better RCU economy
![[Screenshot 2023-03-11 at 15.40.30.png]]
## Scan
More flexible (can query other columns) but consumes whole table
So better to use [[#Indexes]] instead scan... 
![[Pasted image 20230311154528.png|400]]

# Backups
## On demand
![[Pasted image 20230311152522.png]]
## Point in time 
Must be enabled
35d recovery window with 1 second granularity,
![[Pasted image 20230311152557.png]]

# [[IT Software Architectures#Event Driven]]
## DynamoDB Streams
Stream is a list of item changes in the table, has 24 hour rolling window, powered by [[AWS Kinesis#Data Streams]].
Data recorded: INSERTS, UPDATES and DELETES
Has different view types:
- Keys only – state of the item's PK and SK.
- New Image – state of the item after change.
- Old Image – state of the item before change.
- New and old image – state of the item before and after.
![[Pasted image 20230311203418.png|400]]

## Triggers
Powered by [[Lambda]]. When data is changed in a stream, lambda is invoked to respond to that.
![[Pasted image 20230311203928.png]]

# Global Tables
You create tables in multiple regions and then link them from a single table. At the same time all tables become R/W replicas, so a Global Table formed.
- Last writer wins rules is used for conflict resolutions.
- R/W can occur to any region.
- Sub-second replication.
- Strongly consistency reads only in the same region where write has happened.
- Global application must tolerate eventual consistency.

Provides global [[Resilience and Reliability#High availability (HA)]] and [[Resilience and Reliability#Disaster Recovery (DR)]]

# Accelerator (DAX)
- There is DAX SDK for better integration of caching into an application.
	- Abstracts the overhead to a single entity combined DDB and DAX.
- Has Query cache and Item cache.
- Write-Through is supported, Data is written to DDB then to DAX.
- Primary node supports write and Replicas which Read, HA is available (Failover and new Primary).
- Scale UP and OUT (More resources or more caches)
- Deployed in VPC.
Eventual consistency here, again.
![[Pasted image 20230311214558.png]]

# TTL
If enabled you can specify per item, date and time when data marked expired and then deleted. Value specified in a picked attribute "Column"
[[#Stream]] of TTL deletions can be enabled.

# Accelerator (DAX)
In-memory cache solution only available for DynamoDB
Improved performance, milliseconds to microseconds