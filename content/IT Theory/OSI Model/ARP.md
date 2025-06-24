---
tags: concept/networking
---
Protocol which allows host to know IP address  for the given MAC address via L2 Broadcast message.
Sends broadcast by using all FFs MAC address, end host received the message and gives answer that it's that MAC with specified IP.
# ARP Request
Target MAC is zeroed since we don't know it yet
Destination MAC as we know 'FF'ed
![[Pasted image 20230121152940.png]]
The Payload:
![[Pasted image 20230121152952.png]]

# ARP Response
As host2 receives the Frame, it responds to host1.
The response Frame is encapsulated by same logic, but now it includes host2 MAC address
in Sender MAC Address field with corresponding IP Address.
![[Pasted image 20230121153027.png]]
The Payload:
![[Pasted image 20230121153039.png]]
After information is exchanged, ARP table is filled.