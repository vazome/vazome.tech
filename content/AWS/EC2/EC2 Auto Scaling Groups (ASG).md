Related: [[EC2]], [[Elastic Load Balancer (ELB)]]

Free. Linked to a VPC. Helps to deploy more instances (scale out) when there is a high load and decrease the number (scale in) when there is a minimal load. Can automatically add new instances to an [[Elastic Load Balancer (ELB)]]. 

Think about using more, but smaller instances - **granularity**.
ASG defines **WHEN** and **WHER**, LT defines **WHAT**

Optimizes the cost. Has Minimum, Desired and Maximum size i.e.(1:2:4)
	Desired capacity must be always more than Minimum and less than Maximum.
[Set capacity limits on your Auto Scaling group - Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-capacity-limits.html)

ASG can use [[Elastic Load Balancer (ELB)]] instead of [[EC2 Instance Status Checks and Auto recovery]] - Load Balancer checks with EC2 in stances and they don't pass – report -> scale. With ALB you can utilize HTTP/S health check and be aware of the application status. 

> [!WARNING]
> Make sure you Load Balancer health checks are configured thoroughly to report actual application status and don't erroneously report successful state.
> 
> Or when application loads info from DB, but DB becomes unavailable and health checks report failed state, but for EC2 and starting reprovisioning EC2 instances.. 

# Launch Template and Launch Configuration

> [!NOTE]
> Launch Templates supersedes Launch Configuration

Allow you to define EC2 configuration in advance.
	AMI, Instance Type, Storage & Key pair
Networking and Security groups
Userdata and IAM Role
Both are not editable, but LT has versions
LT provides newer features as: including T2/T3 Unlimited, [[EC2 Placement groups]], [[EC2 Purchase Options#Reservations#Capacity Reserved]], Elastic Graphics

Launch Configurations > Autoscaling Groups
Launch Templates > Autoscaling Groups|EC2 Instances

# Health Checks
- EC2 (Default), ELB (Can be enabled) & Custom
- ﻿﻿EC2 - Stopping, Stopped, Terminated, Shutting Down or Impaired (not 2/2 status) = UNHEALTHY
- ﻿﻿ELB - HEALTHY = Running & passing ELB health check
- ﻿﻿... can be more application aware (Layer 7)
- ﻿﻿Custom - Instances marked healthy & unhealthy by an external system.
- ﻿﻿Health check grace period (Default 300s) - Delay before starting checks
- ﻿﻿... allows system launch, bootstrapping and application start

# Scaling
![[Pasted image 20230201003748.png]]
Scaling Policies options automate capacity settings. 
- Manual Scaling - manual capacity adjust
- Scheduled Scaling - time based, schedule a scale up on Friday 17:00 because ppl are active
- Dynamic Scaling
	- By CloudWatch alarm (e.g. CPU use over 40%) and
	- Simple - CPU Above/Below 50% and +/-1, you adding/removing same amount no matter how much it all increases or decreases.![[Pasted image 20230201014009.png|450]]
	- Stepped - Bigger +/- based on difference. helps do scaling/descaling by steps. Usually better than Simple.![[Pasted image 20230201014255.png|450]]
	- Target Tracking - Desired aggregate, i.e. keep CPU at 40% (some network, CPU, ALB metics!)
	- Based on [[SQS]] - ApproximateNumberofMessagesVisible (more messages in queue, more instances, less - less instances)
- Predictive Scaling
	- Uses Machine Learning to predict usage. Forecasts the usage.
**Scaling Policies have ==Cooldown period== - control how long to wait after scale before being able to start next (important.)**

Uses EC2 status checks and replace failed instance, self healing. Same if we manually terminate an instance.
> [!NOTE]
> Create a launch template which can deploy an Instance, create an ASG, set it to use multiple subnets and AZs, then set capacity as 1:1:1, then you have simple instance recover, i.e. [[HA vs FT vs DR#High availability (HA)]] instance

## Scaling Processes
Scaling processes have states:
1. Launch and Terminate - SUSPEND (stop) and RESUME (continue)
2. AddToLoadBalance - add provisioned instances to an [[Elastic Load Balancer (ELB)]]
3. AlarmNotification - ability of ASG to react on cloud watch alarm or not
4. AZRebalance - rebalance instances evenly across AZs
5. HealthCheck - controls whether instances in the ASG have HC on/off
6. ReplaceUnhealth - replaces unhealthy instances
7. ScheduledActions - do scheduled actions or not
8. Standby - suspends any activity of ASG on an instance by 'inService' vs 'Standby' states (good for maintenance)

# Lifecycle hooks
Allows us to run custom actions when ASG action is happening.
When an ASG action happens (Launch/Terminate transitions) instances get paused in the flow, they wait. Until timeout, then CONTINUE or ABONDON ASG action or you explicitly resume ASG process with CompleteLifecycleAction (when you done what you wanted)

Can be integrated with [[EventBridge]] or [[SNS]].
![[Pasted image 20230201015249.png]]