#dataeng 

`%run` magic command can isolate execution to local context within notebook cell.

To clear context and variables: Visit the **Run** menu and select the **Clear state and outputs**.

**Query a file/directory** 
To query the data contained in a single file, execute the query with the following pattern:

``` SQL
SELECT * FROM file_format.`/path/to/file ..or ${CLASS.paths.OFKAFKAEVENT}`
```
==This call can also be done in python, but more lines==
``` python
# UNCOMMENT %python
json_path = f"{DA.paths.kafka_events}/001.json"
df = spark.read.json(json_path)
display(df)
```
Reference to Query by view
``` SQL
CREATE OR REPLACE VIEW event_view
AS SELECT * FROM json.`${DA.paths.kafka_events}`
```
Reference to Query by view (TEMP)
```SQL
CREATE OR REPLACE TEMP VIEW events_temp_view
AS SELECT * FROM json.`${DA.paths.kafka_events}`
```
Common Table Expression(CTE) they are short lived and act as variable within cell/function!
```SQL
WITH cte_json
AS (SELECT * FROM json.`${DA.paths.kafka_events}`)
SELECT * FROM cte_json
```
Binaryfile and working with unstructured data and it's metadata
``` SQL
SELECT * FROM binaryFile.`${DA.paths.kafka_events}`
```

## Pivoting

you can use `.pivot()` to move values from within column to multiple columns
Code example

```python
%python
transactionsDF = (item_purchasesDF
.groupBy("order_id",
"email",
"transaction_timestamp",
"total_item_quantity",
"purchase_revenue_in_usd",
"unique_items",
"items",
"item",
"name",
"price")
.pivot("item_id")
.sum("item.quantity")
)
display(transactionsDF)
```
Aside from `sum` you can use `avg, count, min, max` and `first`

**Unpivoted** table example:

|  **ID**  |  **Date**      |  **Food Name**  |  **Amount Eaten**  |
| -------- | -------------- | --------------- | ------------------ |
| 1        | August 1, 2019 | Sammich         | 2                  |
| 2        | August 1, 2019 | Pickle          | 3                  |
| 3        | August 1, 2019 | Apple           | 1                  |
| 4        | August 2, 2019 | Sammich         | 1                  |
| 5        | August 2, 2019 | Pickle          | 1                  |
| 6        | August 2, 2019 | Apple           | 4                  |
| 7        | August 3, 2019 | Cake            | 2                  |
| 8        | August 4, 2019 | Sammich         | 1                  |
| 9        | August 4, 2019 | Pickle          | 2                  |
| 10       | August 4, 2019 | Apple           | 3                  |
**Pivoted** table:

| DAY        | Sammich | Pickle | Apple | Cake |
| ---------- | ------- | ------ | ----- | ---- |
| 2019-08-01 | 2       | 3      | 1     | NULL |
| 2019-08-02 | 1       | 1      | 4     | NULL |
| 2019-08-03 | NULL    | NULL   | NULL  | 2    |
| 2019-08-04 | 1       | 2      | 3     | NULL |
# Create schema from json payload

schema_of_json() can create schema from json excerpt, usually paired with from_json()

also you can use inferSchema = true

# : vs explode

: allows you to filter before hand in e.g. string  from json (value:value_name = 'string') while explode creates new rows and columns based on key contents 
```python
%python
display(events_stringsDF
.where("value:event_name = 'finalize'")
.orderBy("key")
.limit(1)
)
```

```python
%python
from pyspark.sql.functions import explode, size
exploded_eventsDF = (parsed_eventsDF
.withColumn("item", explode("items"))
)
display(exploded_eventsDF.where(size("items") > 2))
```
# Caveats
## Distinct vs Unique
>“Distinct” means total number of different values regardless how many times it appears in the dataset. A name appears in the list multiple times is counted as 1 distinct count.
>Whereas, the “Unique” value is total number of values that **only appear once**.

# Collect() in Dataframe API
> The DataFrame API also offers the collect() method, but for extremely large DataFrames this is resource-heavy (expensive) and dangerous, as it can cause out-of-memory (OOM) exceptions.

# Samples

## List all Dataframes in session

``` python
from pyspark.sql import DataFrame

def list_dataframes():
    return [k for (k, v) in globals().items() if isinstance(v, DataFrame)]
# OR
for (k, v) in globals().items():
    if isinstance(v, DataFrame):
        print(k)
```