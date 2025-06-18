Related: [[S3]]

A bucket can be used as static website hosting (by enabling the feature)

When you delete a specific version of file (by toggling "Show Versions") you deleting it permanently, but when you toggle off "Show Versions" you place a delete marker

Can be:
	User-Based
		[[IAM]] Policies (JSON)
	Resource-Based
	S3 Bucket Policies (JSON too)
		1 policy object per backet
		Actively uses Principal Element
		Can allow/deny access to other account
		Allow/Deny anonymous principals
	ACL (Bucket/Object)
		LEGACY

Block Public Access
	Works over permissions, you must explicitly disable settings to allow settings.![[Pasted image 20230122224748.png|500]]
We can user policy generator to help us create needed policy