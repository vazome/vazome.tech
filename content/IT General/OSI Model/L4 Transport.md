#it_theory/osi

Fixes L3 intermittent IP packet delivery:
- Because L3 work per packet, you cannot guarantee that packets will arrive in order or not be lost.
- L3 does not distinguish IP packet designation, L3 does not know for which App or Channel a packet is designated.
- L3 does not flow control, sender can be quicker than destination, which can result in oversaturation.

# TCP
Uses segments, which are encapsulated with in IP packet.
Used for reliability depended protocols and applications

Segments does not have SRC and DST IPs, IP packets provide addressing.
TCP Segment Header contains:
- SRC Port and DST Port
- Sequence Number - incremented with each sequence is sent, helps uniquely identify sent segment
- Acknowledgement - allows to indicate whether segment was received
- "Flags and things" - Flags are used to sync sequence numbers, close connection, data offset, etc.
- Window - number of bites you willing to receive between acknowledgements, help to control the rate at which you send data.
- Checksum - error detection
- Urgent pointer - gives priority to the TCP headers in which have such pointer set.
![[Pasted image 20230121153344.png]]
Often server uses well known port and host uses ephemeral (high) port,
IP Packet lost? TCP Header allows us to retransmit failed packet because client haven't sent response IP packet with TCP Header ACK.
![[Pasted image 20230121153436.png]]
Connection (tunnel) is getting established with 3-way handshake. SYN, SYN-ACK, ACK
![[Pasted image 20230121153456.png]]
- Stateless firewall – if you allow request it does not allow response, you must explicitly specify a rule for response, like for SYN-ACK (AWS Network ACL), does not see sessions
- Stateful firewall – if you allow request it allows response, so SYN-ACK would arrive (AWS Security Groups), sees sessions

# UDP
Uses datagrams, which are encapsulated with in IP packet.

Used for not so reliability dependent applications.

Segments does not have SRC and DST IPs, IP packets provide addressing.
UDP Datagram Header contains:

-   SRC Port and DST Port
-   Length of UDP Header and Data
-   Checksum - optional in IPv4

That's it