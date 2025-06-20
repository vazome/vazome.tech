- Managed file transfer service - Supports transferring TO or FROM [[AWS S3 Simple Storage Service]] and [[AWS EFS]]
- Provides managed "servers" which support protocols
	- File Transfer Protocol (FTP) - Unencrypted file transfer
	- File Transfer Protocol Secure (FTPS) - File transfer with TLS encryption
	- Secure Shell (SSH) File Transfer Protocol (SFTP) - File transfer over SSH
	- [Applicability Statement 2 (AS2)](https://en.wikipedia.org/wiki/AS2) - Structured B2B Data
		- AS2 for industries requiring compliance and standard b2b comms, like warehouses, CRMs
- identities - Service Managed, [[Directory Service]], Custom ([[Lambda]]/ [[AWS API Gateway]])
- Managed File Transfer Workflows (MFTW) - [[IT Software Architectures#Serverless]] file workflow engine
- Multi-AZ

Billing for provisioned server per hour + data transferred 

![[Pasted image 20230305143436.png]]
- Public does not require much, but only works with SFTP and can't use: [[VPC Security Groups (Stateful)]] and [[VPC NACL (Stateless)]]
- VPC - Internet, works with SFTP, FTSP and AS2, uses [[AWS Direct Connect (DX)]] or [[AWS Site-to-Site VPN]]
- VPC – Internal, works with SFTP, FTP, FTSP and AS2,