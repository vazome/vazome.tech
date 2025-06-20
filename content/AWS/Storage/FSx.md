# for Windows File Server

The Windows' [[EFS]], 

- Fully managed native Windows File Servers/shares, supports windows permissions
- Native windows file system.
	- For example support shadow copies (VSS) and DFS and ..
- Integrates with [[Directory Service]] and self managed AD.
- Resilient and [[Resilience and Reliability#High availability (HA)]], backed replicates data to enable that.
- Can work in Single and Multi-AZ modes.
- On-demand and Scheduled backups
- Accessible using VPC, Peering, VPN ([[AWS Site-to-Site VPN]]) and [[Direct Connect (DX)]]
![[Screenshot 2023-03-05 at 12.07.24.png]]

# for Lustre
[Lustre (file system) - Wikipedia](https://en.wikipedia.org/wiki/Lustre_(file_system))

- Managed Lustre - Designed for HPC - LINUX Clients, **supports (POSIX) permissions**
- Machine Learning, Big Data, Financial Modelling
- 100's GB/s throughput & sub millisecond latency
- Deployment types - Persistent or Scratch
- Scratch - Highly optimised for Short term no replication & fast, no HA.
- Persistent - longer term, HA (in one AZ), self-healing, if whole AZ fail, bye bye data
- Can be used with [[AWS Site-to-Site VPN]] or [[Direct Connect (DX)]]

Data is stored on FS only when precessed (Lazy Loaded from [[S3 Simple Storage Service]]), when not used it is stored on S3. Processed data can be backed up to S3 with [hsm_archive](https://docs.aws.amazon.com/fsx/latest/LustreGuide/exporting-files-hsm.html) and automatically on schedule [Working with backups - FSx for Lustre](https://docs.aws.amazon.com/fsx/latest/LustreGuide/using-backups-fsx.html)
![[Pasted image 20230305123348.png]]
![[Pasted image 20230305123911.png]]
![[Pasted image 20230305124108.png]]

- [Amazon FSx for Lustre performance - FSx for Lustre](https://docs.aws.amazon.com/fsx/latest/LustreGuide/performance.html#fsx-aggregate-perf)
- [Persistent storage for high-performance workloads using Amazon FSx for Lustre | AWS Storage Blog](https://aws.amazon.com/blogs/storage/persistent-storage-for-high-performance-workloads-using-amazon-fsx-for-lustre)