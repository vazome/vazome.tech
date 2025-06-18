Related: [[Scaling]]

# Monolith
Uses single "black box" for all upload, processing and storage.
Least cost effective, because resource capacity if provisioned but may not be used fully.
![[Pasted image 20230205164329.png|400]]
- If fails - together
- If scales - together
- If billed - together

# Tiered
Each tier can be vertically scaled independently, gives more flexibility and gradually over workload management.
But it can be upgraded so each tier does not communicate directly, but with an internal [[Elastic Load Balancer (ELB)]], which gives abstraction and horizontal scaling. 

Still has downsides, e.g. each tier is coupled - relies on one another, they cannot exists independently. If tier below fails, everything fails.

# Hybrid

# Serverless
- As less servers as possible
- Applications are just collections of small specialised functions
- Stateless and ephimeral - each time env is new and clean
- Event driven - works only when there is a need to
- [Function as a service - Wikipedia](https://en.wikipedia.org/wiki/Function_as_a_service) – used when possible for compute
- Don't reinvent the wheel, if you need other than compute, consider managed services, like [[S3]] for storage.
(Generally API gateway is used between client and lambda, but not mentioned on the image)
![[Pasted image 20230209015416.png|500]]  

# Queues
Message instead of being pushed to Processing is queued for Processing. Message contains infomarion about the data to process, like path, name, size, requirements. Usually queues are FIFO (First In First Out).
[[EC2 Auto Scaling Groups (ASG)]] is configured to scale based on the **queue length**. Instances take messages in front of the queue. Once message is retrieved, instances take data from [[S3]] based on the in-message info.
![[Pasted image 20230206015646.png|400]]

# Microservices
Collection of micro services doing individual things.
A single microservice is a small application with it's own logic and I/O
![[Pasted image 20230206020051.png|400]]

# Event Driven
Event **producers** which can be microservices communication with customers or EC2 or else. Generates and produces events in reaction to something, success, failure etc.
Event **consumers** will react to an event, like if upload failed, then force retry the upload.

>[!NOTE]
>They do not constantly taking up system resources, but awaiting for data to be given, to start taking up resources
>
>Key component of [[Architectures]]

Related: [[EventBridge]]
If every component required a queue it will be a really complex application.
So event router is made, certain exchange point for event.
- has **event bus** - constant flow of information, which router delivers to **event consumers**

