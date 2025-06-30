---
created: 2025-06-30T06:32:04+04:00
modified: 2025-06-30T06:35:20+04:00
---
Related: [[L4 Transport]], [[S3 Performance Optimization#S3 Accelerated transfer]]

Improves global network performance:

Starts with **two ANYcast IP addresses**, since anycast multiple edge locations can have them. Route customers to AWS Global Network, AWS managed fiber channels and their responsibility.

Directs customer to the application via AWS backbone using TCP and UDP Transport capabilities. Cannot: cache, file access or be used with [[L7 Application]] like HTTP/S
![[Screenshot 2023-02-24 at 06.18.27.png]]
Is not [[AWS CloudFront]], but helps to optimise content delivery, but in other, more network related mean.

Moves customers to AWS Global Network as quick as possible