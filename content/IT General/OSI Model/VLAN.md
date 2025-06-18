#it_theory/osi

VLAN helps to divide LAN. So broadcast calls are separate for each lane. 4000 vlans limit.
There are 2 types of VLAN
- 802.1Q - dot1q, adds 32 bit field into Ethernet frame, helps distinct LANs
	- Access physical port has 1 VLAN.
		- Devices communicate with switch as no-VLAN even if a VID is assigned it to the port.
		- When a frame exits Switch then it's assigned with VID.
		- Tagged frame by entering an access port gets stripped from VID.
		- Tagged frame does not lose ID when sent over Trunked port
	- Trunk physical port has all VLANs
	- Devices on different VLANs require L3 Switch
- 802.1AD - qnq/stacking/bridging, uses C-Tag and S-Tag fields. Scale, allows ISPs and carriers to use VLAN across their network, even if customers are using VLAN too.
![[Pasted image 20230121053620.png]]