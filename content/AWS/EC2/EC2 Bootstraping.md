Related: [[AWS/EC2/EC2]], [[EC2 Metadata]]

Allows EC2 Build Automation
Can be done with User Data (accessible with meta-data ip)
	http://169.254.169.254/latest/user-data/
**Execution by instance OS, one-time**
EC2 does not validate provided User Data. For EC2 it's block data.

==Providing credentials to User-Data is a bad practice==

There is software on EC2 instance with checks for User Data.
Not secure, don't use passwords.
Limited for 16 KB.
Can be modified when instance stopped.
[[EC2 Image Builder|AMI baking (for installation of software)]] + Boostapping (for scripting) = optimal to reduce launch time.
![[Pasted image 20230121235956.png|500]]
Info store in cloud-init.log and cloud-init.output.log