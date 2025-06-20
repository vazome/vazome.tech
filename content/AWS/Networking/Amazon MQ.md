Related: [[AWS SQS]], [[AWS SNS]], [[IT Software Architectures#Hybrid]]
**VPC Based (or [[AWS Direct Connect (DX)]]), not public**
**No native AWS integration**

Open source message broker. 
Based and on managed [Apache ActiveMQ - Wikipedia](https://en.wikipedia.org/wiki/Apache_ActiveMQ)
	[Jakarta Messaging (JMS API)](https://en.wikipedia.org/wiki/Jakarta_Messaging).. and [AMQP](https://en.wikipedia.org/wiki/Advanced_Message_Queuing_Protocol), [MQTT](https://en.wikipedia.org/wiki/MQTT), [STOMP](https://en.wikipedia.org/wiki/Streaming_Text_Oriented_Messaging_Protocol), [OpenWire (binary protocol)](https://en.wikipedia.org/wiki/OpenWire_(binary_protocol)) if you need to support one of these, MQ is a way to go.
Provides queues and topics
Has both one-to-one and one-to-many communications
Either Single Instance Broker (for test, dev) or Highly Available Broker (Active/Standby)
![[Pasted image 20230219031839.png|500]]

