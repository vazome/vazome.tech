Does [[Architectures#Serverless]] ETL (Extract, Transform & Load).
On the large scale moves and transforms data.
Crawls data sources and generates [[#Data Catalog]]

Sources: 
- Stores: [[S3]], [[RDS]], any [JDBC](https://en.wikipedia.org/wiki/Java_Database_Connectivity) compatible DB like [[Redshift]] & [[DynamoDB]] 
- Streams: [[AWS Kinesis#Data Streams]] & [[Apache Kafka]]
Targets:
- [[S3]], [[RDS]], any [JDBC](https://en.wikipedia.org/wiki/Java_Database_Connectivity) compatible DB

Relates to [[AWS Data Pipeline]], but latter uses accounts compute resources (creates [[AWS EMR]] cluster)

# Data Catalog

> [!IMPORTANT]
> a **Crawler** can creates metadata in Data Catalog
> 
> A **Glue job** is used to perform ETL by scavenging from Data Catalog, jobs can be [[Architectures#Serverless]] or manual

Persistent storage of metadata about sources within a region.
One catalog per region per account
	Avoids data silos (this way: improves visibility, makes data structure browsable and clutterness)
[[Amazon Athena]], [[Redshift#Spectrum]], [[AWS EMR]] & [[AWS Lake Formation]] all use Data Catalog
	.. data discovered by crawlers by giving them credentials and pointing at sources.

![[Pasted image 20230215023559.png]]