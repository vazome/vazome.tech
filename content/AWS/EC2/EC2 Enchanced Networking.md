Related: [[AWS/EC2/EC2]], [[L3 Network]]

Enhanced networking uses [[Virtualization#Single Root IOV (SR-IOV) (4rd iteration)]]
- This feature is required for cluster placement groups for example.
- Allows more higher I/O & Low Host CPU usage, more bandwith
- Higher packets per second (PPS)
- Consistent low latency.
- Either enabled by default or [allowed to be enabled](https://docs.aws.amazon.com/AWSEC2/latest/WindowsGuide/enhanced-networking.html) on modern instance types
[[EBS]] Optimized
- Dedicated capacity for EBS I/O traffic from other instance traffic, no contention.
- [Supported enabled by default, no charge. On old instances can be turned on, paid](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-optimized.html).