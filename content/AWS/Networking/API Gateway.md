Related: [[Lambda]]
Service made to create and manage APIs. Endpoint/entry point for applications.
Sits between applications and backend services (integration)
Highly available scaleable. Is a public service, so can connect to on-premise too.
Throttle control - how many requests can be sent per API key

HTTP APIs, REST APIs and WebSocket APIs
![[Pasted image 20230212202716.png]]

# Authentication

>[!NOTE]
>Can be setup without authentication

[[Amazon Cognito]]:
[[Lambda]] Authorizer:
[[IAM]] Passing Credentials with headders..
![[Pasted image 20230212203207.png]]

# Endpoint types

1. Edge optimized - route to nearest [[CloudFront]] POP
2. Regional - covering specific region
3. Private - accessible only within VPC via interface endpoint

# Stages
When you deploying API, you do it with stages, like dev.. prod..
Provides isolation and testing. Also, there are Canary deployments which can be upgrade into the new base stage
![[Pasted image 20230212203623.png]]

# Errors

- 4XX - Client-side errors. Invalid requests on client side
- 5XX - Server Error. Valid request, backend issue

Also.
- 400 - Generic client-side error
- 403 - Access denied - Authorizer denies or [[Web Application Firewall (WAF)]] Filtered
- 429 - API Gateway can throttle - this means you've exceeded that amount (Too many requests)
- 502 - Bad Gateway Exception - bad output from backend (like bad output from lambda)
- 503 - Service Unavailable backend endpoint offline? Major service issues.
- 504 - Integration failure/Timeout 29s limit for lambda to provide a request to API Gateway.
[Common Errors - Amazon API Gateway](https://docs.aws.amazon.com/apigateway/latest/api/CommonErrors.html)

# Caching
>[!IMPORTANT]
> Cache is setup per stage

Default TTL is 300s - can be min 0s max 3600s
**Cache can be encrypted**
Cache size 500MB to 237GB.
![[Pasted image 20230212205002.png]]

# Demo
![[Pasted image 20230212235419.png]]