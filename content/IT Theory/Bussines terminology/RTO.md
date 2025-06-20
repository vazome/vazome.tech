---
date created: 2025-06-19T12:57:45+04:00
date modified: 2025-06-20T15:19:00+04:00
tags:
  - concept/resilience
---
Related: [[RPO]]

Below mentioned concepts are a part of [Business Continuity](https://en.wikipedia.org/wiki/Business_continuity_planning).

>[!INFO]
> RTO Recovery Time Objective - maximum amount of time that system can be down after a failure occurs. Clock starts ticking the moment failure occurs and stops when system has been given back fully functioning.

Can be figured though following workflow stages:
1. It is important to have monitoring, alerting and correct (skilled for) people who can be up in non-working hours. Plan beforehand how OPS will act.
	1. The "wake up" must be built into your processes, you will not be immediately aware of the issue.
2.  Issue investigation, can we quickly fix it? Is it on fire? What is the final decision?
3.  How can we restore? Where? Who can do? Documentation in place, available? Also, bad notification service or bad documentation can add hours to restore, not speaking about new hardware orders…

[Establishing RPO and RTO Targets for Cloud Applications | AWS Cloud Operations & Migrations Blog](https://aws.amazon.com/blogs/mt/establishing-rpo-and-rto-targets-for-cloud-applications/)