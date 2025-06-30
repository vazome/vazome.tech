---
created: 2025-06-30T06:32:04+04:00
modified: 2025-06-30T06:35:20+04:00
---
Related: [[DDOS]]

Protects against all three DDOS attack types.
Standard if free and Advanced has a cost. Works passively.
-  Standard can work with only R53 and CloudFront
Advanced can be integrated with:
	other dns
	[[Web Application Firewall (WAF)]]
	Real time events
	Heath based detection [[Route 53 Health checks]] (is a requirement to SRT)
	Protection groups.



> [!Danger]
> Commitment for 1 year. 
> Price for advanced is 3000$ per ORG.
> 	Also charge per data out

- Protects CF, R53, Global Accelerator, Anything Associated with EIPs (i.e EC2), ALBs, CLBs, NLBs
- Not automatic - must be explicitly enabled in Shield Advanced or AWS Firewall Manager Shield Advanced policy
- Cost protection (i.e EC2 scaling) for unmitigated attacks
	- Return you money if they failed to protect you and this cased you to lose money (terms)
- Proactive Engagement & AWS Shield Response Team (SRT) 
	- Should be enabled and contacts provided to AWS. You get contacted by AWS when a spike has been found. Also they can be contacted to make support tickets.