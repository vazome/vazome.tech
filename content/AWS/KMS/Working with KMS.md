The `KeyId` parameter is not required when decrypting with symmetric encryption [[KMS]] keys. AWS KMS can get the KMS key that was used to encrypt the data from the metadata in the ciphertext blob. But it's always a best practice to specify the KMS key you are using. This practice ensures that you use the intended KMS key, and prevents you from inadvertently decrypting a ciphertext using a KMS key you do not trust.

# Permissions
Keys policies are like bucked policies, every keys has one. Be careful when updating trust policy
Keys must be explicitly told that they need to trust AWS account that they contained within.

Usually security stack includes IAM policy which allows use of certain key and KMS policy on the key itself trusting the identity (or service)
![[Pasted image 20230121233657.png]]