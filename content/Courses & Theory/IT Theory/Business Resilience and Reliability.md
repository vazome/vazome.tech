---
date created: 2025-06-19T12:57:45+04:00
date modified: 2025-06-24T23:52:48+04:00
tags:
  - concept/resilience
---
Below mentioned concepts are a part of [Business Continuity](https://en.wikipedia.org/wiki/Business_continuity_planning).
# Concepts
## High availability (HA)
Aims to ensure an agreed level of operational performance (uptime). Systems can be unavailable only within agreed time borders. Maximising uptime. It's like having a spare wheel.
![[Pasted image 20230121154412.png|500]]

## Fault Tolerance (FT)
Systems must work after a fault occurs. Disruption prevention. Must work through failure without disruption. Involves HA, but requires more than that. It's like a plane that has two pilots, two pilot seats, 4 engines, crew of multiple people. Highly available plane is disastrous, but fault tolerant plane isn't.
![[Pasted image 20230121154434.png|500]]
## Disaster Recovery (DR)
Set of policies, tools, and procedures to enable recovery or continuation of vital technology in event of a disaster. Involves pre-planning, documentation, maximum knowledge availability between staff
![[Pasted image 20230121154505.png|500]]

# Business Metrics
[Establishing RPO and RTO Targets for Cloud Applications | AWS Cloud Operations & Migrations Blog](https://aws.amazon.com/blogs/mt/establishing-rpo-and-rto-targets-for-cloud-applications/)
### RPO
Aim to know Goldilocks as close to the TRUE business requirements as possible. Business may not know, you must help them and yourself to know.

>[!INFO]
>RPO Recovery Point Objective – **maximum amount of time or data that can be lost during a disaster recovery situation before that loss become intolerable.** 
>E.g. RPO - 6 hours means that organisation cannot tolerate 6 hours of data loss.

Banks may have RPO "buffer" because they deal with customers money.
	Backups can shorten the extend of the data loss and provide you maximum time of  data loss (because you can restore/new backup will be created if system failed later)
		Lower RPO = More money (Usually)
![[Pasted image 20230121050307.png]]
## RTO
>[!INFO]
> RTO Recovery Time Objective - maximum amount of time that system can be down after a failure occurs. Clock starts ticking the moment failure occurs and stops when system has been given back fully functioning.

Can be figured though following workflow stages:
1. It is important to have monitoring, alerting and correct (skilled for) people who can be up in non-working hours. Plan beforehand how OPS will act.
	1. The "wake up" must be built into your processes, you will not be immediately aware of the issue.
2.  Issue investigation, can we quickly fix it? Is it on fire? What is the final decision?
3.  How can we restore? Where? Who can do? Documentation in place, available? Also, bad notification service or bad documentation can add hours to restore, not speaking about new hardware orders…