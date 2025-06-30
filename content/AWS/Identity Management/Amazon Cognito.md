---
created: 2025-06-30T06:32:04+04:00
modified: 2025-06-30T06:35:20+04:00
---
Provides both [[content/IT Theory/Security contepts/Security|Security]] and user management for web and mobile apps. An alternative to [Firebase - Wikipedia](https://en.wikipedia.org/wiki/Firebase), but difficult to work with.
**Terrible naming.**

- `USER POOLS` - Sign-in and get [JSON Web Token - (JWT)](https://en.wikipedia.org/wiki/JSON_Web_Token), but ***most AWS services can't use JWT***.
	- Made exactly for Authentication, Sign up and Sign in, Built-in customisable user UI, MFA, checks for compromised credentials and account takeover protection.
	- Also, allows social sign-in and [[SAML#IdP]]
	- Customised workflows and user migration with [[Lambda#Triggers]]
	- Token types is always the same.
	- ![[Pasted image 20230215014834.png|400]]
- `IDENTITY POOLS` - Exchanges external identity for a set of temporary AWS Credentials for AWS Resources access. They assume [[AWS IAM Role]]
	- Unauthenticated users – Guests Users.
	- Federated Identity - swap identity from Google, Facebook, Twitter, SAML 2.0 & User Pool for short term AWS Credentials..
		- Each external token type needs its configuration.
	- ![[Screenshot 2023-02-15 at 01.51.49.png|400]]

> [!NOTE]
> When one type of token is replaced with the other, i.e. linking attributes across different providers under one entity is called [Federated identity - Wikipedia](https://en.wikipedia.org/wiki/Federated_identity)

Can operate together, combined.

![[Pasted image 20230215015507.png]]