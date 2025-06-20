Related: [[EC2 Bootstraping]]

Allows to strings, documents and secrets in resilient and secure way.
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
-   Plaintext/Ciphertext (with [[KMS]])
-   Also has public parameters, for example "Latest AMI ID for the OS"
-   Changes can create events

Must have [[IAM]] permissions to access.
![[Pasted image 20230122032747.png|600]]