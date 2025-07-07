NS – Points to the Name Servers, which can give you answers about this domains (server which actually holds the DNS records)
A or AAAA – point to IP address.
CNAME – alias, host to host record.
MX – email records, point to mail server and have priorities
![[Pasted image 20230121232006.png]]

TXT – multi-purpose.
TTL – how long it takes until record updates?

# Route 53 CNAME vs ALIAS
CNAME is Name to Name ([www.catagram.io](http://www.catagram.io) to catagram.io), but CNAME cant point naked domain to other domain (catagram.io to gramcat.io).

ALIAS is naked or records, two types
	A (ALIAS) – name to IP
	CNAME (ALIAS) – ..