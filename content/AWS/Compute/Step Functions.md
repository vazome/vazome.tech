Related: [[Lambda]]

Fixes some Lambas problems.

Uses State Machines, like a workflow, START > STATES > END
States are THINGS which occur
Max duration of execution is 1 year
Standard workflows and Express Workflow
Started via [[API Gateway]], [[IOT]], [[EventBridge]], [[Lambda]]
Uses Amazon States Language
[[IAM Role]] for permissions

# States

- Succeed & fail - final states
- Wait - wait for time or wait until duration or certain point in time
- Choice - behaviour based on the input
- Parallel - create parallel branches (do multiple things at the same time)
- Map - accept list of thing, does things for each in this list.
- TASK - single unit of work performed by stated machine, allow state machine to do things.
	- Integrated with: lots of difference AWS Services, like [[SQS]], [[SNS]], [[Batch]], [[Lambda]], [[DynamoDB]], [[ECS]], [[Step Functions]]