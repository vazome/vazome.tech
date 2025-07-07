---
created: 2025-06-30T06:32:04+04:00
modified: 2025-06-30T06:35:20+04:00
---
Allows to strings, documents and secrets in resilient and secure way.
Used in [[EC2#EC2 Bootstraping]]
-   Supports:
	-   Stings
	-   StringLists
	-   SecureString
-   Can be used for
	-   License codes
	-   DB strings
	-   full configs
	-   Passwords, etc..
-   Has hierarchies (directories) and versioning.
-   Plaintext/Ciphertext (with [[AWS KMS]])
-   Also has public parameters, for example "Latest AMI ID for the OS"
-   Changes can create events

Must have [[AWS IAM]] permissions to access.
![[Pasted image 20230122032747.png|600]]