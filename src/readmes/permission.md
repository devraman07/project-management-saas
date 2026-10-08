# ProjectFlow — Permissions & Lifecycle Rules

> **Status:** LOCKED BASELINE
> **Purpose:** Defines authorization, project/task scope, workflow, transfers, collaboration, and lifecycle rules before implementation.

---

# 1. Authorization Model

ProjectFlow uses:

* **ADMIN** — organization-level authority
* **PROJECT_MANAGER** — project-level management authority
* **MEMBER** — project participant and task assignee
* **VIEWER** — read-only project participant

There is **no Owner role**.

### Core authorization principle

> **Role determines capability, membership determines project scope, and task assignment determines task workflow scope.**

---

# 2. Organization Scope

Users can belong to multiple organizations.

Organization membership and project membership are separate concepts.

Only organization members can be added to projects.

### Visibility

| Role            | Organization Visibility               |
| --------------- | ------------------------------------- |
| ADMIN           | All organization projects and members |
| PROJECT_MANAGER | Projects they manage                  |
| MEMBER          | Projects they belong to               |
| VIEWER          | Projects they belong to               |

A Project Manager may manage projects across multiple organizations.

---

# 3. Organization Permissions

| Permission                    | Admin |      PM |  Member |  Viewer |
| ----------------------------- | ----: | ------: | ------: | ------: |
| View organization             |   Yes | Limited | Limited | Limited |
| View all projects             |   Yes |      No |      No |      No |
| View assigned projects        |   Yes |     Yes |     Yes |     Yes |
| View all organization members |   Yes |      No |      No |      No |
| View project-team members     |   Yes |     Yes |     Yes |     Yes |
| Invite members                |   Yes |     Yes |      No |      No |
| Change Member ↔ Viewer role   |   Yes |    Yes* |      No |      No |
| Change Admin role             |   Yes |      No |      No |      No |
| Change PM role                |   Yes |      No |      No |      No |
| Organization settings         |   Yes |      No |      No |      No |
| Create project                |   Yes |     Yes |      No |      No |

* PM can change Member ↔ Viewer only within projects they manage.

PM cannot promote someone to Admin or Project Manager.

---

# 4. Project Permissions

| Project Action         |           Admin |               PM |            Member |            Viewer |
| ---------------------- | --------------: | ---------------: | ----------------: | ----------------: |
| View project           | Any org project | Managed projects | Assigned projects | Assigned projects |
| Create project         |             Yes |              Yes |                No |                No |
| Edit project           | Any org project | Managed projects |                No |                No |
| Change project status  | Any org project | Managed projects |                No |                No |
| Archive project        | Any org project | Managed projects |                No |                No |
| Delete project         | Any org project |               No |                No |                No |
| Project settings       | Any org project | Managed projects |                No |                No |
| Manage project members | Any org project | Managed projects |                No |                No |

Permanent project deletion is Admin-only.

---

# 5. Project Membership

A project member must already be a member of the organization.

Project membership determines access to project resources.

A project can contain:

* Project Manager
* Members
* Viewers

A user may belong to multiple projects and organizations.

---

# 6. Project Manager

A Project Manager:

* Manages projects assigned to them.
* Can create projects.
* Can add/remove project members.
* Can change Member ↔ Viewer within their projects.
* Can manage project settings.
* Can archive/restore projects.
* Can create and manage tasks within their projects.
* Can assign tasks.
* Can transfer active tasks.
* Can change the reviewer of an IN_REVIEW task.
* Cannot promote users to Admin or Project Manager.

---

# 7. Task Authorization Model

Tasks contain three important responsibility fields:

```text
assignedBy
assignedTo
reviewer
```

### assignedBy

The person who delegated/created the current task assignment.

### assignedTo

The person responsible for completing the task.

### reviewer

The person responsible for reviewing the task when it is IN_REVIEW.

These are separate responsibilities.

---

# 8. Task Permissions

| Task Action                |                   Admin |                    PM |                   Member |        Viewer |
| -------------------------- | ----------------------: | --------------------: | -----------------------: | ------------: |
| View task                  |           All org tasks | Managed-project tasks |            Project tasks | Project tasks |
| Create task                |         Any org project |      Managed projects |                       No |            No |
| Edit task administratively |                Any task | Managed-project tasks |                       No |            No |
| Assign task                |                Any task | Managed-project tasks |                       No |            No |
| Change workflow status     | Tasks assigned by Admin |  Tasks assigned by PM | Tasks assigned to Member |            No |
| Submit for review          | Tasks assigned by Admin |  Tasks assigned by PM | Tasks assigned to Member |            No |
| Approve                    | Tasks assigned by Admin |  Tasks assigned by PM |                       No |            No |
| Request changes            | Tasks assigned by Admin |  Tasks assigned by PM |                       No |            No |
| Delete task                |            Any org task | Managed-project tasks |                       No |            No |

