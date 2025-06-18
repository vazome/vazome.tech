Related: [[S3]]

You can enable S3 Bucket Versioning
	Any file prior the enablement will get "null" version displayed
	Suspending versioning does not delete older versions
	Bucket level
You cannot delete versioning if it was enabled
You can suspend versioning.
You consume for each version, you pay for versions.
Every object is has an ID. By default id is NULL.
New version has new ID. But you can request specific version by ID.

If we try to delete a file without providing ID it will just place a delete marker and all other versions unavailable. You can delete the delete market, ergo undelete the object.

To delete particular file, provide ID.

MFA Delete if enabled, requires MFA to delete file versions or change bucket versioning state.
	Requires MFA Serial number + code via API CALLS