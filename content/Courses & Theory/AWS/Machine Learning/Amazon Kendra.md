---
created: 2025-06-30T06:32:04+04:00
modified: 2025-06-30T06:35:20+04:00
---
Intelligent search service designed to mimic interacting with a human expert. Usually connected via API
- Supports wide range of question types
- Factoid - Who, What, Where
- Descriptive - How do I get my cat to stop being a jerk?
- Keyword - What time is the keynote address (address can have multiple meanings) - Kendra helps determine intent.

Uses indexes from [[AWS S3 Simple Storage Service]], Confluence, Google Workspace, RDS, OneDrive, SalesForce, Kendra, [[AWS FSx]].
![[Screenshot 2023-03-20 at 02.54.13.png]]
[Data sources - Amazon Kendra](https://docs.aws.amazon.com/kendra/latest/dg/hiw-data-source.html)
[Types of documents - Amazon Kendra](https://docs.aws.amazon.com/kendra/latest/dg/index-document-types.html)