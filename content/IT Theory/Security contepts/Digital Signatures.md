Related: [[Signing]]

Verifies INTEGRITY (WHAT) and AUTHENTICITY (WHO)

# Creating Digital Signature of an object

1.  Taking the hash of the data and digitally sign the hash with private key.
2.  Public key gets distributed wider so it's becomes hard to alter it.
3.  Digitally signed data is created (let's share it)
4.  Other party receives the data, they check signature and get exposed to the original hash
5.  Other party uses same hash function on the data if hashes are same, the data is same.

Trust public key => trust private key => trust entity => trust data
![[Pasted image 20230121225109.png]]