Related: [[AWS/EC2/EC2]], [[EC2 Instance Types]]

# On-demand
Capacity allocated, the instances isolated, but multiple customer share same hardware, no specific pros and cons, for is needed for short term or unpredictable planning instances.
Per-second pricing, but you only pay for storage if it stopped

# Spot
Using free capacity when other EC2 instances are not working with decent discount up to 90%. It works the way that you set your price cap, if AWS instance price becomes greater than your cap, you lose the instance. Something which can tolerate interruption and need burst.

Must not be used for workloads which can't tolerate interruptions.

# Reservations

You agree to "use" instance for 1/3 years with reserved capacity/discount, reservation are per AZ or Region
Region – does not reserve the capacity, focuses on the discount
AZ – does reserve the capacity, less focus on discount
No-upfront (less discount)/Partial (Middle)/All-upfront(more discount)

## Scheduled Reserved
Commitment for specific time in day, 1 year period. Good for scheduled jobs etc.

## Capacity Reserved
Can be regional reservation – billing discount for an AZ. 1 - 3 year
Can be zonal reservation – get capacity in certain AZ. 1 - 3 year
On demand capacity – reserve for any duration of time, pay as on-demand type

# [[EC2 Dedicated host]]

You are dedicated with whole physical server (host), most useful for software with socket/core licensing
Pay for host itself.
Dedicated instances – when you don't need to share host's hardware, but also, don't control it. Extra charges.

# Savings Plan (better if no capacity needed)

Commit how much dollars you pay in 1/3 years and receive discount.
You specify specific amount dollar per hour you committed to spend, beyond on-demand you get commitment