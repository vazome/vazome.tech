---
date created: 2025-06-21T01:26:01+04:00
date modified: 2025-06-21T01:59:12+04:00
---
Related: [[EC2 Storage Terminology]], [[AWS S3 Simple Storage Service]]

Elastic File System (EFS). Is a network storage which can be connected to multiple EC2 Linux instances. ==Linux only==. Uses mount targets.
AWS implementation for [Network File System - Wikipedia](https://en.wikipedia.org/wiki/Network_File_System) V4 of it. 
Can be accessed from on-premises [[AWS Site-to-Site VPN]] or [[AWS Direct Connect (DX)]].

`amazon-efs-utils`  is used for in Linux mounting [Using the amazon-efs-utils Tools - Amazon Elastic File System](https://docs.aws.amazon.com/efs/latest/ug/using-amazon-efs-utils.html)

# Options

- **Speed**: GP (default for 99.9% use cases) and MAX I/O mode (for high parallel processes)
- **Scaleability**: Bursting (like GP2 in EBS, more data more performance) and Enhanced (Provisioned – you specify your requirements, more rarely used/Elastic - scales automatically) Throughput Mode
- **Storage Class**: Standard (default) vs Infrequent Access (IA)
- **Data Retention**: Lifecycle policies

Mount targets are deployed on per AZ basis.
![[Pasted image 20230129012029.png]]