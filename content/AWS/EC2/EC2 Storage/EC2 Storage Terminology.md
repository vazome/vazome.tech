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

#ec2/storage