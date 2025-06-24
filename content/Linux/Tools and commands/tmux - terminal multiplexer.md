---
date created: 2025-06-24T21:42:32+04:00
date modified: 2025-06-24T23:41:34+04:00
tags:
  - os/linux
---
- **Create a session**  
  `tmux`
- **List sessions**  
  `tmux ls`
- **Attach to a session**  
  `tmux attach`
- **Detach from a session**  
  `tmux detach`
- **Create a new window**  
  `tmux neww`
- **Close pane**  
  `exit`
- **Manage inside a tmux session** (use `Ctrl + B` as the command prefix):
    - **Detach from session:**  
      `Ctrl + B` then `D`
    - **New window:**  
      `Ctrl + B` then `C`
    - **Move between windows:**  
      `Ctrl + B` then `Shift + P` (previous)  
      `Ctrl + B` then `Shift + N` (next)
    - **Close current window:**  
      `Ctrl + B` then `Shift + 7` (`&`)
    - **Create a new vertical pane:**  
      `Ctrl + B` then `Shift + 5` (`%`)
    - **Create a new horizontal pane:**  
      `Ctrl + B` then `Shift + '` (`"`)