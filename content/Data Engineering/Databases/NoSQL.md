#dataeng 

Related: [[DBMS]]

This article will use some images and diagrams that belong to: Adam Cantril - [cantrill.io](cantrill.io)
# Key-Value
[[Redis]]
Key must be unique.
Very simple. Scalable. Fast. In-memory caching.
![[Pasted image 20230121045338.png]]

# Wide Column Store
1 Key or more keys, groupings of attributes.
Attributes can be not unique, no restriction
![[Pasted image 20230121045357.png]]

# Document
[[Amazon DocumentDB]], [[MongoDB]], [[Firebase Firestore]]
Like an extension of Key-Value, each document interacted by its unique ID. Nested data. Each document are unique and may be linked together. Flexible index.
![[Untitled picture 2.png]]

# Column
[[Apache Cassandra]]
Alike Relational Row store, column can quickly give out data for whole data in the column. Good for analytics, bad for transactions.
AWS Redshift.
![[Pasted image 20230121045434.png]]

# Graph
[[Neo4j]]
Nodes and edges with name/value pairs.
Relationships are stored in the database itself, query to pull data on all people from xyz corp will run faster. Because in relation DB, relations are computed after data is taken, here not.![[Pasted image 20230121045429.png]]