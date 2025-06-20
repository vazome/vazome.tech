Most new PCs don't come with DVD drives anymore. So it can be a pain to install Windows on a new computer.

Luckily, Microsoft makes a tool that you can use to install Windows from a USB storage drive (or "thumbdrive" as they are often called).

But what if you don't have a second PC for setting up that USB storage drive in the first place?

In this tutorial we'll show you how you can set this up from a Mac.

# Step 1: Download the Windows 10 ISO file
You can download the ISO file straight from Windows. That's right - everything we're going to do here is 100% legal and sanctioned by Microsoft.

If you want an English-language version of the latest update of Windows 10, you can download the ISO here.

If you have a relatively new computer, you probably want the 64-bit version. If you're not sure, go with the 32-bit version to be safe.

If you want a non-English-language version of Windows, or want to get an older update version, download the ISO here instead.

# Step 2: Insert your USB storage drive into your Mac
The ISO file is only about 5 gigabytes, but I recommend you use a USB drive with at least 16 gigabytes of space just in case Windows needs more space during the installation process.

I bought a 32 gigabyte USB drive at Walmart for only $3, so this shouldn't be very expensive.

Stick your USB drive into your Mac. Then open your terminal. You can do this using MacOS Spotlight by pressing both the ⌘ and Space bar at the same time, then typing "terminal" and hitting enter.

Don't be intimidated by the command line interface. I'm going to tell you exactly which commands to enter.

# Step 3: Use the diskutil command to identify which drive your USB is mounted on
Open Mac Spotlight using the ⌘ + space keyboard shortcut. Then type the word "terminal" and select Terminal from the dropdown list.

Paste the following command into your terminal and hit enter:

> diskutil list

You will see output like this (note - your Mac's terminal may be black text on a white background if you haven't customized it).

![diskutil list](https://www.freecodecamp.org/news/content/images/2019/09/default_-_default_freeCodeCamp_-_-zsh_-_130-33.png)

Copy the text I point to here. It will probably be something like

/dev/disk2.

# Step 4: Format your USB Drive to work with Windows
Next format your USB drive to Windows FAT32 format. This is a format that Windows 10 will recognize.

Note that you should replace the disk2 with the name of the your drive from step 3 if it wasn't disk2. (It may be disk3 or disk4).

Run this command using the correct disk number for your USB:

`diskutil eraseDisk ExFAT "WIN10" GPT /dev/disk2`

Then you'll see terminal output like this.

![diskutil eraseDisk](https://www.freecodecamp.org/news/content/images/2019/09/default_-_default_freeCodeCamp_-_-zsh_-_130-33-1.png)

This will probably only take about 20 seconds on a newer computer, but may take longer on an older computer.

# Step 5: Use hdiutil to mount the Windows 10 folder and prepare it for transfer.
Now we're going to prep our downloaded ISO file so we can copy it over to our USB drive.

You will need to check where your downloaded Windows 10 ISO file is and use that. But your file is probably located in your ~/Downloads folder with a name of Win10_1903_V1_English_x64.iso.

> hdiutil mount ~/Downloads/Win10_1903_V1_English_x64.iso

Step 6: Copy the Windows 10 ISO over to your USB Drive
Now run the following command to copy your Windows Win10_1903_V1_English_x64.iso to your USB drive.

> cp -rp /Volumes/CCCOMA_X64FRE_EN-US_DV9/* /Volumes/WIN10/

# Step 7: Put your USB into your new PC and start loading Windows
Congratulations - your computer now should boot directly from your USB drive. If it doesn't, you may need to check your new PC's BIOS and change the boot order to boot from your USB drive.

Windows will pop up a screen and start the installation process.

Enjoy your new PC, and your newly-installed copy of Windows.