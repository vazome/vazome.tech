---
tags: concept/networking
---
Uses Physical layer for device to device communication

Common protocol: Ethernet
Device: Switch
Provides Frames and MAC addresses, prevents L1 collision (when two signals are sent simultaneously from multiple ends) with CSMA/CD. Unicast, Multicast, Broadcast

Frame:
-   Preamble -  allows devices to sync the clock
-   SFD - tells that it's start of the frame
-   Destination MAC - allows devices to understand where the data is headed
-   Source MAC - allows devices to receive replies
-   Ether Type (ET) - specifies which L3 protocol is putting data inside the frame
-   Payload - the data itself
-   Frame Check Sequence (FTC) - checks for corruption
# CSMA/CD
CSMA - Checks whether L1 interface is: available, sends/receives data, idle.
Collision Detection (CD) - if collision occurs, then send a jam signal and back off occurs (duration of time during which device will not send data), back off time is random for each end.


