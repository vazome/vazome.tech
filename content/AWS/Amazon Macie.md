Basically DLP (Data Leak(Loss) Prevention)

- Data Security and Data Privacy Service
- Discover, Monitor and Protect Data .. stored in [[S3]]
- Automated discovery of data i.e PII, PHI, Finance
	- Managed Data identifiers- Built-in - ML/Patterns
	- Custom Data identifiers - Proprietary - Regex Based
		- Also keywords, maximum match distance,  ignore words
- Integrates - With Security Hub & finding events' to EventBridge Centrally manage.. either via [[AWS Organizations]] or one Macie Account Inviting
![[Pasted image 20230315011424.png]]

![[Pasted image 20230306001448.png]]

# Findings
**Policy** finding is generated after Macie is enabled, reflects on changed S3 settings which reduce security (like when you randomly disable encryption on the bucket)
Sensitive is for specific types of data
![[Pasted image 20230306003732.png]]