### Important

For Admin/PM workflow authority:

> Scope is based on **tasks they assigned**, not tasks assigned to themselves.

For Member workflow authority:

> Scope is based on **tasks assigned to that Member**.

---

# 9. Member Task Editing

Members cannot administratively modify task ownership or permissions.

However, the current assignee may edit the working content of their assigned task.

Examples:

* Title
* Description
* Due date
* Priority
* Labels
* Checklist/subtasks
* Attachments

This must be implemented using **field-level authorization**.

Members cannot:

* Change assignee
* Change assignedBy
* Change reviewer
* Delete task
* Administratively modify task permissions

---

# 10. Task State Machine

ProjectFlow uses four task states:

```text
TO_DO
IN_PROGRESS
IN_REVIEW
DONE
```

Valid transitions:

```text
TO_DO
  ↓
IN_PROGRESS
  ↓
IN_REVIEW
  ├── APPROVE → DONE
  └── REQUEST_CHANGES → IN_PROGRESS
```

No separate `CHANGES_REQUESTED` task state exists.

---

# 11. Task Workflow Rules

### TO_DO → IN_PROGRESS

Only the current assignee can start the task.

### IN_PROGRESS → IN_REVIEW

Only the current assignee can submit the task for review.

### IN_REVIEW → DONE

Only the current reviewer can approve the task.

### IN_REVIEW → IN_PROGRESS

Only the current reviewer can request changes.

Feedback must be stored with the review.

---

# 12. Review History

Reviews are stored separately from the task.

Recommended model:

```text
task_reviews
------------
id
task_id
reviewer_id
decision
feedback
created_at
```

Decision:

```text
APPROVED
CHANGES_REQUESTED
```

Reviews are never overwritten.

Example:

```text
Review #1
CHANGES_REQUESTED
"Fix refresh-token validation."

Review #2
APPROVED
"Looks good."
```

The task stores the current state and current reviewer; `task_reviews` stores historical review decisions.

---

# 13. Reviewer Rules

A reviewer can be any appropriate member of the project team.

The reviewer does not have to be the Project Manager.

While a task is IN_REVIEW:

* The current reviewer can approve.
* The current reviewer can request changes.
* The current reviewer cannot arbitrarily change the task to another state.
* A Project Manager can reassign the reviewer.
* Reviewer reassignment does **not** change task state.

Example:

```text
Reviewer A
     ↓
Reviewer unavailable
     ↓
PM changes reviewer
     ↓
Reviewer B
     ↓
Task remains IN_REVIEW
```

Reviewer changes are recorded in activity history.

---

# 14. Task Transfer

Task transfer changes the current assignee.

Example:

```text
assignedTo = Ayan
        ↓
PM transfers task
        ↓
assignedTo = Raman
```

The historical assignment must not be destroyed.

PM/Admin can:

* View a member's active tasks.
* Transfer one active task.
* Bulk-transfer active tasks.
* Select the new assignee.

The target must have appropriate access to the project.

Completed tasks do not require transfer.

---

# 15. Task Transfer Events

A task transfer must create an activity record.

Example:

> Debangshu transferred Task #42 from Ayan to Raman.

For bulk transfers:

* Each affected task must retain transfer history.
* A bulk-level activity event may additionally be recorded.

No automatic reassignment should occur.

Explicit transfer is required.

---

# 16. Reviewer Transfer

If an IN_REVIEW task's reviewer becomes unavailable:

```text
reviewer A
    ↓
reviewer B
```

The task remains:

```text
IN_REVIEW
```

The reviewer change must be recorded in activity history.

---

# 17. Collaboration

Collaboration follows **project access**, not task assignment.

A Member can comment on any task in a project they belong to, even when they are not assigned to that task.

Viewer:

* Can view comments.
* Cannot create comments.
* Cannot reply.
* Cannot edit/delete comments.

Users can edit/delete their own comments.

Admin can moderate comments across the organization.

PM can moderate comments in projects they manage.

Members cannot delete other users' comments.

---

# 18. Attachments

Attachment visibility follows project access.

### Admin / PM

Can upload and moderate attachments within their scope.

### Member

Can upload attachments to projects they belong to.

Users can delete their own attachments.

Admin/PM can moderate attachments within their scope.

### Viewer

Read-only.

---

# 19. Mentions

Users can only mention people who have access to the same project.

Flow:

```text
Comment created
      ↓
Extract mentions
      ↓
Validate project access
      ↓
Create mention
      ↓
Create notification
```

---

# 20. Notifications

Notifications are user-facing consequences of business events.

Examples:

