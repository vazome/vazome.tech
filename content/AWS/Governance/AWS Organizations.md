---
created: 2025-06-30T06:32:04+04:00
modified: 2025-06-30T06:35:20+04:00
---
Is a way to manage multiple account in AWS.
Master account, Payer account = management account.
One management account and multiple member account.

AWS Organizations can pool services in billing the way it becomes cheaper (instead of per account pricing on your load it counts pricing for org) Consolidation reservations or volume discounts.
![[Untitled picture 5.png]]
## SCPs
SCP – Service Control Policies

JSON

SCPs does not affect management accounts
They limit what account itself including root user can do
They don't grant permissions
Deny list/Allow list – you choose which way
![[Pasted image 20230121233326.png]]
Two a service to be allowed it must be allowed in both services.![[Pasted image 20230121233346.png]]