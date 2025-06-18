Related: [[Encryption and Encoding]], [[EBS]]

Provides at rest encryption for volumes and snapshots
Uses [[KMS]] either AWS managed or customer managed.

Encrypted DEK is stored on empty EBS Volume, for EBS encryption the key get's decrypted and loaded on to memory of EC2 Host which will be using it to encrypt data on EC2 Instance's EBS volume.

DEK are per volume, unique.
Snapshots from EBS, EBS from Snapshot use same DEK keys.
No way to remove encryption from volume