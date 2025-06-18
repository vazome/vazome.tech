Inside instance logging requires an Agent

Agent, must be configured and instance with given permissions (CW access) via [[EC2 Instance Profile]]
Log group is created for each individual log you want to capture and one log stream for each EC2 instance injecting that log.
Agent configuration, may be set in parameter store 
![[Pasted image 20230122234011.png|500]]

In demo was configured with use of

``` bash
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
#Amazon Linux Bug Fix (agent expects collectd to be installed, but actually you may create just path)
sudo mkdir -p /usr/share/collectd/  
sudo touch /usr/share/collectd/types.db
#And started with 
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c ssm:AmazonCloudWatch-linux -s
```

#monitoring