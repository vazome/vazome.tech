Is a logging service answering the question "what is happening on AWS"? Focuses on resources activities.
Gathers and manages operational data. You need to use agent for custom.
Divides on 3 parts

CloudWatch – (for metrics) AWS Products, Apps, on-premises (Metrics and related)
CloudWatch Logs – AWS Products, Apps, on-premises (Logs)
CloudWatch Events (superseded by [[EventBridge]]) – AWS Services & Scheduler (generates events that do something)
![[Pasted image 20230122233327.png|500]]
Namespace – division of data. Like AWS/EC or CAT/CATAGRAM
Metric – is a collection of related data in a time or structure, (CPU, IO etc..)
Datapoint – contains timestamp and value, is a piece of Metric.
Dimensions – name/value pairs separate datapoints

![[Pasted image 20230122233717.png|500]]
Alarms is linked to Metric and criteria you set, alarm can trigger action based on criteria. Can have insufficient data state, until it gets enough

#monitoring