# ProjectFlow — Permissions & Lifecycle Rules

> **Status:** Design Phase
> **Purpose:** Source of truth for ProjectFlow authorization, permissions, collaboration access, and lifecycle rules.

---

# 1. Authorization Model

ProjectFlow uses multiple levels of authorization:

```text
Organization Role
       ↓
Project Membership
       ↓
Resource Scope
       ↓
Action Permission
       ↓
Lifecycle Rules
```

### Organization Roles

* `ADMIN`
* `PROJECT_MANAGER`
* `MEMBER`
* `VIEWER`

There is **no Owner role**.

---

# 2. Core Authorization Principle

ProjectFlow does not use a simple:

```text
ADMIN > PROJECT_MANAGER > MEMBER > VIEWER
```

Instead:

> **Role determines capability, membership determines project scope, and task assignment determines task workflow scope.**

```text
ADMIN
└── Organization-level authority

PROJECT_MANAGER
└── Project-level authority

MEMBER
└── Project + assigned-task authority

VIEWER
└── Read-only project authority
```

---

# 3. Organization Scope

## Admin

Admin is an **organization-level entity**.

An Admin can operate across the entire organization.

```text
Organization A
├── Project A
├── Project B
├── Project C
└── Project D

Admin
└── Access to all projects
```

The Admin cannot access another organization unless they are also a member of that organization.

---

## Project Manager

Project Manager is a **project-level entity**.

A Project Manager can only operate inside projects they manage.

```text
Organization A

Project A → Ayan is PM
Project B → Raman is PM
Project C → Rahul is PM
```

Ayan:

```text
Project A → ✅
Project B → ❌
Project C → ❌
```

A user can be a Project Manager for projects across multiple organizations.

---

## Member

A Member can access only projects where they are a project member.

Being an organization member does **not** automatically grant access to every project.

---

## Viewer

Viewer follows the same project visibility boundary as Member.

Viewers can access projects they belong to but have read-only permissions.

---

# 4. Organization-Level Permissions

| Permission                    | Admin | Project Manager |  Member |  Viewer |
| ----------------------------- | :---: | :-------------: | :-----: | :-----: |
| View organization             |   ✅   |     Limited     | Limited | Limited |
| View all projects             |   ✅   |        ❌        |    ❌    |    ❌    |
| View assigned projects        |   ✅   |        ✅        |    ✅    |    ✅    |
| View all organization members |   ✅   |        ❌        |    ❌    |    ❌    |
| View project-team members     |   ✅   |        ✅        |    ✅    |    ✅    |
| Invite members                |   ✅   |        ✅        |    ❌    |    ❌    |
| Change member role            |   ✅   |        ✅*       |    ❌    |    ❌    |
| Change Admin role             |   ✅   |        ❌        |    ❌    |    ❌    |
| Change Project Manager role   |   ✅   |        ❌        |    ❌    |    ❌    |
| Organization settings         |   ✅   |        ❌        |    ❌    |    ❌    |
| Create project                |   ✅   |        ✅        |    ❌    |    ❌    |

`*` Project Managers can change `MEMBER ↔ VIEWER` within projects they manage.

They cannot promote someone to Admin or Project Manager or change another Project Manager's role.

---

# 5. Project Management Permissions

| Project Action         |           Admin           |  Project Manager |       Member      |       Viewer      |
| ---------------------- | :-----------------------: | :--------------: | :---------------: | :---------------: |
| View project           | All organization projects | Managed projects | Assigned projects | Assigned projects |
| Create project         |             ✅             |         ✅        |         ❌         |         ❌         |
| Edit project           |  Any organization project | Managed projects |         ❌         |         ❌         |
| Change project status  |  Any organization project | Managed projects |         ❌         |         ❌         |
| Archive project        |  Any organization project | Managed projects |         ❌         |         ❌         |
| Delete project         |  Any organization project |         ❌        |         ❌         |         ❌         |
| Project settings       |  Any organization project | Managed projects |         ❌         |         ❌         |
| Manage project members |  Any organization project | Managed projects |         ❌         |         ❌         |

