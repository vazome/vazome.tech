Use `countrycode-region-id-citycode-id` notation: us-west-2-las-1

- "1" zone ..so no built in resilience.
- Think of them like an AZ, but near your location
- They are closer to you ... so lower latency.
- Not all products support them .. many are opt in w/ limitations
- DX to a local zone IS support (extreme performance needs)
- Utilise parent region .. i.e EBS snapshots are TO parent
- Use local zones when you need THE HIGHEST performance

Help to reduce latency because AZs can be 100+km away from on-premise.
Not all services support them. Can connect to them with [[Direct Connect (DX)]] (generally)
Local zones have private networking with the parent region, but subnets located in Local Zones. Not resilient.
	EBS snapshots are stored in regional S3.![[Pasted image 20230320045939.png]]
[AWS Local Zones Features - Amazon Web Services](https://aws.amazon.com/about-aws/global-infrastructure/localzones/features)




