## Distinguishing Ansible Playbooks and Role Files

### Playbooks

- **Structure**: Starts with a list of plays, each containing:
    - `hosts`: Specifies target machines
    - `tasks`: Lists tasks to execute
    - `roles`: Includes roles to apply
- **Purpose**: Orchestrates tasks or roles across specific hosts
- **Example**:
    ```yaml
    - name: Deploy web servers
      hosts: webservers
      roles:
        - webserver_setup
    ```
### Role Files (Task Files)

- **Structure**: Starts directly with a list of tasks, without `hosts` or `roles` at the top level
- **Purpose**: Defines reusable tasks for playbooks to use
- **Example**:
    ```yaml
    - name: Copy configuration file
      copy:
        src: config.conf
        dest: /etc/app/config.conf
    ```

**Additional Clue**: File location can help:
- Playbooks are often standalone files (e.g., `site.yml`)
- Role files are within role directories (e.g., `roles/myrole/tasks/main.yml`)