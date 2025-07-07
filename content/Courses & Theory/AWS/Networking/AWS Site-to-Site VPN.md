---
created: 2025-06-30T06:32:04+04:00
modified: 2025-06-30T06:35:20+04:00
---
Related: [[How IPSEC VPN work]]
Requires: [[Border Gateway Protocol (BGP)]] for Dynamic VPN

VPC to on-premise VPN solution. Can be Full HA. Is quick to provision ~1h

Considerations:
- AWS Speed cap 1.25Gbps for single connection and same for whole VGW
- Latency Considerations - inconsistent, 'cos public internet
- Hourly cost, GB out cost, data camp (on premise)
- Speed to setup – can be hours for all software **configurations**
- Can be used as a backup for [[AWS Direct Connect (DX)]]
- Can be used with [[AWS Direct Connect (DX)]]

Consists of
	VPC
	Virtual GW - logical gateway object, target to [[VPC Routing]]
	Customer GW -  logical configuration in AWS or a physical devices which logical configuration represents.
	VPN Connection between VGW and CGW

Dynamic VPN is cool, route propagation is useful works for both ST and DYN. ![[Screenshot 2023-02-27 at 01.07.33.png]]
Making fully HA Infrastructure ![[Screenshot 2023-02-27 at 01.04.17.png]]
# Demo
![[Pasted image 20230227022550.png]]
In this on-prem route table the route destined to AWS will be pointed to Router's private ENI (on-prem facing ENI), and traffic then will be released over the router's public ENI
![[Pasted image 20230227020519.png]]
![[Pasted image 20230227022208.png]]
![[Pasted image 20230227022227.png]]