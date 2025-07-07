---
created: 2025-06-30T06:32:04+04:00
modified: 2025-06-30T06:35:20+04:00
---
AWS CloudFront is a content delivery network (CDN) that helps distribute data by using local regional caches. No self-signed certs are allowed.

- **Origin**: Source of content ([[AWS S3 Simple Storage Service]] or Custom Origin)
  - Can have origin groups (resilience)
  - Viewer protocol matches edge-origin protocol on **S3**
  - Origin access identity and control - S3
  - Custom ports - custom origin
  - Custom header match - custom origin
  - Can be S3 or custom origin
- **Distribution**: The configuration of CloudFront
- **Edge locations**: Local cache of your data, fewer than regions
- **Regional Edge Cache**: Larger version of edge location, slower than edge but still helps distribute content quicker
- **Cache Behaviours**: Path pattern for distributions (affects TTL, protocol, and privacy)
  - The default behaviour is ✳️
  - Many settings, like restrict viewer access (use signed URLs or cookies to access data)
  - Each distribution has its own domain name in the format `xxxxxx.cloudfront.net`, but can be given an alternate custom name

# Architecture

**Cache hit**: Edge location cache is close and accessed
**Cache miss**: Regional Edge searches Origin, then data sent to Regional Edge, then to the closest Edge, then it's accessed. Regional Edge now holds cache in longer term.
PREVENT MISS IF POSSIBLE, TO LOWER THE LOAD

> [!WARNING]
> viewer -> edge -> origin requires chain of trust SSL (HTTPS)
> NO WRITE CACHING.

![[Pasted image 20230219041947.png]]

# TTL and Invalidations

By default, source data updates are not immediately reflected on the edge's cache. Wait for the TTL or invalidate. 
Default TTL = 24h, can specify Minimum TTL and Maximum TTL.
Object Specific TTL with use of headers from Origin:
- `Cache-Control: max-age` (Seconds)
- `Cache-Control: s-maxage` (Seconds)
- `Expires:` (Date & Time)
If value below/above min/max TTL, then min/max TTL will be used.

Invalidation is performed on a distribution. Applies to all edges, takes time.
Can have wildcard:
- `/images/wiskers*`
- `/images/*`
- `/*`
Invalidation is for infrequent error fixes, not constant use.
BILLED PER INVALIDATION TASK

> [!TIP]
> Consider versioned file names if you tend to frequently invalidate cache
> `whiskers_1v.jpg .. _2v_.jpg .. _3v.jpg` — create other versions and call them in a version style. Better because application will download only needed version compared to invalidation where downloaded data can be already expired.

![[Pasted image 20230219043909.png|400]]

# SSL/TLS Monitoring

![[Screenshot 2023-02-20 at 02.43.47.png]]
[Supported protocols and ciphers between viewers and CloudFront - Amazon CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/secure-connections-supported-viewer-protocols-ciphers.html#secure-connections-supported-ciphers)

# Origin Access and Behaviours

CloudFront has two default security settings:
- Public: Open access to objects
- Private: Access via signed URLs or signed cookies
Generally, multiple behaviours are defined.

> [!NOTE]
> If someone mentions Trusted Signer, they mean private behaviour.

**Trusted Key Groups** are used to create private behaviours – this is the new and better way.

| Signed URLs                                                     | Signed Cookies                                                |
| --------------------------------------------------------------- | ------------------------------------------------------------- |
| Access to one object only                                       | Access to groups of files or all files                        |
| RTMP Supported                                                  | RTMP historically was not supported, now okay                 |
| Clients support, default thing                                  | If client does not support cookies, forced to use signed URLs |
| Signed URLs gives random URL, not your Application's custom URL | Application URLs maintained                                   |

# Origin Access Identity (OAI)

Origin Access Identity is associated with a distribution. Used to verify that traffic is coming from an Edge location and not a direct request.

## S3 Origin
Associate an OAI with a distribution and create a bucket policy to allow that OAI access to the S3 bucket, and explicitly deny anything else. This way, only people from edge locations can access CDN content; direct access is restricted.
![[Pasted image 20230224040757.png]]

## Custom Origin
Configure viewer/origin protocol policy to require HTTPS and configure origin protocol on edge to generate a custom header and require that header on the origin.
Traditionally, set up a firewall around the origin to only allow traffic from known Edge location IPs.

## Combined
Access to general public CF, then a cookie is generated to access private CF.
![[Screenshot 2023-02-24 at 04.42.24.png]]

# Lambda@Edge
Run lightweight [[Lambda]] functions at edge locations. Allow adjustment of data between the Viewer and Origin. Supports only Node.js and Python. Runs in AWS Public Space, cannot access VPC. Layers are not supported. Different limits apply.
![[Screenshot 2023-02-24 at 06.07.21.png]]Example solutions:
- A/B Testing — change image in viewer request
- Migration between S3 Origins
- Customise behaviour per device (e.g., high DPI devices get better pictures)
- Content by Country

[Lambda@Edge example functions - Amazon CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-examples.html#lambda-examples-redirecting-examples)