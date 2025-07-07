- [[#About|About]]
	- [[#About#At Rest (usually Symmetric encryption)|At Rest (usually Symmetric encryption)]]
	- [[#About#At Transit (usually Asymmetric Encryption)|At Transit (usually Asymmetric Encryption)]]


# Encoding
Quick hack, if you encode to pass a variable use `printf` instead of `echo` so it does not add a new line character

# Encryption
Encryption is the method of encoding information (converting to secret code), generally, for the sake of security.
Divides on two types
Here's the table with improved formatting for better readability:

| Encryption At Rest                                                                                                                                                             | Encryption In Transit                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Designed to protect against physical theft and tampering. Example: A user with a laptop has data written on storage, which gets encrypted and decrypted when read into memory. | Protects data while it's in transit between two places. Example: A user sends encrypted data to a bank, the bank decrypts it, and sends it back encrypted. |
| Uses secrets.                                                                                                                                                                  | Uses a wrapper, a tunnel for the data.                                                                                                                     |
| Used by one entity.                                                                                                                                                            | Used when multiple entities are involved.                                                                                                                  |
| Designed to protect against physical theft and tampering, example: user with a laptop, data written on storage gets encrypted, the same gets decrypted when read into memory   | Protecting data while it's in transit between two places, example: user sends encrypted data to bank, bank decrypts it and sends it back encrypted.        |
| Uses secrets.                                                                                                                                                                  | Uses wrapper, a tunnel for the data                                                                                                                        |
| Used by one entity                                                                                                                                                             | Used when multiple entities involved                                                                                                                       |
Terms:
- Plaintext - is un-encrypted data, which can be a text, image.. can be immediately read.
- Algorithm - a piece of code (maths) which takes plaintext and an encryption key and turn it generates encrypted data. Common examples: Blowfish, AEC, RC4/5/6, DES
- Key - at its simplest is a password but can be much more complex
- Ciphertext - is the output of plaintext and a key, just like plaintext it is not always a text, it just encrypted data which can be anything.

Encryption takes plaintext and an algorithm with a key, and generates a ciphertext.

Decryption is a reverse of it.

## At Rest (usually Symmetric encryption)
Symmetric encryption – is good for At Rest encryption, fails At Transit because it uses single key.
Transfer is this key between two entities makes the process insecure, you can find a way to securely transfer the key, but there are other options.
![[Pasted image 20230121160336.png]]

## At Transit (usually Asymmetric Encryption)

Asymmetric Encryption – is good for At Transit encryption, in this example:
1.  Cat Ruler needs to send plaintext to Robot General.
2.  Since Robot General is receiving, he generates public and private keys.
3.  He uploads public key in cloud storage, and keeps private key to himself.
4.  Cat Ruler downloads pub and converts plaintext into ciphertext, and sends it to Robot General.
5.  Robot General receives ciphertext and decrypts it with priv.
This way only Robot General can decrypt the ciphertext.
>[!NOTE]
>Followed by [[Signing]]

![[Pasted image 20230121224313.png]]
