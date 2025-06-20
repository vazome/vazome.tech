# Data modelling
1. Conceptual data model
	1. Diagrams, papers, relationships to business requirements
2. Logical data model
	1. Schema definition, indexes
3. Physical data model
	1. How data stored physically, buckets disks, file structure etc.
## Star and Snowflake schemas
(Fact tables contain measurements and metrics, which this table has in song length, and unit price. In addition, the artist and genre ids can be used to join dimensional tables to provide more details about the song length or unit prices.)
Based on dimensional[^1] modelling
![[Pasted image 20250121185331.png]]

**Start schema** is one to many that look like a star.
![[Pasted image 20250121191914.png]]
![[{18F0730D-3E5D-4CA9-8FA6-D85DE173131D}.png]]
**Snowflake** is a cascading enchanced start schema ![[Pasted image 20250121192013.png]]
![[{F53383BC-A8C4-4F2C-BD1F-FA9BD2E67E0D}.png]]
Schemas same in fact table, but snowflake does normalization while star is denormalized![[Pasted image 20250121192206.png]]
# Data storage

> [!NOTE] Note
> **Data** stored in Data Lakes and after processing in can be used as **information** in Data Warehouses or elsewhere. Data lakehouses combine both concepts.

Database is a general term which can include RDBMS and Data warehouses.

- Data Lakes
	- Do not enforce models on data
	- schema-on-read
	- Any data type can be stored, especially all raw data
	- Generally much bigger than warehouses
	- Harder to analyze.
	- Optimized for cost efficiency
	- Requires up-to-date catalog![[Pasted image 20241217171012.png|400]]
- Data warehouse
	- Enforce model and structures
	- Smaller than lakehouses
	- Easier to analyze
	- Generally use star schema for dimensional modelling which enables more effective OLAP queries.

# Data integration
When integrating data, you need to ask several questions:
1. What is the purpose?
2. Who is the target audience of the data integration?
3. In what formats data is contained?
4. How often will you pull/receive data?
Integration is done through transformations, they vary. If it's a handcoded solution, then be wary and avoid maintenance costs if possible.
![[Pasted image 20250206045020.png]]
An extension on the transformation idea is [[#ETL]] and [[#ELT]]. These approaches becoming a standard, they combine multiple stages of data integration and process data from multiple sources. Popular tools are [[Databricks]], [[Apache Spark]] or [[AWS Redshift]]. The tool must be flexible with many data formats, reliable and scalable, as always.

Pay attention to security and anonymization, to prevent access to PII, PHI and other sensitive information to unauthorized parties and employees.

Consider as a part of data governance consider data linage, you should know where data originated from can be achieved with [[Apache Spark#DAG and how it works]] and other tools.
![[Pasted image 20250206045523.png]]
## Processing
![[Pasted image 20250121184617.png]]

![[ETL and ELT]]

[^1]: A Data Dimension is a set of data attributes pertaining to something of interest to a business.  Examples of dimensions are things like "customers", "products", "stores" and "time".