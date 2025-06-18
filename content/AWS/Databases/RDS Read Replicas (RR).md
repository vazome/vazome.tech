Related: [[RDS]]

5 read replicas can be created per DB instance
Can be cross-regional
Read replicas can have read replicas (but can eventually become laggy)
Global performance improvement
[[RTO]] are still a problem
[[PRO]] are near 0, quick promotion
Can be promoted quickly
Failover works out when there is no data corruption, if data corruption happened, then it is replicated to read replica and read replica becomes corrupted too.