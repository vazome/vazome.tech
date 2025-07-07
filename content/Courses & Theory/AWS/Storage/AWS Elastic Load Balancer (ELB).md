---
created: 2025-06-30T06:32:04+04:00
modified: 2025-06-30T06:35:20+04:00
---
Amazon Elastic Load Balancer (ELB) - AWS.
Abstracts user from internal infrastructure.
Takes all incoming requests and redirects them to different servers based on load.

- v1 - Classic Load Balancer, introduced in 2009,
	- Lacking features, 1 SSL certificate per CLB
- v2 - faster, cheaper, supports targeting groups and rules
	- Application Load Balancer (ALB) - [[L7 Application]] HTTP/S/WebSocket
	- Network Load Balancer (NLB) - [[L4 Transport#TCP]], TLS & UDP
	- Gateway Load Balancer (GWLB)..
==Void **v1** and use **v2**==
![[Pasted image 20230129180346.png]]

# Architecture
ELB appears as a single entity but actually underlines multiple nodes in subnets..AZs you have chosen. Each ELB has an (A) [[DNS]] record which resolve to 1+ nodes per AZ.

It's important to choose whether to use **Internet** facing or **Internal** facing balancer, this affects given addresses.
- Internet facing – public + private IP addresses
	- But [[public/AWS/EC2/EC2]] instances that are used, do not have to be public
- Internal facing – private only IP addresses
	- Usually used to separate application tiers.

ELB Nodes are configured with **listeners** which accept traffic on port + protocol and communicate with target on a port + protocol.

8+ free IP addresses are required per subnet i.e a /27 or larger subnet for scale 
![[Pasted image 20230129174202.png]]
LBs allow each tier to scale independently
![[Pasted image 20230129174758.png|400]]

## Cross-Zone LB
In usual architecture connections are split equally between nodes. 
But nodes in AZ-A may have 4 instances, but nodes in AZ-B only 1 instance.
Cross-Zone LB eliminates this obstacle and allows nodes to distribute connections  between instances in other AZs.

This feature is enabled by standard in ALB but I should be aware of it, in some cases uneven distribution of load my come from this feature not being enabled.
![[Screenshot 2023-01-29 at 17.57.44.png]]

# ALB vs ELB

| Feature                       | E[[AWS Elastic Load Balancer (ELB)#NLB]]------ | -------- |
| Unbroken encryption [[AWS Elastic Load Balancer (ELB)#NLB]] (ELB)#NLB]]      |
| Static IP for white [[AWS Elastic Load Balancer (ELB)#NLB]] (ELB)#NLB]]      |
| The fastest performa[[AWS Elastic Load Balancer (ELB)#NLB]] (ELB)#NLB]]      |
| Not HTTP and HTTPS  [[AWS Elastic Load Balancer (ELB)#NLB]] (ELB)#NLB]]      |
| [[AWS PrivateLink and VPC Endpoint]]     [[AWS Elastic Load Balancer (ELB)#ALB]] (ELB)#NLB]]      |
| Otherwise                     | [[Elastic Load Balancer (ELB)#ALB]]      |


## ALB
- No other L7 protocols other than HTTP/S/WebSocket.
- No TCP/UDP/TLS listeners
- Can understand L7 components: cookies, custom headers, user location, app behavior
- Incoming connections is terminated on ALB no unbroken SSL.
	- New connection is made from LB to the application.
	- No end-to-end unbroken SSL encryption
	- Can't pass-through connections from ALB to Instances.
- ALL ALBs with HTTPS require SSL certificate.
- ALBs are slower than NLB
- Application health checks are made at L7, aside from checking network connectivity it can make application requests.

Rules:
- Direct connections which arrive at a listener
- Have priority order
- Default rule = catch-all
- **Rule Conditions**: host-header, http-header, http-request-method, path-pattern, query-string & source-ip
- **Actions**: forward, redirect, fixed response, authenticate oidc & authenticate-cognito
![[Pasted image 20230129182525.png|500]]

## NLB
- [[L4 Transport#TCP]], [[L4 Transport#UDP]], [[TLS and SSL]], TCP_UDP
- No headers, cookies, L7...
- Really fast (millions of RPS, 25% of ALB Latency)
- Ideal for **non HTTP/HTTPS**, like (SMTP, SSH, Game Servers, financial apps)
- Health check only check ICMP and basic TCP handshaking
- **Can have static IP (good for whitelisting)**
- Forward TCP to instances, unbroken encryption
- Used with [[AWS PrivateLink and VPC Endpoint]] to provide services to other VPCs

## GWLB

Enables running and scaling third party security appliances at scale. Like firewalls, intrusion detection and prevention systems. Inbound and outbound traffic, transparent analysis tools. Can work along with ALB..

GWLB endpoints - traffic enters and leaves via them (can be added to [[VPC Routing#Route Table]])
GWLB balances - across multiple backend appliances.
Use GENEVE tunneling protocol between GWLB and backend instances. Takes traffic from source, encapsulates it and sends it to security appliance, security appliance returns the application and decapsulates it to the App destination server (SRC and DST are maintained). (But when the answer is sent, after scanning, the source IP of the internal instance will be replaced with DNS of the GWLBE)

Has flow Stickiness, so data stream is locked under single appliance

![[Pasted image 20230205161643.png]]
 ![[Pasted image 20230205164623.png]]