### Project deletion

Permanent project deletion is an **Admin-only destructive operation**.

A Project Manager can archive a project but cannot permanently delete it.

---

# 6. Project Membership

Project membership is separate from organization membership.

```text
Organization Membership
        ↓
Project Membership
        ↓
Project Team
```

A user must first belong to the organization before they can become a project member.

### Project Manager can:

* Add organization members to their projects.
* Remove members from their projects.
* Change `MEMBER → VIEWER`.
* Change `VIEWER → MEMBER`.

### Project Manager cannot:

* Add someone who is not an organization member.
* Promote someone to Admin.
* Promote someone to Project Manager.
* Change another Project Manager's organization role.

---

# 7. Task Permission Model

Task permissions use different scopes for different roles.

### Admin

Admin is organization-scoped.

Admin can view, create, edit, assign, and delete tasks across projects belonging to their organization.

Workflow actions are additionally restricted by **who assigned the task**.

### Project Manager

Project Manager is project-scoped.

A PM can operate on tasks inside projects they manage.

Workflow actions are additionally restricted by **tasks assigned by that PM**.

### Member

Member has project visibility but task workflow authority only for tasks **assigned to them**.

### Viewer

Viewer has read-only task access inside their assigned projects.

---

# 8. Task Permissions Matrix

| Task Action           | Admin                       | Project Manager              | Member                     | Viewer                     |
| --------------------- | --------------------------- | ---------------------------- | -------------------------- | -------------------------- |
| **View Task**         | All tasks in organization   | Tasks in managed projects    | Tasks in assigned projects | Tasks in assigned projects |
| **Create Task**       | Any project in organization | Managed projects             | ❌                          | ❌                          |
| **Edit Task**         | Any task in organization    | Any task in managed projects | ❌*                         | ❌                          |
| **Assign Task**       | Any task in organization    | Any task in managed projects | ❌                          | ❌                          |
| **Change Status**     | Tasks assigned by Admin     | Tasks assigned by PM         | Tasks assigned to Member   | ❌                          |
| **Submit for Review** | Tasks assigned by Admin     | Tasks assigned by PM         | Tasks assigned to Member   | ❌                          |
| **Approve**           | Tasks assigned by Admin     | Tasks assigned by PM         | ❌                          | ❌                          |
| **Request Changes**   | Tasks assigned by Admin     | Tasks assigned by PM         | Tasks assigned to Member   | ❌                          |
| **Delete Task**       | Any task in organization    | Any task in managed projects | ❌                          | ❌                          |

`*` Members can modify working information on their assigned tasks according to the field-level rules below.

---

# 9. Task Assignment Scope

There is an important distinction between:

* **Assigned by** → the person who delegated/assigned the task.
* **Assigned to** → the person responsible for doing the task.

### Admin / Project Manager

The following workflow actions use **Assigned By**:

* Change Status
* Submit for Review
* Approve
* Request Changes

Example:

```text
Task A

Assigned by: Raman
Assigned to: Sujal
```

Raman can perform the appropriate workflow actions on Task A.

---

### Member

Member workflow actions use **Assigned To**.

```text
Task A

Assigned by: Ayan
Assigned to: Raman
```

Raman can:

```text
Change Status       ✅
Submit for Review   ✅
Request Changes     ✅
Approve             ❌
```

---

# 10. Task Editing

Task editing should eventually use **field-level authorization** rather than one simple `EDIT_TASK` permission.

### Worker-editable fields

An assigned Member can modify working information such as:

* Title
* Description
* Due date
* Priority
* Labels
* Checklist/subtasks
* Attachments

### Management fields

Management fields remain controlled by Admin/Project Manager, such as:

* Assignee
* Assignment
* Project
* Administrative fields

Example:

```text
Member
└── Assigned Task
    ├── Edit title             ✅
    ├── Edit description       ✅
    ├── Change deadline        ✅
    ├── Change priority        ✅
    ├── Manage checklist       ✅
    ├── Add attachments        ✅
    ├── Change assignee        ❌
    └── Delete task            ❌
```

