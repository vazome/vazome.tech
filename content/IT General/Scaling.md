Related: [[EC2 Auto Scaling Groups (ASG)]], [[Architectures]]

# Vertical Scaling
Increase the size of an instance, resizing.
	Each resize causing a reboot – disruption.
	Larger instances cost more and may not be in liner way
	There is always a cap.

# Horizontal Scaling
Increases the amount of instances
	Usually requires a load balancer
	Sessions is everything, consider it before enabling the concept
		Requires an application support or off-host sessions
	No disruption
	No real limits to scale
	Often less expensive, granular
![[Pasted image 20230122001122.png]]