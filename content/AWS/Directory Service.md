Related: [[Active Directory]]

![[Pasted image 20230304225018.png|400]]
Some services require Directory Service, like [[Amazon Workspaces]]

Run in VPC, to implement [[HA vs FT vs DR#High availability (HA)]], deploy multiple AZs
Can be Isolated (Like being AWS only) or integrated or act as a proxy in connector mode.

# Simple AD Mode
Uses open-source [Samba (software) - Wikipedia](https://en.wikipedia.org/wiki/Samba_(software)) ver. 4 directory service. 
Simple iD is a default go-to. 
If you want to migrate people to [[#AWS Managed Microsoft AD]] there you go: [Migrate users from Active Directory to AWS Managed Microsoft AD - AWS Directory Service](https://docs.aws.amazon.com/directoryservice/latest/admin-guide/ms_ad_migrate_users.html)
![[Pasted image 20230304230131.png]]

# AWS Managed Microsoft AD
Literally AD in AWS, which can be independent from on-premise service, 
![[Pasted image 20230304230256.png]]

# AD Connector
Just connects AWS Services to on-premise AD
![[Screenshot 2023-03-04 at 23.04.16.png]]