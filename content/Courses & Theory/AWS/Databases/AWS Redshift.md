---
created: 2025-06-30T06:32:04+04:00
modified: 2025-06-30T06:35:20+04:00
---
Is a [[NoSQL#Column]] type.

Petabyte-scale Data warehouse, uses servers (not serverless)
One-AZ, uses node infrastructure:
	Leader node for query input, plan, and aggregation
	Compute node partitioned into slices, performs queries on data.
	VPC Security controls, IAM, KMS, CloudWatch monitoring
	**RedShift Enhanced VPC Routing traffic** enabled is routing based on  NACL, custom DNS and GWs.

- [[Database Types#OLAP]] (Column based) not [[Database Types#OLTP]] (row/transaction)
- Pay as you use ... similar structure to RDS
- Direct Query [[AWS S3 Simple Storage Service]] using Redshift Spectrum
- Direct Query other DBs using federated query
- Integrates with AWS tooling such as Quicksight
- SQL-ike interface JDBC/ODBC connections

Data can be imported with S3, [[AWS DynamoDB]], [[AWS Kinesis#Data Firehouse]] or [[AWS Database Migration Service (DMS)]]
![[Pasted image 20230316203637.png]]

# Redshift Resilience and Recovery
Default backups Automatic and manual
![[Pasted image 20230316210530.png]]
