Related: [[Route 53]]

1 Public zone and 1 private zone with same name are created. This way public internet and private network can access different resources under one zone name.  

Records are created in zones according to their publicity level, i.e. in out example:
- A – record is private record
- TXT, MX, www – are public records.
So in our example private can access anything (assuming they have access to internet) but public internet hosts can't resolve private records
![[Pasted image 20230121231905.png]]