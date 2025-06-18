[[Encryption and Encoding]]

Creating CSR
``` shell
openssl req -new -nodes -out servername.csr -newkey rsa:4096 -keyout servername.key -subj "/C=LDAPPATH/ST=LDAPPATH/L=LDAPPATH/O=LDAPPATH LDAPPATH/OU=LDAPPATH LDAPPATH/CN=servername" -reqexts san -config <(echo '[req]'; echo 'distinguished_name=req';echo '[san]'; echo 'subjectAltName=DNS:servername,DNS:servername_nodomain,IP:serverIP')
```

Creating symmetric key [[Encryption and Encoding#At Rest (usually Symmetric encryption)]]
``` shell
openssl enc -aes-256-cbc -k secret -P
```
