---
created: 2025-06-30T06:32:04+04:00
modified: 2025-06-30T06:35:20+04:00
---
Related: [[]]
Also uses [Virtual network interface - Wikipedia](https://en.wikipedia.org/wiki/Virtual_network_interface)

- Is a **physical** fiber-optic cable connection between Internal network and AWS.
- DX Locations usually 3rd party Data Centers and are not ubiquitous. 
- Supports 1, 10 or 100 Gbps. (Or lower for hosted)
- Business Location -> DX Location > AWS Region.
- At under technical scope you allocate a port at DX Location.
- Billing: Port hourly cost & outbound data (inbound if free of charge).

AWS will take same time to provision port, but most time consuming is cable laying.
No resilience by default: cable is cut = connection is cut.
Redundancy can achieve resilience by connecting to other DX.
Offers low and consistent latency and can achieve highest speeds in hybrid.
DX can be used access AWS Private and Public services, but not internet, on default.

# Architecture in depth
VIFs:
-  **Private virtual interface**: A private virtual interface should be used to access an Amazon VPC using private IP addresses.    
-  **Public virtual interface**: A public virtual interface can access all AWS public services using public IP addresses.
-  **Transit virtual interface**: A transit virtual interface should be used to access one or more Amazon VPC Transit Gateways associated with Direct Connect gateways.

AWS Region is connected via redundant high speed to DX Locations. This means AWS Regions to DX Location connection is HA.
![[Pasted image 20230301001349.png]]
DX Locations consist off:
- AWS DX Router(s) located at AWS Direct Connect "Cage"
	- Where Port allocation is done.
- Customer or Partner "DX Router" at ditto "Cage"
	- You either have you own router or use Partner services.
Link between AWS DX Router and Customer/Partner DX Router is called **Cross-connect**

If your infrastructure is not in DX Location, you will need to pay for cabling.

# Gateway

## Single Points of Failure
1. The cheapest one, lots of SPOFs ![[Pasted image 20230301003255.png]]
2. Resilience – OK, but still .. SPOFs, imagine cross-connect use same physical route or DX Locations fails.![[Pasted image 20230301003705.png]]
3. Resilience - Better, distribute Direct Connect between at least two cross-connects and on-premises. Main SPOFs are routers singly presented in each DX Location![[Pasted image 20230301004010.png]]
4. Resilience - Great, there are sill SPOFs, but they bleak![[Pasted image 20230301004509.png]]

