Related: [[IT Software Architectures]]

Is a scaleable streaming service, producers send data into a kinesis stream.
Public, Has [[Resilience and Reliability#High availability (HA)]]. 
Data available in the moving windows for 24h by default up to 365d with additional cost. So 24h 1s is discarded.
Multiple consumers access data from that moving window.

# Data Streams
**Kinesis Data Streams focuses on ingesting and storing data streams.**
Data is a stream is organised with "shards". Data records – 1MB, stored across shards.
Each shard provides 1MB/s Ingestion and 2 MB/s Consumption capacity.
**Real time delivery ~200ms**
Usually delivers to computes services.
![[Pasted image 20230213022710.png]]

# Data Firehouse
**Kinesis Data Firehose focuses on delivering data streams to select destinations.**
Fully managed service to load data for data lakes, data stores and analytics services.
Automatic scaling, fully serverless and resilient.
**Near** realtime delivery <60s of data to the destination.
Supports transformation of data on the fly [[Lambda]] (increases latency)
Billed per passed data 

Can deliver to HTTP, Splunk, [[AWS Redshift]], [[ElasticSearch]], [[AWS S3 Simple Storage Service]]

Producers can put data directly into Firehouse or into [[#Data Streams]] then Kinesis will consume it from them.
Delivers data when either 1MB buffer fills up or 60s timeout.
![[Pasted image 20230213022632.png]]

# Data Analytics
Real time analytics of data using [[SQL]] (Firehouse can do this too via lambda but is not real time)

Ingests from [[#Data Streams]] or [[#Data Firehouse]], and optionally static data from S3
Destination [[#Data Firehouse]]  (and it's destinations, also **loses real time**), [[Lambda]], [[#Data Streams]]
Enrich source data with references (like form [[AWS S3 Simple Storage Service]]), select, format data and output it to [[#Data Streams]] or [[#Data Firehouse]]
Pay for processed data, not cheap, best use for
- Streaming data requiring real-time SQL processing
- Time-series analytics (elections/e-sports)
- Real-time dashboards (leaderboards)
- Real-time metrics (Security and Response teams)

![[Pasted image 20230215004718.png]]

# Video Streams
Collects (Ingests) video streams fro various producers such as CCTV, smartphones, cars, drones, time-serialised audio, thermal, depth, RADAR data.
Consumers can access frame-by-frame.. or as needed.
Holds data and encrypts data [[Encryption and Encoding#At Rest]] and [[Encryption and Encoding#At Transit]]
Integrates well if [[Amazon Rekognition]] and [[Connect]]
Relatable to [Real Time Streaming Protocol - Wikipedia](https://en.wikipedia.org/wiki/Real_Time_Streaming_Protocol) and [GStreamer - Wikipedia](https://en.wikipedia.org/wiki/GStreamer)
>[!WARNING]
> You can't access received data via S3 or other matter. Only via the product itself (APIs).

![[Pasted image 20230215011417.png]]

# [[AWS SQS]] vs Kinesis

>[!NOTE]
>**SQS** usually for worker pools, decoupling, asynchronous communication
>**Kinesis** usually for ingestion of data.

SQS receives messages from one production group, can has 1 consumer.
SQS is not designed to receive data from 100000 sensors at once.
SQS sender and received may not know about each other Decoupling and Asynchronous.
SQS has no persistence and window.

Kinesis is for **huge scale ingestion** and multiple consumers
Data ingestion, analytics, monitoring, app clicks
