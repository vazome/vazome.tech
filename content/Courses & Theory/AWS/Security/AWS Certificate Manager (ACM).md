---
created: 2025-06-30T06:32:04+04:00
modified: 2025-06-30T06:35:20+04:00
---
Related: [[node_modules/fastq/SECURITY]], [[TLS and SSL]]
Regional.

Allows you to create Certification Authority and generate/import certificates.
**If generated, automatically renewed**

Works with only supported services:  [[AWS Elastic Load Balancer (ELB)#ALB]] and [[AWS CloudFront]], but **not** EC2

> [!DANGER]
> To use cert on ALB like in ap-southeast-2 you need certificate issued in the same region!
> 
> Exception CloudFront – it always operates with it on us-east-1

![[Pasted image 20230220022921.png]]


