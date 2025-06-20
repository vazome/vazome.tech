Terraform-be-like:

**AWSTemplateFormatVersion** – helps us to increase functionality over time by choosing needed Version
**Description** – must follow after AWSTemplateFormatVersion.
**Metadata** – many functions, can control how UI presents CF template etc.
**Parameters** – add fields that prompt user for more information.
**Mappings** – allows to create lookup tables
**Conditions** – do something if met.
**Outputs** – how outputs, std

Template are working trough stacks.
Resources in templates are Logical Resources with specific naming.
Stacks are using Logical Resources from Template to create Physical resources
When updating template, you update stack and physical resources.

Stack Create Logical – Updates Create resource
Stack Updates Logical – Updates Physical resource
Stack Delete Logical – Delete Physical resource

![[Screenshot 2023-03-07 at 01.12.18.png]]

# Templates
Templates can be non-portable usually if configured improperly. Templates can be provided with paramenters (variables..). There can be Deafult, Allowedvalues, Min&Max lenght & allowed patterns, NoEcho (good for passwords) & Type.
Decrease number of input parameters if possible (more Defaults to) for best practice for better automation.
![[Pasted image 20230307013954.png]]
Also pseudo-parameters which auto-populated by AWS based on the environment 
![[Pasted image 20230307014153.png]]

# Intrinsic Functions
[Intrinsic function reference - AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html)
- Ref & Fn::GetAtt - reference value from one logical resource in another.
	- Ref literally return reference information when used on a logical resource, link instance ID
	  Fn:GetAtt returns the attribute of a logical resource![[Pasted image 20230307015403.png|400]]
- Fn:Join & Fn::Split
	- Split string to list with a delimiter and Join is vice-versa.![[Pasted image 20230307020109.png|400]]
- Fn::GetAZs & Fn::Select
	- Important thing that GetAZs returns AZs where defaul VPC has subnets, generally this configuration is untouched (no need to delete default VPC), but be ware :O
	  ![[Pasted image 20230307015803.png|400]]
- Conditions (Fn:: IF, And, Equals, Not & Or)
- Fn::Base64 (encode text (like user data)) & Fn::Sub (substitute text)
	- Just in case, instance variable here is incorrect on purpose![[Pasted image 20230307020341.png|400]]
- Fn::Cidr – helps building cidr blocks
	- Creates Cidr ranges fro subnets![[Pasted image 20230307020721.png|400]]
- Later.. Fn::ImportValue, Fn::FindInMap, Fn::Transform

# CloudFormation Init

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