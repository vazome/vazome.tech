---
date created: 2025-06-21T01:26:01+04:00
date modified: 2025-06-21T01:52:23+04:00
tags:
  - concept/scale
  - concept/resilience
---
Related: [[AWS CloudFormation]], [[AWS Organizations]], [[AWS Config]]

Quick and easy setup for AWS multi-account environment
Orchestrates other AWS services to provide this functionality

Landing Zone – multi-account environment
Guard Rails – detect/mandate rules
Account Factory – Automates and Standardises new accounts creation.

Foundational OU (def: security) – Audit account (SNS CloudWatch), Log archive account (for like Config and CloudTrail)

Custom OU (def: sandbox) –

Account Factory provisions accounts![[Pasted image 20230122234505.png|500]]
Guard Rails
![[Pasted image 20230122234547.png|500]]
![[Pasted image 20230122234559.png|500]]