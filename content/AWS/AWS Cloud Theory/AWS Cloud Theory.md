---
date created: 2025-06-20T15:31:41+04:00
date modified: 2025-06-20T16:09:31+04:00
---
### AWS Global and Regional Architecture

Related:

Regions are separate as isolated fault domains and geopolitically, location control.
Regions have Availability Zone which have separate power, connection and are located in different locations. Can be multiple DCs in one AZ. They are isolated too.
Creation of Virtual Private Cloud between AZs is possible

AWS Edge location can be use to speed up processes where AWS Regions are not available.
![[Pasted image 20230129171659.png]]

# Service Resilience
-   Global Resilient - for these services to fail you need the world to fail.
-   Region Resilient - for these services to fail you need Region to fail.
-   AZ Resilient - for these services to fail you need Availability Zone to fail.

### AWS Local Zones


Use `countrycode-region-id-citycode-id` notation: us-west-2-las-1

- "1" zone ..so no built in resilience.
- Think of them like an AZ, but near your location
- They are closer to you ... so lower latency.
- Not all products support them .. many are opt in w/ limitations
- DX to a local zone IS support (extreme performance needs)
- Utilise parent region .. i.e EBS snapshots are TO parent
- Use local zones when you need THE HIGHEST performance

Help to reduce latency because AZs can be 100+km away from on-premise.
Not all services support them. Can connect to them with [[Direct Connect (DX)]] (generally)
Local zones have private networking with the parent region, but subnets located in Local Zones. Not resilient.
	EBS snapshots are stored in regional S3.![[Pasted image 20230320045939.png]]
[AWS Local Zones Features - Amazon Web Services](https://aws.amazon.com/about-aws/global-infrastructure/localzones/features)

### Public vs Private Service


Related: [[AWS Global and Regional Architecture]], [[What is Cloud?]], [[Public vs Private vs Multi vs Hybrid Cloud]]

Public – is global facing service (as S3)
Private – is within VPN.

AWS Public Zone is not Internet but connected to it.
Resources in AWS Private Zone can access AWS Public Zone with, for example (IGW)

### Shared Responsibility


Related: [[AWS Global and Regional Architecture]], [[Cloud Service Models]]

AWS - Security off the cloud
You - Security in the cloud
![[Pasted image 20230121034140.png]]