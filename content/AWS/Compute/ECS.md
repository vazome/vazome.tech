---
tags:
  - compute/containers
created: 2025-06-30T06:32:04+04:00
modified: 2025-06-30T06:35:20+04:00
---


Managed container based service.
Why USE ECS?
-   If you use containers, **ECS**.
-   Large workload - price conscious, **EC2 Mode**.
-   Large workload - overhead conscious, **Fargate**.
-   Small / Burst workloads - **Fargate**
-   Batch / Periodic workloads - **Fargate**

Has two modes EC2 and Fargate.
They provide clusterization. 
[[ECR]] is like DockerHub.

**Container definition** points where the image is stored and what port it uses.
**Task definition** store all other information (task role, containers, resources…). May include many containers.
**Task role**, gives containers in ECS to access AWS products/services.
**Service definition** provide configuration for scalability and HA, how many copies.

# ECS Modes

## General info

ECS Management components
	Scheduling and orchestration
	Cluster manager
	Placement engine
You use registries for container images

## EC2 Mode
You and you pay for EC2 instances.
You manage container host (EC2 Instance), the capacity and availability.
Can use different [[EC2 Purchase Options]]

## Fargate
You don't manage EC2 instances
Instances run on a shared platform.
	Tasks/Services are injected into you VPC
Capacity and availability is managed by AWS.
Pay per containers.

# ECR
Relates to [[Containers Theory#Container registry]]

AWS Elastic container registry.
Each account can have it's registry, public or private.

It's integrated with [[AWS IAM]]
Image scanning, basic/enhanced (inspector)
Near real-time metrics > CloudWatch
Event ≥ Event bridge
Replication-cross-region, cross account
![[Pasted image 20230122040236.png|500]]
