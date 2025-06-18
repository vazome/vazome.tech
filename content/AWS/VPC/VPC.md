Some services can behave badly if default VPC does not exists. Max

Regionally resilient, you can have 1 Default VPC and many Custom VPCs.
By default Private and isolated. Can be connected with on premise. Custom VPCs are private within itself unless configured.
Default VPCs Subnets are configured to provide public IP addresses. Default VPC comes with IGW (Static NAT  + Region Resilient), Security groups and NACL. 172.31.0.0/16. They can be deleted (residuals too) and recreated.
**Provides default (pick it by default) vs dedicated tenancy – be careful!**

# Custom VPC

1 Private Primary CIDR block
Max VPC and Subnet Size is Min /16 –  Max VPC Size /28

Optional secondary IPv4

Consider AWS allocated IPv6 CIDR option.

# [[DNS]]

Provided by [[Route 53]]
DNS available at Base VPC IP +2 e.g. (10.0.0.2)
enableDnsHostnames – if set true, instances with public IP get DNS hostnames
enableDnsSupport – enable/disable DNS in the VPC.
