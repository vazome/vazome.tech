---
date created: 2025-06-25T00:31:21+04:00
date modified: 2025-06-25T00:41:07+04:00
tags: concept/networking/global
---
Related: [[L3 Network]]

NAT is a crutch that was designed to overcome IPv4 shortcomings, and consequentially provides some security. Is not needed for IPv6.

Translates Private IP Address into Public

# Static NAT
1 private to 1 public (AWS IGW), used for IP consistency. Has NAT table.
![[Pasted image 20230121154052.png]]
# Dynamic NAT
1 private to 1st available public from the pool. Temporary allocations.
Multiple devices can use same IP if they do it in different time.
![[Pasted image 20230121154112.png]]
# Port Address Translation (PAT)
Many private addresses to 1 public ([[VPC NATGW]]).
Uses rewrites source port to random source port and keeps relations with NAT table, then sends this packet  to destination. Destination responds to source port and source IP, router or NATGW receives IP packet and replaces source port and IP with origin source port from the NAT table.
![[Pasted image 20230121154216.png]]