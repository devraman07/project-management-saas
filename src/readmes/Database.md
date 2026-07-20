# 🗄️ Database Design

> ProjectFlow is built on **PostgreSQL** using **Drizzle ORM**. The database is designed around a **multi-tenant organization model**, where every resource belongs to an organization and access is controlled through memberships instead of global user roles.

---

# 📖 Design Principles

The database follows several core principles:

* Multi-tenant architecture
* Membership-based authorization
* UUID primary keys
* Soft deletes for business entities
* Activity-driven audit history
* Queue-friendly event generation
* Referential integrity through foreign keys
* PostgreSQL enums for business states

---

# 🏛️ Entity Relationship Overview

```text
Users
   │
   │ 1:N
   ▼
Memberships
   │
   │ N:1
   ▼
Organizations
   │
   ├─────────────┐
   │             │
   ▼             ▼
Projects     Activity Logs
   │
   ▼
Tasks
   │
   ├────────────┬────────────┐
   ▼            ▼            ▼
Comments   Attachments   Notifications
   │
   ▼
Mentions
```

---

# 📋 Tables

---

## Users

Stores application user accounts.

### Purpose

Represents a real user of the system.

### Important Fields

| Column       | Description           |
| ------------ | --------------------- |
| id           | UUID Primary Key      |
| name         | Full name             |
| username     | Unique username       |
| email        | Unique email address  |
| passwordHash | Encrypted password    |
| createdAt    | Account creation time |
| updatedAt    | Last profile update   |

### Relationships

* One User → Many Memberships
* One User → Many Refresh Tokens
* One User → Many Organizations (Creator)

---

## Refresh Tokens

Stores hashed refresh tokens used for secure authentication.

### Purpose

Supports:

* Refresh Token Rotation
* Secure Logout
* Token Revocation

### Important Fields

| Column    | Description          |
| --------- | -------------------- |
| userId    | Owner of token       |
| tokenHash | Hashed refresh token |
| isRevoked | Revocation status    |
| expiresAt | Expiration timestamp |

---

## Organizations

Represents a workspace.

Everything inside ProjectFlow belongs to an organization.

### Important Fields

| Column    | Description                       |
| --------- | --------------------------------- |
| id        | Organization ID                   |
| name      | Organization name                 |
| createdBy | User who created the organization |
| isDeleted | Soft delete flag                  |
| deletedAt | Soft delete timestamp             |

### Relationships

One Organization contains:

* Members
* Projects
* Activity Logs
* Notifications
* Invites

---

## Memberships

The most important table in the database.

ProjectFlow authorizes users using **Membership IDs** rather than User IDs.

A user receives a unique membership inside every organization they join.

### Roles

* Owner
* Admin
* Project Manager
* Member
* Viewer

### Important Fields

| Column         | Description                         |
| -------------- | ----------------------------------- |
| userId         | Linked user                         |
| organizationId | Organization                        |
| role           | Organization role                   |
| invitedBy      | Membership that invited this member |
| joinedAt       | Join timestamp                      |

### Why Membership IDs?

This allows the same user to have different permissions in different organizations.

Example:

```text
Organization A

Raman → OWNER

Organization B

Raman → MEMBER
```

Without memberships this would not be possible.

---

## Invites

Stores pending organization invitations.

### Features

* Secure Invite Token
* Expiration
* Assigned Role
* Invite Status

### Status

* Pending
* Accepted
* Expired
* Revoked

---

## Projects

Projects belong to organizations.

### Features

* Project Manager
* Status Tracking
* Archive Support

### Status

* Planning
* Active
* On Hold
* Completed

---

## Tasks

Tasks belong to projects.

Each task can contain:

* Comments
* Attachments
* Activity
* Assignee

Tasks support assignment and status updates while maintaining complete activity history.

---

## Comments

Task discussion system.

Supports:

* Threaded comments
* Replies
* Editing
* Soft Deletes

Each comment belongs to:

* Task
* Membership

---

## Attachments

Stores uploaded task files.

Files are stored in **Cloudinary** while metadata is stored inside PostgreSQL.

### Stored Metadata

* Original Name
* File Name
* MIME Type
* File Size
* Cloudinary Storage Key
* Public URL

Soft delete support preserves attachment history.

---

## Mentions

Allows users to mention teammates inside comments.

Each mention records:

* Comment
* Mentioned Member
* Mention Creator
* Read Status

This table powers mention notifications.

---

## Activity Logs

Stores the organization's complete activity history.

Every important business event creates an activity record.

### Current Actions

* Organization Created
* Project Created
* Project Updated
* Project Archived
* Task Created
* Task Updated
* Task Assigned
* Task Completed
* Invite Sent
* Invite Accepted
* Member Added
* Member Removed
* Role Changed
* Comment Created
* Comment Updated
* Comment Deleted
* Attachment Created
* Attachment Deleted
* Mention Created

### Stored Information

| Field             | Description                 |
| ----------------- | --------------------------- |
| organizationId    | Organization                |
| actorMembershipId | Member who performed action |
| action            | Business event              |
| entityType        | Target entity               |
| entityId          | Entity identifier           |
| metadata          | Additional context          |
| createdAt         | Timestamp                   |

Activity logs form the foundation for audit history, notifications, analytics, and future reporting.

---

## Notifications

Stores notifications displayed to users.

Notifications are linked directly to activity records.

### Structure

Each notification references:

* Organization
* Recipient Membership
* Activity Log

Current notification events include:

* Organization Invitations
* Task Assignments
* Mention Notifications (foundation implemented)

---

# 🔐 Multi-Tenant Design

ProjectFlow follows an organization-centric architecture.

```text
User

↓

Membership

↓

Organization

↓

Project

↓

Task

↓

Comment

↓

Mention
```

Every permission check ultimately resolves through the Membership table.

---

# 📈 Soft Delete Strategy

Business entities are soft deleted whenever possible.

Current support includes:

* Organizations
* Projects
* Tasks
* Comments
* Attachments

This preserves historical data while allowing future recovery and auditing.

---

# 🚀 Database Highlights

* PostgreSQL
* Drizzle ORM
* UUID Primary Keys
* Strong Foreign Key Constraints
* PostgreSQL Enums
* Membership-Based Authorization
* Multi-Tenant Design
* Activity-Driven Architecture
* Notification System
* Soft Delete Support
* Cloudinary File Metadata
* Secure Refresh Token Storage

The database has been designed to support scalability, maintainability, and future enterprise features such as audit logs, analytics, real-time collaboration, and reporting while maintaining strong data integrity.
