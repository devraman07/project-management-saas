# ProjectFlow — Product Workflow & User Flow

> **Purpose:** Define how real users will use ProjectFlow from account creation through daily project execution, collaboration, review, and completion.
>
> This document describes the **product workflow and user experience**, not the security audit, API documentation, or infrastructure design.

---

# 1. Product Vision

ProjectFlow is a collaborative project management application for teams.

The core idea is:

```text
Organization
    ↓
Organization Members
    ↓
Projects
    ↓
Project Members
    ↓
Tasks
    ↓
Collaboration
    ↓
Review
    ↓
Completion
```

A user joins an organization once, but does not automatically gain access to every project inside that organization.

Instead:

```text
Organization Membership
        ↓
Who are you in the organization?

Project Membership
        ↓
Which projects can you access?
What can you do inside those projects?
```

This gives organizations control over which team members can work on which projects.

---

# 2. Main User Journey

The overall user journey is:

```text
Visit ProjectFlow
       ↓
Create Account / Login
       ↓
Create Workspace
       ↓
Invite Organization Members
       ↓
Members Accept Invitation
       ↓
Organization Team Exists
       ↓
Create Projects
       ↓
Add Organization Members to Projects
       ↓
Assign Project Roles
       ↓
Create Tasks
       ↓
Assign Tasks
       ↓
Work on Tasks
       ↓
Collaborate
       ↓
Submit for Review
       ↓
Project Manager Reviews
       ↓
Approved → Done
       OR
Sent Back → Member Fixes Task
       ↓
Task Completed
```

---

# 3. Account Entry

A random user arrives at ProjectFlow.

They can:

* Create an account
* Login to an existing account

After authentication, the user enters their ProjectFlow workspace environment.

A new user who does not belong to an organization should be guided toward creating or joining a workspace.

---

# 4. Workspace / Organization Setup

## 4.1 Create Workspace

A user can create a new workspace.

The workspace setup includes:

```text
Workspace Name
Workspace Description
```

Example:

```text
Workspace Name:
DeepTech Creations

Description:
Software development and client project management team.
```

The workspace becomes the central organization for the team's work.

---

# 5. Organization Membership

An organization contains its team members.

A user joins an organization once.

The organization has four organization-level roles:

| Role            | Purpose                                       |
| --------------- | --------------------------------------------- |
| Admin           | Manages the organization and its members      |
| Project Manager | Manages projects, members and task assignment |
| Member          | Works on assigned projects and tasks          |
| Viewer          | Can view permitted project information        |

There is **no separate Owner role** in the planned model.

The highest organization role is:

```text
Admin
```

---

# 6. Inviting Members

An Admin or Project Manager can add people to the organization.

The workflow:

```text
Admin / Project Manager
        ↓
Open Members
        ↓
Add Member
        ↓
Enter Gmail / Email
        ↓
Choose Organization Role
        ↓
Send Invitation
        ↓
Invitation Email
        ↓
User clicks invitation link
        ↓
Accept Invitation
        ↓
User becomes organization member
```

The invitation is sent through email.

The invited user receives a link that takes them to ProjectFlow.

After accepting the invitation, the user becomes part of the organization.

---

# 7. Organization-Level Roles

## 7.1 Admin

Admin is the highest organization-level role.

Admin can:

* Add organization members
* Remove organization members
* Manage organization membership
* Assign organization roles
* Change members to Project Manager
* Manage workspace settings
* Manage projects
* Manage organization-level activities

An Admin can change:

```text
Member → Project Manager
Project Manager → Member
```

The Admin can manage Project Managers.

A Project Manager **cannot promote someone to Admin**.

---

# 7.2 Project Manager

Project Manager is responsible for managing project execution.

A Project Manager can:

* Create/manage projects
* Add organization members to projects
* Remove members from projects
* Manage project participation
* Assign tasks
* Review submitted tasks
* Approve tasks
* Send tasks back for changes
* Manage task workflow

A Project Manager cannot:

```text
Project Manager → Admin
```

The Project Manager remains below Admin at the organization level.

---

# 7.3 Member

A Member is primarily an execution-level user.

A Member can:

* Access projects they have been added to
* View assigned work
* Work on tasks
* Update task status
* Add comments
* Mention other users
* Upload attachments
* Submit tasks for review
* Respond to review feedback

A Member does not automatically have access to every organization project.

---

# 7.4 Viewer

Viewer is a read-oriented role.

A Viewer can see permitted project information but is not intended to execute project work.

The exact mutation permissions for Viewer will be finalized during the permission audit.

---

# 8. Two-Level Membership Model

This is a core ProjectFlow concept.

## Organization Membership

Answers:

> "Who is this person inside the organization?"

Example:

```text
Raman
Organization: DeepTech Creations
Role: Member
```

## Project Membership

Answers:

> "Which projects can this person access?"

