[[DNS]]
DNS Resolving i.e. Walking the tree
Resolving [www.netflix.com](http://www.netflix.com):
1.  Computer hosts file is checked
2.  Computer cache is checked
3.  Query to DNS Resolver (Usually router or ISP), it might return non-authoritative answer because of cache
4.  Query to DNS Root Zone which does not host TLDs but can point us to registries which do, returns .com NS (which IP addresses are hardcoded in operation systems)
5.  Now DNS Resolver queries Registries TLD NS. Gets returned with netflix.com NS
6.  Query to netflix.com DNS NS, [www.netflix.com](http://www.netflix.com) ip is returned.
7.  The record might be cached.
![[Pasted image 20230121042606.png]]
![[Pasted image 20230121042633.png]]  