---

# 11. Task Workflow

The planned task lifecycle is:

```text
TO_DO
  ↓
IN_PROGRESS
  ↓
IN_REVIEW
  ↓
DONE
```

If changes are requested:

```text
IN_REVIEW
    ↓
REQUEST CHANGES
    ↓
IN_PROGRESS
```

The detailed state-machine rules will be finalized separately.

---

# 12. Collaboration Permissions

Collaboration follows **project access**, not task assignment.

A Member does not need to be assigned to a task to collaborate on it.

Example:

```text
Project A

Task 1 → Raman
Task 2 → Sujal
Task 3 → Ayan
```

Raman can still collaborate on Task 2 or Task 3 because Raman belongs to Project A.

---

# 13. Comment Permissions

| Comment Action          |     Admin    |  Project Manager |       Member      |       Viewer      |
| ----------------------- | :----------: | :--------------: | :---------------: | :---------------: |
| View comments           | Organization | Managed projects | Assigned projects | Assigned projects |
| Create comment          | Organization | Managed projects | Assigned projects |         ❌         |
| Reply to comment        | Organization | Managed projects | Assigned projects |         ❌         |
| Edit own comment        |       ✅      |         ✅        |         ✅         |         ❌         |
| Delete own comment      |       ✅      |         ✅        |         ✅         |         ❌         |
| Delete others' comments |       ✅      | Managed projects |         ❌         |         ❌         |

### Comment rule

Members can comment on any task inside a project they belong to, even if the task is assigned to someone else.

---

# 14. Attachment Permissions

| Attachment Action         |     Admin    |  Project Manager |       Member      |       Viewer      |
| ------------------------- | :----------: | :--------------: | :---------------: | :---------------: |
| View attachment           | Organization | Managed projects | Assigned projects | Assigned projects |
| Upload attachment         | Organization | Managed projects | Assigned projects |         ❌         |
| Delete own attachment     |       ✅      |         ✅        |         ✅         |         ❌         |
| Delete others' attachment |       ✅      | Managed projects |         ❌         |         ❌         |

Attachments follow the access boundary of their parent task/project.

---

# 15. Mention Permissions

Users can mention another user only when the mentioned user has access to the same project.

```text
Create Comment
      ↓
Extract @mentions
      ↓
Is mentioned user an organization member?
      ↓
Is mentioned user a project member?
      ↓
YES
      ↓
Create Mention
      ↓
Create Notification
```

A user who cannot access the project should not be mentionable.

This prevents accidental information leakage.

---

# 16. Notification Permissions

Notifications are generated from business events.

Examples include:

```text
TASK_ASSIGNED
TASK_STATUS_CHANGED
TASK_SUBMITTED_FOR_REVIEW
TASK_APPROVED
TASK_CHANGES_REQUESTED

COMMENT_CREATED
COMMENT_REPLIED
USER_MENTIONED

PROJECT_MEMBER_ADDED
PROJECT_MEMBER_REMOVED
```

Notifications may eventually be delivered through:

* In-app notifications
* Email notifications

The exact notification lifecycle will be finalized separately.

---

# 17. Activity / Audit

Activity logs are different from notifications.

### Notification

```text
"Raman assigned you Task #123."
```

### Activity

```text
"Raman assigned Task #123 to Sujal."
```

Notifications are user-facing alerts.

Activity logs are historical/audit records.

Important events should create activity records, including:

```text
Project created
Project archived
Project member added
Project member removed
Role changed

Task created
Task assigned
Task reassigned
Task status changed
Task submitted for review
Task approved
Changes requested
Task deleted

Comment created
Comment edited
Comment deleted
Attachment uploaded
Attachment deleted
Mention created
```

---

# 18. Lifecycle Principles

The lifecycle model follows this core principle:

> **No active responsibility may become orphaned because of a membership or role change.**

Historical data is preserved.

Current responsibility must be explicitly transferred before access is removed.

---

