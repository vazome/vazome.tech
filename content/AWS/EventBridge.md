Related: [[CloudWatch (Metrics)]]

Basically do: if X happens, or at Y time(s) .. do Z

Event Bus is a stream of events from supported services inside AWS Account.
Every account has default event bus.
Can have additional Event Buses and for 3rd party too.

Rules match events, if match, deliver to target.
	And scheduled rules (matches when you set the time, like in cron)
![[Screenshot 2023-02-07 at 01.26.33.png]]