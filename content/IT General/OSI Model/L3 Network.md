#it_theory/osi

Used to connect distinct L2 networks - Interlink to make Internet possible

Device example: Routers
Encapsulation here means that IP packet is put inside an Ethernet frame
Routers remove frame encapsulation and add new encapsulation with each hop.

Some important parts of an IP packet:
- Source IP (bigger in IPv6)
- Destination IP (bigger in IPv6)
- Protocol - L4 protocol
- Time To Live (TTL) - how many hops a packet can move through, used to stop packets from endless loop (Hop Limit in IPv6)
- Data - Data

# IPv4
First two octets match network and last two octets match hosts
![[Pasted image 20230121151503.png]]
Subnet mask allows a host to understand whether it needs to communicate with to remote host or local, this affects the use of network gateway.
Subnet mask is configured on a host device along with an IP address
![[Pasted image 20230121151530.png]]
## Subnetting
You can create two new subnets from existing one by dividing it.
If you have 10.14.0.0/16 you can split them in 10.14.0.0/17 and 10.14.128.0/17
![[Pasted image 20230121151549.png]]
## IP addresses allocation
Networks are divided into classes, where classes represent network sizes. Less the letter, less the number of IPs in networks.

List below represents all private network ranges per class
-   Class A: 10.0.0.0 to 10.255.255.255
-   Class B: 172.16.0.0 to 172.31.255.255
-   Class C: 192.168.0.0 to 192.168.255.255
Image below represents all network ranges per class:
![[Pasted image 20230121151632.png]]
Summary:
![[Untitled picture 3.png]]

# IPv6