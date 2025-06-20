Related: [[content/AWS/RDS/RDS]]

# [[Encryption and Encoding]]
Encryption in transit: accomplished with SSL/TLS connection between client and RDS instance, can be mandatory.

Encryption at rest: RDS supports EBS [[KMS]] encryption[^1], with either AWS managed keys or Customer managed keys. Data key (DEK) is used for encryption operations.
==Encryption cannot be removed!==

Elements which being encrypted:
- Storage
- Logs
- Snaphots
- replicas

MSSQL and Oracle support TDE[^2], in addition latter supports TDE with [[Cloud-HSM]] meaning no key exposure to AWS.
![[Pasted image 20230121022656.png|600]]

# [[IAM]] (Authentication only)
For IAM access an RDS local DB would require a local user configured to use AWS Authentication Token. Next, IAM Instance Profile with necessary permissions and users is attached to a RDS instance, hence mapping user to a RDS local DB user.

**`generate-db-auth-token`** operation is used to generate 15 minute validity token which is used in place of password a DB user's password.
![[Screenshot 2023-01-21 at 02.52.28.png|700]]

[^1]:done by the RDS HOST itself
[^2]:transparent data encryption – data is encrypted and decrypted by the DB engine itself.