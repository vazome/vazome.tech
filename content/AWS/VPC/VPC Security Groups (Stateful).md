Related: [[VPC]], [[VPC NACL (Stateless)]]

Don't allow explicit deny/block traffic (for such combine with NACL)
Attached to ENI, network interface of an instance.

Can use **Logical References**, for example reference other security group as a source.
Also, **Self References** – i.e. source is the groups itself, this will allow communication between instances which have this group attached.
> [!NOTE]
> Even though if you past other SG id it won't show any guess it will work
> ![[Pasted image 20230226034335.png]]
> ![[Pasted image 20230226034350.png]]

![[Pasted image 20230122173044.png]]
![[Pasted image 20230122173047.png]]

