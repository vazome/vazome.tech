---
tags: [monitoring]
date created: 2025-06-20T16:15:50+04:00
date modified: 2025-06-20T16:16:43+04:00
---
### EC2 AMI


Related: [[public/AWS/EC2/EC2]], [[EC2 Image Builder]], [[EC2 Instance Export caveats]]

AMI – Amazon Machine Image
Regional and has unique ID, same distribution to be published in multiple regions
==Consider it as a logical container==

Image type with which you launch your instance. Built for specific regions and can be copied to one another.
3 Types:
- Public – AWS provided
- Owner – in-house, you make them and can share to multiple AWS accounts or outside
- Marketplace – which were made by someone else

You capture EC2 instance into an AMI, allows to customize your deployment.

Containing
-   Permissions.
-   Device ID of connected volumes.
-   Block Device Mapping to newly created snapshots of [[EBS]] volumes.

AMI Baking – creating an AMI form a configured instance (golden imaging)
AMI cannot be edited – launch a new instance and update configuration
Can be copied between regions (w/ snapshots), absolutely new AMI unique name
![[Pasted image 20230122032619.png|600]]

### EC2 Auto Scaling Groups (ASG)


Related: [[public/AWS/EC2/EC2]], [[Elastic Load Balancer (ELB)]]

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

### EC2 Bootstraping


Related: [[public/AWS/EC2/EC2]], [[EC2 Metadata]]

Allows EC2 Build Automation
Can be done with User Data (accessible with meta-data ip)
	http://169.254.169.254/latest/user-data/
**Execution by instance OS, one-time**
EC2 does not validate provided User Data. For EC2 it's block data.

==Providing credentials to User-Data is a bad practice==

There is software on EC2 instance with checks for User Data.
Not secure, don't use passwords.
Limited for 16 KB.
Can be modified when instance stopped.
[[EC2 Image Builder|AMI baking (for installation of software)]] + Boostapping (for scripting) = optimal to reduce launch time.
![[Pasted image 20230121235956.png|500]]
Info store in cloud-init.log and cloud-init.output.log

### EC2 Dedicated host


Related: [[public/AWS/EC2/EC2]]

Dedicated Host – you are dedicated with whole physical server (host)
-   Most useful for software with socket/core licensing.
-   Pay only for the host: On-demand – Reserved Options available.
-   Specific size and family, with Nitro architecture – different sizes
-   You cant use Windows, RHEL, SUSE Linux - AMIs
-   Amazon RDS Instances are not supported
-   Placement groups are not supported
- Hosts can be shared within ORG (AWS RAM)
Dedicated Instances – when you don't need to share host's hardware, but also, don't control it. Extra charges. ![[Pasted image 20230121235241.png|600]] ![[Pasted image 20230121235248.png|600]]

### EC2 Enchanced Networking


Related: [[public/AWS/EC2/EC2]], [[L3 Network]]

