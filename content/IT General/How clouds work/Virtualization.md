Related: [[AWS/EC2/EC2]], [[RDS]]

Virtualization is a solution for running multiple operating systems on under one computer.

# Emulated virtualization (1st iteration)
Requires software hypervisor, an application which is always running in privileged mode, so it can provide the needs to the VMs. The VM sees hardware legit, but it's emulated. Uses Binary translation process to intercept Guest OS calls to hardware.
Slow.
![[Pasted image 20230121154632.png|500]]

# Para virtualization (2nd iteration)
Alike emulated, but instead of system calls sent designed to reach hardware, it had modified guest OSes in which parts that were making the privileged calls were modified to make grade them into User Calls. So OS makes a Hypercall to hypervisor.  Specific operating system locked to specific Virtualization vendors. OS is hypervisor aware.
![[Pasted image 20230121154652.png|500]]

# Hardware Assisted Virtualization (3rd iteration)
CPU knows that virtualization exists, by having a relatable set of instructions.
OS makes a privilege call, hardware redirect it to hypervisor.
Issue with hardware even though CPU is aware, Network cards are not, so some "software" for NIC is required to deal with multiple calls, translation still in place.
Decent performance but not good with I/O
![[Pasted image 20230121154811.png|500]]

# Single Root IOV (SR-IOV) (4rd iteration)
Hardware is aware of virtualization, so NIC can be split into two virtual cards and Guest OSes can call on it directly. Hardware must support such standard.
![[Pasted image 20230121154836.png|500]]