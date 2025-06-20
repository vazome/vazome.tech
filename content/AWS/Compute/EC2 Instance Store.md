---
date created: 2025-06-21T01:02:28+04:00
date modified: 2025-06-21T01:19:22+04:00
tags:
  - compute
  - aws/ec2
  - storage
---
Block storage devices, local (connected to one EC2 Host), not network. Provided with specific instance types, included in price anyway even if you don't use it.

Highest storage performance in AWS. Must be attached at launch – one chance to attach. Can't attach if instance already lauched. Launch time only.

**They lose the storage if they are stopped (Ephemeral) and if Hardware fails. Or move, or change.**

>[!ERROR]
>IF AWS MAKES A MAINTENANCE, INSTANCE IS MOVED TO NEW EC2 HOST, SO YOU LOSE DATA ON INSTANCE STORE, HARDWARE FAILURE WILL DESTROY DATA TOO.

![[Pasted image 20230122005753.png|600]]
Suitable for quick changing content like cache, buffer, temp.
Gigabits per second.

# EC2 Storage Terminology
Direct Storage – attached to the EC2 Host
Network attached ([[EBS]]) Storage – volumes are delivered over network
Ephemeral Storage – temporary storage (like Instance Store)
Persistent Storage – permanent storage, lives past the lifetime of EC2 instance

Block storage – there is not structure, just blocks. Can be physical/logical.
File storage – as a file share, has structure, mountable, not bootable.
Object storage – collection of objects, flat, neither mountable nor bootable.

IO Size X IOPS = Throughput (but also, Drive, NIC, CPU affects speed.)

IO Size = block size
IOPS = Number of IO operations per second
Throughput = overall performance
![[Pasted image 20230122001757.png]]