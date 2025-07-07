---
tags: concept/networking
date created: 2025-06-21T01:02:28+04:00
date modified: 2025-06-21T02:11:30+04:00
---
Router has Route Tables with a list of Routes
A routes represents a network to which the router is connected (can route to Next Hop/Target).
Before sending Ethernet Frame, our host is calculating based on IP Mask whether end host is in the same network, because if not, Ethernet frame with IP Packet is sent to the Router.
![[Pasted image 20230121153127.png]]
As data routes to the destination host, the IP packet remains unchanged, but Frame is encapsulated with each hop.
Router can route only to the networks in its route table, if IPs network is missing from route table than, the packet is dropped. Last resort is 0.0.0.0/0 which matches all the network.
![[Pasted image 20230121153214.png]]