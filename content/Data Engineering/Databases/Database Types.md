#dataeng 

There are generally two types of databases which have different structure and models. 

![[DBMS]]

# ACID vs BASE

It all clocks around [CAP theorem - Wikipedia](https://en.wikipedia.org/wiki/CAP_theorem) – Consistency, Availability, Partition tolerant aka resilience.
-  Consistency – every read operation, will get most recent write, or it will get error
-  Availability – every request will not return error but without guarantee that it contains is most recent write.
-  Partition tolerance – system is made of multiple network partitions and system continues to operate even when there is a number of dropped messages or errors between these network nodes.
**A DB can have max of two.**

|[ACID](https://en.wikipedia.org/wiki/ACID#Consistency)                                                                                                                                                         |[BASE](https://en.wikipedia.org/wiki/Eventual_consistency)                                                                                                                                                     |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
|Atomic, Consistent, Isolated, Durable                                                                                                                        |Basically Available, Soft State, Eventually Consistent                                                                                                   |
|**A**: Example, bank transaction consisting two parts: 1. Removing 10$ from account A 2. Replenishing 10$ to account B ALL or NO components must success or fail.|**BA**: Reads and writes are available, but not consistent. Maybe/kind of. Instead of storing data is durable way it will spread that data across many nodes.|
|**C**: Items moves through DB and has one valid state or the other per its rules. Nothing in-between is allowed.                                                 |**S**: DB is not consistent and state aware, this is a application's developer job to ensure that application supports/negates soft state.                   |
|**I**: If multiple transactions execute at the same time, the don’t affect one another. Each executed in full.                                                   |**E**: If you wait long enough, data will become consistent.                                                                                                 |
|**D**: Once transaction is committed and succeeded, it must be durable, withstand power outages or crashed, be record on non-volatile memory.                    |                                                                                                                                                         |
|Generally RDS DB – limits scaling                                                                                                                            |Generally DynamoDB, high performance                                                                                                                     |

# OLAP vs OLTP
Online analytical processing (OLAP) and online transaction processing (OLTP) are data processing systems that help you store and analyze business data. You can collect and store data from multiple sources—such as websites, applications, smart meters, and internal systems. OLAP combines and groups the data so you can analyze it from different points of view. Conversely, OLTP stores and updates transactional data reliably and efficiently in high volumes. OLTP databases can be one among several data sources for an OLAP system.

| **Criteria**         | **OLAP** (Analysis)                                                                             | **OLTP** (Day-to-day operations)                                                      |
| -------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Purpose              | OLAP helps you analyze large volumes of data to support decision-making.                        | OLTP helps you manage and process real-time transactions.                             |
| Queries              | COMPLEX, aggregate & limited updates                                                            | simple transaction & frequent                                                         |
| Data source          | OLAP uses historical and aggregated data from multiple sources.                                 | OLTP uses real-time and transactional data from a single source.                      |
| Data structure       | OLAP uses multidimensional (cubes) or relational databases.                                     | OLTP uses relational databases.                                                       |
| Data model           | OLAP uses star schema, snowflake schema, or other analytical models.                            | OLTP uses normalized or denormalized models.                                          |
| Volume of data       | OLAP has large storage requirements. Think terabytes (TB) and petabytes (PB).                   | OLTP has comparatively smaller storage requirements. Think gigabytes (GB).            |
| Response time        | OLAP has longer response times, typically in seconds or minutes.                                | OLTP has shorter response times, typically in milliseconds                            |
| Example applications | OLAP is good for analyzing trends, predicting customer behavior, and identifying profitability. | OLTP is good for processing payments, customer data management, and order processing. |

## OLAP cube
Faster processing via data cube, multidimensional database which works better with multidimensional than traditional DBS and hypercube consists of multiple dimensions ![[{592745D1-2DB5-406A-B26F-1AE9C3B1E739}.png]] 
