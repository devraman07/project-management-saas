# ProjectFlow — Version 1

## Current System, Existing Capabilities & Workflow Problems

> **Status:** Current-state audit
> **Purpose:** Establish a baseline of what ProjectFlow currently has before redesigning permissions, project membership, lifecycle rules, and task workflow.
>
> **Important:** This document describes the **current implementation and known problems**. It does not yet define the final permission model or workflow. Those will be designed in the next phase.

---

# 1. What ProjectFlow Currently Is

ProjectFlow is currently a backend-first project management system built as a **modular monolith**.

The current architecture follows:

```text
Client
  ↓
Express Routes
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
PostgreSQL
```

Background processing is handled separately through:

```text
Service
  ↓
BullMQ
  ↓
Redis
  ↓
Worker
```

The system currently uses:

* Node.js
* Express.js
* PostgreSQL
* Drizzle ORM
* Redis
* BullMQ
* Cloudinary
* JWT authentication
* Pino logging
* Modular feature-based architecture
* Repository-Service-Controller structure

The architecture is organized around features such as authentication, users, organizations, memberships, invitations, projects, tasks, comments, attachments and notifications.

---

# 2. Current Feature Set

ProjectFlow currently contains backend functionality for:

```text
Authentication
Users
Organizations
Memberships
Invitations
Projects
Tasks
Comments
Attachments
Mentions
Notifications
Activity Logs
Background Jobs
```

The API already exposes endpoints across these areas.
The important distinction is:

> **The individual modules exist, but the complete product workflow connecting them is incomplete.**

---

# 3. Current Account Workflow

## Registration

A new user can create an account.

Current registration information includes:

```text
Name
Username
Email
Password
Image
```

After registration, the user is expected to be authenticated and eventually enter the dashboard.

### Current product gap

There is currently no complete frontend experience defining what a brand-new user sees after registration.

The desired future experience is:

```text
Register
   ↓
Login / authenticated session
   ↓
Dashboard
   ↓
No workspace
   ↓
Create Workspace
```

---

# 4. Current Login Workflow

The current login flow:

```text
Login
  ↓
Find user by email
  ↓
Validate password
  ↓
Create access token
  ↓
Create refresh token
  ↓
Hash refresh token
  ↓
Store refresh token
  ↓
Return authenticated user/session information
```

The authentication architecture supports access and refresh tokens, refresh-token storage, rotation and revocation.

## Current gap

Login does not currently establish a clear concept of:

```text
Current Workspace
```

A user can belong to multiple organizations, but the system does not currently have a clearly defined active/current organization state.

The user can retrieve organization/membership information, but:

> **There is no finalized "currently active workspace" concept.**

---

# 5. Current Organization Model

ProjectFlow currently supports organizations/workspaces.

An organization contains:

```text
Members
Projects
Invitations
Activity
Notifications
```

The database model is organization-centric and uses memberships to associate users with organizations.

---

# 6. Current Organization Creation

An authenticated user can currently create an organization.

The current workflow is approximately:

```text
Authenticated User
      ↓
Create Organization
      ↓
Organization Created
      ↓
Membership Created
      ↓
Creator becomes Owner
      ↓
Activity Logged
```

The creator currently receives:

```text
Role = Owner
```

## Problem

The desired product does not use a separate Owner role.

The desired organization roles are:

```text
Admin
Project Manager
Member
Viewer
```

Therefore the current:

```text
Owner
```

concept must eventually be redesigned/replaced.

---

# 7. Current Organization Roles

The current database enum supports:

```text
Owner
Admin
Project Manager
Member
Viewer
```

The architecture was designed around organization membership and role-based authorization.

However, the actual permission system does not consistently implement the intended role hierarchy.

---

# 8. Current Invitation Workflow

The current invitation process is:

```text
Admin / authorized organization member
        ↓
Create invitation
        ↓
Invitation record created
        ↓
Invitation token generated
        ↓
Email job queued
        ↓
Invitation email sent
        ↓
User receives invitation link
        ↓
User accepts invitation
        ↓
Invitation token validated
        ↓
Membership created
        ↓
Invitation status updated
```

