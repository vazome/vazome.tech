---
tags: concept/networking/global
---
Basically helps with [Dynamic routing - Wikipedia](https://en.wikipedia.org/wiki/Dynamic_routing)

Path-vector protocol, it exchanges best path to a destination between peers. The path is called **ASPATH**. 
BGP serves as a network topology map, like how can we reach from A to C?

> [!IMPORTANT]
> BGP helps with route optimization, since routers in one AS can provide best path if needed to other AS. Short path is by default. But ASPATH Prepending can make a route less optimal
> **In the screenshot below, direct path to Alice got artificially made look longer in order to prefer Fiber-optic link**

![[Screenshot 2023-02-26 at 19.05.06.png]]
[AS and ASN](https://en.wikipedia.org/wiki/Autonomous_system_(Internet)) 
 AS, autonomous system – a collection of routing prefixes (or more objectively – routers) in one or more networks
 ASN, **autonomous system number** is how BGP identifies different networks over internet, allocated by IANA 0-65535, though 64512-65534 are private

Operates over [[L4 Transport#TCP]] port 179 - TCP guaranties reliability. 
Is not automatic, peering must be manually configured

**iBGP** – Internal BGP (within AS)
**eBGP** – External BGP (between ASes)

