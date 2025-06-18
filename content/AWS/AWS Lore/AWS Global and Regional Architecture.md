Related:

Regions are separate as isolated fault domains and geopolitically, location control.
Regions have Availability Zone which have separate power, connection and are located in different locations. Can be multiple DCs in one AZ. They are isolated too.
Creation of Virtual Private Cloud between AZs is possible

AWS Edge location can be use to speed up processes where AWS Regions are not available.
![[Pasted image 20230129171659.png]]

# Service Resilience
-   Global Resilient - for these services to fail you need the world to fail.
-   Region Resilient - for these services to fail you need Region to fail.
-   AZ Resilient - for these services to fail you need Availability Zone to fail.