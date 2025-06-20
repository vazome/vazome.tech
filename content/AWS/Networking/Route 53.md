### Route 53 Health checks

Related: [[Route 53]]

Configured separately but used with records.
You can check anything on the web.
TCP, HTTP(S), HTTP(S) Sting matching
Health checks are done regards every 30s (10s for extra costs)
Heathy/Unhealthy

3 Types
-   Endpoint checks
-   CloudWatch alarm checks
-   Calculated checks (check consisting of other checks)
![[Pasted image 20230121231809.png]]

### Route 53 Routing


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

### Route 53 Split-View Hosted Zone


Related: [[Route 53]]

1 Public zone and 1 private zone with same name are created. This way public internet and private network can access different resources under one zone name.  

Records are created in zones according to their publicity level, i.e. in out example:
- A – record is private record
- TXT, MX, www – are public records.
So in our example private can access anything (assuming they have access to internet) but public internet hosts can't resolve private records
![[Pasted image 20230121231905.png]]

### Route 53


Related: [[DNS]]

Global service, globally resilient.
1.  Register Domains
2.  Host Zones.. managed nameservers

Zone files are stored in AWS. Zone files are stored on four AWS NS servers.
	Can be public.
	Or private linked VPC(c)
	Records called record set.
R53 - Registrar only is not good. R53 Registry + "Hosting" or R53 "Hosting" is Good