Example:

```text
Raman
Organization Role: Member

Project Membership:
- Website Project      → Member
- Mobile App Project   → Member
- Internal CRM         → No Access
- Client A Project     → No Access
```

Therefore:

```text
Organization
│
├── Raman
├── Ayan
├── Sujal
└── Debangshu
```

does **not** mean everyone can see every project.

Instead:

```text
Organization
│
├── Project A
│    ├── Raman
│    └── Ayan
│
├── Project B
│    ├── Sujal
│    └── Debangshu
│
└── Project C
     ├── Raman
     ├── Ayan
     └── Sujal
```

This allows one organization to run multiple projects with different teams.

---

# 9. Project Setup

After the organization has members, an Admin or Project Manager can create projects.

The organization may have:

```text
Project A
Project B
Project C
Project D
```

Not every organization member needs to participate in every project.

The project setup workflow is:

```text
Create Project
      ↓
Define project information
      ↓
Select organization members
      ↓
Add members to project
      ↓
Assign project-level roles
      ↓
Project becomes active
```

The organization member list becomes the pool from which project members are selected.

---

# 10. Project Membership

Project membership controls project access.

Example:

```text
Organization Members

1. Raman
2. Ayan
3. Sujal
4. Debangshu
5. Rahul
6. Priya
```

When creating a project, the Project Manager can select:

```text
Website Project

✓ Raman
✓ Ayan
✓ Sujal
□ Debangshu
□ Rahul
□ Priya
```

Only selected users become members of that project.

The exact project-level role model will be finalized as we implement the permission system, but the fundamental rule is:

> A user must be a member of a project to work inside that project.

---

# 11. Daily User Workflow

Once the workspace and projects are configured, ProjectFlow becomes a daily work-management system.

The user's primary entry point is the:

# Dashboard

The dashboard should answer:

> **"What do I need to know and do today?"**

---

# 12. Dashboard

The dashboard should contain:

## My Tasks

Tasks assigned to the current user.

Example:

```text
My Tasks

Fix authentication bug
Due: Today
Status: In Progress

Create landing page
Due: Tomorrow
Status: To Do

Implement payment API
Due: Friday
Status: In Review
```

---

## Task Sorting

Tasks should be organized around urgency.

Important categories:

```text
Overdue
Due Today
Due This Week
Upcoming
```

The goal is to immediately show the user what requires attention.

---

## Recent Activity

The dashboard should contain a recent activity feed.

Example:

```text
Ayan assigned "Payment API" to Raman

Sujal moved "Landing Page" to In Review

Raman commented on "Authentication"

Ayan approved "Database Schema"

Priya joined the project
```

The activity feed gives the team visibility into what is happening without requiring everyone to open every project.

---

## Quick Task Creation

The dashboard should provide an easy way to create a task.

Example:

```text
+ Create Task
```

The user should not need to navigate through multiple screens just to create basic work.

---

# 13. Creating a Task

A task contains the core information required to execute work.

Required/primary fields:

```text
Title
Description
Assignee
Priority
Due Date
```

Optional:

```text
Labels
Subtasks / Checklist
Attachments
```

Example:

```text
Title:
Implement Login API

Description:
Implement JWT-based login flow.

Assignee:
Raman

Priority:
High

Due Date:
October 10

Labels:
Backend
Authentication

Checklist:
□ Create login controller
□ Implement service
□ Add validation
□ Add tests
```

---

# 14. Task Assignment

Tasks can be assigned:

### During task creation

```text
Create Task
     ↓
Select Assignee
     ↓
Create Task
```

### After creation

```text
Existing Task
     ↓
Change Assignee
     ↓
Select Project Member
```

When a task is assigned to someone:

```text
Task Assignment
      ↓
In-App Notification
      +
Email Notification
```

The assigned user can then see the task in:

```text
Dashboard → My Tasks
```

---

# 15. Task Status Workflow

Every project follows a simple four-stage task pipeline.

```text
TO DO
  ↓
IN PROGRESS
  ↓
IN REVIEW
  ↓
DONE
```

This is the core execution workflow.

---

# 16. To Do

New work starts in:

```text
TO DO
```

The task has not yet been actively worked on.

---

# 17. In Progress

When the assignee begins working:

```text
TO DO
  ↓
IN PROGRESS
```

The team can now see that the task is actively being worked on.

---

# 18. In Review

When the assignee believes the work is complete:

```text
IN PROGRESS
      ↓
IN REVIEW
```

This means:

> "The implementation is ready for someone responsible for review."

The Project Manager receives a notification.

---

# 19. Review Workflow

The Project Manager reviews the task.

There are two possible outcomes.

## Approval

```text
IN REVIEW
    ↓
Approved
    ↓
DONE
```

The task is completed.

---

## Rejection / Changes Required

If there is a problem:

