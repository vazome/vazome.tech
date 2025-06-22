---
date created: 2025-06-21T01:24:19+04:00
date modified: 2025-06-23T00:28:28+04:00
tags:
  - concept/scale
---
Related: [[IT Software Architectures]]
# Vertical Scaling
Increase the size of an instance, resizing.
	Each resize causing a reboot – disruption.
	Larger instances cost more and may not be in liner way
	There is always a cap.

# Horizontal Scaling
Increases the amount of instances
	Usually requires a load balancer
	Sessions is everything, consider it before enabling the concept
		Requires an application support or off-host sessions
	No disruption
	No real limits to scale
	Often less expensive, granular