The invitation system supports roles assigned during invitation. The database model contains invitation status and expiration concepts.

The API exposes invitation creation, lookup and acceptance endpoints.

---

# 9. Invitation Problems

The current invitation workflow has several unresolved product questions.

## 9.1 New user invitation

The current implementation primarily checks whether the invited email already exists as a user.

The desired workflow needs to clearly support:

```text
Invited email does not have account
        ↓
Create account / login
        ↓
Accept invitation
        ↓
Become organization member
```

This complete UX has not yet been finalized.

---

## 9.2 Invitation role validation

The invitation accepts a role from the request.

The current implementation does not sufficiently validate whether the requested role is an allowed/appropriate organization role.

This must eventually be explicitly validated.

---

## 9.3 Invitation permissions

The current middleware primarily allows:

```text
Owner
Admin
```

to manage invitations.

Project Manager currently does not have the intended invitation/member-management capabilities.

This needs to be redesigned according to the final organization permission model.

---

# 10. Current Organization Member Management

The API currently supports:

```text
Get members
Add member
Change member role
Remove member
```

The API exposes organization membership operations through membership endpoints.

However, the current authorization model is heavily centered around:

```text
Organization Owner
Admin
```

rather than the desired:

```text
Admin
Project Manager
Member
Viewer
```

---

# 11. Current Project Model

Projects currently belong to organizations.

The current project model contains concepts such as:

```text
Project ID
Organization ID
Project Manager / Manager
Created By
Status
Archive state
```

The current project statuses include:

```text
Planning
Active
On Hold
Completed
```

Projects are organization-scoped.

---

# 12. Current Project Creation

Currently:

```text
Authenticated organization member
        ↓
Authorization middleware
        ↓
Owner/Admin allowed
        ↓
Create Project
```

The current implementation does not allow Project Managers to create projects.

This differs from the desired product direction where Project Managers are intended to manage project execution.

The final project-creation permission will be decided later.

---

# 13. Major Project Architecture Problem

## Project Membership Does Not Currently Exist

This is one of the biggest gaps discovered during the audit.

Currently the relationship is effectively:

```text
Organization
     ↓
Organization Members
     ↓
Projects
```

A member of the organization can currently access projects belonging to that organization.

The desired architecture is:

```text
Organization
     ↓
Organization Members
     ↓
Projects
     ↓
Project Members
```

Therefore we need two distinct concepts:

```text
Organization Membership
        ↓
Who is this person in the organization?

Project Membership
        ↓
Which projects can this person access?
```

---

# 14. Current Project Access Problem

Currently:

> Organization membership effectively provides access to organization projects.

This does not match the intended product.

Example:

```text
Organization
│
├── Project A
├── Project B
├── Project C
└── Project D
```

A team may have:

```text
Raman
Ayan
Sujal
Debangshu
Rahul
Priya
```

But Project A might only require:

```text
Raman
Ayan
Sujal
```

The current system does not have the project membership layer required to model this properly.

---

# 15. Current Project Roles

Projects currently do not have their own membership roles.

The current role system exists primarily at the organization membership level.

The desired product requires us to determine:

```text
What role does someone have inside a project?
```

This is intentionally unresolved and will be designed in the next phase.

---

# 16. Current Task Model

Tasks currently contain:

```text
ID
Project ID
Title
Description
Created By
Assigned To
Status
Priority
Due Date
Is Archived
Created At
Updated At
```

The current task priorities are:

```text
Low
Medium
High
Urgent
```

The current task statuses are:

```text
To Do
In Progress
Done
Blocked
```

Tasks belong to projects.

---

# 17. Current Task Creation

The current task creation endpoint primarily requires authentication.

The current authorization around task creation is not sufficiently connected to the project's membership/role model.

This means the current system allows task creation without the complete business-level permission model we want.

---

# 18. Current Task Assignment

Task assignment exists as a separate operation.

The current system checks organization-level relationships when determining whether a target user can be assigned.

## Problem

The assignment model is currently too broad.

The desired rule is:

```text
Task
 ↓
Project
 ↓
Project Members
 ↓
Assignable Users
```

