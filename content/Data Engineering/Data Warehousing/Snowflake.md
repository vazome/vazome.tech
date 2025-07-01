---
tags: []
created: 2025-07-01T12:15:08+04:00
modified: 2025-07-01T12:35:10+04:00
---
Uses drivers for communication with external tools, supports ODBC and JDBC and connectors like [[Apache Spark]] or python.

This article will use some images that belong to: Data Camp - [Learn Data Science and AI Online \| DataCamp](https://www.datacamp.com/)
# Flavor
Has its own flavor of [[SQL]]

## JSON Processing
- Postgres: Uses `JSONB`
- Snowflake: Uses `VARIANT`
	- Supports both **OBJECT** and **ARRAY** data types:
	  - `OBJECT`: `{ "key": "value" }` (key-value pairs)
	  - `ARRAY`: `["list", "of", "values"]` (ordered list)
	  - **Creating a Table for JSON Data**
```sql
CREATE TABLE cust_info.json_data (
    customer_id INT,
    customer_info VARIANT  -- VARIANT column for semi-structured data
);
```

`PARSE_JSON(expr)`
- `expr`: A string containing JSON-formatted data
Returns
- A `VARIANT` type containing the parsed JSON object
- Returns `NULL` if the input string is not valid JSON


```sql
SELECT PARSE_JSON(
    -- JSON string enclosed in single quotes
    '{
        "cust_id": 1,
        "cust_name": "cust1",
        "cust_age": 40,
        "cust_email": "cust1***@gmail.com"
    }'
) AS customer_info_json;
```

| Key          | Value                  | Data Type |
|--------------|------------------------|-----------|
| `cust_age`   | 40                     | Integer   |
| `cust_email` | `cust1***@gmail.com`   | String    |
| `cust_id`    | 1                      | Integer   |
| `cust_name`  | `cust1`                | String    |
To create JSON object, use `OBJECT_CONSTRUCT`.
![[Pasted image 20250403035031.png]]
![[Pasted image 20250403035050.png]]
![[Pasted image 20250403035108.png]]
`GROUP BY ALL` groups by all.![[{790ABE58-D2D5-42B7-AFBD-BC7A126CECE0}.png]]

`NUMBER(p, s)` - similar to `NUMERIC` has precision and scale. `NUMERIC` is aliased it.
`TIMESTAMP_LTZ`
`CAST` or `::` works the same![[{9F05577D-1144-420A-BA77-44ED5A4A6EC8}.png]]

Has conversion functions like `TO_VARCHAR` converts numeric or timestamps into string format, `TO_DATE`

Alternatively to this:
``` sql
select column_name, data_type, character_maximum_length, column_default, is_nullable
from INFORMATION_SCHEMA.COLUMNS where table_name = '<name of table>';
```
We can do this: `DESC TABLE orders`

`INITCAP(column)` to capitalize the beginning of a cell.
`CURRENT_DATE` and `CURRENT_TIME` for current timestamp 
`EXTRACT` to extract specific part of timestamp.![[{EAA2F3EA-8EBC-47CD-A7E7-DE6268DD86CF}.png]]

``` sql
SELECT COUNT(*) AS orders_per_day, 
    EXTRACT(weekday FROM order_date) AS order_day
FROM orders
GROUP BY order_day
ORDER BY orders_per_day DESC
```
![[{D72D70A1-8662-424B-8E78-7CBB3BAFA25D} 1.png|400]]
`NATURAL JOIN` - Removed duplicate columns, does not require ON clause
![[{825A06AE-2158-4A76-8014-5EC752624216}.png]]

`LATERAL JOIN` - Allows subquery to reference columns in preceding tables. In this subquery `JOIN` inside subquery is not needed
![[{59975A18-9C13-4E42-833A-5CC7249A0999}.png]]

## Optimization
![[{397303BF-6936-4AAE-AC6C-E5EF77F87B27}.png]]

- **`UNION`** or **`UNION ALL`**: Know the difference  
  - **`UNION`** removes duplicates, slows down the query  
  - **`UNION ALL`** is faster if no duplicates  

- **Handling big data**  
  - Use filters to narrow down data  
  - Apply limits for quicker results  

![[{70E71331-9C39-48F8-882A-AE7260560F64}.png]]
![[{C8B30727-EDB5-46F3-BCBF-84CA2FBB47FB}.png]]

**Apply filtering beforehand**, this one is wrong application:
```sql
SELECT orders.order_id,
       orders.order_date,
       pizza_type.name,
       pizzas.pizza_size
FROM orders
JOIN order_details
ON orders.order_id = order_details.order_id
JOIN pizzas
ON order_details.pizza_id = pizzas.pizza_id
JOIN pizza_type
ON pizzas.pizza_type_id = pizza_type.pizza_type_id
WHERE orders.order_date = '2015-01-01';  -- Filtering after JOIN

```
And this one is good application:
``` sql
WITH filtered_orders AS (
    SELECT *
    FROM orders
    WHERE order_date = '2015-01-01'  -- Filtering in CTE before JOIN
)
SELECT filtered_orders.order_id,
       filtered_orders.order_date,
       pizza_type.name,
       pizzas.pizza_size
FROM filtered_orders  -- Joining with CTE
JOIN order_details
ON filtered_orders.order_id = order_details.order_id
JOIN pizzas;

```

### Query History
- Source: `snowflake.account_usage.query_history`
- Provides different metrics such as execution time
```sql
SELECT query_text, start_time, end_time, execution_time
FROM
    snowflake.account_usage.query_history
WHERE query_text ILIKE '%order_details%'
```
#### Query Results

| QUERY_TEXT                                                                       | START_TIME                    | END_TIME                      | EXECUTION_TIME |
| -------------------------------------------------------------------------------- | ----------------------------- | ----------------------------- | -------------- |
| `SELECT * FROM order_details AS od JOIN pizzas AS p ON od.pizza_id = p.pizza_id` | 2023-09-01 03:44:37.233 -0700 | 2023-09-01 03:44:38.309 -0700 | 529            |
| `SELECT * FROM order_details AS od JOIN pizzas AS p;`                            | 2023-09-01 03:43:37.899 -0700 | 2023-09-01 03:43:47.369 -0700 | 8,747          |
Note:
- `ILIKE`: Case-insensitive string-matching operator