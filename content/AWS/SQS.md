Related: [[Architectures#Queues]]

Simple Queue Service - regionally highly available and public message queue service
Comes with Standard (chances for out of order) and FIFO (ordered queues 1-2-3..)

256KB Max message size, if more just link it to an S3 Object.

**Client polls** (checks for messages), messages are hidden from the queue (**Visibility timeout**)
**Visibility timeout** can make message to reappear if message was not deleted by the client when the job is done – help in [[HA vs FT vs DR#Fault Tolerance (FT)]] implementation. [Amazon SQS visibility timeout - Amazon Simple Queue Service](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html)

[[#Dead-Letter Queues]] can be used from problem messages
[[EC2 Auto Scaling Groups (ASG)]] can scale and [[Lambda]] can invoke based on the queue length

# Standard vs FIFO
Standard guarantee at least once delivery doesn't guarantee order
FIFO guarantee order and exactly-once delivery

**FIFO** - 3000msg per seconds with batching and up to 300 without. Need `.fifo` suffix to be valid FIFO.
	Good example is sending commands, you want them to be in order.
	Or some sequential processing.
**Standard** - scale near unlimited
	Good for decoupling, worker pools or batch for future processing.

Billed based on request
1 request - 1-10 messages
Each 64 KB chunk of a payload is billed as 1 request (for example, an API action with a 256 KB payload is billed as 4 requests).
**Short polling** - 1 request and 0 or more msg, you billed even if 0 messages returned
**Long polling** - you specify waitTimeSeconds (up to 20s) if msg available when request is made they will be received. Will wait up to 20s until msg will arrive to the queue fewer requests. up to 10 msg (64KB each) max total payload 256 
[Fetching Title#phmw](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-short-and-long-polling.html)

Supports [[Encryption and Encoding#At Rest]] and [[Encryption and Encoding#At Transit]] 
Queue policy (like resource policy)
![[Screenshot 2023-02-13 at 00.49.02.png]]

# Delay Queues

**Specific queue where messages are made invisible once they appear in the queue.** 

For a queue to be Delay Queue the DelaySeconds operator must be greater than 0. Maximum is 15 minutes.
Same can be done with a per-message invisibility which will override queue settings for that specific message (does not work for FIFO Queues.)

Used if general Delay in processing is needed. 
[Amazon SQS delay queues - Amazon Simple Queue Service](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-delay-queues.html)
[Amazon SQS message timers - Amazon Simple Queue Service](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-message-timers.html)

# Dead-Letter Queues
Allows separate processing for failed messages. 

With each VisibilityTimeout (aka fail), ReceiveCount is increased by one.

`redrive policy` specifies the source queue, the dead-letter queue and conditions where a messages will be moved from one to another. Define maxReceiveCount.
>[!WARNING]
>Every message in SQS has a retention period and the enqueue timestamp, moving a message between queues DOES NOT refresh the timestamp! 
>Generally retention period of Dead-Letter queues must be longer than general queues [Amazon SQS FAQs | Message Queuing Service | AWS](https://aws.amazon.com/sqs/faqs/)
>
>You can use the MessageRetentionPeriod attribute to set the message retention period from 60 seconds (1 minute) to 1,209,600 seconds (14 days)

# Examples
Simple example
![[Screenshot 2023-02-13 at 00.26.26.png|400]]
Complicated example with use of [[SNS]] Topics to SQS Queues (Fanout) 
![[Pasted image 20230213002747.png]]

