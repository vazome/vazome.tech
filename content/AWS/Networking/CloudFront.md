Related: [[]]

No self signed certs
Is a content delivery network, helps distributing data by doing local regional caches

- Origin - source of content [[S3 Simple Storage Service]] or Custom Origin
	- Can have origin groups (resilience)
	- viewer protocol matches edge-origin protocol on **S3**
	- origin access identity and control - s3
	- custom ports - custom origin
	- custom header match - co
	- can be S3, custom origin
- Distribution -  the configuration of CloudFront
- Edge locations -  Local cache of your data, less than regions, 
- Regional Edge Cache - Larger version of edge location, slower than edge but still help distributing content quicker.
- Cache [[#Behaviours]] – path pattern for distributions (affects TTL, protocol and privacy):
	- The default behaviour is ✳️
	- Many settings, like, restrict viewer access (use signed URLs or cookies to access data.)
	- ![[Pasted image 20230219042221.png|400]]
Each distribution has its own domain name in format dd21232✳️cloudfront.net, but can be given an alternate custom name.


# Architecture
**Cache hit** - Edge location cache is close and accessed 
**Cache miss** - Regional Edge searches Origin then data sent Regional Edge then to the closest Edge, then it's accessed. Regional Edge now holds cache in longer term.
		PREVENT MISS IF POSSIBLE, TO LOWER THE LOAD
> [!WARNING]
> viewer -> edge -> origin requires chain of trust ssl (HTTPS)
> NO WRITE CACHING.

![[Pasted image 20230219041947.png]]

## TTL and Invalidations
By default source data update is not immediately reflected on the edge's cache. Wait the TTL or invalidate. 
Default TTL = 24h, can specify Minimum TTL and Maximum TTL.
Object Specific TTL with use of headers from Origin.
	Cache-Control max-age: (Seconds)
	Cache-Control s-maxage: (Seconds)
	Expires: (Date & Time)
	IF VALUE BELOW/ABOVE MIN/MAX TTL, THEN MIN/MAX TTL WILL BE USED

Invalidation performes on a distribution. Applies to all edges, takes time.
Can have wildcard:
	`/images/wiskers*`
	`/images/*`
	`/*`
Invalidation made for infrequent error fix, not constant use.
BILLED PER IVALIDATION TASK

> [!TIP]
> Consider versioned file names if you tend to frequently invalidate cache
> `whiskers_1v.jpg .. _2v_.jpg .. _3v.jpg` literally create other versions and call them in a version style. Better because application will download only needed version compared to invalidation where downloaded data can be already expired.

![[Pasted image 20230219043909.png|400]]

# SSL/TLS monitoring
![[Screenshot 2023-02-20 at 02.43.47.png]]
[Supported protocols and ciphers between viewers and CloudFront - Amazon CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/secure-connections-supported-viewer-protocols-ciphers.html#secure-connections-supported-ciphers)

# Origin Access and  Behaviours
Cloudfront has default security two settings
- Public - Open Access to objects
- Private - Access via signed URLs or signed cookies
Generally multiple behaviour defined.
> [!NOTE]
> If someone mentions Trusted Signer, the speak about private behaviour

**Trusted Key Groups** are used to create private behaviours – is new and better way.
| Signed URLs                                                     | Signed Cookies                                                |
| --------------------------------------------------------------- | ------------------------------------------------------------- |
| Access to one objects only                                      | Access to Groups of files or all files                        |
| RTMP Supported                                                  | RTMP historically was not supported, now okay                 |
| Clients support, default thing                                  | If client does not support cookies, forced to use signed URLs |
| Signed URLs gives random URL, not your Application's custom URL | Application URLs maintained                                   |
|                                                                 |                                                               |

# Origin Access Identity (OAI)
Origin Access Identity associated with a distribution.
Undermentioned examples: verify that traffic is coming from an Edge location and not direct request.
## S3 Origin
In example you associate an OAI with a distribution and create bucket policy to allow that OSI access to S3 bucket, and explicit deny anything else.
	This way people from edge location will be allowed to access CDN content, direct access will be restricted.
![[Pasted image 20230224040757.png]]

## Custom Origin
Fancy: Configure viewer/origin protocol policy to require HTTPS and configure origin protocol on edge to generate custom header and origin to require that header.

Traditionally: setup a firewall around origin which will only allow traffic form known Edge location's IPs

## combined

Access to general public CF, then cookie is generated to access private CF
![[Screenshot 2023-02-24 at 04.42.24.png]]
# [[Lambda]]@Edge

Run Lightweight lambda functions at edge locations
Allow to adjust data between the Viewer and Origin
Supports only Node.js and Python
Run in AWS Public Space, cannot access VPC
Layers are not supported
Diffrent limits
![[Screenshot 2023-02-24 at 06.07.21.png]]
Example solution:
A/B Testing - change image  in viewer request
Migration between S3 Origins
Customise behaviour of per device - like high DPI devices get better pictures
Content by Country
[Lambda@Edge example functions - Amazon CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-examples.html#lambda-examples-redirecting-examples)