```text
TASK_ASSIGNED
TASK_REASSIGNED
TASK_SUBMITTED_FOR_REVIEW
TASK_APPROVED
TASK_CHANGES_REQUESTED
TASK_REVIEWER_CHANGED
COMMENT_CREATED
COMMENT_REPLIED
USER_MENTIONED
PROJECT_MEMBER_ADDED
PROJECT_MEMBER_REMOVED
```

Notifications should not replace historical activity.

---

# 21. Activity / Audit Log

Activity is the permanent historical record.

Examples:

```text
Raman assigned Task #42 to Ayan.

Ayan submitted Task #42 for review.

Sujal requested changes on Task #42.

Sujal approved Task #42.

Ayan transferred Task #42 to Raman.

Raman changed reviewer from Sujal to Debangshu.

Ayan transferred Project A to Raman.
```

Activity records must preserve the identity of the actor.

Historical activity must never be rewritten because responsibility changes.

---

# 22. Business Event Pattern

Business operations should follow:

```text
Authorization
      ↓
State Change
      ↓
Activity
      ↓
Notification
      ↓
Optional Email
```

The core database state change must remain authoritative.

---

# 23. Lifecycle Principle

> **No active responsibility may become orphaned because of a membership or role change.**

Before removing or transferring a person, check their active responsibilities.

---

# 24. Responsibilities That Block Exit

| Responsibility                      | Blocks Exit |
| ----------------------------------- | ----------: |
| TO_DO task assigned to user         |         Yes |
| IN_PROGRESS task assigned to user   |         Yes |
| IN_REVIEW task assigned to user     |         Yes |
| DONE task assigned to user          |          No |
| PM of active project                |         Yes |
| PM of archived project              |         Yes |
| Reviewer of IN_REVIEW task          |         Yes |
| Pending invitations created by user |          No |
| Historical comments                 |          No |
| Historical attachments              |          No |
| Historical activity                 |          No |

---

# 25. Member Leaving Organization

A user cannot leave the organization while they have active responsibilities.

Before leaving:

1. Active tasks must be transferred/resolved.
2. Active reviewer responsibilities must be transferred.
3. Project Manager responsibilities must be transferred.
4. Project memberships are removed.
5. Historical data remains.

Pending invitations created by the user are not deleted.

---

# 26. Member Removal

Removing a member follows the same responsibility checks as voluntary exit.

A user with active responsibilities cannot simply be removed.

Responsibilities must first be transferred/resolved.

Historical data remains attributed to the original user.

---

# 27. Member Removed From Project

A member cannot be removed from a project while they have active assigned tasks in that project.

Before removal:

```text
Find active tasks
      ↓
Transfer tasks
      ↓
Verify no active responsibilities
      ↓
Remove project membership
```

No automatic reassignment.

---

# 28. Task Assignee Losing Project Access

A task assignee cannot lose project access while active tasks remain assigned to them.

Before removal/exit:

```text
Find active tasks
      ↓
Explicitly transfer tasks
      ↓
Verify responsibilities cleared
      ↓
Remove access
```

---

# 29. Project Manager Leaving

A Project Manager cannot leave while they manage a project, including an archived project.

They must first transfer the project.

After transfer:

```text
Old PM → Member
New PM → Project Manager
```

The project itself does not move.

All project resources remain attached to the same project:

* Tasks
* Members
* Comments
* Attachments
* Invitations
* Notifications
* Activity
* History

Only current Project Manager responsibility changes.

Historical actions remain attributed to the old PM.

---

# 30. Project Transfer

Project transfer is a responsibility transfer.

Example:

```text
Ayan = PM
Raman = Member

Ayan transfers Project A to Raman

Raman = PM
Ayan = Member
```

No project resources are physically moved.

The transfer must be atomic.

Activity:

> Ayan transferred Project A to Raman.

The new PM receives the project-management scope previously held by the old PM.

---

# 31. Admin Leaving

An Admin cannot simply leave an organization.

Administration must first be transferred to another appropriate user.

The organization must never have zero Admins.

Admin transfer must be atomic.

Historical Admin actions remain attributed to the previous Admin.

---

# 32. Organization Deletion

Organization deletion is separate from leaving.

An organization cannot be deleted while outstanding billing obligations remain.

Billing must be cleared before organization deletion.

Data retention/deletion policy must be finalized before implementing permanent organization deletion.

---

# 33. Project Archive

Archive means:

> **Frozen, not deleted.**

Archived projects retain:

* Tasks
* Comments
* Attachments
* Members
* Activity
* Notifications
* History

Archive does not destroy data.

Restore must be supported.

The exact list of operations blocked while archived must be enforced by the project state machine.

---

# 34. Historical Data Principle

Responsibility transfer changes **current responsibility**, not historical identity.

Never rewrite historical records to make them appear as though the new user performed the original action.

