Relates to [[Containers Theory#Container registry]]

AWS Managed [[Kubernetes (K8S)]] – open source and cloud agnostic

Control plane can scale, runs on multiple AZs.
Integrates with AWS Services [[ECR]], ELB, [[AWS IAM]], VPC
EKS Cluster = EKS Control Plane+ EKS Node
etcd managed in AWS, distributed cross AZ
Nodes - Self Manged, Managed Nodes groups or Fargate
	**You must check which node type suits your needs more**
Storage – can be [[AWS EBS]], EFS, FSx Lusture/for NetAPP ONTAP

EKS connects to worker nodes in managed node group, either via ENI injection or EKS Public control plane endpoint
![[Pasted image 20230122044002.png]]