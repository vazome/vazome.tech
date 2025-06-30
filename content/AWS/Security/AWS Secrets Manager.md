---
created: 2025-06-30T06:32:04+04:00
modified: 2025-06-30T06:35:20+04:00
---
# Secrets Manager vs [[AWS SSM Parameter store]]

 It does share functionality with [[AWS SSM Parameter store]] BUT

- Designed for secrets (.. passwords, API KEYS..)
	- Consider it instead of Param Store if you need more capabilities of secrets management
- Usable via Console, CLI, API or SDK's (integration)
- **Supports automatic rotation... this uses lambda**
	- MAIN DIFFERENCE FROM SSM
- Directly integrates with some AWS products (..RDS)

![[Pasted image 20230305145225.png]]