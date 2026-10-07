# ProjectFlow — Permissions & Authorization

> **Status:** Design Phase
> **Purpose:** Source of truth for ProjectFlow's authorization and permission model.

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

```text
Organization A

Project A
├── Ayan
├── Raman
└── Sujal

Project B
├── Ayan
└── Debangshu
```

Raman:

```text
Project A → ✅
Project B → ❌
```

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

Permanent project deletion is an **Admin-only destructive operation**.

---

# 6. Project Membership

Project membership is separate from organization membership.

A user must first belong to the organization before they can become a project member.

```text
Organization Membership
        ↓
Project Membership
        ↓
Project Team
```

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
| **Edit Task**         | Any task in organization    | Any task in managed projects | ❌                          | ❌                          |
| **Assign Task**       | Any task in organization    | Any task in managed projects | ❌                          | ❌                          |
| **Change Status**     | Tasks assigned by Admin     | Tasks assigned by PM         | Tasks assigned to Member   | ❌                          |
| **Submit for Review** | Tasks assigned by Admin     | Tasks assigned by PM         | Tasks assigned to Member   | ❌                          |
| **Approve**           | Tasks assigned by Admin     | Tasks assigned by PM         | ❌                          | ❌                          |
| **Request Changes**   | Tasks assigned by Admin     | Tasks assigned by PM         | Tasks assigned to Member   | ❌                          |
| **Delete Task**       | Any task in organization    | Any task in managed projects | ❌                          | ❌                          |

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

Task editing will eventually use **field-level authorization** rather than one simple `EDIT_TASK` permission.

### Worker-editable fields

The assigned Member should be able to modify working information such as:

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

The detailed state-machine rules will be defined separately during the **Lifecycle & Task State Machine** phase.

---

# 12. Collaboration Permissions

Collaboration follows the user's **project access**, not task assignment.

A Member does not need to be assigned to a task to collaborate on it.

For example:

```text
Project A

Task 1 → Raman
Task 2 → Sujal
Task 3 → Ayan
```

Raman can still comment on Task 2 or Task 3 because Raman belongs to Project A.

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

Examples:

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

The exact notification lifecycle will be defined separately.

---

# 17. Activity / Audit Permissions

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

# 18. Business Event Pattern

Permission, state changes, activity, and notifications should eventually work together:

```text
                BUSINESS ACTION
                      ↓
               Authorization
                      ↓
                 State Change
                      ↓
              ┌───────┴───────┐
              ↓               ↓
        Activity Log     Notification
                              ↓
                       ┌──────┴──────┐
                       ↓             ↓
                    In-App         Email
```

Example:

```text
PM requests changes
        ↓
Authorization check
        ↓
IN_REVIEW → IN_PROGRESS
        ↓
Activity Log
        ↓
Review feedback stored
        ↓
Notification to assignee
```

---

# 19. Authorization Rules

The authorization system should eventually support centralized checks such as:

```text
isOrganizationAdmin(user, organization)

isProjectManager(user, project)

isProjectMember(user, project)

isTaskAssignee(user, task)

isTaskAssigner(user, task)

canViewTask(user, task)

canCreateTask(user, project)

canEditTask(user, task)

canAssignTask(user, task)

canChangeTaskStatus(user, task)

canSubmitTaskForReview(user, task)

canApproveTask(user, task)

canRequestTaskChanges(user, task)

canDeleteTask(user, task)

canCreateComment(user, task)

canUploadAttachment(user, task)

canMentionUser(user, project)
```

Authorization should be centralized instead of scattering role checks throughout controllers.

---

# 20. Current Decisions

## Organization

* [x] Admin is organization-scoped.
* [x] Project Manager is project-scoped.
* [x] Member is project-scoped.
* [x] Viewer is project-scoped.
* [x] Admin can access all projects in their organization.
* [x] PM can access only managed projects.
* [x] Member can access only assigned projects.
* [x] Viewer can access only assigned projects.
* [x] Admin controls organization settings.
* [x] PM controls settings for managed projects.
* [x] Admin can create projects.
* [x] PM can create projects.

## Project Membership

* [x] PM can add members to managed projects.
* [x] PM can remove members from managed projects.
* [x] PM can change Member ↔ Viewer.
* [x] PM cannot promote someone to Admin.
* [x] PM cannot promote someone to Project Manager.
* [x] Only organization members can be added to projects.

## Tasks

* [x] Admin can view all organization tasks.
* [x] PM can view tasks in managed projects.
* [x] Member can view tasks in assigned projects.
* [x] Viewer can view tasks in assigned projects.
* [x] Admin can create tasks in organization projects.
* [x] PM can create tasks in managed projects.
* [x] Member cannot create tasks.
* [x] Viewer cannot create tasks.
* [x] Admin can edit any task in their organization.
* [x] PM can edit tasks in managed projects.
* [x] Admin can assign tasks.
* [x] PM can assign tasks in managed projects.
* [x] Member cannot assign tasks.
* [x] Viewer cannot assign tasks.
* [x] Admin workflow actions are scoped to tasks assigned by that Admin.
* [x] PM workflow actions are scoped to tasks assigned by that PM.
* [x] Member workflow actions are scoped to tasks assigned to that Member.
* [x] Viewer cannot perform workflow actions.
* [x] Admin can delete organization tasks.
* [x] PM can delete tasks in managed projects.
* [x] Member cannot delete tasks.
* [x] Viewer cannot delete tasks.

## Collaboration

* [x] Collaboration follows project access.
* [x] Members can comment on tasks in their projects.
* [x] Members can reply to comments.
* [x] Users can edit their own comments.
* [x] Users can delete their own comments.
* [x] Admin can moderate comments organization-wide.
* [x] PM can moderate comments in managed projects.
* [x] Members cannot delete other users' comments.
* [x] Members can upload attachments to tasks in their projects.
* [x] Users can delete their own attachments.
* [x] Admin/PM can moderate attachments within their scope.
* [x] Users can only mention users who have access to the same project.
* [x] Notifications are generated from business events.
* [x] Activity logs record important state-changing events.

---

# 21. Next Phase — Lifecycle Rules

The permission model is **not yet the complete authorization specification**.

The next phase will define what happens when the system changes state:

```text
Organization Lifecycle
├── Member leaves organization
├── Member is removed
├── Admin leaves
├── Project Manager leaves
└── Last Admin leaves

Project Lifecycle
├── Member removed from project
├── PM removed from project
├── PM leaves project
├── Project archived
├── Project restored
└── Project deleted

Task Lifecycle
├── Assignee leaves organization
├── Assignee removed from project
├── Task creator leaves
├── Task assigner leaves
├── PM leaves project
├── Task becomes orphaned
└── Task is in review during membership changes

Review Lifecycle
├── Who can submit?
├── Who can review?
├── Who can approve?
├── Who can request changes?
├── What happens after rejection?
├── Where is review feedback stored?
└── Who receives notifications?
```

These lifecycle rules will be defined **before implementation**, so ProjectFlow does not end up with permissions that work only in the happy path.
