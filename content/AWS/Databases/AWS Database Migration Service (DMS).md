---
date created: 2025-06-19T12:57:45+04:00
date modified: 2025-06-21T01:52:50+04:00
---
Related: [[DBMS]], [[content/AWS/RDS/RDS]], [[AWS Amazon Aurora]],
No downtime migration service.

Consists of 
- Source Endpoint
- EC2 Replication instance
- Target Endpoint
Replication instance performs the migration between Source and Destination endpoints which store connection information for source and target databases

Has 3 types of jobs.

1. Full Job - one-off migration of all data
2. Full Job + CDC (Change data capture) - migrates existing data + ongoing changes (full load migration)
3. CDC only - migrates only data changes (when you used other tool migrate full DB)

Also goes along with **SCT**

# Schema Conversion Tool (SCT)
Related: [[AWS Snow Family]]

Helps to convert/change DB schema. Mostly used when migrating to another DB engine.
==SCT is not used when migrating between DB's of the same type like MySQL to RDS MySQL.==
Works with:
- OLTP DB Types (MySQL, MSSQL, Oracle)
- OLAP (Teradata, Oracle, Vertica, Greenplum..
Used in cases like:
- e.g. On-Premises MSSQL -> RDS MySQL
- e.g. On-premises ORACLE -> Aurora

If DB is multi-TB it maybe impractical to transfer data over network. [[AWS Snow Family]] is a solution, DMS can utilise snowball ...
- ﻿Step 1 : Use SCT to extract data locally and move to a snowball device
- ﻿Step 2: Ship the device back to AWS. They load onto an [[AWS S3 Simple Storage Service]] bucket.
- ﻿Step 3: DMS migrates from S3 into the target store
- ﻿Step 4: Change Data Capture (CDC) can capture changes, and via S3 intermediary they are also written to the target database