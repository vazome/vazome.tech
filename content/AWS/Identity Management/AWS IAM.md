---
date created: 2025-06-21T01:02:28+04:00
date modified: 2025-06-21T01:54:32+04:00
---
Inline - exceptional/special allows or denies
Managed policies – easy to manage policies, as separate object which can be assigned
![[Pasted image 20230121031350.png|500]]
Resource policies cannot reference groups. Groups cannot be referenced!
There is no all users group and groups can't nest
300 groups per account.

# Security tools
Security Tools include:
- Access Advisor – view unused accesses by user
- Credentials report – view broad information regarding user (like logs)

# MFA Enforcement
You can Enforce MFA the way it restricts a user to use AWS Services until they setup MFA

# IAM Role
IAM Roles does not represent themselves, they represent permissions. 
User assumes role to become an identity in a short term. An assumed IAM Role generates temporary credentials. Used in [[EC2#EC2 Instance Profile]].

For large scale authentication (1,000,000 like unique request) you should consider using IAM Role instead of [IAM users - AWS Identity and Access Management](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html)
## Service Linked Role and IAM PassRole 
Allows service to do thing on your behalf. Linked to specific service which can create and delete it.
You cannot delete it until it no longer requires the service.
![[Pasted image 20230121033227.png|600]]
Role Separation:
IAM:PassRole - Bob can assign a role, but not use it
IAM:AssumeRole - Bob can user role, but not assign it (if role doesn't explicitly grant such right)