```text
IN REVIEW
    ↓
Changes Required
    ↓
Comment explaining the problem
    ↓
Task goes back to IN PROGRESS
    ↓
Member fixes the issue
    ↓
IN REVIEW
```

Example review:

```text
Please fix the validation issue
in the email field.

Also handle duplicate email errors.
```

The assignee receives the feedback and continues working.

---

# 20. Task Status Changes

Users should be able to change task status in two ways.

### Kanban Board

Drag and drop:

```text
┌──────────┐
│ TO DO    │
└──────────┘
     ↓
┌──────────────┐
│ IN PROGRESS  │
└──────────────┘
     ↓
┌──────────────┐
│ IN REVIEW    │
└──────────────┘
     ↓
┌──────────┐
│ DONE     │
└──────────┘
```

### Task Detail Page

The user can change the status directly from the task detail screen.

---

# 21. Task Activity History

Every important task action should appear in the task history.

Example:

```text
10:15 AM — Raman created the task

10:20 AM — Ayan assigned the task to Raman

11:30 AM — Raman moved task to In Progress

2:45 PM — Raman added a comment

4:10 PM — Raman moved task to In Review

4:30 PM — Ayan requested changes

5:20 PM — Raman moved task to In Review

5:45 PM — Ayan approved the task
```

This gives the team a clear history of:

```text
Who
What
When
```

---

# 22. Collaboration Inside a Task

The task detail page is the main collaboration area.

It should contain:

```text
Task Information
Comments
Mentions
Attachments
Activity History
```

---

# 23. Comments

Users can discuss work directly inside the task.

Example:

```text
Ayan:
Can we also handle invalid JWT tokens here?

Raman:
Yes, I'll add that.

Sujal:
@Raman I found another edge case.
```

Comments keep project discussions attached to the relevant work.

---

# 24. Mentions

Users can mention team members:

```text
@Raman
@Ayan
@Sujal
```

A mention generates an in-app notification.

Depending on the notification workflow, it may also trigger email.

---

# 25. Attachments

Users can attach relevant files to tasks.

Example:

```text
Task
 ├── screenshot.png
 ├── requirements.pdf
 └── design.png
```

Attachment handling, file limits, malware scanning, storage security and similar concerns will be handled during the later security/reliability phase.

For now, the product workflow simply defines:

> A task can contain relevant attachments.

---

# 26. Notifications

Users have a dedicated notification area.

Notifications may be generated when:

```text
You are assigned a task
You are mentioned in a comment
Your task is sent back for changes
Your task is approved
You are invited to an organization
You are added to a project
```

The notification experience should provide:

```text
Unread
Read
Mark as read
Mark all as read
```

---

# 27. Core Frontend Screens

The first version of the frontend should revolve around these screens.

## 1. Dashboard

Purpose:

> Understand what needs attention today.

Contains:

* My Tasks
* Overdue tasks
* Tasks due today
* Tasks due this week
* Recent activity
* Quick task creation

---

## 2. Kanban Board

Purpose:

> Visualize project execution.

Columns:

```text
To Do
In Progress
In Review
Done
```

Supports:

* Task cards
* Drag and drop
* Status changes
* Task opening

---

## 3. List View

Purpose:

> View and manage project tasks in a structured format.

Possible information:

```text
Task
Assignee
Priority
Status
Due Date
Labels
```

---

## 4. Task Detail

Purpose:

> Everything related to one task.

Contains:

```text
Title
Description
Assignee
Priority
Due Date
Labels
Checklist
Attachments
Comments
Mentions
Activity History
Status
```

---

## 5. Members

Purpose:

> Manage organization members.

Contains:

```text
Member
Email
Organization Role
Project Membership
Actions
```

---

## 6. Workspace Settings

Purpose:

> Manage organization/workspace configuration.

Contains:

```text
Workspace Name
Description
Members
Roles
Projects
Workspace configuration
```

---

## 7. Notifications

Purpose:

> Central location for user notifications.

---

# 28. Complete Product Flow

The complete ProjectFlow workflow can be visualized as:

```text
                    PROJECTFLOW
                         │
                         ▼
              ┌─────────────────────┐
              │ Create Account/Login │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Create Workspace    │
              │ Name + Description  │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Add Organization    │
              │ Members             │
              └──────────┬──────────┘
                         │
                         ▼
                 Invitation Email
                         │
                         ▼
                 Accept Invitation
                         │
                         ▼
              ┌─────────────────────┐
              │ Organization Team   │
              └──────────┬──────────┘
                         │
                         ▼
                 Create Projects
                         │
                         ▼
              Select Organization
                    Members
                         │
                         ▼
                 Project Members
                         │
                         ▼
                  Assign Roles
                         │
                         ▼
                  Create Tasks
                         │
                         ▼
                  Assign Members
                         │
                         ▼
                    TO DO
                         │
                         ▼
                  IN PROGRESS
                         │
                         ▼
                   IN REVIEW
                    /       \
                   /         \
             Approved      Changes
                │             │
                ▼             ▼
              DONE       IN PROGRESS
                              │
                              └──────→ IN REVIEW
```

