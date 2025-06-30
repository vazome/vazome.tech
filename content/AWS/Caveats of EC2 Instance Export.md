---
tags:
  - aws/ec2
created: 2025-06-30T06:32:04+04:00
modified: 2025-06-30T06:35:20+04:00
---
This article assumes you have: latest AWS CLI, [Necessary Permissions](https://docs.aws.amazon.com/vm-import/latest/userguide/required-permissions.html#iam-permissions-image), needed disk space for `vmdk`/`ova` download.

- **`Can't launch more than one export tasks`**
	- At the time this article was written, you could only export 1 AMI Image and 1 EC2 Instance at a time.
- **`ClientError: BLSC-style GRUB found, but unable to detect default kernel`**
	- AWS was unable to detect default kernel. Make sure `/boot/grub2/grubenv` has defined `saved_entry=` record, if not, you may try executing.
		- `sudo grubby --set-default=/boot/vmlinuz-$(uname -r)`
		- Try starting `create-instance-export-task`/`export-image` again.
- **Is there a way to quicken cancellation of an export task?**
	- After canceling an export task there is a possibility to delete newly created, residual AMI or EC2 snapshot.
