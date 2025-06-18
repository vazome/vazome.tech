# Auditing
Is a logging service answering the question "who did"?
Logs calls and API in AWS. Stores 90 days are stored by default.

# Trails
- Management events (logged by Default) – stores control information, control plane operations" management info.
- Data event – stores information about resource operation on a resource
- Insight – ?

Trail creates a regional trail which can operate within one region or within multiple regions as unified logical trail, scales on new created regions.
Trail logs in region where event was created or in us-east-1 if it's global services (IAM, STS and CloudFront).
Not Real-Time, may take few minutes for log to arrive.

You can store CloudTrail trail logs in S3 bucket for indefinite period in JSON files.
You can also store CloudTrail trail logs in CloudWatch, to have ability to search through these logs or metric filter.
NEW: Organization trail, logs all events of all accounts in the organization.
![[Pasted image 20230122233119.png|500]]

#monitoring