---

# 29. The Product Loop

The most important loop in ProjectFlow is:

```text
PLAN
 ↓
CREATE TASK
 ↓
ASSIGN
 ↓
WORK
 ↓
COLLABORATE
 ↓
SUBMIT FOR REVIEW
 ↓
REVIEW
 ↓
APPROVE / REQUEST CHANGES
 ↓
COMPLETE
```

This is the behavior the product should optimize for.

---

# 30. What We Are Building First

We are **not** trying to build a massive project-management platform.

The first goal is to make this core workflow excellent:

```text
Workspace
   ↓
Members
   ↓
Projects
   ↓
Project Members
   ↓
Tasks
   ↓
Assignment
   ↓
Execution
   ↓
Collaboration
   ↓
Review
   ↓
Completion
```

Everything in the initial frontend should support this loop.

---

# 31. Development Strategy

We will build ProjectFlow in stages.

## Stage 1 — Understand

Before changing the backend:

* Understand the existing code
* Understand the existing database
* Understand current workflows
* Map existing features to the desired product workflow

---

## Stage 2 — Align

Compare:

```text
Desired Product Workflow
          vs
Current Backend
```

Identify:

* Already implemented
* Partially implemented
* Missing
* Different from desired behavior
* Needs redesign

---

## Stage 3 — Product Polish

Once the workflow is understood:

* Complete missing workflow pieces
* Improve UX
* Standardize behavior
* Define permissions
* Define state transitions
* Handle important edge cases

---

## Stage 4 — Reliability & Security Audit

Only after the workflow is clear, perform the deeper audit.

This includes:

* Authorization vulnerabilities
* Tenant isolation
* Authentication issues
* Data integrity
* Race conditions
* Invalid state transitions
* File security
* Input validation
* Rate limiting
* Queue failures
* Database consistency
* Error handling
* Other edge cases

---

## Stage 5 — Testing

Turn the finalized workflows into automated tests.

The tests should represent actual user behavior:

```text
User registers
User creates workspace
User invites member
Member accepts invitation
Manager creates project
Manager adds members
Manager creates task
Member works on task
Member submits task
Manager reviews
Manager approves
Task becomes Done
```

This becomes the foundation of the application's regression test suite.

---

## Stage 6 — Frontend

Build the frontend around the finalized workflows:

```text
Dashboard
Kanban
List View
Task Detail
Members
Workspace Settings
Notifications
```

The frontend should not invent business behavior independently from the backend.

---

## Stage 7 — Real Users

After the core workflow works:

```text
Deploy
   ↓
Invite real users
   ↓
Observe actual usage
   ↓
Collect bugs / friction
   ↓
Fix
   ↓
Add regression test
   ↓
Deploy again
```

The goal is to move ProjectFlow from:

> **"A backend project I built."**

to:

> **"A working product that real teams can use."**

---

# 32. Current Product Principle

For now, the guiding principle is:

> **Do not add features just because they sound impressive. Make the core workflow reliable, understandable and pleasant to use.**

The core question for every future feature should be:

> **Does this make it easier for a team to plan, execute, collaborate, review and complete work?**

If not, it probably does not belong in the first production version.

---

# 33. Current Scope

### Core

* Authentication
* Workspace creation
* Organization membership
* Invitations
* Four organization roles
* Project creation
* Project membership
* Project roles
* Task creation
* Task assignment
* Task status workflow
* Kanban
* List view
* Task details
* Comments
* Mentions
* Attachments
* Activity history
* Notifications
* Review workflow
* Dashboard

### Deliberately Deferred

The following are **not being solved in this workflow-design phase**:

* Security audit
* Malware scanning
* File size/security limits
* Advanced rate limiting
* Performance optimization
* Database optimization
* Infrastructure scaling
* Advanced analytics
* Real-time WebSockets
* Microservices
* Kafka/RabbitMQ
* Kubernetes
* Other advanced infrastructure

Those will be evaluated after the product workflow is finalized.

---

# 34. Definition of the First Real Product

ProjectFlow is ready for its first real users when a team can successfully do this without developer intervention:

```text
Create account
     ↓
Create workspace
     ↓
Invite team
     ↓
Team accepts invitations
     ↓
Create projects
     ↓
Select project members
     ↓
Create and assign tasks
     ↓
Work on tasks
     ↓
Comment / mention / attach files
     ↓
Submit work for review
     ↓
Manager reviews
     ↓
Approve or request changes
     ↓
Complete tasks
     ↓
Track everything from dashboard/activity
```

That is the **core ProjectFlow product loop**.
