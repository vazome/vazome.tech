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

