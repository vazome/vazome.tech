Quick refresher:
> [!Click to expand:]- 
> ![[Data Design and Pipelines#Data storage]]

# Different kinds of

## Data storage
In addition to Warehouses and Lakes, there are 
#### Marts
Marts are structured databases that contain data from a few sources and logically cover specific department and/or task requirement.

Typically, <100 GB in size.

#### Lakehouses
Can't elaborate yet, but in short they join benefits of both Warehouses and Lakes.

#### Data Lakehouse

## Data architecture

#### Data Mesh

#### Data Fabric

# Business logic

## High-level lifecycle
![[Pasted image 20250222232614.png]]
- **Planning**
	- Requirements gathering. This phase is done to understand who's and how's of people which are going to use the warehouse.
		- Roles: Data Analyst, Data Scientist and perhaps BI Analyst
	- Data modelling. Planning and organizing data transformation and/or integration from various, yet relevant sources. Crucial that the team understands and links these datasets.
		- Roles: Data Engineer, Database Administrator.
		- Support in business knowledge: Data Analyst, Data Scientist.
- Implementation
	- ETL and Data pipeline design.
		- Roles: Data engineer to create the pipeline and Database Administrator to extract the data.
	- BI Application development. So the user can extract information from the data. Tableau, Google Looker or perhaps Power BI to be setup
		- Roles: Data Analyst, Data Scientist.
- Support and Maintenance
	- Maintenance, make any necessary modifications.
		- Roles: Data Engineer.
	- Test and Deploy, where Data Analyst and Scientist test that the business requirements are met. Data Engineer deploys the tool.
		- Roles: Data Engineer, Data Analyst, Data Scientist.
![[Pasted image 20250222234531.png]]

# Data Layers 
![[Pasted image 20250223010716.png]]
Briefly:
1. Data Sourcing
	1. Involves spreadsheet, logs, transactional RDBMS
2. ETL > Staging
	1. Prepare data for storage, transform/tackle/clean use temporary staging tables. Turn semi-structured data to structured, in batches or fully.
3. Data Storage
	1. Data can either be stored in warehouse and then moved to mart or vice versa
4. Data Presentation
	1. BI tools, data mining tools, direct queries ![[Pasted image 20250223011954.png]]![[Pasted image 20250223012045.png]]![[Pasted image 20250223012130.png]]
Also:
![[Pasted image 20250223011738.png]]

# Architectures

Relates to [[Data Design and Pipelines#Star and Snowflake schemas]]
## Inmon - top-down
Assumes that data warehouse contains all data of the organization.
![[Pasted image 20250223022324.png]]

**Pros and cons**
	Pros
		Single source of truth
		Normalization = less storage
		Data Marts are easier to change
	Cons
		More join = slower response time
		Lengthy upfront work (higher startup cost) to unify definitions can take a lot of work across org.
![[Pasted image 20250223022528.png]]

## Kimball - bottom-up
![[Pasted image 20250223023416.png]]Data is **denormalized** into [[Data Design and Pipelines#Star and Snowflake schemas|Star Schema]]. To make query writing fast and straight forward. Data definitions are gathered from one department of the org, data then placed into data mart and is made available for reporting and cycle repeats for next departments. Later data mart connected to warehouse. Incremental approach.

**Pros and cons**
	Pros
		Upfront cost low 
		Denormalized = user-friendly
	Cons
		Higher ETL processing time
		Greater possibility of duplicates because of denormalization
		Ongoing development nature.
![[Pasted image 20250223024031.png]]
### Kimball 4 step approach
To help users to find answers for business questions
1. Selected processes to track, like invoices, product quality or performace
2. Decide on grain, the lowest level of data stored in fact table, like "song grain" or "Line item grain". So we can see which individual items did or did not perform well enough
3. Dimension identification: time, location, user's name or id. Helps to describe data and get feedback
4. Facts identification: like measurement or metric of the process, number of listens, rides, orders or completed tasks, travel distance, time needed to finish process.

## Slowly changing dimensions
For example, category of electric vehicle was to be renamed to electric-crossover in dimensions table.
### classic approach
1. Type 1 - basic replacement of value, which removes history.
2. Type 2 - create new role with new ID and timeframe ![[{06213757-379B-43FE-8DE8-39EE23FE6944} 1.png]]
3. Type 3 - add a new column ![[{28142F00-F524-4D16-818F-B3643E166640}.png]]
### Modern approach
Make snapshots of entire dimensions table, considering low storage costs and then change the category name like in Type 1 Classic. Use previous snapshots for historic backtrack.

## Row vs column data store

Relates to block storage concepts: [[Azure Storage]], [[AWS S3 Simple Storage Service]]
TL;DR fewer blocks you use to write the data, the faster Read and Write will be.

**In case of Row storage** and storing in blocks, it is excellent option for transaction storage since transactions come in rows, and we can store each new transaction in a new block.
![[{CEC74A72-275E-4A4B-BB2E-69D74BFE59AA}.png]]

**In case of Column storage**, you store each column in a block. Which makes it good for analytical workloads because you can use fewer blocks to answer the business question, because not all business questions require all columns to be read. Also benefits of data compressions since were data in columns is the same type. Takes longer to add new rows![[{BF86D91A-F058-4603-ACC3-07576F0495C6}.png]]