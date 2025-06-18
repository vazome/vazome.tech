In-memory, highly efficient DB, stateless, can store Session Data.
**Will require some changes for an application to support ElastiCache**
Loads off intensive read workloads, to cache popular values.

Available engines follow:
| Memcached                        | Redis                           |
| -------------------------------- | ------------------------------- |
| Simple data structures (strings) | Advanced structure (many other) |
| No built-in replication          | Multi-AZ  replication           |
| No backup support                | Support backup & restores       |
| Better with multi-threaded CPUs                               | Has Transactions, can treat multiple operations as one                                |

## Use case 1
As cache
![[Pasted image 20230316194421.png|400]]
## Use case 2
As user session data storage
![[Pasted image 20230316194612.png|400]]