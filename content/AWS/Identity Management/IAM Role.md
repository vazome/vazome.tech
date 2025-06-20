Related: [[IAM]], [[EC2 Instance Profile]]

IAM Roles does not represent themselves, they represent permissions. 
User assumes role to become an identity in a short term. An assumed IAM Role generates temporary credentials. 

For large scale authentication (1,000,000 like unique request) you should consider using IAM Role instead of [IAM users - AWS Identity and Access Management](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html)

# Service Linked Role and IAM PassRole 
Allows service to do thing on your behalf. Linked to specific service which can create and delete it.
You cannot delete it until it no longer requires the service.
![[Pasted image 20230121033227.png|600]]
Role Separation:
IAM:PassRole - Bob can assign a role, but not use it
IAM:AssumeRole - Bob can user role, but not assign it (if role doesn't explicitly grant such right)
