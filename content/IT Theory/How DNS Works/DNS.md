The job of DNS is to help you locate and get a query response from the authoritative zone which hosts the DNS record(s) you need
![[Pasted image 20230121042008.png]]

Why we don't have ONE DNS server?  
- Security issue - everything is stored in one location, makes it easier for a successful attack to cause colossal damage
- Scaling issue - there are many internet services, it will be tedious to scale it all in one place.

Key terms:

-  DNS Zone - a database containing name records.
-  Zone file - the files storing that DNS Zone
-  Name Servers (NS) - servers hosting 1 or more Zones, can answer queries
-  Authoritative .. - contains real, genuine records.
-  Non-Authoritative/Cached - copies of records/zones stored elsewhere to speed up.
- FQDN - Fully Qualified Domain Name, the complete address of a domain, specifying hierarchy ^d3c822

 DNS Root Zone have 13 IP addresses distributed across the globe. ICANN operates 1 IP address of these 13.
	1. Root Zone contains critical info on TLDs (top-level domains) and points to registries (like Verisign or ICANN). Registries considered Authoritative because the Root Zone points to them.
		1.  Registries TLD zones are containing info about the domain within these zones. Foe example. Twitter.com, Google.com. They don't contain detailed record of these domains, like [www.twitter.com](http://www.twitter.com). They host NS server info of the domains in zone, like NS servers for google.com
			1. NS Servers for second level domain are authoritative because their are pointed at from the level above. These NS servers host zone info and file
![[Pasted image 20230121042249.png]]

# DNS purchase process
DNS registrar have connections to many registries.
DNS hosting provider can hosts DNS Zones
![[Pasted image 20230121042755.png]]