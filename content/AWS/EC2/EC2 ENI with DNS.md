Instances can have many secondary interfaces

Use case: If some software is allocated per macaddress, then you can relocate that license by moving ENI to other EC2 Instance

Use case 2: two interfaces per each type of traffic, instance connected to two subnets.
Use case 3: Different security groups for each ENI, if needed, it's available

**OS does not see Public IP4**

**Within VPC, Public DNS corresponding to the Public IP resolves to Private IP in public, so in case if you have 2 instances with public IP, they won't talk to each other over internet, but within VPC.**