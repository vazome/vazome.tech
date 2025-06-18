Related: [[S3]]

Bucket now can have access points which will have its own policies and network access control.

Permissions in access point and bucket policy must match. Like bucket allowing access policy, and access policy manages specific permissions.

Created via Console or:
`aws s3control create-access-point --name secretcats --account-id 123456789012 --bucket catpics`

[Creating access points - Amazon Simple Storage Service](https://docs.aws.amazon.com/AmazonS3/latest/dev/creating-access-points.html#access-points-policies)