A user being an organization member should not automatically make them eligible for tasks in every project.

---

# 19. Current Task Status Workflow

Current status model:

```text
TO DO
IN PROGRESS
DONE
BLOCKED
```

Users can currently move tasks between statuses without the intended review workflow.

There is currently no:

```text
IN REVIEW
```

state.

There is also no explicit:

```text
Submit for Review
Approve
Request Changes
```

workflow.

---

# 20. Desired Task Workflow — Not Yet Implemented

The intended product workflow is:

```text
TO DO
   ↓
IN PROGRESS
   ↓
IN REVIEW
   ↓
DONE
```

If the Project Manager finds a problem:

```text
IN REVIEW
   ↓
Changes Requested
   ↓
IN PROGRESS
   ↓
IN REVIEW
```

The detailed permission rules for these transitions have **not yet been finalized**.

---

# 21. Current Review System

There is currently no dedicated review mechanism.

There is no finalized concept of:

```text
Reviewer
Review submission
Approval
Changes requested
Review comment
Review notification
```

This is a major product gap.

---

# 22. Current Collaboration Features

The backend already contains collaboration features:

```text
Comments
Replies
Mentions
Attachments
Activity Logs
Notifications
```

These are part of the existing collaboration layer.

The API supports comments and attachments alongside task workflows.

---

# 23. Current Comments

Comments support:

* Creating comments
* Retrieving comments
* Updating comments
* Deleting comments
* Replies/threading

The database model supports threaded comments and soft deletion.

## Problem

The comment system is not completely integrated with activity tracking.

For example, not every meaningful comment event is currently represented in the activity history.

---

# 24. Current Mentions

Mentions are supported as a database concept.

The intended architecture is:

```text
Comment created
      ↓
Extract mentions
      ↓
Create mention records
      ↓
Queue notification
      ↓
Notification worker
```

This flow is part of the documented collaboration design.

## Current problem

The notification side of this flow is not yet fully connected to actual business events.

---

# 25. Current Attachments

Attachments use:

```text
Multer
 ↓
Cloudinary
 ↓
Attachment metadata
 ↓
PostgreSQL
```

The database stores attachment metadata associated with tasks.

The backend supports attachment creation/retrieval/deletion.

## Current gap

The complete product behavior around attachments is not yet defined.

Examples of unresolved concerns include:

* When attachments should be available
* How attachment deletion appears in activity
* What happens when a task/project is archived
* File limits
* Malware scanning
* Storage cleanup

These will be handled later.

---

# 26. Current Activity System

ProjectFlow has an activity logging system.

Activity records contain concepts such as:

```text
Organization
Actor Membership
Action
Entity Type
Entity ID
Metadata
Created At
```

The database model is designed to support organization-level activity history.

Some events are currently logged, including task creation and assignment.

However, the event coverage is incomplete.

---

# 27. Current Activity Gaps

Important events that are not consistently represented include:

```text
Task status change
Comment creation
Comment mention
Attachment deletion
Project membership changes
Review requested
Review approved
Changes requested
Other meaningful workflow transitions
```

The final activity event model still needs to be defined.

---

# 28. Current Notification System

The architecture includes:

```text
Notification Queue
        ↓
Notification Worker
        ↓
Notification Storage
```

The database contains notification concepts associated with organization activities and recipients.

The API also provides notification retrieval and read operations.

---

# 29. Notification Problem

The infrastructure exists, but the business events are not currently connected comprehensively to the notification system.

For example, the intended product should eventually generate notifications for:

```text
Task assigned
Mention
Invitation
Task submitted for review
Task sent back
Task approved
Project membership
```

The actual event → notification mapping is currently incomplete.

Therefore:

> **The notification infrastructure exists, but the notification product workflow is incomplete.**

---

# 30. Current Dashboard

The backend does not currently provide the complete dashboard experience required by the product.

Some task/project retrieval functionality exists.

However, the following dashboard concepts are not fully implemented:

```text
My Tasks
Overdue Tasks
Due Today
Due This Week
Recent Activity
Quick Task Creation
Relevant Notifications
```

