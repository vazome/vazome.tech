Related: [[AWS/EC2/EC2]], [[Scaling]]

-   Cluster – instances use one hardware
	-   Best practice to use same type of instances and to deploy all needed instances from the start for capacity evaluation.
	-   Same rack, sometimes same host.
	-   Fastest inter-instance networking, you probably require network instance types. Up to 10 Gbps per single stream.
	-   One AZ only, VPC peers can be spanned.
	-   Best for fast speeds/low latency, where no resilience is acceptable![[Pasted image 20230121235650.png]]
-   Spread – instances use different hardware
	-   Cross-AZ, instances are spread access AZ, so AZ-failure resilient
	-   Max 7 Instances per AZ
	-   Infrastructure isolation, each instance within spread placement group runs from a different rack, each rack has it's own power and network supply
	-   Small number of critical instances, with AZ level resilience and needs to be separated from each other. Like fileshares.
	-   You don't manage in which racks to place instances.![[Pasted image 20230121235736.png]]
-   Partitioned – groups of instances on different hardware
	-   Designed for more than 7 instances per AZ.
	-   Uses multiple partitions up to 7 instances each within AZ
	-   Each partition has it's own rack, so partitions separated.
	-   You select into which partition launch an instance.
	-   Best for huge scale parallel processing. Can be used with topology aware applications such as HDFS, HBase and Cassandra (intelligent data replication)![[Pasted image 20230121235802.png]]