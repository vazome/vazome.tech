Related: [[VPC]],[[VPC Security Groups (Stateful)]]

Network Access Control List (Network ACL)
Each subnet has 1 NACL, but 1 NACL can be associated with many subnets

Offer both explicit allow and explicit deny. Inbound/Outbound. Supports only subnets  
Rules get processed in order **lowest ruler number 
\* first is an implicit deny (if nothing else, then)**
Default NACLs are configured the way they allow any connection – no effect.
==Custom by default restrict any, not associated with a subnet by default, be careful!==

Can be used with security groups no explicitly DENY BAD IPs/NET
Not secure with wide port range for response rules
![[Pasted image 20230122172954.png]]
Tedious, too much overhead
![[Pasted image 20230122173003.png]]

#