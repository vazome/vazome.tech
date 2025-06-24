#dataeng 

This article will use some images and diagrams that belong to: Data Camp - [Learn Data Science and AI Online \| DataCamp](https://www.datacamp.com/)
# SQL BASICS
![[Pasted image 20241217175013.png]]
## Terminology
- **Field** (Column) - defines what field name and data type
- **Record** (Row) - defines place where data can be put in
- **Attribute** -  is basically a column in a schema, it's not a different object, just separation of logic 
- **Key** - in general a field (column) or set of fields that serves a particular purpose. Regular Key (minimal superkey) is when you can't remove more columns since records won't be uniquely identifiable anymore.
	- **Primary key** - Unique, Not Null, as the name suggests can be the only one per table, ideally as few columns as possible
		- Surrogate key, is an artificial key usually created for the sake of having more suiting primary key, like `SERIAL` type auto-incrementing ID or `CONCAT` other columns, column. 
	- **Foreign key**
		- Reference to PK in other tables, NULL/Empty/duplicates allowed, values must be in same domain as PK, referential integrity applies.
		- by using `REFERENCES table(name)` you can lock possible values of foreign key to the range specified in PK table. By default set to `ON DELETE NO ACTION`
	- **Unique key**
	- **Composite key**
	- **Candidate key** - basically a regular key or minimal superkey, it uniquely identifies records and is a candidate to become a primary key
	- **Alternate key**
	- **Super key** - if you can remove columns from the key and the remaining ones still uniquely identify records.![[Pasted image 20250115195725.png]]

## List of some commands

- `SELECT (can be combined with DISTINCT)` column/expression/regex/math, `AS` alias, column/expression/regex/math2 `AS` alias2
	- Interger divided by integer returns integer! CAST to NUMBER/DECIMAL
- `SELECT AGG_FUNC(_column_or_expression_) AS aggregate_description` 
	- `GROUP BY` to have result per group in specified column (more precise aggregation)
		- Imagine we have car transmission type `[auto, manual]` so for each group we can get aggregate metric.
		- `HAVING` is like `WHERE` but after grouping
- `FROM` `123_woflow_table` AS `alias`
- `LIMIT`, `OFFSET` (optional) - Offset moves starting point where we begin to show record, e.g. `LIMIT 5 OFFSET 2` will show 4 records, we skip record №1.
- `INNER JOIN` join only matching columns
	- `ON p.user_id = p2.uid` but if columns same name employ `USING(colname)`
- `CARTESIAN/CROSS JOIN` join for each row of one table to every row of another table or T1.Student will have all T2.subject_names assigned, i.e. all possible combinations of everything like, 1:2:3, 1:3:2, 2:1:3, 2:3:1, 3:1:2, 3:2:1.
- `OUTER JOINS (LEFT/RIGHT/FULL)` for asymmetrical data unlike INNER.
	- When joining table A to table B, a `LEFT JOIN` simply includes rows from A regardless of whether a matching row is found in B. The `RIGHT JOIN` is the same, but reversed, keeping rows in B regardless of whether a match is found in A. Finally, a `FULL JOIN` simply means that rows from both tables are kept, regardless of whether a matching row exists in the other table (**that match the query's `WHERE` clause, and in cases where the `ON` condition can't be satisfied for those rows it puts `NULL` values in for the unpopulated fields.**). *ALL MATCHES (DUPLICATES) ARE PRESERVED*
		- `ON` condition `AND` condition
- `ORDER BY ASC/DESC` sorts fields or multiple fields (tie breaking) you can also order in ASC 1 field and in DESC 2 fields at the same time.
- `CREATE TABLE IF NOT EXISTS` Table
	- col `DataType` (INTEGER) `TableConstraint` (PRIMARY KEY...) `DEFAULT` _default_value_,
- `ALTER TABLE` to change table name, add/remove columns etc
	- Has `ADD` + `DEFAULT`, `DROP`, `RENAME COLUMN x TO `
- `DROP TABLE IF EXISTS` table
- `INSERT INTO` Table (this, is, optional, columns)
	- `VALUES` (1, 3.4, 1000/20, "Text")
- `UPDATE` Table
	- `SET` Col = expression
- `DELETE FROM` Table
	- `where`

`SELECT COUNT(DISTINCT birth)` count number of unique birthdates

For dates, remember `TO_CHAR`, `DATE_TRUNC`, `DATE_PART`, `FORMAT (but TO_CHAR is better)` which let's you format date output. You can also do `INTERVAL '30 days'` to compare between one or more dates within a range and stuff

You can create autoupdating view which you can access later:
`CREATE VIEW name_view AS SELECT (complex_logic) FROM table`
And then query it
`SELECT id, name FROM name_view`

`ROUND` with negative operator will round number after point. i.e 2006 becomes 2010 with operator '-1'

**Table manipulations**

``` sql
-- Populate table
INSERT INTO table_name (col1, col2...)
VALUE (val1, val2...)
-- Populate table from a query
INSERT INTO table_name
SELECT a, b
FROM table_og
-- Add column
ALTER TABLE professors 
ADD COLUMN id SERIAL;
-- Rename column
ALTER TABLE affiliations
RENAME COLUMN organisation TO organization;
-- Update column, modify existing records
UPDATE cars
SET id = CONCAT(make, model);
-- Add constraint
ALTER TABLE table_name
ADD CONSTRAINT some_name PRIMARY KEY (column_name)
-- Change column type
ALTER TABLE professors
ALTER COLUMN firstname
TYPE VARCHAR(16);
-- Truncate data in columns to certain number of characters
ALTER TABLE professors 
ALTER COLUMN firstname 
TYPE varchar(16)
USING SUBSTRING(firstname FROM 1 FOR 16)
-- Delete the university_shortname column
ALTER TABLE affiliations
DROP COLUMN university_shortname, DROP COLUMN unidays
-- YOU CAN LEAVE OUT THE COLUMN so it will be just DROP unidays
-- Delete table
DROP TABLE university_professors;
```
Some constraints:
![[Pasted image 20241226025912.png]]
![[Pasted image 20241226030147.png]]
## DB Schema
![[Pasted image 20241225002330.png]]
Adding affiliation function
![[Pasted image 20241225002424.png]]
`information_schema` is like meta overview of other tables' schemas:
``` sql
SELECT table_schema, table_name
FROM information_schema.tables;
```
It also holds columns information.
``` sql
-- table constraints
SELECT constraint_name, table_name, constraint_type
FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY';
--
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_name = 'pg_config';
--
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'university_professors' AND table_schema = 'public';
```

Finding a superkey
1. Count the distinct records for all possible combinations of columns. If the resulting number `x` equals the number of all rows in the table for a combination, you have discovered a superkey.
## **SET OPERATIONS**
![[Pasted image 20241221000259.png]]
They require same number of columns and same data type between them. Return data if `col_name` is aliased.

- With union it is unlike join, because we don't match, we stack it on top of each other with `UNION` or without `UNION ALL` duplicates.
	- *Each UNION query must have the same number of columns*
	- ![[Pasted image 20241221000537.png|400]]
```sql
SELECT pizza_id, 'Most Ordered' AS Description, total_qty AS metric
-- Select from the most_ordered CTE
FROM most_ordered
UNION ALL
SELECT pizza_id, 'Cheapest' AS Description, price AS metric
-- Select from the cheapest_pizza CTE
FROM cheapest_pizza
```
- `INTERSECT` returns matches between two tables, it's like `INNER JOIN` but unlike it does not produce duplicates when there is a duplicated value in one of the tables.![[Pasted image 20241221002056.png]]
- `EXCEPT` returns unmatched records.![[Pasted image 20241221002612.png]]

## Views
Can be created as simply as:
``` sql
CREATE VIEW top_10_sales_view AS
SELECT
	sale_id,
	description,
	price,
	tax 
FROM sales
ORDER BY price DESC
LIMIT 10;

DROP VIEW view_name (CASCADE | RESTRICT)

-- changing the view itself can be done as long as new_query generates the same coluymn names, order and data type. Though new columns can be added and output can be different.
CREATE OR REPLACE VIEW view_name AS new_query

-- to change name owners and other attributes.
ALTER VIEW ...
```

They can be materialized and non-materialized, meaning whether it stores the resulting data on disk or not.
`CREATE MATERIALIZED VIEW top_15 AS` and to refresh them `REFRESH MATERIALIZED VIEW` 
There is no SQL command to create an auto-refreshing views in PGSQL, but can be accomplished via [[CRON Scheduler]]. Materialized views have more dependency implications since if original view is updated earlier than materialized view then it's output is out-of-date.

Nowadays there are tools that use DAG, like in [[Apache Spark#DAG and how it works]] and pipeline schedulers, Like Apache Airflow or Luigi to track dependencies of views.
## SQL Permission control
Key commands are `GRANT` and `REVOKE`. There are reserved keywords such as `PUBLIC` which encompasses all users.
- `GRANT UPDATE ON reviews TO PUBLIC`
- `REVOKE INSERT ON films FROM db_user`

> [!Warning] Views grant caveat
> You can grant a user permission to update & insert a view, but not all views are updateable (can change data), it depends on the underlying query and database flavor.

### Roles
To create a role to achieve custom access controls you would typically
`CREATE ROLE data_analyst;`
And grant role to user/groups/roles with:
`GRANT marta TO data_scientist;`
Or with attributes (seems like WITH here is used like overall AND where space is the separator)
- `CREATE ROLE intern WITH PASSWORD 'PasswordForIntern' VALID UNTIL '2020-01-01';`
- `CREATE ROLE admin CREATEDB;
To change a role attributes
`ALTER ROLE admin CREATEROLE;`

To change permissions on a role
- `GRANT UPDATE, INSERT ON ratings TO data_analyst;`
- `REVOKE UPDATE ON ratings FROM data_analyst;`

![[Pasted image 20250206034605.png]]

## Complex stuff

### Table partitioning
Splitting the table into smaller parts as the table grows in size to improve query speed and stability. Similar to normalization via FK.

This falls into **Physical data model** as described here: [[Data Design and Pipelines#Data modelling]], because we distribute data over physical entities (storages).

**Vertical partitioning**
Splitting over columns:
![[Pasted image 20250206040901.png]]

**Horizontal partitioning**
Splitting over rows, like timestamp for example:
![[Pasted image 20250206041207.png]]
You put `PARTITION` clause after creation of the table:
`PARTITION BY LIST (release_year);`
`PARTITION BY RANGE (release_year);`

Full showcase:
``` sql
CREATE TABLE film_partitioned (
  film_id INT,
  title TEXT NOT NULL,
  release_year TEXT
)
PARTITION BY LIST (release_year);

-- Create the partitions for 2019, 2018, and 2017
CREATE TABLE film_2019
	PARTITION OF film_partitioned FOR VALUES IN ('2019');

CREATE TABLE film_2018
	PARTITION OF film_partitioned FOR VALUES IN ('2018');

CREATE TABLE film_2017
	PARTITION OF film_partitioned FOR VALUES IN ('2017');

-- Insert the data into film_partitioned
INSERT INTO film_partitioned
SELECT film_id, title, release_year FROM film;

-- View film_partitioned
SELECT * FROM film_partitioned;
```

Some constraints can not be set if partitioned, and partitioning of the existing table can be a hassle.

**Sharding**
Sharding, relates to partitioning, but here you also distribute data across multiple machines (computes/processors), so it can benefit from parallel processing.
![[Pasted image 20250206041520.png]]
### Joining via multiple tables in `FROM`
**It's the same is `INNER JOIN`. But different format of writing.**
![[Pasted image 20241221015223.png]]

### Date manipulation on Postgres
[PostgreSQL: Documentation: 17: 9.9. Date/Time Functions and Operators](https://www.postgresql.org/docs/current/functions-datetime.html)

### Subqueries and CTEs

#### Subqueries
Can be correlated and uncorrelated, the difference is that uncorrelated don't use results from the main query

**Subquery in `SELECT`:**
![[Pasted image 20241221024944.png]]
OR
``` sql
SELECT 
    Register.contest_id,
    ROUND((COUNT(Register.contest_id)::decimal) / (
        SELECT COUNT(Users.user_id) -- here
        FROM Users) * 100, 2)
	AS percentage 
FROM Users
INNER JOIN Register
	ON Register.user_id = Users.user_id
GROUP BY Register.contest_id
ORDER BY percentage DESC, Register.contest_id ASC
```

**Subquery in `WHERE` Semi Join or Anti/join (if `NOT` used) case: *note that select 1 is there because something needs to be selected***
``` sql
SELECT s.id
FROM  students s
WHERE EXISTS (SELECT 1 FROM grades g
              WHERE g.student_id = s.id)
```

**Subquery in `FROM`** 
Example continents with most recent independence of a country.
![[Pasted image 20241221015606.png]]

**Subquery example in `JOIN`.**
``` sql
SELECT Employee.name
FROM Employee
FULL JOIN (
    SELECT managerId, COUNT(managerId) AS count_mgmt
    FROM Employee
    WHERE managerId IS NOT NULL
    GROUP BY managerId
) AS TempTable
ON TempTable.managerId = Employee.id;
```

```sql
SELECT pt.name,
    pt.category,
    SUM(od.quantity) AS total_orders
FROM pizza_type pt
JOIN pizzas p
    ON pt.pizza_type_id = p.pizza_type_id
JOIN order_details od
    ON p.pizza_id = od.pizza_id
GROUP BY ALL
HAVING SUM(od.quantity) < (
  -- Calculate AVG of total_quantity
  SELECT AVG(total_quantity)
  FROM (
    -- Calculate total_quantity
    SELECT SUM(od.quantity) AS total_quantity
    FROM pizzas p
    JOIN order_details od 
    	ON p.pizza_id = od.pizza_id
    GROUP BY p.pizza_id
    -- Alias as subquery
  ) AS subquery
)
```
#### CTE (Common Table Expression) 
Allows us to nickname (create variable/constant) with this query. ![[{FC684F8A-838B-4C54-8609-BA9BC92AC9F3}.png]]
example:

``` sql
WITH TempTable AS (
    SELECT managerId, COUNT(managerId) AS count_mgmt
    FROM Employee
    WHERE managerId IS NOT NULL
    GROUP BY managerId
)
SELECT Employee.name
FROM Employee
FULL JOIN TempTable
ON TempTable.managerId = Employee.id;
```
![[{E77C812F-5778-49C3-86FA-ECC990B692B0} 1.png]]
### Normal forms (xNF) of normalization
#### Kinds of norms
There are multiple kinds of normal forms
- 1NF
	- Each record is unique, so no duplicate rows
	- Each cell holds one value
		- Example: `"Courses" | 'Python, SQL'` is invalid in such design, colors column has a record with two values. In example below Completed was Courses: ![[Pasted image 20250123232216.png]]
- 2NF satisfies 1NF AND
	- If PK is one column, they automatically satisfy 1NF
	- If PK is a composite key, the each non-key column must depend on all the keys
		- Example: `instructor_id` and `instructor` depend on course_id, meanwhile progress dependent on student_id![[Pasted image 20250123233057.png]]This is where we spit table into two likewise: ![[Pasted image 20250123233114.png]]
- 3NF satisfies 2NF AND
	- Has no transitive dependencies: non-PK columns cannot depend on other non-PK columns
		- Example:![[Pasted image 20250123233806.png]]  ![[Pasted image 20250123233843.png]]

#### Anomalies with insufficient normalization
![[Pasted image 20250124005815.png]]
**Update anomaly**: Like here, where you need to update 2 records at id 520
**Insertion anomaly**: Unable to insert record because some attribute can be missing, e.g. we have a student that didn't enroll yet, but columns can't be null
**Deletion anomaly**: If we delete 230 what happens to "Clearing Data in R", course information.
## Caveats


### Dates

> [!Warning]
> POSTGRES DOES NOT HAVE `DATEADD` USE `INTERVAL 'X NUMERATOR'`

### DROP VS DELETE


### Aggregate function operates on column (field)
It is. They don't operate on rows(records).

### `COUNT` counts 0 (zeros) and doesn't count NULL
`COUNT()` counts all non-NULL values, including zeros.
### Integer division truncates decimal part

ROUNDING AFTER ITEGER DEVISION DOES NOT GIVE RESULT. 

### Division by 0, the kludgy way of workaround via NULL

Suppose `COUNT` of `CON1.user_id = 0`, we can't divide by 0, but we can divide by NULL, to get NULL result. Then we use COALESCE to convert NULL Result to 0.... Fuck this shit.
``` sql
COALESCE(COUNT(CON2.user_id) / NULLIF(COUNT(CON1.user_id), 0), 0)
```

### PGSQL VS MYSQL
MYSQL FORMAT
``` sql
ROUND(IFNULL(AVG(action = 'confirmed'), 0), 2) AS confirmation_rate
```

``` sql
ROUND(COALESCE(AVG((action = 'confirmed')::int), 0), 2) AS confirmation_rate
```
#### **MySQL**

- MySQL allows boolean expressions (like `action = 'confirmed'`) to be used directly in the `SELECT` clause and treats them as integers:
    - `TRUE` is treated as `1`.
    - `FALSE` is treated as `0`.
- Aggregate functions like `AVG()` can operate directly on these boolean values.

#### **PostgreSQL**

- PostgreSQL adheres to stricter type handling:
    - Boolean expressions (`action = 'confirmed'`) evaluate to `TRUE` or `FALSE` (not `1` or `0`).
    - Aggregate functions like `AVG()` cannot directly operate on booleans because they are not integers.

| month   | country | trans_count | approved_count | trans_total_amount | approved_total_amount |
| ------- | ------- | ----------- | -------------- | ------------------ | --------------------- |
| 2019-01 | US      | 1           | 1              | 2000               | 2000                  |
| 2019-01 | null    | 0           | 1              | 2000               | 2000                  |
| 2018-12 | US      | 2           | 1              | 3000               | 1000                  |
### Shortenings

`FROM Table T` is `FROM Table AS T`

`ROUND(avg(AC2.timestamp - AC1.timestamp)::numeric,3)` is `ROUND(CAST(AVG(AC2.timestamp - AC1.timestamp) AS NUMERIC), 3)`

### VAR VARCHAT TEXT

Text is unlimited in number of characters.
### Length vs Char_length vs DATALENGHT

| Function      | Measures                  | Encoding Sensitive |
| ------------- | ------------------------- | ------------------ |
| `LENGTH`      | Bytes                     | Yes                |
| `CHAR_LENGTH` | Characters                | No                 |
| `DATALENGTH`  | Bytes (for any data type) | Yes                |
## Order of execution
![[Pasted image 20241214222838.png]]
### DDL
DDL stands for Data Definition Language
# CREATE TABLE VS CTAS CREATE TABLE

The main difference between the CREATE TABLE approach and the CTAS (Create Table As Select) approach lies in how the table is created and populated.

- **Data Population**:
    - CREATE TABLE: Defines the schema and location but does not populate the table.
    - CTAS: Defines the schema and populates the table with data from the SELECT query.
- **Flexibility**:
    - CREATE TABLE: Requires data to be already present at the specified location.
    - CTAS: Allows for data transformation and type casting during table creation.
- **Use Case**:
    - CREATE TABLE: Use when you have data already formatted and located correctly.
    - CTAS: Use when you need to transform data or ensure correct data types during table creation.

## CREATE TABLE
This approach defines the schema and specifies the location of the data, but it does not populate the table with data. The table is created with the specified schema, and the data is expected to be in the specified location.
``` SQL
CREATE TABLE IF NOT EXISTS events_json
	(key BINARY, offset LONG, partition INTEGER, timestamp LONG, topic STRING, value BINARY)
USING JSON
LOCATION "${DA.paths.kafka_events}"
```

## CTAS (Create Table As Select)
This approach creates a new table based on the result of a SELECT query. It allows you to define the schema and populate the table with data in a single operation. Additionally, you can use CAST to ensure the data types are correct.

``` SQL
CREATE TABLE events_json AS
SELECT
CAST(key AS BINARY) AS key,
CAST(offset AS LONG) AS offset,
CAST(partition AS INTEGER) AS partition,
CAST(timestamp AS LONG) AS timestamp,
CAST(topic AS STRING) AS topic,
CAST(value AS BINARY) AS value
FROM json.`${DA.paths.kafka_events}`
```

# Assert python

For sanity checks.

``` python
assert spark.table("events_json"), "Table named `events_json` does not exist"
assert spark.table("events_json").columns == ['key', 'offset', 'partition', 'timestamp', 'topic', 'value'], "Please name the columns in the order provided above"
assert spark.table("events_json").dtypes == [('key', 'binary'), ('offset', 'bigint'), ('partition', 'int'), ('timestamp', 'bigint'), ('topic', 'string'), ('value', 'binary')], "Please make sure the column types are identical to those provided above"
total = spark.table("events_json").count()

assert total == 2252, f"Expected 2252 records, found {total}"
```