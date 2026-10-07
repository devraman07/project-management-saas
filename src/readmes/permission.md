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

The four organization roles are:

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

hierarchy.

Instead:

> **Role determines capability, membership determines project scope, and resource ownership/assignment determines task scope.**

Different roles therefore operate at different levels.

```text
ADMIN
└── Organization-level authority

PROJECT_MANAGER
└── Project-level authority

MEMBER
└── Assigned-task-level authority

VIEWER
└── Read-only project authority
```

---

# 3. Organization Scope

## Admin

An Admin is an **organization-level entity**.

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

The Admin is not restricted to a particular project.

However, the Admin's authority still stops at the organization boundary.

```text
Organization A
└── Admin → Full organization access

Organization B
└── ❌ No access
```

---

# 4. Project Manager Scope

A Project Manager is a **project-level entity**.

A Project Manager can only operate inside projects they manage.

Example:

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

Even though Ayan is an organization member, being a Project Manager does not give him access to unrelated projects.

A user can also be a Project Manager for projects across multiple organizations.

```text
Organization A
└── Project A → Ayan

Organization B
└── Project X → Ayan
```

Ayan can access:

```text
Organization A / Project A
Organization B / Project X
```

but nothing else.

---

# 5. Member Scope

A Member can only access projects where they are a project member.

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

Being a member of the organization does not automatically grant access to every project.

---

# 6. Viewer Scope

Viewer follows the same project visibility boundary as Member.

A Viewer can see projects they belong to and the resources inside those projects according to their read-only permissions.

```text
Viewer
└── Assigned Projects
      ├── Tasks
      ├── Members
      └── Project information
```

---

# 7. Organization-Level Permissions

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

They cannot promote someone to Admin or Project Manager, or change another Project Manager's role.

---

# 8. Project Management Permissions

| Project Action         |           Admin           |    Project Manager   |       Member      |       Viewer      |
| ---------------------- | :-----------------------: | :------------------: | :---------------: | :---------------: |
| View project           | All organization projects |   Assigned projects  | Assigned projects | Assigned projects |
| Create project         |             ✅             |           ✅          |         ❌         |         ❌         |
| Edit project           |  Any organization project | Own/managed projects |         ❌         |         ❌         |
| Change project status  |  Any organization project | Own/managed projects |         ❌         |         ❌         |
| Archive project        |  Any organization project | Own/managed projects |         ❌         |         ❌         |
| Delete project         |  Any organization project |           ❌          |         ❌         |         ❌         |
| Project settings       |  Any organization project | Own/managed projects |         ❌         |         ❌         |
| Manage project members |  Any organization project | Own/managed projects |         ❌         |         ❌         |

Permanent project deletion is an **Admin-only destructive operation**.

A Project Manager can archive their project but cannot permanently delete it.

---

# 9. Project Membership

Project membership is separate from organization membership.

A user must first belong to the organization before they can become a project member.

```text
Organization Membership
        ↓
Eligible for Project Membership
        ↓
Project Team
```

A Project Manager can manage the team of projects they manage.

### Project Manager can:

* Add an organization member to their project.
* Remove a member from their project.
* Change `MEMBER → VIEWER`.
* Change `VIEWER → MEMBER`.

### Project Manager cannot:

* Add someone who is not an organization member.
* Promote someone to Admin.
* Promote someone to Project Manager.
* Change another Project Manager's organization role.

---

# 10. Task Permission Model

Task permissions use **different scopes for different roles**.

## Admin

Admin is organization-scoped.

The Admin can view, create, edit, assign, and delete tasks across projects belonging to their organization.

However, workflow actions that depend on task assignment/ownership follow the **task assignment creator/actor rule defined below**.

---

## Project Manager

Project Manager is project-scoped.

A Project Manager can operate on tasks inside projects they manage.

They cannot operate on tasks belonging to projects they do not manage.

---

## Member

Member is assignment-scoped for task actions.

A Member can work with tasks assigned to them.

Members cannot create, assign, delete, or administratively manage tasks.

---

## Viewer

Viewer has read-only access to tasks inside their assigned projects.

---

# 11. Task Permissions Matrix

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

# 12. Critical Task Scope Rule

For Admin and Project Manager, the following actions are scoped to **tasks they assigned**, not tasks assigned to themselves:

* Change Status
* Submit for Review
* Approve
* Request Changes

Example:

```text
Admin: Raman

Task A
Assigned by: Raman
Assigned to: Sujal

Task B
Assigned by: Ayan
Assigned to: Sujal
```

Raman:

```text
Task A
├── Change Status       ✅
├── Submit Review       ✅
├── Approve             ✅
└── Request Changes     ✅

Task B
├── Change Status       ❌
├── Submit Review       ❌
├── Approve             ❌
└── Request Changes     ❌
```

The fact that Raman is the Admin does not mean he can perform these assignment-scoped workflow actions on every task.

---

# 13. Project Manager Task Scope

Example:

```text
Project A
PM: Ayan

Task 1
Assigned by: Ayan
Assigned to: Raman

Task 2
Assigned by: Raman
Assigned to: Sujal
```

Ayan can:

```text
Task 1
├── Change Status       ✅
├── Submit Review       ✅
├── Approve             ✅
└── Request Changes     ✅
```

Ayan cannot perform those actions on Task 2 because **Ayan did not assign Task 2**.

However, because Task 2 is inside Ayan's managed project, Ayan can still perform project-level task management actions such as:

```text
Edit Task       ✅
Assign Task     ✅
Delete Task     ✅
```

---

# 14. Member Task Scope

A Member can work on tasks assigned to them.

Example:

```text
Task A
Assigned to: Raman
```

