---
created: 2025-06-30T06:32:04+04:00
modified: 2025-06-30T06:35:20+04:00
---
Does [[IT Software Architectures#Serverless]], [[ETL and ELT]]
Crawls data sources and generates [[#Data Catalog]]

Sources: 
- Stores: [[AWS S3 Simple Storage Service]], [[AWS RDS]], any [JDBC](https://en.wikipedia.org/wiki/Java_Database_Connectivity) compatible DB like [[AWS Redshift]] & [[AWS DynamoDB]] 
- Streams: [[AWS Kinesis#Data Streams]] & [[Apache Kafka]]
Targets:
- [[AWS S3 Simple Storage Service]], [[AWS RDS]], any [JDBC](https://en.wikipedia.org/wiki/Java_Database_Connectivity) compatible DB

# Data Catalog

> [!IMPORTANT]
> a **Crawler** can creates metadata in Data Catalog
> 
> A **Glue job** is used to perform ETL by scavenging from Data Catalog, jobs can be [[IT Software Architectures#Serverless]] or manual

Persistent storage of metadata about sources within a region.
One catalog per region per account
- Avoids data silos (this way: improves visibility, makes data structure browsable and clutterness)
[[Amazon Athena]], [[AWS Redshift#Spectrum]], [[AWS EMR]] & [[AWS Lake Formation]] all use Data Catalog
	.. data discovered by crawlers by giving them credentials and pointing at sources.

![[Pasted image 20230215023559.png]]