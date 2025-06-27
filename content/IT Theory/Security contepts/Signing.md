---
date created: 2025-06-26T07:15:28+04:00
date modified: 2025-06-27T09:35:21+04:00
tags:
  - concept/security
---
Signing is needed because encryption does not prove the identity.
Without signing anybody can pretend to be your partner to whom you send data.
Signing with private key is producing a hash "stamp" with your data, which can be verified with public key.

Here is an example by using Cat Ruler and Robot General.
Robot wants to send a confirmation of received ciphertext. To prove the identity
Robot uses Private key to sign the message and send it to Cat. Cat, then uses Robot's public key to verify the signature on the message.

It works like reverse of encryption, meaning instead of Pub, Priv is used, but the data is not encrypted, only signed.
![[Pasted image 20230121224953.png]]