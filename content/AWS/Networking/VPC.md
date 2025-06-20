---
date created: 2025-06-21T01:26:01+04:00
date modified: 2025-06-21T02:32:57+04:00
tags:
  - concept/networking
---
Some services can behave badly if default VPC does not exist. 

Max Regionally resilient, you can have 1 Default VPC and many Custom VPCs.
By default Private and isolated. Can be connected with on premise. Custom VPCs are private within itself unless configured.
Default VPCs Subnets are configured to provide public IP addresses. Default VPC comes with IGW (Static NAT  + Region Resilient), Security groups and NACL. 172.31.0.0/16. They can be deleted (residuals too) and recreated.
**Provides default (pick it by default) vs dedicated tenancy – be careful!**

# Custom VPC

1 Private Primary CIDR block
Max VPC and Subnet Size is Min /16 –  Max VPC Size /28

Optional secondary IPv4

Consider AWS allocated IPv6 CIDR option.

# DNS

Provided by [[AWS Route 53]]
DNS available at Base VPC IP +2 e.g. (10.0.0.2)
enableDnsHostnames – if set true, instances with public IP get DNS hostnames
enableDnsSupport – enable/disable DNS in the VPC.

# VPC Subnets

Related: [[VPC]]

AZ Resilient VPC subnetworks

Subnet can never be changed and only in 1 AZ. But AZ can have many different subs.
Subnet IP cannot overlap.
Can additionally be allocated with CIDR IPv6
Subnets can communicate between other subnets.

- There are 5 IP Addresses in VPC Subnet you can't use, example (10.16.16.0/24):
	- Network address – 10.16.16.0
	- Network +1 –10.16.16.1 VPC Router
	- Network +2 – 10.16.16.2 Reserved (DNS*)
	- Network +3 – 10.16.16.3 Reserved Future Use
	- Network broadcast – 10.16.16.255
- Funny, if IP subnet has 16 IPs it's actually has 11 usable Ips

Subnets have DHCP option set, you can create DHCP but not change them. So you may need to re-create.

Public IPv4 may be auto assigned
Public IPv6 may be auto assigned

# VPC Security Groups (Stateful)

Related: [[VPC]], [[VPC NACL (Stateless)]]

Don't allow explicit deny/block traffic (for such combine with NACL)
Attached to ENI, network interface of an instance.

Can use **Logical References**, for example reference other security group as a source.
Also, **Self References** – i.e. source is the groups itself, this will allow communication between instances which have this group attached.
> [!NOTE]
> Even though if you past other SG id it won't show any guess it will work
> ![[Pasted image 20230226034335.png]]
> ![[Pasted image 20230226034350.png]]

![[Pasted image 20230122173044.png]]
![[Pasted image 20230122173047.png]]

# VPC NACL (Stateless)

Related: [[VPC]],[[VPC Security Groups (Stateful)]]

Network Access Control List (Network ACL)
Each subnet has 1 NACL, but 1 NACL can be associated with many subnets

Offer both explicit allow and explicit deny. Inbound/Outbound. Supports only subnets  
Rules get processed in order **lowest ruler number 
* first is an implicit deny (if nothing else, then)**
Default NACLs are configured the way they allow any connection – no effect.
==Custom by default restrict any, not associated with a subnet by default, be careful!==

Can be used with security groups no explicitly DENY BAD IPs/NET
Not secure with wide port range for response rules
![[Pasted image 20230122172954.png]]
Tedious, too much overhead
![[Pasted image 20230122173003.png]]

# VPC Routing

Related: [[VPC]]

Every VPC router is highly available, simply works
In every router network+1
Every subnet has a route table.

## Route Table

> [!NOTE]
> **Destination** - what client wants reach
> **Target** - where to send that client 

Route table is a list of routes, where they can be sent.
If multiple routes match, the higher CIDR prefix gets priority.
At least one local route, default local routes can't be updated.
![[Pasted image 20230122172646.png|600]]

## Internet Gateway

Regionally resilient. Gateway covers all AZs
1 IGW = 1 VPC or 0.
Gateway traffic between private network, AWS Public Network and Internet
AWS Manages handles performance = just works
Add ::/0 Default route in RT to enable Bi-directional connectivity to Public AWS, ([is not enabled by default](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html))
Add ::/0 Futura…:::

**Green means public part of cloud, public subnet in our case**
![[Pasted image 20230122172733.png|500]]

Public IP Address assigned to an instance is not installed on instance

# Bastion host/jumpbox (not recommended)
An instance in a public subnet  
Incoming management connections arrive there
Generally used as management or entry point for inbound connections into private VPC

# VPC NATGW

Related: [[VPC]], [[NAT#Port Address Translation (PAT)]]

AZ resilient, for region resilience deploy NATGW for each AZ. Has it's own translation table. Max 45 Gbits. You pay hourly per NATGW and for data per GB, 4 cents for each. Can't be as bastion host, can't do port forwarding, ONLY [[VPC NACL (Stateless)]]. IPv6 doesn't require it.

> [!NOTE]
> You can only attach one public IP per NATG.

Route table routes 0.0.0.0/0 requests from private subnet to NATGW within subs AZ , then NATGW masquerades requests by changing source IP and sending it to VPC Router and then to Internet Gateway.

RARE CASE: In weird scenarios EC2 instance can serve as [NAT Instance (Deprecated)](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-comparison.html). To enable it, you should switch off Source/Destination Checks

# VPC Peering

Related: [[VPC]]
Requires: [[VPC Routing]] configured table from both VPCs

Connect ONLY two VPCs in encrypted network link (tunnel)

**VPC CIDRs MUST NOT OVERLAP FOR THIS TO WORK**

Regional and Cross-Regional, Account and Cross-Account.
Public hostnames resolves to Private IPs.
Security Group referencing feature peer SGs works, but only same region.

NOT Transitive. i.e. if A peered to B and B peered to C, The A will not see C. If you want A, B and C to see each-other, than you need total of 3 peers.

![[Screenshot 2023-02-26 at 03.23.15.png]]

# Transit Gateway (TGW)

Works on top of DX or VPN

Transit hub which connects VPCs to on-premise. Also, transitive!
Reduces network complexity.
It's a network gateway object, so HA and scaleable.
Creates attachment (the way it connects to other network objects), like [[VPC]], [[AWS Site-to-Site VPN]] and [[AWS Direct Connect (DX)#Gateway]] 

## Comparison w/o and with TGW 
- **w/o (trying to connect complex network into AWS in HA way)**![[Pasted image 20230301010133.png|500]]
- **with**, transitive HA single point, does the mesh, can cross-account![[Screenshot 2023-03-01 at 01.43.57.png]]

# VPC Flow Logs

Related: [[VPC]]

Captures packet metadata, but not the contents of it.

Enabled by attaching monitors into a VPC, listining to ENIs
	On VPC level
	On subnet level
	On ENI level

NOT Real Time.
Export to [[AWS S3 Simple Storage Service]] (view them directly and easy export to 3rd party) or [[CloudWatch Logs]] (view them in AWS UI and connect it to other AWS Services)
Also, integrates with [[Amazon Athena]] querying
![[Pasted image 20230225051418.png]]

![[Pasted image 20230225052159.png]]

# VPC Planning

Related: [[VPC]]

Consider having at least 2 networks in regions your company can possibly operate.

**Animals4life case.**
AWS Regions by number:
- 3 in US
- 1 in Europe
- 1 in Australia.
In our case will equate to 10 networks

With the number of 4 AWS Accounts it's 40 networks

After some time:
![[Pasted image 20230122171605.png]]
