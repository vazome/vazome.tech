Related: [[S3]], [[Encryption and Encoding]]

# Default bucket encryption
Buckets are not encrypted, but objects are.

When you upload an object, it's PutObject operation, which can have a specified header string: `x-amz-server-side-encryption` – AES256, aws:kms
But you can set default encryption, which will be applied if you don't specify header.

> [!Done]
> [amazon web services - Remove encryption from all s3 objects using CLI - Stack Overflow](https://stackoverflow.com/a/57944588)


(at Transit)
When data is moved to/from S3, by default.

(at Rest)
Client-side encryption – you generate the key, you provide encrypted data in already encrypted tunnel. AWS does not know contents of your data.
Server-side encryption – AWS generates the key and encrypts data in the Cloud
![[Pasted image 20230122225442.png|500]]

Role separation in data encryption (Example):
	Financiers need access to the keys and data and access to decrypt ciphertext data.
	Administrators even though logically may have access to the keys and encrypted data, must not have access to such resources because this is not within theirs responsibilities.

Server-side has 3 types:

# SSE-C
Server-side encryption with customer-provided keys
- Customer manages keys and data.
- S3 Endpoint manages encryption (offload your CPU resources)
	- Object is encrypted with your key, key hash is made, key is discarded,
	- Object is decrypted with your key, verifies key by comparing hashes, then decrypts data, discards keys and provides plaintext data.
- S3 Storage stores encrypted data and key hash
- Nuances: you manage keys, which can be applicable for regulated environments

# SSE-S3
Server-side encryption with Amazon S3 managed keys
- Customer manages data
- S3 Endpoint generates Root key (invisible for Customer)
	- S3 generates unique key per one object and encrypts that object, then Root key encrypts that key and discards plaintext version of it.
	- AES256 by default
- S3 Storage stores encrypted data and encrypted unique keys for each object.
- Nuances: you do not manage keys in anyway, ergo role separation is not available.

# SSE-KMS
Server-side encryption with KMS keys stored in AWS Key Management Service 
- Customer manages data
- KMS generates Root key
	- S3 generates unique DEK key per one object and encrypts that object, then Root key encrypts that key and discards plaintext version of it.
	- AES256 by default
- S3 Storage stores encrypted data and encrypted DEK unique keys for each object.
- Nuances: you manage KMS key and have logging + fine grained control policies, ergo role separation is available.