# 19. Member Leaving Organization

A member cannot simply leave if they still have active responsibilities.

Before leaving, active responsibilities must be resolved through transfer/unassignment according to the lifecycle rules.

Historical data remains.

The following do **not** prevent leaving:

* Completed tasks
* Historical comments
* Historical attachments
* Historical activity
* Pending invitations created by the user

Pending invitations are **not automatically deleted** when the creator leaves.

---

# 20. Active Responsibilities

The following responsibilities currently block a user's exit:

| Responsibility                           | Blocks Exit |
| ---------------------------------------- | :---------: |
| `TO_DO` task assigned to user            |      ✅      |
| `IN_PROGRESS` task assigned to user      |      ✅      |
| `IN_REVIEW` task assigned to user        |      ✅      |
| `DONE` task assigned to user             |      ❌      |
| Project Manager of project               |      ✅      |
| Project Manager of archived project      |      ✅      |
| Assigned reviewer of an `IN_REVIEW` task |      ✅      |
| Pending invitation created by user       |      ❌      |
| Historical comments                      |      ❌      |
| Historical attachments                   |      ❌      |
| Historical activity                      |      ❌      |

---

# 21. Member Removal

Before removing a member, ProjectFlow must check their active responsibilities.

Example:

```text
Remove Member
      ↓
Check active tasks
      ↓
Active responsibilities?
      ↓
YES
      ↓
Transfer responsibilities
      ↓
Re-check
      ↓
No active responsibilities
      ↓
Remove member
```

The system should provide explicit options for handling their active tasks/projects before removal.

---

# 22. Member Removed From Project

A member cannot simply be removed from a project while they still have active task responsibilities in that project.

Before removal:

```text
Member
   ↓
Has active tasks?
   ↓
YES
   ↓
Transfer tasks to another project member
   ↓
No active tasks
   ↓
Remove project membership
```

Historical activity remains unchanged.

---

# 23. Project Manager Leaving

A Project Manager cannot leave while they are still responsible for a project.

Before leaving:

```text
Current Project Manager
        ↓
Transfer Project
        ↓
New Project Manager
        ↓
Project responsibility transferred
        ↓
Old PM can leave
```

The transfer preserves:

* Project
* Tasks
* Project members
* Comments
* Attachments
* Invitations
* Notifications
* Activity history

Historical actions remain attributed to the original Project Manager.

Example:

```text
Ayan created Project A
Ayan assigned Task #1
Ayan requested changes
Ayan transferred Project A → Raman

Raman became Project Manager
Raman assigned Task #10
```

History is never rewritten.

---

# 24. Project Transfer

Project transfer is an explicit lifecycle operation.

```text
TRANSFER PROJECT
       ↓
Select new Project Manager
       ↓
Transfer project management responsibility
       ↓
Preserve project data
       ↓
Preserve historical activity
       ↓
Old PM can leave
```

The exact atomic transaction and transfer mechanics will be designed separately.

---

# 25. Admin Leaving Organization

An Admin cannot simply leave an organization.

Before leaving:

```text
Admin
 ↓
Transfer Administration
 ↓
Another member becomes Admin
 ↓
Old Admin loses Admin role
 ↓
Old Admin can leave
```

The organization must never be left without an Admin.

Historical actions performed by the previous Admin remain attributed to that user.

---

# 26. Organization Deletion

Organization deletion is a controlled business operation.

Before deletion:

```text
Admin requests deletion
        ↓
Check outstanding billing
        ↓
Outstanding bills?
     /          \
   YES           NO
    ↓             ↓
 BLOCK         Continue
```

An organization cannot be deleted while outstanding bills remain unresolved.

Organization deletion must therefore be treated separately from simply deleting an organization row from PostgreSQL.

The exact data-retention/deletion policy remains to be finalized.

---

# 27. Project Archive

Archive means:

> **Frozen project, not deleted project.**

```text
ACTIVE
  ↓
ARCHIVED
```

Archived projects retain their historical data.

Expected retained data includes:

