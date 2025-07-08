---
tags: [dataeng]
created: 2025-07-08T12:49:25+04:00
modified: 2025-07-08T13:02:28+04:00
---
#dataeng 

Is a PaaS platform, functions 3rd part for GCP and AWS, and 1st party on Azure i.e. Azure has more responsibilities on it's part which can be important for business.

This article will use some images and diagrams that belong to: Databricks - [Databricks: Leading Data and AI Solutions for Enterprises](https://www.databricks.com/)
# Prerequisites
Works on top of [[Apache Spark]]. Highly recommended to read.
[Get Started With Data Engineering on Databricks | Databricks](https://www.databricks.com/learn/training/getting-started-with-data-engineering)
![[Screenshot 2024-06-18 at 07.04.15.png|600]]
# Clusters

When you setup a cluster Databricks preinstalls necessary libraries depending on they type of operation, ML, Data, etc.

**Termination** = Stop Cluster and deletes it in 30 days.
**Delete** = Delete Cluster.

**Single node** – low cost.
**Multi node** – production (more than 2 VM)

![[Screenshot 2024-06-20 at 01.38.49.png]]

Runtimes can be:
1. Standard – default
2. Photon – Best optimized for SQL and Dataframes.
3. Machine Lerning – best optimized for ML, includes: TensorFlow, Keras, Pytorch

Has it's own access control (as in resource-level controls) and cluster policies.
![[Screenshot 2024-06-20 at 01.53.55.png|500]]
## Notebooks
A notebook is a collection of executable cells, each notebook is tied to a Specific programming language. There is native scheduling ability. Notebooks can be shared with Confluence like permission manager. 

There are markers ==%== which if present before a command can tell the Notebook  it's a Markdown, Python or Scala cell. Cells can also be multilanguage. [Develop code in Databricks notebooks#How to format Python and SQL cells](https://docs.databricks.com/en/notebooks/notebooks-code.html#how-to-format-python-and-sql-cells)

Similarly to Jupyter and Apache Spark has ability to execute shell commands in Databricks with use of exclamation mark ==`!`==. 
 ![[Screenshot 2024-06-18 at 05.15.37.png]]![[Screenshot 2024-06-18 at 05.16.50.png]]
Shift + Option + Space can recommend you some queries 


We can interface with the filesystem where data is stored by opening a terminal window in Databricks.

We can visualize (chart) data just from the cell or even get a data profiling overview

# Storage
Compute and Storage are separated in Databricks, i.e  data is not stored where compute is located.
Unstructured data is usually stored in data lakes
## Delta Lake
>Delta Lake is the default for all reads, writes, and table creation commands Databricks.
>i.e. it's a default storage type
>
>By default Unity Catalog Managed tables are Delta type tables.

Open-source [[Database Types#ACID vs BASE|ACID]]  compliant, schema-on-read, mutable, backtrack-enabled framework. Is the alternative to previous .parquet file architecture which stored immutable way. Delta Lake Framework was built around it to allow mutability.

[What is this delta lake thing? - YouTube](https://youtu.be/3ef985a0Veg)

In the image below presents a multi-layer architecture, where: the Bronze layer consist of Raw data maybe not even in Delta format, the Silver layer is where data is cleansed (just-enough) and converted into Delta format and finally, the Golden layer is from where consumer are taking the data – this is [Medallion Architecture](https://www.databricks.com/glossary/medallion-architecture)

[[ETL and ELT]], here we use ELT (as usual for Lakehouses) because the Silver layer doesn't get fully transformed data, it is only manipulated just-enough, so that we can load it and store in Delta format.  
![[Pasted image 20240618063259.png]]

Deep clone replaces data each time executed, but merge allows us to merge to based on specific criteria

Z-ordering collated related information speeding up queue times, which is powered by:
[Data skipping for Delta Lake | Databricks on AWS](https://docs.databricks.com/en/delta/data-skipping.html)
>When data is written into a Delta table, Delta Lake automatically collects key details about the data, such as the smallest and largest values (min/max), the number of null entries, and the total records stored in each file.

Can be OPTIMIZEd and vacuumed.
## Delta Live Tables
LIVE STREAMING OF DATA
Its pipelines can be continuous ( for dashboards, ETL) or triggered (for ML, reports)
![[Screenshot 2024-06-20 at 15.57.10.png]]

# Dashboards
Can source tables.

# Workflows
For jobs orchestration. 2 Types:
- Workflow Jobs
	- Can be sourced with programming language, SQL, Notebooks, DLR or JAR
	- Manual dependency control
	- Self-provisions a cluster or use existing one
	- Timeouts and retries supported
	-  Library import supported!
	  Quick use cases 
	  ![[Screenshot 2024-06-20 at 01.12.12.png|400]]
- Delta Live Tables (DLR)
	- Only notebooks
	- Automatics dependency control
	- Self provisioned.
	- No timeouts, retries are automatic in prod mode.
	- No library import support.
Can be integrated together.

# Unity Catalog
Centralized control plane of Databricks: Users, Permissions, data access auditing, data lineage, data search and discovery, data sharing with Delta Share.

[CONFIGURE UNITY CATALOG IN MULTI SUBSCRIPTION MULTI STORAGE ACCOUNT](https://www.youtube.com/watch?v=z9L7rNtKjCg)

FROM LATE 2023 ENABLED BY DEFAULT, AZURE: [Set up and manage Unity Catalog - Azure Databricks | Microsoft Learn](https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/get-started#enablement)

Previous architecture was around Hive Metastore, but Unity Catalog Metastore is improved version of it. Though, you can connect Hive Metastore to Unity Metastore as `hive_metastore`

> [!NOTE]
> There can be only one metastore per Databricks deployment and multiple catalogs per one metastore.
> Programmatically Catalogs can only be created via SQL `CREATE CATALOG my_catalog;` or with pyspark it can be accomplished via `spark.sql("CREATE CATALOG my_catalog")`


## Catalog
In it's core catalog is schema which can contain any number of subschemas for databases.
![[Screenshot 2024-06-18 at 18.12.11.png|500]]

Catalog splits into Table, View and Function
Table can be 
- Managed (sourced from Databricks)
	- If you drop it, all data is discarded
- External (sourced from remote)
	- if drop it, metadata is discarded
View is a saved querry which can be global or temp (session), read-only
Function custom code which can be invoked through query

You can create schemas (databases) with SQL or via Python `from delta.tables import *`

Keep in mind that [[Apache Spark]] Dataframes and [[Databricks#Delta Lake]] are separate concepts even though the latter is built on top of Dataframes.



One of the ways to upload data to Databricks (from the looks of it – if it's structured) is to create a table and reference an actual file in DBFS to source form. To add data manually you can click on Add > Add data > Create or modify table from upload, but note that this requires SQL Warehouse. 

``` SQL
CREATE TABLE shops_jeans
using csv
OPTIONS (
	path "Apache Spark format path, dbfs:/"
	header "true"
)
```

You can do queries from Catalog against tables ![[Screenshot 2024-06-18 at 05.50.36.png|500]]

### Auto Loader
>Auto Loader incrementally and efficiently processes new data files as they arrive in cloud storage without any additional setup.

[What is Auto Loader? - Azure Databricks | Microsoft Learn](https://learn.microsoft.com/en-us/azure/databricks/ingestion/cloud-object-storage/auto-loader/)
![[Screenshot 2024-06-20 at 15.53.15.png]]

# Connections

Best practice, limit visibility and access. Tag them (source cat, data cat)

# Repos

Related to [[git]]

## Best practices
Taken from course

![[Screenshot 2024-06-21 at 12.24.02.png|300]]
![[Screenshot 2024-06-21 at 12.25.02.png|300]]