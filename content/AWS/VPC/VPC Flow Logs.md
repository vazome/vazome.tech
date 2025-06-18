Related: [[VPC]]

Captures packet metadata, but not the contents of it.

Enabled by attaching monitors into a VPC, listining to ENIs
	On VPC level
	On subnet level
	On ENI level

NOT Real Time.
Export to [[S3]] (view them directly and easy export to 3rd party) or [[CloudWatch Logs]] (view them in AWS UI and connect it to other AWS Services)
Also, integrates with [[Amazon Athena]] querying
![[Pasted image 20230225051418.png]]

![[Pasted image 20230225052159.png]]