---
created: 2025-06-30T06:32:04+04:00
modified: 2025-06-30T06:35:20+04:00
---
Much upgraded version of [[S3 Select and Glacier Select]]

> [!NOTE]
> S3 Select operates on only one object while Athena to run queries across multiple paths, which will include all files within that path.

![[Pasted image 20230316193827.png]]
Interactive querying service, pay for data consumed.
Uses schema-on-read.
	You define schema in advance, it commands how to structure data into tables.
	Collected data is processed and translated.
		Original data is unmodified
	Output can be send to other AWS services.

Supports lots of data formats. 
Good for occasional data query

Athena Federated Query (uses connectors to read from other data sources.)