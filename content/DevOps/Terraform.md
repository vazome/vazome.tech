First steps:[Terraform Files - How to Structure Terraform Project](https://spacelift.io/blog/terraform-files)

Simplify variables
[Variables for Modules - Terraform - HashiCorp Discuss](https://discuss.hashicorp.com/t/variables-for-modules/39728)

Rename resource in terraform via `terrform state mv`

Store state file in azure: [Store Terraform state in Azure Storage | Microsoft Learn](https://learn.microsoft.com/en-us/azure/developer/terraform/store-state-in-azure-storage) and service or managed identities: [Always store the Terraform state in Azure blob Storage | by Anoop Srivastava | Medium](https://medium.com/@anoop.srivastava/always-store-the-terraform-state-in-azure-blob-storage-c8095aadfffc) in Azure you don't need to use CosmoDB because Azure storage account natively supports state locking and leasing in blob storage types.

Features{} block in Azure: [Terraform Registry](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/features-block)

Upload file to azure storage file: [Is it possible to upload files to Azure Share using terraform? - Stack Overflow](https://stackoverflow.com/a/70935468/10897030) and **blob** [Terraform Registry](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/storage_blob)

Using provisioner is the last measure, look into provider specific for each clauses and global meta arguments: [Provisioners | Terraform | HashiCorp Developer](https://developer.hashicorp.com/terraform/language/resources/provisioners/syntax)

Multiregion deployment by using Aliases: [Deploy AWS Resources in Different AWS Account and Multi-Region with Terraform Multi-Provider and Alias - DEV Community](https://dev.to/devops4mecode/deploy-aws-resources-in-different-aws-account-and-multi-region-with-terraform-multi-provider-and-alias-ie9)

required_providers is used to set version while provider confiures the provider itself, like subscription, "domain" or identity role used 

### Outputs
They can access data without managing in Terraform, which is funny.


Terraform file types include:
1. **main.tf** – containing the resource blocks that define the resources to be created in the target cloud platform.
2. **variables.tf** – containing the variable declarations used in the resource blocks.
3. **provider.tf** – may containing the terraform block, s3 backend definition, provider configurations, and aliases or other provider configurations
4. **output.tf** – containing the output that needs to be generated on successful completion of “apply” operation.
5. **[*.tfvars](https://spacelift.io/blog/terraform-tfvars)** – containing the environment-specific default values of variables.
