Related: [[EBS]]

# st1 - Throughput Optimized

Cheap
1 IO block size is 1MB
MAX is 500 IOPS = 500 MB/s
40 MB/s/TB Base
250 MB/s/TB Burst
Works like GP2 credit bucket

Frequent access with cost concern
Big data, data warehouses, log processing

# sc1 - Cold HDD
Cheap
1 IO block size is 1MB
MAX is 250IOPS = 250MB/s
12 MB/s/TB Base
80 MB/s/TB Burst
Works like GP2 credit bucket

Cold data requiring few scans per day.

#ec2/storage