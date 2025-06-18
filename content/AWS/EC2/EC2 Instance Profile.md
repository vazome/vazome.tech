Related: [[AWS/EC2/EC2]]

[[IAM Role]] assumed by an instance
Instance Profile allows permissions to get inside instance.
IAM Role and Instance Profile are separate entities but in UI they represented as one  
You **attach** Instance profile not IAM Role.

Role gets assumed by metadata temporary credentials provision to an instance.
Credentials automatically renewed.
Roles preferable for long term access.  
CLI Tools inside that instance will use role credentials automatically

-   curl [http://169.254.169.254/latest/meta-data/iam/security-credentials/](http://169.254.169.254/latest/meta-data/iam/security-credentials/)
-   curl [http://169.254.169.254/latest/meta-data/iam/security-credentials/{RoleName}](http://169.254.169.254/latest/meta-data/iam/security-credentials/%7bRoleName%7d)

Credential check precedence
[https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html#cli-configure-quickstart-precedence](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html#cli-configure-quickstart-precedence)