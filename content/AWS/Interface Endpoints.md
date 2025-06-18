Related: [[Gateway Endpoints]]

Interface endpoints are used to allow private IP addressing to access public AWS services.
![[Pasted image 20230226023312.png]]
S3 and DynamoDB are handled by gateway endpoints - other supported services are handled by interface endpoints.

But S3 can, also be used with Interface Endpoints.
Not [[HA vs FT vs DR#High availability (HA)]] as Gateway Endpoint, you need to add one endpoint per one subnet per one AZ
So if you use 3 AZs you need 3 Endpoints
Endpoint Policies – restrict what can be done with the endpoint

Only TCP and IPv4
Uses [[Privatelink]]

Alike Gateway Endpoints, they don't user prefix list in RT, they have private IP and get DNS.
They get endpoint regional DNS and Zonal DNS. Also, PrivateDNS associates [[Route 53]] Private Zone and overrides default given DNS
![[Pasted image 20230225175259.png]]![[Screenshot 2023-02-25 at 17.53.49.png]]