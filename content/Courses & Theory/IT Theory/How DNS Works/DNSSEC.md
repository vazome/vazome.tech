Related: [[DNS]], [[Encryption and Encoding]]

Is additional stack of protocol insuring DNS Security
It solely exists because DNS was designed at the time when Internet was viewed as a friendly thing and attacks were not common.
![[Pasted image 20230121042850.png]] Does not change how DNS works, but add additional verification mechanisms to ensure that DNS queries and data were not altered.![[Pasted image 20230121042912.png]] As we can see the SERVER is non-authoritative, DNS queries might be tampered
![[Pasted image 20230121042958.png|600]]
DNSSEC  RPSIG -  signature proves valid queries
![[Untitled picture 1.png|600]] 
RRSET - Resource Record Set (Records of the same type (A,MX..) are in the set.)![[Pasted image 20230121043154.png]]
RRSIG - Verifies RRSETs

- Zone Signing Key - Private key is not related to the zone, but Public key is.
- Key Signing Key (KSK) - Creates RRSIG from DNSKEY

We tale RRSET and sign it with private key and hashing algorithm. Now, hash+signature is created.

How to verify?

Aside from other records in the zone we have DNSKEY record containing Public key of ZSK and maybe KSK. Record contains value 256 = ZSK, 257 = KSK.
We take MX Records, RRSIG MX records and public key, so we trust RRSET and that only Zone admin has the private key.

DNS Integrity Protection
![[Pasted image 20230121043234.png]]
# How chain of trust is created.

1.  Zone .org delegates control of icann.org to ICANN NS servers. This is a normal DNS thing.
2.  Zone .org has DS records, these DS records contain a hash of icann.org's (child) KSK. This is DNSSEC
3.  Zone creates RRSIG DS by using it's private key on DS records.
4.  Then Zone creates DNSKEY record containing pub of it's ZSK and KSK
5.  Then Zone Private KSK creates RRSIG DNSKEY.
6.  We trust zone .org same way as for icann.org, the Root Zone (which too has DS record set which contains a hash of child DNS KSK)
Root Keys are trust anchors (the are just trusted)![[Pasted image 20230121043309.png]]
[Root KSK Ceremony 47 - YouTube](https://www.youtube.com/watch?v=YrV_P9xjHc8)- how Root Zone keys created.
![[Pasted image 20230121044012.png]]