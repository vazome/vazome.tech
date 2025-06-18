Eliminates admin overhead in [[Amazon Aurora]], which is managing instances "Aurora provisioned".
The concept of service provision is defunct, instead Aurora Capacity Unit (ACUs) in cluster are used.

You set MIN and MAX ACU values and cluster will scale between these values, based on the load.
It can go down to 0 and being billed only for storage.

Billing is done on per second basis. Same resilience as Aurora provisioned.

Best for:
- infrequently used applications
- New applications where uncertainty is a major factor
- Variable workloads (when picks and downs are frequent)
- Unpredictable workloads.
- Development/test workloads.
- Multi-tenant applications where load aligns with revenue

# Difference with [[Amazon Aurora]]

ACUs allocated from a shared pool. Proxy Fleets are used as middle ground between your application and Serverless DB. You communicate with Proxy Fleet and they translate it to the Serverless cluster

