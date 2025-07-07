---
tags:
  - dataeng/spark
created: 2025-07-07T21:56:25+04:00
modified: 2025-07-07T23:02:48+04:00
---

This article will use some images from: [Learning Spark, 2nd Edition [Book] (oreilly.com)](https://www.oreilly.com/library/view/learning-spark-2nd/9781492050032/) 
# Main
## General theory
> [!Question] Concern
> The biggest issue I faced with popular (and free) Apache Spark and Databricks learning materials is that they often skip infrastructure theory and as a guy who made a step from OPS into DevOps in the past – **I feel uncertain about products if I don't know how their cogs spin**.

Even that book does not explain such concepts as: **DAG**, **RDD**, **DataFrame**, **DataSet** and more, but briefly mentions what they do, sometimes in one sentence.

**I disagree with such approach**, so which theory I feel is necessary for the topic of the article will be mentioned here.

Consider this as a recommendation of "what" and "where" you should dig to get a better understanding.

- General references: 
	- [Data Engineering Community's Wiki](https://dataengineering.wiki/Index)
	- [THE DATA ENGINEERING COOKBOOK | GITHUB](https://cookbook.learndataengineering.com/)
- What is Bytecode:
	- [Bytecode - Wikipedia](https://en.wikipedia.org/wiki/Bytecode)
	- My brief: it is a code that a machine (low-level hardware, like processors) can actually understand.
- What is JVM
	- [Java virtual machine - Wikipedia](https://en.wikipedia.org/wiki/Java_virtual_machine)
	- [java - The reason for JVM existence - Stack Overflow](https://stackoverflow.com/questions/22878183/the-reason-for-jvm-existence)
	- My brief: is a virtual machine which can execute Java code and convert it into bytecode.
- What are the RDD, DataFrame and DataSet? 
	- [RDD Programming Guide - Spark 3.1.1 Documentation](https://spark.apache.org/docs/3.1.1/rdd-programming-guide.html#resilient-distributed-datasets-rdds)
	- [What is a Resilient Distributed Dataset (RDD)?](https://www.databricks.com/glossary/what-is-rdd)
	- [Spark SQL and DataFrames - Spark 3.5.1 Documentation](https://spark.apache.org/docs/latest/sql-programming-guide.html)
	- [RDD vs DataFrames and Datasets: A Tale of Three Apache Spark APIs](https://www.databricks.com/blog/2016/07/14/a-tale-of-three-apache-spark-apis-rdds-dataframes-and-datasets.html)
	- [Spark RDD vs DataFrame vs Dataset | Medium](https://medium.com/@ashwin_kumar_/spark-rdd-vs-dataframe-vs-dataset-c90f7da18e56)
	- My brief: **RDD** (used in Spark Core) is immutable collection of partitioned (split apart) data. Data is partitioned across worker nodes to achieve higher performance meanwhile making data mutable in the partitions.
	  
	  **Dataframe** (used in Spark SQL) is an improvement upon RDD where data is organized in table format allowing SQL operations on it.
	  Generally It can do more, it support more data formats and work better with memory garbage collection. Since Dataframes are a feature of untyped languages we can use `inferSchema=True` when creating a table, so it reads it and defines column datatypes automatically or define schema on our own.
	  Nowadays Dataframes are referencing to Dataset\[Row\].
	  ==Python uses this one heavily==
	  
	  **Dataset** (used in Spark SQL) is a generic API implementation which covers both RDD and Dataframe. The figure below gives a little detail and is works for version 3.0 too.![[Screenshot 2024-06-21 at 22.08.45.png]]
	  Your choice will largely depend on whether the programming language is strongly/weakly typed and static/dynamic-typed (untyped).
	  [This is an article explaining the language concepts](https://stackoverflow.com/a/2690593/10897030)
	  > Quoting Databricks: Python and R have no compile-time type-safety, we only have untyped APIs, namely DataFrames. ![[Screenshot 2024-06-16 at 00.38.31.png]]
- How Driver actually operates?
	- [What is Apache Spark Driver | Medium](https://medium.com/@ashwin_kumar_/what-is-apache-spark-driver-509653ab750a)
	- My brief: There is only one SparkContext per JVM. Although you may see the `**spark.driver.allowMultipleContexts**` option, it is misleading because this one is required for internal Spark tests.
### DAG and how it works
- [Directed acyclic graph - Wikipedia](https://en.wikipedia.org/wiki/Directed_acyclic_graph)
- My brief: a graph (math concept) that enables us to create a visual representation and order of operations (dependencies) as seen on the image below. 
  ![[Pasted image 20240617225427.png|400]]
  It's finite and non-cycle. Chains can only depend on previous operations.
  ![[Pasted image 20250128232359.png|400]]
## Apache Spark Theory
### How we connect
#### Sessions
To execute code, first you need to connect to Spark it can be done programmatically or non-interactively.

> [!HINT]
> Before Spark 2.0 people used separate SparkContext object to initiate sessions, but once Dataframes (Spark SQL) arrived – `pyspark.sql` was born and all session building components were put inside of SparkSession.
> 
> For RDDs (Spark Core) you still going to use `pyspark.SparkContext`

SparkSession - [`pyspark.sql.SparkSession`](https://spark.apache.org/docs/3.5.1/api/python/reference/pyspark.sql/api/pyspark.sql.SparkSession.html#pyspark-sql-sparksession) serves as a wrapper for all connection purpose stuff for Dataframes. 
A session consists of:
- **Builder** – `SparkSession.builder`
	- You create a session with it.
- **SparkConf** – `SparkSession.conf`
	- Represents key-value parameters to load into Spark application.
	- Can be disabled, to prevent load of external settings and apply default system settings
- **SparkContext** – `SparkSession.sparkContext`
	- Represents a connection to a Spark Cluster.

##### Dataframe vs Metastore table

Dataframes are in memory, while metastore table "CREATE TABLE" are persistent on the disc.

##### CLI - PySpark
If you execute script in the same environment and the same host where Spark is setup you can expect the `spark` variable which contains session object to be auto-populated, meaning you don't need to create the session.
``` python
# import pyspark # (I prefer this more)
from pyspark.sql import SparkSession # ..but usually you will encounter this more.

#pyspark
# Create a Spark session.
spark = (
	 SparkSession.builder
		 .master("local")
		 .appName("Word Count")
		 .config("spark.some.config.option", "some-value")
		 .getOrCreate()
 )
 
# Create a Spark session with Spark Connect.
 spark = (
	 SparkSession.builder
		 .remote("sc://localhost")
		 .appName("Word Count")
		 .config("spark.some.config.option", "some-value")
		 .getOrCreate()
 )  # doctest: +SKIP
```

##### GUI - Databricks
Databricks connects you to its Spark infrastructure when you login to Databricks, so there is no need to initiate a session with the in-house cluster. ==Though you may need to build a session when you connect to a remote instance Databricks.==

## How it executes
What happens when you run an application or [[Databricks#Notebooks]].

![[Screenshot 2024-06-21 at 12.50.13.png]]
### Driver
Spark driver is responsible to execution, during execution it covert Application to into Jobs
- Receives requests for computations and data from the user program.
- Breaks down the task into stages and submits them to the DAGScheduler.
- DAGScheduler organizes tasks into stages and constructs a directed acyclic graph (DAG).
- Resilient Distributed Datasets (RDDs) manage the data flow between stages.
- Tasks are scheduled on the Spark executors by the TaskScheduler.
![[Screenshot 2024-06-15 at 17.15.13.png]]

Driver are either Transformations or Actions.
#### Transformations
Provide RDD or Dataframe data
Transformations are creating a new Dataframe to work with to preserve Immutability of the source Dataframe. They feature **lazy evaluation**, meaning they are not executed immediately, but formed as a lineage (a-la future versions revision) with DAG graph which gives total overview on how data was/will be transformed. This also help Spark to optimize it's execution plan, e.g. certain transformations may be split more Stages.

> [!hint]
> No wonder Apache Spark team chose "lazy" transformations and "eager" actions, the names tells us a lot about their behavior 

![[Screenshot 2024-06-17 at 22.46.04.png]]

Transformation can be classified into Narrow and Wide:

> Any transformation where a single output partition can be computed from a single input partition is a **narrow transformation**. Both `filter()` and `contains()` can be classified as such. 
> There are many Narrow Transformations supported by Spark: **`map(func); flatMap(func); filter(func); mapPartition(func); mapPartitionWithIndex(func); union(dataset); zip(dataset); zipWithIndex(); zipWithUniqueId().`**
Map func returns new RDD after calculation, Filter returns resource on if condition successful, and Union basically joins RDDs into new one
> 
> However, `groupBy()` or `orderBy()` instruct Spark to perform **wide transformations**, where data from other partitions is read in, combined, and written to disk. Since each partition will have its own count of the word that contains the "Spark" word in its row of data, a `count(groupBy())` will force a shuffle of data from each of the executor's partitions across the cluster. In this transformation,` orderBy()` requires output from other partitions to compute the final aggregation.

![[Screenshot 2024-06-17 at 22.45.24.png]]
Here is how can you list all of dataframes in a session:
``` python
def list_dataframes():
    from pyspark.sql import DataFrame
    return [k for (k, v) in globals().items() if isinstance(v, DataFrame)]
```

Zipping
**zip, zipWithIndex, zipWithUniqueId**
zip -  zips this RDD with another one, returning key-value pairs (PairRDD) with the elements pair.
For instance, if you have two RDDs with ('A', 'B', 'C') first and (1, 2, 3) second, and you try to zip them, then you get a new RDD with pairs ('A', 1), ('B', 2), ('C', 3). It's like a hash map with 'A', 'B', 'C' as keys, and 1,2,3 as values for them respectively
```
val x = sc.parallelize('A' to 'C',2)
val y = sc.parallelize(1 to 3, 2)
val z = x.zip(y)
// (A,1), (B,2), (C,3)
```
Zipping two RDDs with N elements each is a way to get new N elements where each value is a function of elements on the same position in initial RDDs. Spark has few transformations for that.
![[L3_zipping2222.svg|white|400]]
Wide
Intersection – shufles partitions: For example, you have two RDD. The first one consists of 1 to 5 integers and has one partition only, and the second one consists of 3 to 6 integers and has two partitions. When you apply intersection to them, data is shuffled between nodes (repartitioning) and you get two new partitions (A and B) with 4 and 3,5 values respectively.
```
val x = sc.parallelize(1 to 5)
val y = sc.parallelize(3 to 6, 2)
val z = x.intersection(y)
// 4, 3, 5
```

**`distinct`** (a-la UNIQUE)returns a new dataset that contains the distinct elements of the source dataset. For instance, in the simplest case, if you have an RDD with some values duplicated (say 1,2,1,3,2) and run the distinct transformation, then you get a new RDD with unique values only. Please note that the values might change partitions.
```
val x = sc.parallelize(Array(1, 2, 1, 3, 2), 2)
val z = x.distinct()
// 1, 3, 2
```
**`coalesce`** decreases the number of partitions in the RDD to the given one. It is useful for running operations more efficiently after filtering down a large dataset. For instance, if you have an RDD with 1 to 6 integers, spread around 4 partitions, you can easily decrease partitions to 2 by running coalesce(2) on it.

```
val x = sc.parallelize(1 to 6, 4)
// [1], [2, 3], [4], [5, 6]

val z = x.coalesce(2)
// [1, 2, 3], [4, 5, 6]
```
`**repartition**` (DOES NOT EQULLY DISTRIBUTE VALUES, SOME RRDS may be empty)changes the number of partitions in the RDD to the given one. It means you can also decrease partitions to 2 with its help. Decreasing the number of partitions does not mean you get equal partitions, for example, RDD values are not distributed equally as you can see in this case.
```
val x = sc.parallelize(1 to 6, 4)
// [1], [2, 3], [4], [5, 6]

val z = x.repartition(2)
// [1, 2, 4, 5], [3, 6]
```
> Thus, what's the difference between a coalesce and repartition? The only thing coalesce can do is to decrease the number of partitions, while repartition can increase them.
> If you are not sure how many partitions you have and do not want to increase them but possibly decrease, then coalesce is your choice. Otherwise, if there is no need to change the number of partitions, whether increasing or decreasing, then select repartition
#### Actions
Provide non RDD DATA
Examples include: **`count(); collect(); take(n); top(n); countByValue(); reduce(func); fold(zeroValue, func); aggregate(zeroValue, seqOp, combOp); foreach(func); saveAsTextFile(path); saveAsSequenceFile(path); saveAsObjectFile(path).`**

Top returns unordered values, Take returns ordered values

An action is basically what triggers execution (computation) of transformations.
In the given example, execution only happens when `filtered.count()` is passed. This is an example of narrow transformation, everything happens within one partition.

``` python
>>> strings = spark.read.text("../README.md")  
>>> filtered = strings.filter(strings.value.contains("Spark")) >>> filtered.count()  
20
```

The table below has some examples of transformations and actions.

| Transformations | Actions   |
| --------------- | --------- |
| orderBy()       | show()    |
| groupBy()       | take()    |
| filter()        | count()   |
| select()        | collect() |
| join()          | save()    |

### Jobs
Applications are transformed into a Jobs and then into a DAG (directed acyclic graph)![[Screenshot 2024-06-15 at 17.55.26.png]]
#### Stages
A Job has at least 1 stage, but can be divided intro many depending on the complexity.
![[Screenshot 2024-06-15 at 17.56.01.png]]
##### Tasks
A task is a subset of Stage, an actual execution unit. Maps to a single core working with one partition of data. I.e. An executor with 10 cores has 10 task in achieving native level of parallelization 
![[Screenshot 2024-06-15 at 22.31.14.png]]
