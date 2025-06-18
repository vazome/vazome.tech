Related: [[Route 53]], [[Routing]]

# Simple Routing
Randomly selects one record value and routes to it
# Failover
Includes health check on primary record, if records fails.
Useful for Active-Passive (Active-Backup) failover
# Multi Value
As failover but you can have many values to be returned
Returns up to 8 health records, at random 8+
Improves availability. If you have many resources servicing your app.![[Pasted image 20230121230829.png|600]]
# Weighted
Records are returned based on their defined weight.
More weight, more often returned. Record weight vs total weight
Can be combined with health checks, to exclude unhealthy records until healthy found.
Useful for testing new versions, control records distribution![[Pasted image 20230121230931.png|600]]
# Latency
AWS manages a database of between users general location and regions tagged in records.
Returns record which offers the lowest estimated latency and healthy.
Up to 1 record with the same name in each AWS region.
Good if latency is a concern![[Pasted image 20230121231055.png|600]]
# Geolocation
Does not return records by latency (logically closest), but returns them based on record' location (from narrow to broad): state, country, continent or default (optional). Then compared to users IP.
Offers records exactly based on the location of the customer.
![[Pasted image 20230121231605.png|600]]
# Geoproximity
Returns closest records. Records tagged with AWS regions or latitude and longitude coordinates. Bias can be provided, to expand region we are searching from.![[Pasted image 20230121231711.png|600]]