Example:

```text
Ayan created project
Ayan assigned task
Ayan requested changes
Ayan transferred project to Raman
```

After transfer:

```text
Raman manages project
```

But history remains:

```text
Ayan created project
Ayan assigned task
Ayan requested changes
Ayan transferred project
```

---

# 35. Transfer History

Transfers must be auditable.

At minimum, record:

### Project transfer

```text
actor
project
previous_pm
new_pm
timestamp
```

### Task transfer

```text
actor
task
previous_assignee
new_assignee
timestamp
```

### Reviewer transfer

```text
actor
task
previous_reviewer
new_reviewer
timestamp
```

---

# 36. Core Lifecycle Invariant

Before removing access, changing organizational responsibility, or allowing a user to leave:

```text
Check active responsibilities
        ↓
Transfer / resolve responsibilities
        ↓
Verify no blocking responsibilities remain
        ↓
Change membership / role / access
```

Never silently orphan active work.

---

# 37. Locked Task Workflow

The final task workflow is:

```text
TO_DO
  │
  │ assignee starts
  ▼
IN_PROGRESS
  │
  │ assignee submits
  ▼
IN_REVIEW
  │
  ├── reviewer approves
  │       ▼
  │      DONE
  │
  └── reviewer requests changes
          ▼
      IN_PROGRESS
```

Review feedback is persisted in `task_reviews`.

Review history is immutable.

---

# 38. Initial Business Events

The initial event vocabulary should include:

```text
TASK_CREATED
TASK_ASSIGNED
TASK_REASSIGNED
TASK_STATUS_CHANGED
TASK_SUBMITTED_FOR_REVIEW
TASK_APPROVED
TASK_CHANGES_REQUESTED
TASK_REVIEWER_CHANGED

PROJECT_TRANSFERRED
PROJECT_MEMBER_ADDED
PROJECT_MEMBER_REMOVED

COMMENT_CREATED
COMMENT_REPLIED
COMMENT_UPDATED
COMMENT_DELETED

ATTACHMENT_ADDED
ATTACHMENT_DELETED

USER_MENTIONED
```

The exact event implementation can use an internal event/service layer rather than requiring a full distributed event bus.

---

# 39. Implementation Principle

Do not implement authorization as scattered role checks such as:

```text
if (user.role === "ADMIN")
```

throughout controllers.

Authorization should be centralized around:

```text
Role
+
Organization membership
+
Project membership
+
Project ownership/management scope
+
Task assignment
+
Reviewer responsibility
+
Resource state
```

Controllers should remain thin.

Business authorization and lifecycle rules belong in the service/domain layer.

---

# 40. Production-Grade Requirement

ProjectFlow is not production-grade merely because the CRUD endpoints work.

Before calling V1 complete, the system must have:

* Correct authorization
* Correct lifecycle enforcement
* Transaction-safe transfers
* Valid state transitions
* Field-level authorization
* Input validation
* Secure authentication
* Database constraints
* Consistent error handling
* Idempotency where required
* Transaction boundaries
* Audit/activity history
* Notifications
* Background jobs
* Rate limiting
* Logging
* Observability
* Tests
* API documentation
* Deployment
* CI/CD
* Backups/recovery
* Security hardening
* Frontend authorization-aware UX
* Production environment configuration

---

# 41. Definition of Done

A feature is not considered complete when its endpoint works.

A feature is complete when:

```text
Business rule defined
        ↓
Database model correct
        ↓
Authorization enforced
        ↓
Validation enforced
        ↓
State transitions enforced
        ↓
Transaction boundaries correct
        ↓
Activity recorded
        ↓
Notification generated where required
        ↓
Error cases handled
        ↓
Tests written
        ↓
API documented
        ↓
Frontend integrated
        ↓
Production behavior verified
```

---

# 42. Current Design Status

### LOCKED

* Roles
* Organization/project scope
* Project permissions
* Task permissions
* Task assignment model
* Reviewer model
* Task state machine
* Review behavior
* Review history
* Task transfer
* Reviewer transfer
* Project transfer
* Exit/removal blocking
* Historical data principle
* Collaboration permissions
* Activity vs notification separation

### STILL REQUIRES IMPLEMENTATION/VERIFICATION

* Exact database schema
* Existing-code authorization mapping
* Archived-project blocked operations
* Notification matrix
* Email behavior
* Exact transaction boundaries
* Idempotency rules
* Error-code catalog
* Security audit
* API contract audit
* Production infrastructure
* Frontend permission/UX behavior
* Backup/recovery strategy
* Observability
* Automated test coverage

---

# 43. Design Principle

> **Freeze the rules first. Then make the code conform to the rules.**

Do not allow existing implementation shortcuts to redefine the product's business rules.
