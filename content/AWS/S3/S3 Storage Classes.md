Related: [[S3]]

S3 Objects are replicated over 3 AZs and Content-MD5 checksum and Cycling Redundancy Checks (CRC) are implemented to fix any data corruption. 1 file lost per 10,000 years.

Objects are replicated at least across 3 AZs.
If object is stored durably, HTTP/1.1 200 OK response is provided by S3 API Endpoint.
![[Pasted image 20230122224831.png|500]]

First bite latency - anki
-   **S3 Standard** – for frequent access to important data. IN is free. No retrieval fee, no minimum size.
-   **S3 Standard-IA** – reduction in storage cost, but has retrieval fee. Design for infrequent storage of important data. It's effective to store large files instead of small to optimize the cost. Minimal storage duration 30 days.
-   **S3 One Zone-IA** – like Standard IA, but does not replicate data between multiple zones. Do not use for critical data, do not use for frequent access data. May be used for replaceable and infrequent data.
-   **S3 Glacier Instant** –  Standard IA but for accessing data once per quarter of the year, minimal storage duration for 90 days
-   **S3 Glacier Flexible** – holds objects in cold state, you can see them in bucket but you need to start retrieval process, during retrieval you files stored in Standard IA storage class (temp), you access them, then they are removed. Objects cannot be publicly accessible. For archival data accessible per annual basis. Retrieval job types by warming speed:
	-   Expedited 1-5 minutes
	-   Standard 3-5 hours
	-   Bulk 5-12 hours
-   **S3 Glacier Deep Archive** –  hold objects in frozen state, 180 days minimum storage bill duration, 40KB minimum size. Objects cannot be publicly accessible. Retrieval jobs take longer. For archival data accessible per annual basis. Retrieval job types by warming speed:
	-   Standard 12 hours
	-   Bulk up to 48 hours.
-   **S3 Intelligent-Tiering** – multiple tiers, analyzes data usage and moves it to appropriate tiers. You pay for used tiers as before and additionally management fee. Used for long-lived data when usage and change rate is unknown.
![[Pasted image 20230122224920.png|500]]