Enhanced networking uses [[Virtualization#Single Root IOV (SR-IOV) (4rd iteration)]]
- This feature is required for cluster placement groups for example.
- Allows more higher I/O & Low Host CPU usage, more bandwith
- Higher packets per second (PPS)
- Consistent low latency.
- Either enabled by default or [allowed to be enabled](https://docs.aws.amazon.com/AWSEC2/latest/WindowsGuide/enhanced-networking.html) on modern instance types
[[EBS]] Optimized
- Dedicated capacity for EBS I/O traffic from other instance traffic, no contention.
- [Supported enabled by default, no charge. On old instances can be turned on, paid](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-optimized.html).

### EC2 ENI with DNS


Instances can have many secondary interfaces

Use case: If some software is allocated per macaddress, then you can relocate that license by moving ENI to other EC2 Instance

Use case 2: two interfaces per each type of traffic, instance connected to two subnets.
Use case 3: Different security groups for each ENI, if needed, it's available

**OS does not see Public IP4**

**Within VPC, Public DNS corresponding to the Public IP resolves to Private IP in public, so in case if you have 2 instances with public IP, they won't talk to each other over internet, but within VPC.**

### EC2 Image Builder


Related: [[public/AWS/EC2/EC2]], [[EC2 AMI]]

Automates VM and AMI creation
Can be scheduled
Pipeline is a configuration of this automation
Recipe is an explanation of how the image will be customised

### EC2 Instance Export caveats


Related: [[public/AWS/EC2/EC2]], [[EC2 AMI]], [[Virtualization]]

# Prerequisite

This article assumes you have: latest AWS CLI, [Necessary Permissions](https://docs.aws.amazon.com/vm-import/latest/userguide/required-permissions.html#iam-permissions-image), needed disk space for vmdk/ova download.

# Can't launch more than one export tasks

At the time this article was written, you could only export 1 AMI Image and 1 EC2 Instance at a time.

# ClientError: BLSC-style GRUB found, but unable to detect default kernel

AWS was unable to detect default kernel. Make sure `/boot/grub2/grubenv` has defined `saved_entry=` record, if not, you may try executing.

``` shell
sudo grubby --set-default=/boot/vmlinuz-$(uname -r)
```

Try starting `create-instance-export-task`/`export-image` again.

# Is there a way to quicken cancelation of an export task?

After canceling an export task there is a possibility to delete newly created, residual AMI or EC2 snapshot.


### EC2 Instance Profile


Related: [[public/AWS/EC2/EC2]]

[[IAM Role]] assumed by an instance
Instance Profile allows permissions to get inside instance.
IAM Role and Instance Profile are separate entities but in UI they represented as one  
You **attach** Instance profile not IAM Role.

Role gets assumed by metadata temporary credentials provision to an instance.
Credentials automatically renewed.
Roles preferable for long term access.  
CLI Tools inside that instance will use role credentials automatically

-   curl [http://169.254.169.254/latest/meta-data/iam/security-credentials/](http://169.254.169.254/latest/meta-data/iam/security-credentials/)
-   curl [http://169.254.169.254/latest/meta-data/iam/security-credentials/{RoleName}](http://169.254.169.254/latest/meta-data/iam/security-credentials/%7bRoleName%7d)

Credential check precedence
[https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html#cli-configure-quickstart-precedence](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html#cli-configure-quickstart-precedence)

### EC2 Instance Status Checks and Auto recovery


Related: [[public/AWS/EC2/EC2]]

# Status checks

1. System Status checks
	1. Loss of power
	2. Loss of network
	3. EC2 HOST issues
2. Instance Status reachability
	1. Corrupted FS
	2. Incorrect Instance Networking
	3. OS Kernel Issues
	4. Instance issues

# Auto recovery (System Status)
Status check alarm can initiate auto-recovery. Helps in HA. Uses SNS
If you start auto recovery, EC2 Instance is moved to other host.
Networking, metadata, Elastic IP, data configuration is saved. Does not work for instance store volumes
[https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-recover.html](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-recover.html)

#monitoring 

### EC2 Instance Types


Related: [[public/AWS/EC2/EC2]], [[EC2 Purchase Options]]

The difference affects
-   Raw: CPU, Memory, Local Storage, Capacity & Type
-   Resource ratios
-   Storage and Data Network Bandwith
-   System Architecture / Vendor
-   Additional features…

Instance code: R5dn.x8large.
|     |                                         |
| --- | --------------------------------------- |
| R   | Instance Family                         |
| 5   | Instance Generation (Always use latest) |
| dn  | Additional capabilities                 |
| 8xlarge    |  Instance Size                                       |

Main categories:
![[Pasted image 20230122001421.png|600]]
Types (may be old):
![[Pasted image 20230122001500.png|600]]
-   [https://aws.amazon.com/ec2/instance-types/](https://aws.amazon.com/ec2/instance-types/)
-   [https://ec2instances.info/](https://ec2instances.info/)

### EC2 Metadata


Related: [[public/AWS/EC2/EC2]], [[EC2 Bootstraping]]

Metadata is a service with EC2 provides for instances.
Any instance can access this service with (curl)
[http://169.254.169.254/latest/meta-data/](http://169.254.169.254/latest/meta-data/)

Contains env information:
- Networking
- Authentication
- User-Data

And you can use ec2-metadata tool

``` bash
wget [http://s3.amazonaws.com/ec2metadata/ec2-metadata](http://s3.amazonaws.com/ec2metadata/ec2-metadata)  
chmod u+x ec2-metadata
```

![[Pasted image 20230121234033.png|600]]


### EC2 Placement groups


Related: [[public/AWS/EC2/EC2]], [[Scaling]]

-   Cluster – instances use one hardware
	-   Best practice to use same type of instances and to deploy all needed instances from the start for capacity evaluation.
	-   Same rack, sometimes same host.
	-   Fastest inter-instance networking, you probably require network instance types. Up to 10 Gbps per single stream.
	-   One AZ only, VPC peers can be spanned.
	-   Best for fast speeds/low latency, where no resilience is acceptable![[Pasted image 20230121235650.png]]
-   Spread – instances use different hardware
	-   Cross-AZ, instances are spread access AZ, so AZ-failure resilient
	-   Max 7 Instances per AZ
	-   Infrastructure isolation, each instance within spread placement group runs from a different rack, each rack has it's own power and network supply
	-   Small number of critical instances, with AZ level resilience and needs to be separated from each other. Like fileshares.
	-   You don't manage in which racks to place instances.![[Pasted image 20230121235736.png]]
-   Partitioned – groups of instances on different hardware
	-   Designed for more than 7 instances per AZ.
	-   Uses multiple partitions up to 7 instances each within AZ
	-   Each partition has it's own rack, so partitions separated.
	-   You select into which partition launch an instance.
	-   Best for huge scale parallel processing. Can be used with topology aware applications such as HDFS, HBase and Cassandra (intelligent data replication)![[Pasted image 20230121235802.png]]

### EC2 Purchase Options


Related: [[public/AWS/EC2/EC2]], [[EC2 Instance Types]]

# On-demand
Capacity allocated, the instances isolated, but multiple customer share same hardware, no specific pros and cons, for is needed for short term or unpredictable planning instances.
Per-second pricing, but you only pay for storage if it stopped

# Spot
Using free capacity when other EC2 instances are not working with decent discount up to 90%. It works the way that you set your price cap, if AWS instance price becomes greater than your cap, you lose the instance. Something which can tolerate interruption and need burst.

Must not be used for workloads which can't tolerate interruptions.

# Reservations

You agree to "use" instance for 1/3 years with reserved capacity/discount, reservation are per AZ or Region
Region – does not reserve the capacity, focuses on the discount
AZ – does reserve the capacity, less focus on discount
No-upfront (less discount)/Partial (Middle)/All-upfront(more discount)

## Scheduled Reserved
Commitment for specific time in day, 1 year period. Good for scheduled jobs etc.

## Capacity Reserved
Can be regional reservation – billing discount for an AZ. 1 - 3 year
Can be zonal reservation – get capacity in certain AZ. 1 - 3 year
On demand capacity – reserve for any duration of time, pay as on-demand type

# [[EC2 Dedicated host]]

You are dedicated with whole physical server (host), most useful for software with socket/core licensing
Pay for host itself.
Dedicated instances – when you don't need to share host's hardware, but also, don't control it. Extra charges.

# Savings Plan (better if no capacity needed)

Commit how much dollars you pay in 1/3 years and receive discount.
You specify specific amount dollar per hour you committed to spend, beyond on-demand you get commitment

### EC2


**Instances** are run on **EC2 Hosts**

EC2 Hosts can be shared (share hardware with other people) and dedicated (you have dedicated hardware)
Can have multiple network interfaces.
**Instance is an AZ resilient.**

Instance is relocated to different host in same AZ if it was stopped/started (not reboot) or AWS having maintenance on hardware.

Good for traditional for OS+App compute.
Long-running compute.
For Server style compute
Burst/steady-state load.
Monolithic app stack.
Migrated applications and workload, DR.
