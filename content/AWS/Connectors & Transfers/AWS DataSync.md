---
created: 2025-06-30T06:32:04+04:00
modified: 2025-06-30T06:35:20+04:00
---
Managed data transfer process TO and FROM AWS end-to-end (vice-versa). Reliable transfer of large quantities of data and integrates with [[AWS EFS]], [[AWS S3 Simple Storage Service]]... 
- Migrations, Data Processing Transfer, Archival/Cost effective storage and Backup and DR.
- **HUGE SCALE, EACH AGENT UP TO 10GBPS/EACH JOB 50.000.000 files**
- Keeps metadata like permissions and timestamps
- **Built in data validation** (matches migrated data with original)
![[Pasted image 20230304233356.png|400]]
# Architecture
Task – a Job, Defines what does, FROM, TO, how quickly
Agent – software used for R/W for on-prem and AWS
Location – Every task has two locations FROM and TO, like EFS, S3, NFS, SMB FSx
![[Pasted image 20230304233541.png]]



