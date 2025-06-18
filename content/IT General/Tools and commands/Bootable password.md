---
date created: 2025-06-18T06:10:19+04:00
date modified: 2025-06-18T06:55:20+04:00
---
You can also reset your Windows 10 password with a Windows USB installation disk. By booting your locked PC from a USB installation disk, you will be able to reset your Windows 10 password with Command Prompt. This would be a good option if you prefer to reset your Windows 10 password manually instead of using any third-party software.

Step 1: If you don’t have a Windows USB installation disk, create one on another accessible computer using Microsoft’s [Media Creation Tool](https://www.microsoft.com/en-us/software-download/windows10) or an ISO file.

Step 2: Plug the USB installation disk into the computer on which you want to reset your Windows 10 password, and boot your computer from it.

Step 3: After the computer has finished the boot from the USB drive, you will see the Windows Setup window. Choose Next>Repair your computer>Troubleshoot>System Image Recovery.

Step 4: In the “Re-image your computer” window, choose Cancel>Next>Advanced>Install a driver>OK.

Step 5: An Open window appears. Open your operating system drive (usually, drive C) and navigate to the Windows\System32 folder.

Step 6: In the Windows\System 32 folder, find the Utilman file and rename it Utilman1, then find the cmd file and rename it Utilman. You need to refresh the current folder before you can see the changes.

[![](https://mspoweruser.com/wp-content/uploads/2023/03/word-image-420014-12.png)](https://mspoweruser.com/wp-content/uploads/2023/03/word-image-420014-12.png)

Step 7: Now, unplug the USB installation disk, close all the windows on your screen, and then choose to Continue to restart your computer.

**Step 8**: When you reach the Windows 10 login screen, click the **Ease of Access** icon in the lower-right corner. This opens a Command Prompt window. Then, type `net user <username> <new_password>` and press **Enter** to reset your Windows 10 password. Replace `<username>` with your actual account name and `<new_password>` with your desired password. After doing this, you can log into Windows 10 with your new password.

![[Pasted image 20240310000810.png]]