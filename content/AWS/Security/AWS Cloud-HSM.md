---
date created: 2025-06-21T01:02:28+04:00
date modified: 2025-06-21T01:58:51+04:00
---
Related: [[AWS KMS]]
FIPS-140-2 Level 3 compliant, better compliance than [[AWS KMS]].

- AWS does not have access to physical module where keys are stored and the physical unit is not Shared as in KMS. Tamper resistant.
- Industry Standard **APIs** - PKCS#11, Java Cryptography Extensions (JCE), Microsoft CryptoNG (CNG) libraries
	- Is not integrated with AWS much. NO [[S3 Encryption#SSE-S3]]
- KMS can use CloudHSM as a custom key store, CloudHSM integration with KMS.

HSM is not HA, to achieve HA deploy them in many AZs and configure them in a cluster

# Use-cases
![[Pasted image 20230305235802.png]]