Function as a Service (FaaS) - short running and focused. A key part in [[Architectures]]: generally used with [[S3 Simple Storage Service]], [[API Gateway]]. Good at file processing: [[S3 Simple Storage Service]], [[S3 Logging#Events]]. Database triggers: [[DynamoDB]], [[DynamoDB#Streams]]. Serverless CRON: [[EventBridge]]/[[CloudWatch (Metrics)#Events]]. Realtime Stream Data Processing ([[AWS Kinesis]] + Lambda)

- Lambda function - is a piece of code which gets executed by Lambda service
- Function uses a runtime - usually like python 3.8, then runtime env is create for such runtime
- **Can run up to 900s or 15min, i.e. single function timeout, can't use a lambda function for more than 15 min.** 
	- Can be prolonged with step functions.
- Environment has a direct memory, but **indirect CPU (you don't choose CPU) allocation**
	- 128MB to 10240MB definable memory in 1MB steps. 
	- 1769MB is 1vCPU to allocate.
- Disk space 512MB at default, available as `/tmp` scales up to 10240MB, stateless too.
- Billed for duration of a function's run
- Runtimes: [[Python]], Ruby, Java, GO, C#
- Custom runtimes are possible with use of layers(?)
- Can be used with [[Containers Theory]], but you don't confuse lambda images with docker images.
- Base level is stateless, each launch new (clean) env.

Lambda Function at it's most basics is a deployment package **50MB zipped 250 MB** unzipped - package gets executed in the runtime environment. 

# Execution 
## Synchronous invocation
Executes from API/CLI data is passed to lambda and client awaiting response. Then data or failure is returned. Also client > [[API Gateway]] > Lambda is possible. Errors and Retries are up to client.
![[Pasted image 20230207005001.png|400]]
## Asynchronous invocation
Usually when invoked by AWS on your behalf. Lambda now retries to reprocess failed queue.
Separate destinations can be configured based on end status. e.g. DLQ for failed and SNS, SQS, Lambda .. for success.
Requires lambda to implement [Idempotence - Wikipedia](https://en.wikipedia.org/wiki/Idempotence).
![[Pasted image 20230207004942.png|400]]
## Event source mapping
Used on streams or queues which don't generate events, like [[AWS Kinesis]].
Data stream is broken on to source batches which get's sent to Lambda but as an Event Batch.
But remember 15 minute timeout for any lambda function.
![[Pasted image 20230207005027.png|400]]
## Versioning
Each version is immutable, has it's own ID and you can't change it.
A version is the code + the configuration of the lambda function
`$Latest` - points to the latest version
`Aliases` - point to a specific version (can be changed)
# Startup times, execution envs
Greatly affects user overall experience. Keep in mind.
**Cold Start** (~100ms) - When function starts it loads data and env
**Worm Start** (~1-2ms) - if the same function is executed, same context is already preloaded. But context may get deleted if long time period between starts.
`/tmp` space can be pre filled with your data, but be careful, functions must be designed to cope with new and clean env.
	Like creating DB connections or other reuse features outside of lambda function handler 
**Provisioned concurrency** – provision of environment in advance.
>[!WARNING]
>Assume by default that everything is clean and stateless

![[Pasted image 20230207012529.png]]

# Networking 
## Public
Needs to have public IP and security allow to access VPC services.
![[Pasted image 20230207001158.png|500]]
## Private VPC
Injected to VPC with an ENI, One ENI per collection of lambdas with shared security group. First launch 90 sec, then no delay.
>[!WARNING]
> Treat private as any other VPC object.

![[Screenshot 2023-02-07 at 00.20.07.png|500]]

# Security 
[[IAM]] is enabled as execution roles.
Also, has resource policies, like in [[S3 Resource Policies and Features]] which control who can use lambda and which external account are allowed. Can't be changed with console UI (for now)

# Logging
CloudWatch, CloudWatch Logs, X-Ray

Lambda execution logs -> [[CloudWatch Logs]]
Metrics (success/failures, retries, lantency) > [[CloudWatch (Metrics)]]
Distributed tracing -> X-Ray

Lambda needs Execution Role to log in [[CloudWatch Logs]]
