
Physical Devices for Data Migration and Edge Computing
# Snowball
Older generation
![[Pasted image 20230304223934.png|400]]
# Snowball Edge
Better option [[#Snowball]]
Can have EC2 capability option, which enables hosting EC2 on it too.
![[Screenshot 2023-03-04 at 22.41.53.png]]
# Snowmobile
One-site mobile DC ![[Pasted image 20230304224604.png]]
![[Pasted image 20230129003117.png]]


Use cases:
	Data Migration
		Sometimes transferring large amounts of data is not a viable option
			Inability to increase the bandwidth/share bandwith
			Network instability
		Process
			We request AWS Snowball device (e.g Edge), record the data, send it back to AWS, they will import it via physical connection.
	Edge Computing
		Some locations may not have not only internet but power (Mines, Ships..), etc. So we need to have a device which will pre process the data at the place. (ML, Media Stream transcoding, Preprocessing)

CLI + OPS Hub GUI

[AWS re:Invent 2016: Move Exabyte-Scale Data Sets with AWS Snowmobile - YouTube](https://youtu.be/8vQmTZTq7nw)