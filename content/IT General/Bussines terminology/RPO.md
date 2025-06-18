Related: [[RTO]]

Aim to know Goldilocks as close to the TRUE business requirements as possible. Business may not know, you must help them and yourself to know.

>[!INFO]
>RPO Recovery Point Objective – **maximum amount of time or data that can be lost during a disaster recovery situation before that loss become intolerable.** 
>E.g. RPO - 6 hours means that organisation cannot tolerate 6 hours of data loss.

Banks may have RPO "buffer" because they deal with customers money.
	Backups can shorten the extend of the data loss and provide you maximum time of  data loss (because you can restore/new backup will be created if system failed later)
		Lower RPO = More money (Usually)
![[Pasted image 20230121050307.png]]

[Establishing RPO and RTO Targets for Cloud Applications | AWS Cloud Operations & Migrations Blog](https://aws.amazon.com/blogs/mt/establishing-rpo-and-rto-targets-for-cloud-applications/)