---
date created: 2025-06-26T07:15:28+04:00
date modified: 2025-06-27T09:35:22+04:00
tags:
  - concept/security
---
# Authentication
**Authentication** is a confirmation of identity, that you is you.
# Authorization
**Authorization** is a grant of specific rights to the identity, that you can do something.
# Hashing
Converting a file into a short string defining that file.
Algorithm examples: SHA2-256
![[Untitled picture 4.png|500]]
Hashing uses Hash Functions to receive hash for a file. The idea is that if file has been changed by a single bit, hash will be different.
Same document = same hash.
You cannot convert hash to a file.
![[Pasted image 20230121155028.png|500]]
Common use case of using hashes is password storage on an online service.
It's not secure to store encrypted passwords, but it is secure to store only password hashes. Each time user logs in, their password is converted to hash and verified against hash in DB.

But nothing stops a hacker to bruteforce login until he find a password that matches. So you must use more secure hashing algorithms
>[!WARNING]
>Do not use MD5.

Hashing Weaknesses:
-   Creating file back from the hash. Impossible with secure algorithms.
-   Collisions when two different files have the same hash. MD5 is prone to this.

