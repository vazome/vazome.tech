Related: [[EBS]]

# GP2
Good for boot volumes and initial workloads, desktop envs.
Can be as small as 1 GB and as big as 16 TB

-   Has IO credit allocation:
	-   1 IO credit is 16 KB of data
	-   1 IOPS is 1 IO in 1 Second
-   Each GP2 has baseline performance:
	-   IO 'credit bucket' capacity is 5.4 million IO credits, starts of with5.4 million
	-   The bucket fills with 100 IO credits per second.
		-   Beyond minimum 100 IO credit it increases per 3 IO cr. per second, per GB of volume size.
		-   Fill rate of 16,000 IOPS per second is max.
	-   Burst up to 3,000 IOPS by depleting the bucket
	-   Volumes over 1TB don't use credit system
# GP3
Good for boot volumes and initial workloads, desktop envs, single instance DBs,
Benefits of both GP2 and IO1
3,000 IOPS & 125MiB/s – Standard.
Extra cost for up to 16,000 IOPS & 1000MiB/s (4x Faster Max throughput than GP2)
GP3 is 20% cheaper than GP2, for standard-base price.

#ec2/storage