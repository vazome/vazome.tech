Related: [[VPC]]

Works on top of DX or VPN

Transit hub which connects VPCs to on-premise. Also, transitive!
Reduces network complexity.
It's a network gateway object, so HA and scaleable.
Creates attachment (the way it connects to other network objects), like [[VPC]], [[AWS Site-to-Site VPN]] and [[Direct Connect (DX)#Gateway]] 

# Comparison w/o and with TGW 
- **w/o (trying to connect complex network into AWS in HA way)**![[Pasted image 20230301010133.png|500]]
- **with**, transitive HA single point, does the mesh, can cross-account![[Screenshot 2023-03-01 at 01.43.57.png]]
