---
date created: 2025-06-21T01:26:01+04:00
date modified: 2025-06-21T01:52:35+04:00
---
Related: [[]]

Simple Notification Service - highly available, secure, Public service but [[VPC]] can access if has a public endpoint. 
**Regional Resilient.**

Coordinates sending and delivery of messages <= **256 KB** payloads (delivery can be filtered)
**SNS Topic**, base entry, define permissions and configuration
**Publisher** - sends messages to the topic
**Subscribers** - receive messages, can be: HTTP(s), [[AWS SQS]] (**Fanout Architecture**), Email(-json), Mobile push, SMS Messages & Lambda

Used across AWS for notifications like: [[CloudWatch (Metrics)]] & [[AWS CloudFormation]].

Delivers

Delivery Status - (for HTTP, SQS, Lambda..)
Delivery Retries - Reliable Delivery 
HA & Scaleable - Regional
Server Side Encryption (SSE) - needed to have if mandated by requirements
Cross-Account via Topic policy 
