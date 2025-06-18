Related: [[S3]]

[Amazon S3 Transfer Acceleration Tool](https://s3-accelerate-speedtest.s3-accelerate.amazonaws.com/en/accelerate-speed-comparsion.html)

Remember S3 buckets are based service.

# Single PUT upload 
Default is single data stream via PUT method.
If a stream fails – upload fails, so restart is required.
5GB data limit.

# Multipart-upload PUT upload
Data is broken up
Required data size is at least 100 mb
Multipart-upload can split max 10,000 part, parts vary 5MB>5GB
Each part is Isolated, transfer rate are better.

# S3 Accelerated transfer
(because routing is not always optimal)
Uses edge locations
Bucket name cannot contain periods and it needs to be DNS compatible.
Uses closest location edge location, like bus->metro vs express train
![[Pasted image 20230122225324.png|500]]

I have a question:

You have a single EC2 instance running a small public web application. You use an S3 bucket as a ‘maintenance’ page for when the application is offline or has failed. Currently this process is manual, what AWS product and feature can you use to automated this process?

Which option do you think is right?

API Gateway
Application Load Balancer
Route53
CloudFront