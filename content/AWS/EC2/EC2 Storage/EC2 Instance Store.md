Block storage devices, local (connected to one EC2 Host), not network. Provided with specific instance types, included in price anyway even if you don't use it.

Highest storage performance in AWS. Must be attached at launch – one chance to attach. Can't attach if instance already lauched. Launch time only.

**They lose the storage if they are stopped (Ephemeral) and if Hardware fails. Or move, or change.**

>[!ERROR]
>IF AWS MAKES A MAINTENANCE, INSTANCE IS MOVED TO NEW EC2 HOST, SO YOU LOSE DATA ON INSTANCE STORE, HARDWARE FAILURE WILL DESTROY DATA TOO.

![[Pasted image 20230122005753.png|600]]
Suitable for quick changing content like cache, buffer, temp.
Gigabits per second.

#ec2/storage