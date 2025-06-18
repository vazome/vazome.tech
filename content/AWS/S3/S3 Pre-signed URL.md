Related: [[S3]]

Provide access to an object in a bucket from public in a limited time.
Pre-signed URL require an IAM user. You can do it with role, but it will expire too fast, not good.
You can create pre-signed urls for objects you don't have access to :)
When you use pre-signed url, it has same permissions as identity generated it

At least:
``` bash
aws s3 presign s3://animals-dv-12323-83/all5.jpg --expires-in 180
```
An automated example:
![[Pasted image 20230122230527.png|500]]