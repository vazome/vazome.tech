Related: [[Application Layer (L7) Firewall]]

Aside from Firewall, can log events, can be also integrated with [[EventBridge]] to pass IP Lists to it and many other things.
Can protect against SQL injections and cross site scripts even
![[Pasted image 20230305151003.png]]
# WEBACL
WEBACL Default Action (ALLOW or BLOCK) - Non matching
Resource Type Cloud Front (Global) or Regional Service 
- If Regional ALB, API GW, AppSync.. pick region 
Add [[#Rule Groups]] or Rules.. processed in order 
Web ACL Capacity Units (WCU) - Default 1500 
- can be increased via support ticket WEBACL's are associated with resources (this can take time)
- adjusting a WEBACL takes less time than associating one
You cannot link Global WEBACL (Cloudfront) to a regional (Like ALB) and vice-vesa.
Does not work with AWS Outposts.

# Rule Groups
Contain rules, can be reused.
![[Pasted image 20230305151855.png|400]]

# Rules

|                   | Regular Rule                                                                                                                      | Rate Based Rule           |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| Statement         | What to match                                                                                                                     | Count all or What & Count |
| Statement options | .. origin Country, IP, label, header, cookies, query parameter, URI path, query string, body (first 8192 bytes ONLY), HTTP method | Same as left              |
| Action            | Allow, Block, Count, Captcha                                                                                                      | Block, Count, Captcha     |

>[!Warning]
>ALLOW and BLOCK labels stop the processing (the flow) of said rule, so you may want to link other rules 
>Captcha and Count continue

Custom response and labels are also supported, other rules in can target other labels .. like security groups can target security groups 

# Pricing
![[Pasted image 20230305231147.png]]