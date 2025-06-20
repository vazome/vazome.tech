---
date created: 2025-06-21T01:02:28+04:00
date modified: 2025-06-21T01:58:53+04:00
---
Is a regional and public service
Creation, management and store of keys
Symmetric and asymmetric
Cryptographic encrypt/decrypt

Keys never leave the product **FIPS 140-2 Level 2** and regional
Can be multiregional though.

**There are separate permissions for KMS operations, like encrypt, decrypt, createkey…**

KMS key – ID policy desc state. Backed by physical key data. Can be used for up to 4kb data.

Data Encryption Key DEK – Is created with use of KMS and for data more than 4KB. Provides you with plain text version and ciphertext version DEK. **DEK is not stored in KMS Service**. Therefore only you or service which is using KMS Service can encrypt or decrypt data. Same with usage tracking. The process follows: DEK issued, data is encrypted by you with plain text  version of DEK, then plaintext DEK is erased, but ciphertext version of DEK is present. So you store encrypted key with encrypted data.

Keys can be AWS Owned(usually on work background) or Customer owned managed
Keys can be managed by AWS or Customer (more configurable, e.g. create key policy to allow cross account access) – both keys support rotation approx once per year, customer key rotation is optional
KMS keys can have backing key – physical key material and all previous backing keys caused by rotation meaning you can still decrypt data which was encrypted with old keys before rotation.
Alias per region per key