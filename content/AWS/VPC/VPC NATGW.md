Related: [[VPC]], [[NAT#Port Address Translation (PAT)]]

AZ resilient, for region resilience deploy NATGW for each AZ. Has it's own translation table. Max 45 Gbits. You pay hourly per NATGW and for data per GB, 4 cents for each. Can't be as bastion host, can't do port forwarding, ONLY [[VPC NACL (Stateless)]]. IPv6 doesn't require it.

> [!NOTE]
> You can only attach one public IP per NATG.

Route table routes 0.0.0.0/0 requests from private subnet to NATGW within subs AZ , then NATGW masquerades requests by changing source IP and sending it to VPC Router and then to Internet Gateway.

RARE CASE: In weird scenarios EC2 instance can serve as [NAT Instance (Deprecated)](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-comparison.html). To enable it, you should switch off Source/Destination Checks
