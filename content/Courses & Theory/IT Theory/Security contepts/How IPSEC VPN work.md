IPSEC is a group of protocols

Sets up secure tunnels over insecure networks
Provides [[content/Courses & Theory/IT Theory/Security contepts/Security#Authentication]] and [[Encryption and Encoding#At Rest]]
SA - Security Associations. An SA is a relationship between two or more entities that describes how the entities will use security services to communicate securely.

Has two phases

IKE Phase 1 (Slow and Heavy)
	Authenticate - Pre-shared key (Password) / Certificate
	Uses Asymmetric encryption to agree on, and create a shared Symmetric key
		[Diffie–Hellman key exchange - Wikipedia](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange)
	IKE SA Created (phase 1 tunnel)![[Screenshot 2023-02-26 at 23.54.10.png]]
IKE Phase 2 (Fast and Agile)
	Uses the keys agreed in phase 1
	Agree on encryption method and key for data trans
	Create IPSEC SA ... phase 2 tunnel (runs over phase 1)![[Screenshot 2023-02-26 at 23.56.17.png]]
# VPN Types

Policy-based
	rule set match traffic and traffic sent over a pair of SA
	different rules/sec settings
Route-based
	based on route target (prefix) match 
	matches a single pair of SAs![[Screenshot 2023-02-27 at 00.08.13.png]]