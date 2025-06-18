Distributed Denial of Service attacks, used to overload the servers.
Can be on layer L7 or L4. Usually involve botnets.

DDOS exploits the ease of request and the difficulty of response generation.
Often It's impossible to distinguish which requests are legit and which are a part of DDOS.

# Application attack
Botnet hosts requesting a hard-to-process webpage. Because there are so many of these requests server can't continue the computation stably and gets prone to failure. Clients cannot use applications because server is busy with computation.![[Pasted image 20230121225245.png]]

# Protocol Based Attack
Botnet hosts generate (3-way handshake) SYN requests with spoofed (not legit) IP and the server responds them back by sending SYN-ACK, botnet does not answer. So the buffer becomes full and other hosts can't connect to the server.
![[Pasted image 20230121225308.png]]

# Volumetric/Amplification Attack
Small number of hosts maybe a botnet generate DNS requests to DNS servers, by using a spoofed IP address, (target infrastructure IPs are used), so DNS servers respond to target infrastructure and it becomes overwhelmed by the number of data it receives suddenly. People cannot access our application because infrastructure's channels are filed with responses.

This type of attack requires less resource per amount of responses (damage)
![[Pasted image 20230121225330.png]]