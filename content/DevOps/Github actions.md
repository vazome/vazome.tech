if `${{ failure() }}` to trigger when failure of the previous step

leave comment via github scripts, permissions, pull-requests: write or none even...

To access steps variable you need you do that by referencing id.


``` yaml
- name: Run CSV Validation with Python
  id: run_validation    # Set a unique id for this step
  env: 
    ALLOWLISTED_CSV_HEADERS: ${{ vars.ALLOWLISTED_CSV_HEADER }}
    ALLOWLISTED_INGEST_DOMAINS: ${{ toJson(fromJson(vars.ALLOWLISTED_INGEST_DOMAINS)) }}
  run: |
    validation_message=$(python validate_csv.py 2>&1)
    echo "validation_message=$validation_message" >> $GITHUB_OUTPUT
- name: Post output as PR comment
  if: ${{ failure() }}
  uses: actions/github-script@v7
  with:
    script: |
      github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: "🛑 CSV validation failed :\n```\n" + process.env.INPUT_OUTPUT + "\n```"
      })
  env:
    INPUT_OUTPUT: ${{ steps.run_validation.outputs.validation_message }}
```