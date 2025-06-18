Related: [[AWS/EC2/EC2]], [[EC2 Bootstraping]]

Metadata is a service with EC2 provides for instances.
Any instance can access this service with (curl)
[http://169.254.169.254/latest/meta-data/](http://169.254.169.254/latest/meta-data/)

Contains env information:
- Networking
- Authentication
- User-Data

And you can use ec2-metadata tool

``` bash
wget [http://s3.amazonaws.com/ec2metadata/ec2-metadata](http://s3.amazonaws.com/ec2metadata/ec2-metadata)  
chmod u+x ec2-metadata
```

![[Pasted image 20230121234033.png|600]]
