Related: [[AWS/EC2/EC2]]

# Status checks

1. System Status checks
	1. Loss of power
	2. Loss of network
	3. EC2 HOST issues
2. Instance Status reachability
	1. Corrupted FS
	2. Incorrect Instance Networking
	3. OS Kernel Issues
	4. Instance issues

# Auto recovery (System Status)
Status check alarm can initiate auto-recovery. Helps in HA. Uses SNS
If you start auto recovery, EC2 Instance is moved to other host.
Networking, metadata, Elastic IP, data configuration is saved. Does not work for instance store volumes
[https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-recover.html](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-recover.html)

#monitoring 