The dashboard therefore needs product-level aggregation rather than simply exposing existing CRUD endpoints.

---

# 31. Current Kanban

There is currently no complete Kanban workflow.

Desired:

```text
TO DO
IN PROGRESS
IN REVIEW
DONE
```

with drag-and-drop task movement.

This is currently a frontend/product feature that also requires the backend to support the correct task state transitions.

---

# 32. Current List View

There is currently no finalized task list experience designed around:

```text
Task
Assignee
Priority
Status
Due Date
Labels
```

This will be part of the frontend/product layer.

---

# 33. Current Task Detail

The backend already provides task-level operations.

The task detail experience will eventually combine:

```text
Task information
Status
Assignee
Priority
Due date
Comments
Mentions
Attachments
Activity history
Review
```

The complete product experience is not yet implemented.

---

# 34. Current Member Removal Behavior

Currently, removing a membership primarily removes the organization membership record.

Database relationships use behaviors such as:

```text
Cascade
Set Null
Restrict
```

depending on the relationship.

For example, task assignment can be set to null when the assigned user relationship is removed, while project/organization relationships have different deletion behavior.

However, the **business lifecycle** is not fully defined.

For example, the system has not yet explicitly defined:

```text
What happens to a user's project memberships?
What happens to assigned tasks?
What happens to pending work?
What happens to comments?
What happens to notifications?
What happens when a Project Manager leaves?
```

These decisions are deferred to the lifecycle-design phase.

---

# 35. Current Project Archive Behavior

Projects currently support archiving/soft deletion concepts.

The current implementation primarily changes the project's state rather than executing a complete project lifecycle.

The desired product needs to define what happens to:

```text
Tasks
Members
Comments
Attachments
Activity
Notifications
```

when a project is archived.

This is also deferred to the lifecycle-design phase.

---

# 36. Current Architecture Strengths

Despite the workflow problems, ProjectFlow already has several strong foundations.

## Architecture

```text
Feature-based modular monolith
Repository-Service-Controller
Thin controllers
Business logic in services
Database abstraction through repositories
```

This is documented as the intended architecture.

## Database

```text
PostgreSQL
Drizzle ORM
UUID identifiers
Foreign keys
Enums
Soft deletes
Transactions
```

The database model is already designed around multi-tenancy and organization relationships.

## Background Processing

```text
Redis
BullMQ
Workers
Email processing
Activity processing
Notification infrastructure
```

The architecture already separates asynchronous work from request processing.

## Collaboration

Comments, attachments, mentions, notifications and activity concepts already exist.

---

# 37. The Core Problem

The current ProjectFlow can be summarized as:

```text
                CURRENT PROJECTFLOW

       ┌───────────────┐
       │ Authentication│
       └───────┬───────┘
               ↓
       ┌───────────────┐
       │ Organizations │
       └───────┬───────┘
               ↓
       ┌───────────────┐
       │ Memberships   │
       └───────────────┘

       ┌───────────────┐
       │   Projects    │
       └───────┬───────┘
               ↓
       ┌───────────────┐
       │    Tasks      │
       └───────┬───────┘
               ↓
       ┌───────────────┐
       │ Collaboration │
       └───────────────┘

              BUT...

       The business relationships
       between these modules are
       incomplete.
```

The modules exist.

The product loop does not yet fully exist.

---

# 38. Main Problems Identified

## P1 — Owner/Admin model is inconsistent

Current:

```text
Owner
Admin
Project Manager
Member
Viewer
```

Desired:

```text
Admin
Project Manager
Member
Viewer
```

---

## P2 — Project membership does not exist

This is the largest structural product gap.

We need:

```text
Organization Membership
+
Project Membership
```

---

## P3 — Project access is too broad

Current organization membership effectively gives access to organization projects.

Desired:

```text
Organization Member
       ↓
Project Membership
       ↓
Project Access
```

---

## P4 — Project Manager role is not actually implemented

The role exists in the enum, but current permissions do not give Project Managers their intended responsibilities.

---

## P5 — Task authorization is incomplete

Current task operations are not consistently tied to:

```text
Organization role
+
Project membership
+
Task responsibility
```

