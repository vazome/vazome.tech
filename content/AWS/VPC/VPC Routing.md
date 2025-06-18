Related: [[VPC]]

Every VPC router is highly available, simply works
In every router network+1
Every subnet has a route table.

# Route Table

> [!NOTE]
> **Destination** - what client wants reach
> **Target** - where to send that client 

Route table is a list of routes, where they can be sent.
If multiple routes match, the higher CIDR prefix gets priority.
At least one local route, default local routes can't be updated.
![[Pasted image 20230122172646.png|600]]
# Internet Gateway

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
