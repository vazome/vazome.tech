---
created: 2025-06-30T06:32:04+04:00
modified: 2025-06-30T06:35:20+04:00
---
Related: [[AWS Elastic Load Balancer (ELB)]]

# Options
![[Screenshot 2023-02-01 at 02.28.16.png]]
## Bridging mode
Default for [[AWS Elastic Load Balancer (ELB)#ALB]].
1 or more client makes 1 or more connection to the LB.
LB Listener uses HTTPS, connections terminated on LB itself.
Therefore LB a certificate for the domain name which application uses.
EC2 instances too will require SSL certificate which application is using, so ALB can re-encrypt data and send it ti the instance.
In theory AWS has access to that certificate.

Remember HTTPS is just HTTP with a secure wrapper. Load Balancer uses certificate to strip the encryption and access HTTP. But requires certificate to be stored in LB and EC2...

## Pass-through 
Default for [[AWS Elastic Load Balancer (ELB)#NLB]].
Client connects but connection is passed-through on backend instances.
EC2 requires certificate, but LB doesn't need it. No encryption/decryption is done on  LB. AWS is not exposed with certificate.
Can be used with [[AWS Cloud-HSM]].

## Offload
> [!NOTE]
> HTTPS to the load balancer, HTTP to the instance

Clients connect same way via HTTPS, but load balancer connects to the backend using HTTP. For customer data is encrypted (public zone), for internal hosts it is decrypted (private zone)

# Connection Stickiness
As a concept it's an ability of a Load Balancer to maintain client's session by directing traffic to specific backend which is has client's session in multi backend host environment.
There are applications made with state-less approach for example, using [[AWS DynamoDB]] to store sessions. ==Better to have state-less approach== But there are many cases when this is not applicable.

ELB as an option called Session Stickiness it generates AWSALB Cookie with yours defined duration (1s to 7d) which locks to a specific backend endpoint, for a duration.
Until:
1. Server failure, user will be moved
2. Cookie expire, user to be moved