---

## P6 — Task assignment is organization-oriented

Assignment needs to become project-oriented.

---

## P7 — Task workflow is incomplete

Current:

```text
To Do
In Progress
Done
Blocked
```

Desired:

```text
To Do
In Progress
In Review
Done
```

with review behavior.

---

## P8 — Review system does not exist

There is currently no proper:

```text
Submit
Review
Approve
Request Changes
```

workflow.

---

## P9 — Notification infrastructure is disconnected

The queue/worker infrastructure exists, but actual business events are not consistently producing notifications.

---

## P10 — Activity logging is incomplete

Important business events are missing from activity history.

---

## P11 — Dashboard data is incomplete

The backend is not yet shaped around the user's daily workflow.

---

## P12 — Project/task lifecycle is undefined

The system knows how to perform CRUD operations but does not consistently define:

```text
What happens after an action?
```

---

# 39. What We Have Learned

The key lesson from Version 1 is:

> **ProjectFlow was initially developed feature-by-feature, but the next phase must be workflow-first.**

We should no longer think:

```text
"I need an endpoint for X."
```

Instead:

```text
"A user performs X.
What should happen before it?
What should happen after it?
Who should be allowed to do it?
What state changes?
Who needs to know?
What happens if the person leaves?
What happens to related data?"
```

This is the shift from:

```text
CRUD BACKEND
```

to:

```text
PRODUCT BACKEND
```

---

# 40. Next Design Phase

We now stop implementing temporarily and define the business rules.

The next phase consists of six decisions.

---

## A. Organization Permissions

Define exactly what:

```text
Admin
Project Manager
Member
Viewer
```

can do at the organization level.

Questions include:

```text
Who can invite?
Who can remove members?
Who can change roles?
Who can create projects?
Who can manage workspace settings?
Who can view members?
```

---

## B. Project Permissions

Define exactly who can:

```text
Create project
Edit project
Archive project
Add project member
Remove project member
Assign project role
```

---

## C. Task Permissions

Define exactly who can:

```text
Create task
Edit task
Delete task
Assign task
Change status
Submit for review
Approve
Request changes
```

---

## D. Project Membership

Define the exact project-level roles.

For example:

```text
Project Manager
Member
Viewer
```

or another model if required.

The final decision should be based on the product workflow rather than simply duplicating organization roles.

---

## E. Lifecycle Rules

Define what happens when:

```text
Member leaves organization
Member is removed
Member is removed from project
Project is archived
Project Manager leaves
Admin leaves
Task assignee leaves project
```

---

## F. Task Workflow

Define the exact state machine:

```text
TO DO
   ↓
IN PROGRESS
   ↓
IN REVIEW
   ↓
DONE
```

including:

```text
Who can move each state?
Who gets notified?
Who can approve?
Who can request changes?
Where is the review feedback stored?
What happens when changes are requested?
```

---

# 41. What We Will Do From Tomorrow

We should **not start coding tomorrow morning immediately**.

The first job is to finish the product rules.

### Step 1

Finalize:

```text
A. Organization permissions
```

### Step 2

Finalize:

```text
B. Project permissions
```

### Step 3

Finalize:

```text
C. Task permissions
```

### Step 4

Design:

```text
D. Project membership
```

### Step 5

Define:

```text
E. Lifecycle rules
```

### Step 6

Finalize:

```text
F. Task workflow
```

### Step 7

Only then compare:

```text
DESIRED SYSTEM
       ↓
CURRENT SYSTEM
       ↓
DATABASE CHANGES
       ↓
BACKEND CHANGES
       ↓
API CHANGES
       ↓
TESTS
       ↓
FRONTEND
```

---

# 42. Version 1 Definition

At the end of this phase, we should be able to say:

> **We know exactly how ProjectFlow is supposed to behave before we change its implementation.**

The next documents/decisions should therefore define the **business rules**, not more code.

---

## Next

Start with **A — Organization Permissions**.

We will take:

```text
Admin
Project Manager
Member
Viewer
```

and define, one action at a time, exactly what each role can and cannot do.

We will not touch B–F until A is settled.
