---
date created: 2025-06-24T21:42:32+04:00
date modified: 2025-06-25T00:59:23+04:00
tags:
  - concept/networking/global
  - concept/security
---
Provide security and data integrity between client and service.
TLS improves upon now-deprecated SSL: [RFC 8996: Deprecating TLS 1.0 and TLS 1.1](https://www.rfc-editor.org/rfc/rfc8996)
- **Privacy** – uses asymmetric and then symmetric [[Encryption and Encoding]]
- **Identity** – server and client/server are verified
- **Reliability** – protects connection against alteration of data in transit.

Though they don't quite fit in OSI model:

>Thus, in the OSI model, SSL/TLS must be in layer 6 or 7, and, _at the same time_, in layer 4 or below. The conclusion is inescapable: the OSI model does not work with SSL/TLS. TLS is not in any layer. [packet - What layer is TLS? - Information Security Stack Exchange](https://security.stackexchange.com/a/93338)

TLS phases in when client initiates a connection to a server (the handshake).

[Server Name Indication - Wikipedia](https://en.wikipedia.org/wiki/Server_Name_Indication) which is an extension on TLS - is not supported by older browsers (One IP per multiple HTTPS websites with different certificates).
# Stages
![[Pasted image 20230121225725.png]]
- Cipher suite – a set of protocols used by TLS (including key exchange algorithm, bulk encryption algorithm and Message Authentication Code Algorithm (MAC)).
	- Client and a server must agree on cipher suite. Client provide cipher suites and SSL/TLS versions, Session ID, etc.
	- Server responds with Server Certificate with pub key and SSL/TLS versions, cipher suites
	- Asymmetric at transit encryption established
	- In the past, server has generated pub/priv key pair and CSR. Submitted it to public CA and in return received a [[Signing]] certificate
- Authentication – ensure that Certificate is authentic, verifying the server as legitimate.
	- Client trusts public CA and verifies that the certificate was signed by CA, is not expired and wasn't revoked and that the DNS name matches the name/names in the cert
	- Client attempts to encrypt some data and sends it to the server to verify that it has corresponding private key
- Key exchange – here we move from asymmetric encryption to symmetric (for ease of computation)
	- Client generates Pre-Master Key, encrypts it with server's public key and sends it to server.
	- Server decrypts it with Private key now it has Pre-Master Key.
	- Now both hosts convert Pre-Master Key into a Master Secret
	- Master key is used to generate session keys which will encrypt and decrypt data in a session.
	- Handshake is confirmed, encrypted connection is established
