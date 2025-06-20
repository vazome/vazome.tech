Related: [[L7 Application]], [[Signing]], [[Encryption and Encoding]]

Provide security and data integrity between client and service.
Privacy – uses asymmetric and then symmetric [[Encryption and Encoding]]
**Identity** – server and client/server are verified
Reliability – protects connection against alteration of data in transit.

TLS phases when client initiates a connection to a server (handshake).

[Server Name Indication - Wikipedia](https://en.wikipedia.org/wiki/Server_Name_Indication) is not supported by older browsers (IP for two https websites)

- Cipher suite – a set of protocols used by TLS (including key exchange algorithm, bulk encryption algorithm and Message Authentication Code Algorithm (MAC)).
	- Client and a server must agree on cipher suite. Client provide cipher suites and SSL/TLS versions, Session ID, etc.
	- Server responds with Server Certificate with pub key and SSL/TLS versions, cipher suites
	- Asymmetric at transit encryption established
	- In the past, server has generated pub/priv key pair and CSR. Submitted it to public CA and in return received a signed certificate
- Authentication – ensure that Certificate is authentic, verifying the server as legitimate.
	- Client trusts public CA and verifies that the certificate was signed by CA, is not expired and wasn't revoked and that the DNS name matches the name/names in the cert
	- Client attempts to encrypt some data and sends it to the server to verify that it has corresponding private key
- Key exchange – here we move from asymmetric encryption to symmetric (for ease of computation)
	- Client generates Pre-Master Key, encrypts it with server's public key and sends it to server.
	- Server decrypts it with Private key now it has Pre-Master Key.
	- Now both hosts convert Pre-Master Key into a Master Secret
	- Master key is used to generate session keys which will encrypt and decrypt data in a session.
	- Handshake is confirmed, encrypted connection is established
![[Pasted image 20230121225725.png]]