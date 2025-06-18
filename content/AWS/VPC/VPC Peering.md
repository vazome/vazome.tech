Related: [[VPC]]
Requires: [[VPC Routing]] configured table from both VPCs

Connect ONLY two VPCs in encrypted network link (tunnel)

**VPC CIDRs MUST NOT OVERLAP FOR THIS TO WORK**

Regional and Cross-Regional, Account and Cross-Account.
Public hostnames resolves to Private IPs.
Security Group referencing feature peer SGs works, but only same region.

NOT Transitive. i.e. if A peered to B and B peered to C, The A will not see C. If you want A, B and C to see each-other, than you need total of 3 peers.


![[Screenshot 2023-02-26 at 03.23.15.png]]