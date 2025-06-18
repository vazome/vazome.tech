# Secrets Manager vs [[SSM Parameter store]]

 It does share functionality with [[SSM Parameter store]] BUT

- Designed for secrets (.. passwords, API KEYS..)
	- Consider it instead of Param Store if you need more capabilities of secrets management
- Usable via Console, CLI, API or SDK's (integration)
- **Supports automatic rotation... this uses lambda**
	- MAIN DIFFERENCE FROM SSM
- Directly integrates with some AWS products (..RDS)

![[Pasted image 20230305145225.png]]