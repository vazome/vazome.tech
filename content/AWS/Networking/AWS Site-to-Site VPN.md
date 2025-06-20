Related: [[How IPSEC VPN work]]
Requires: [[Border Gateway Protocol (BGP)]] for Dynamic VPN

VPC to on-premise VPN solution. Can be Full HA. Is quick to provision ~1h

Considerations:
AWS Speed cap 1.25Gbps for single connection and same for whole VGW
Latency Considerations - inconsistent, 'cos public internet
Hourly cost, GB out cost, data camp (on premise)
Speed to setup – can be hours for all software **configurations**
Can be used as a backup for [[Direct Connect (DX)]]
Can be used with [[Direct Connect (DX)]]

Consists of
	VPC
	Virtual GW - logical gateway object, target to [[VPC Routing]]
	Customer GW -  logical configuration in AWS or a physical devices which logical configuration represents.
	VPN Connection between VGW and CGW

Dynamic VPN is cool, route propagation is useful works for both ST and DYN. ![[Screenshot 2023-02-27 at 01.07.33.png]]
Making fully HA Infrastructure ![[Screenshot 2023-02-27 at 01.04.17.png]]