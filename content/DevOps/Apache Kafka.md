# General Theory
## Topics
Topic is a particular stream of data (can be compared to a table in db, but without constraints)
### Topic replication
Replication is supported across brokers. Replication factor should be N > 1
### Partition
Partition  is a division (categorization of stream) within topic.
Can't be queried. Once written in - it is Immutable. Data is kept limited time.
Messages are ordered in partition with id, called **offset**, incrementally.![[Screenshot 2024-06-12 at 20.13.08.png]]
**Offsets** are not reused, so when you delete msg with offset 3, this number will not be applied again in the partition.
Data is ordered only within partition, not across.
If msg does not have partition key it will be assigned via round-robin.
## Message magic
**Message serializer** – coverts keys data (key/value) in message to bytes (binary), done by Producer to compress data.
How it looks.
![[Screenshot 2024-06-12 at 20.37.46.png|200]] 
**How hashing works** ![[Screenshot 2024-06-12 at 20.41.24.png]]
## Producers
write to topics', decides which partition. 
Has self-recovery mechanism in case of Kafka broker failures.![[Screenshot 2024-06-12 at 20.28.52.png]]
key = null – send with round-robin algorithm
key != null – always send to one partition (hashing)
Kafka message has key, compression type, headers (opt), partition, offset, timestamp ![[Screenshot 2024-06-12 at 20.34.39.png]]

Producer can receive ACKs from Brokers to prevent data loss.
![[Screenshot 2024-06-25 at 13.11.23.png]]

# Consumer
Pulls data topic (identified by name). Know automatically from which broker to read from.
Self-recovery in case of broker failure. Can deserialize. Can be bundled in group within one application where each consumer reads from single partition and therefore covering whole topic.

**`__consumer_offsets`** - special topic where consumers where they pick up left off progress. They commit what they read in this topic. Java consumers commit "at l**e**ast once", automatically. ![[Screenshot 2024-06-25 at 09.17.43.png]]
**At least once** – offset commit after message was processed.
	If processing fails, it can cause double processing. Prevent by idempotent design.
**At most once** – offset commit as soon as messages are received
	If processing fails, some messages can be lost (won't be read again).
**Exactly once** – only once.. Kafka to Kafka Workflows or Kafka -> idempotent consumer.

## Brokers
> [!NOTE]
> Broker engines:
> For 2.x – [[#Zookeeper]] is required
> For 3.x – Can switch Zookeper with [[#Kafka Raft]]
> For 4.x – Will not have Zookeper

Contains topics. A cluster can have multiple of them. They have its own ID.

When connection to any broker, that one "**Bootstrap** broker" will automatically discover other brokers for consumers. Able to horizontal scale and distribute topics.![[Screenshot 2024-06-25 at 09.52.43.png|500]]

Brokers have a single leader for a given partition and producers can only send data to leader.![[Screenshot 2024-06-25 at 10.12.15.png|500]]
So the **default** behavior is that Producer is only writing to a single leader broker. Consumer is only reading from single leader broker even though replicas are in place – meaning replicas here are only for [[Resilience and Reliability#High availability (HA)]].
> [!NOTE]
> Though since Kafka 2.4 you can configure a consumer to read from the closest replica.![[Screenshot 2024-06-25 at 10.19.53.png]]

## Zookeeper 

By design uses odd number of servers (1,3,5,7). One is the leader and all others are the followers. Early on (v0.1) Producers stored offsets in Zookeeper, but nowadays they do it in `__consumer_offsets` Topic.
![[Pasted image 20240708040331.png|white]]
DO NOT USE IT WITH KAFKA CLIENTS, BUT YOU MAY USE IT WITH BROKERS