Raman can:

```text
Edit task content        ✅
Change status            ✅
Submit for review        ✅
Request rework/changes   ✅
```

Raman cannot:

```text
Assign task              ❌
Approve own task         ❌
Delete task              ❌
```

---

# 15. Task Editing

Task editing should eventually be split into **field-level permissions** rather than using a single `EDIT_TASK` permission.

### Worker-editable fields

The assigned Member should be able to modify their working information, such as:

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
* Other administrative fields

Therefore:

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

# 16. Task Workflow

The task lifecycle is:

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

Then the Member works on the task again:

```text
IN_PROGRESS
    ↓
IN_REVIEW
```

---

# 17. Status Permissions

### Member

For a task assigned to them:

```text
TO_DO → IN_PROGRESS       ✅
IN_PROGRESS → IN_REVIEW   ✅
IN_REVIEW → DONE          ❌
```

### Project Manager

For a task assigned by them:

```text
IN_REVIEW → DONE           ✅
IN_REVIEW → IN_PROGRESS    ✅
```

### Admin

For a task assigned by them:

```text
IN_REVIEW → DONE           ✅
IN_REVIEW → IN_PROGRESS    ✅
```

### Viewer

```text
Change status → ❌
```

---

# 18. Review Workflow

The intended workflow is:

```text
                    CREATE
                      ↓
                    TO_DO
                      ↓
                 IN_PROGRESS
                      ↓
                  IN_REVIEW
                      │
             ┌────────┴─────────┐
             ↓                  ↓
          APPROVE         REQUEST CHANGES
             ↓                  ↓
            DONE          IN_PROGRESS
                                ↓
                            IN_REVIEW
```

The reviewer must be the appropriate Admin/Project Manager according to the task assignment rules.

---

# 19. ProjectFlow Authorization Philosophy

The system should evaluate permissions using:

```text
1. Is the user authenticated?
        ↓
2. Does the user belong to the organization?
        ↓
3. What is their organization role?
        ↓
4. Does the user belong to the project?
        ↓
5. Is the user the Project Manager of this project?
        ↓
6. Is the user the relevant task assignee/assigner?
        ↓
7. Is the requested action allowed?
        ↓
ALLOW / DENY
```

---

# 20. Examples

## Example 1 — Admin

```text
Organization A
Admin: Raman

Project A
Project B
Project C
```

Raman can:

```text
View Project A/B/C             ✅
Create tasks                   ✅
Edit tasks                     ✅
Assign tasks                   ✅
Delete tasks                   ✅

Workflow actions:
Only for tasks assigned by Raman
```

---

## Example 2 — Project Manager

```text
Organization A

Project A
PM: Ayan

Project B
PM: Raman
```

Ayan:

```text
Project A → Full PM permissions
Project B → No project access
```

---

## Example 3 — Member

```text
Project A

Task 1 → Assigned to Raman
Task 2 → Assigned to Sujal
```

Raman:

```text
Task 1 → Can work on it
Task 2 → Cannot perform assignment-scoped task actions
```

---

## Example 4 — Viewer

```text
Project A
Viewer: Debangshu
```

Debangshu can:

```text
View project       ✅
View members       ✅
View tasks         ✅
```

But:

```text
Create task        ❌
Edit task          ❌
Assign task        ❌
Change status      ❌
Submit review      ❌
Approve            ❌
Request changes    ❌
Delete             ❌
```

---

# 21. Authorization Rules to Implement

The eventual authorization layer should support checks conceptually similar to:

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
```

These should be implemented as centralized authorization rules rather than scattered role checks throughout controllers.

---

# 22. Current Permission Decisions

### Organization

* [x] Admin is organization-scoped.
* [x] Project Manager is project-scoped.
* [x] Member is project-scoped.
* [x] Viewer is project-scoped.
* [x] Admin can access every project in their organization.
* [x] PM can access only managed projects.
* [x] Member can access only assigned projects.
* [x] Viewer can access only assigned projects.
* [x] Admin manages organization settings.
* [x] PM manages settings for projects they manage.
* [x] Admin can create projects.
* [x] PM can create projects.

### Project Membership

* [x] PM can add members to managed projects.
* [x] PM can remove members from managed projects.
* [x] PM can change Member ↔ Viewer.
* [x] PM cannot promote someone to Admin.
* [x] PM cannot promote someone to Project Manager.
* [x] Only organization members can be added to projects.

### Tasks

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
* [x] Member cannot administratively edit tasks.
* [x] Admin can assign tasks.
* [x] PM can assign tasks in managed projects.
* [x] Member cannot assign tasks.
* [x] Viewer cannot assign tasks.
* [x] Admin can perform workflow actions on tasks assigned by that Admin.
* [x] PM can perform workflow actions on tasks assigned by that PM.
* [x] Member can perform workflow actions on tasks assigned to them.
* [x] Viewer cannot perform workflow actions.
* [x] Admin can delete organization tasks.
* [x] PM can delete tasks in managed projects.
* [x] Member cannot delete tasks.
* [x] Viewer cannot delete tasks.

---

# 23. Next Design Block

The next authorization work should define the remaining collaboration permissions:

```text
Comments
├── Create
├── Edit
├── Delete
├── Reply
└── Mention

Attachments
├── Upload
├── View
└── Delete

Notifications
├── View
├── Read
└── Read all

Activity
├── View
└── Audit access
```

After those are finalized, the complete permission model can be translated into:

```text
Database
    ↓
Authorization Policies
    ↓
Middleware
    ↓
Service-level Authorization
    ↓
Controllers
    ↓
Tests
```

This README should be treated as the **authorization source of truth** before implementation begins.