* Tasks
* Comments
* Attachments
* Members
* Activity
* Notifications
* History

The exact set of blocked operations while archived will be finalized during the state-machine phase.

A project can eventually be restored:

```text
ARCHIVED
    ↓
RESTORE
    ↓
ACTIVE
```

---

# 28. Task Assignee Leaving / Losing Project Access

A user should **not be allowed to lose project access while they still have active tasks assigned to them**.

Before project removal or organization exit:

```text
User
 ↓
Check active assigned tasks
 ↓
Active tasks?
 ↓
YES
 ↓
Transfer tasks to another person
 ↓
No active tasks
 ↓
Allow access removal / exit
```

This prevents tasks from becoming orphaned.

---

# 29. Task Assigner / Project Manager Leaving

A Project Manager who has assigned tasks does not need those historical assignments rewritten.

Instead, the PM must first transfer the project:

```text
Old PM
   ↓
Transfer Project
   ↓
New PM
   ↓
Project + current responsibilities transfer
   ↓
Old PM leaves
```

Historical assignment records remain unchanged.

Example:

```text
Task #123

Assigned by: Ayan
Assigned to: Sujal

Ayan later transfers Project A → Raman
```

The historical record remains:

```text
Assigned by: Ayan
```

It does not become:

```text
Assigned by: Raman
```

---

# 30. Historical Data Principle

ProjectFlow must distinguish between:

### Historical identity

Who performed an action?

```text
actor = Ayan
```

### Current responsibility

Who is responsible now?

```text
currentProjectManager = Raman
```

These must never be confused.

Transfers should change **current responsibility**, not rewrite historical records.

---

# 31. Lifecycle Invariant

ProjectFlow should enforce:

> **No active project, task, review, or management responsibility may become orphaned because a user leaves, is removed, or changes role.**

The system should use a **pre-exit responsibility check**.

```text
User requests exit/removal
          ↓
Check responsibilities
          ↓
┌─────────────────────┐
│ Active responsibility│
└──────────┬──────────┘
           ↓
        Found?
       /       \
     YES        NO
      ↓          ↓
   BLOCK       ALLOW
      ↓
Transfer / resolve
      ↓
Re-check
      ↓
ALLOW
```

---

# 32. Still To Define

The following are intentionally **not finalized yet**:

### Transfer Mechanics

* Exact Project Transfer workflow
* Exact Task Transfer workflow
* Bulk task transfer
* Transfer validation
* Transfer confirmation
* Transaction boundaries
* What happens if a transfer partially fails

### Task State Machine

* Exact allowed transitions
* Who can perform each transition
* Review assignment
* Review failure
* Review feedback
* Reopening rules
* Whether `CHANGES_REQUESTED` is a state or review result

### Lifecycle Notifications

* Who gets notified after transfers
* Who gets notified after removal
* Who gets notified when tasks are transferred
* Review notifications
* Project transfer notifications

### Billing / Deletion

* Billing states
* Grace period
* Organization deletion workflow
* Data retention
* Final hard deletion policy

---

# 33. Design Principle

The current ProjectFlow lifecycle philosophy is:

```text
Permissions
    ↓
Determine who can act

Lifecycle
    ↓
Determine what happens when state changes

Transfer
    ↓
Move current responsibility

History
    ↓
Preserve what happened

Notifications
    ↓
Tell affected users
```

The system should **never solve lifecycle problems by silently deleting or rewriting historical data**.

---

# 34. Next Phase

The next phase is:

## Transfer Operations + Task State Machine

We will define:

```text
Transfer Project
Transfer Tasks
Transfer Review Responsibility
Transfer Administration
```

Then formally define:

```text
TO_DO
   ↓
IN_PROGRESS
   ↓
IN_REVIEW
   ↓
DONE

IN_REVIEW
   ↓
REQUEST CHANGES
   ↓
IN_PROGRESS
```

including:

* Who can transition each state
* Review assignment
* Review feedback
* Failed review
* Notifications
* Activity events
* Lifecycle interactions
* Transaction boundaries
