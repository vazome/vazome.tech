---
tags: [monitoring]
date created: 2025-06-20T15:58:27+04:00
date modified: 2025-06-20T16:09:57+04:00
---
# CloudWatch (Metrics)

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

# CloudWatch Logging Inside EC2


Inside instance logging requires an Agent

Agent, must be configured and instance with given permissions (CW access) via [[EC2 Instance Profile]]
Log group is created for each individual log you want to capture and one log stream for each EC2 instance injecting that log.
Agent configuration, may be set in parameter store 
![[Pasted image 20230122234011.png|500]]

In demo was configured with use of

``` bash
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
#Amazon Linux Bug Fix (agent expects collectd to be installed, but actually you may create just path)
sudo mkdir -p /usr/share/collectd/  
sudo touch /usr/share/collectd/types.db
#And started with 
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c ssm:AmazonCloudWatch-linux -s
```

#monitoring

# CloudWatch Logs


Log group – is a group of log streams, stores config settings and metric filters.
	Log stream – Log events from same source for specific stream
![[Pasted image 20230122233605.png|500]]