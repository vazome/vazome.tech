Related: [[AWS/EC2/EC2]], [[EC2 Image Builder]], [[EC2 Instance Export caveats]]

AMI – Amazon Machine Image
Regional and has unique ID, same distribution to be published in multiple regions
==Consider it as a logical container==

Image type with which you launch your instance. Built for specific regions and can be copied to one another.
3 Types:
- Public – AWS provided
- Owner – in-house, you make them and can share to multiple AWS accounts or outside
- Marketplace – which were made by someone else

You capture EC2 instance into an AMI, allows to customize your deployment.

Containing
-   Permissions.
-   Device ID of connected volumes.
-   Block Device Mapping to newly created snapshots of [[EBS]] volumes.

AMI Baking – creating an AMI form a configured instance (golden imaging)
AMI cannot be edited – launch a new instance and update configuration
Can be copied between regions (w/ snapshots), absolutely new AMI unique name
![[Pasted image 20230122032619.png|600]]