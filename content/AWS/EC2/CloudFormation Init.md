Related: [[CloudFormation]], [[AWS/EC2/EC2]]

AWS::CloudFormation::Init

Special procedure-script included in every Amazon Linux image

cfn-init – the script name, has simple configuration mgmt system

Procedural (as User Data) – customer provides the config details in form of base64.  
Desired state (cfn-init) – customer describes what needs to be done on instance.
	Package manipulation with version awareness, system user&group, download sources, file creation and commands and services.
	Provided with directives via Metadata or AWS::CloudFormation::Init

CF Template has EC2 instance configuration as AWS::EC2:Instance with UserData which lauches cfn-init and provides it with stack+region etc
![[Pasted image 20230122000313.png|600]]
# CFN Creation Policy and Signal
We can make CF aware of Instance deployment status.
Creation Policy included in CF template will wait for Signal.
![[Pasted image 20230122000334.png|600]]