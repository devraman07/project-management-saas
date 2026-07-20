# 🚀 ProjectFlow – Enterprise Project Management SaaS (Backend)

> A production-oriented, scalable backend powering a collaborative project management platform with organizations, projects, tasks, activity tracking, notifications, and secure role-based access control.

---

## 📖 Overview

ProjectFlow is a backend-first Project Management SaaS designed with production architecture in mind. Instead of focusing only on CRUD operations, the project emphasizes scalability, maintainability, security, and clean software architecture.

The system supports multiple organizations, role-based collaboration, project management, task management, comments, file attachments, mentions, notifications, activity tracking, and background job processing.

The project follows a modular, feature-based architecture using the Repository-Service-Controller pattern and is designed to evolve into a full enterprise collaboration platform.

---

# ✨ Current Features

## Authentication & Security

* JWT Authentication
* Access Token + Refresh Token flow
* Refresh Token Rotation
* Refresh Token Hashing
* Secure Logout
* Token Revocation
* Authentication Middleware
* Authorization Middleware
* Role-Based Access Control (RBAC)
* Membership-Based Authorization
* Global Error Handling
* Custom Error Classes
* Request Validation

---

## User Management

* User Registration
* User Login
* User Profile
* Update Profile
* Delete User
* User Listing

---

## Organization Management

* Create Organization
* Update Organization
* Delete Organization (Soft Delete)
* View Organization
* View User Organizations
* Organization Ownership

---

## Membership System

Every organization maintains its own memberships.

Supported Roles:

* Owner
* Admin
* Project Manager
* Member

Features:

* Add Members
* Remove Members
* Update Member Role
* View Organization Members

The entire authorization system is built around Membership IDs instead of User IDs.

---

## Invitation System

* Invite Members via Email
* Secure Invite Tokens
* Accept Invite
* Membership Creation
* Background Email Delivery

---

## Project Management

* Create Projects
* Update Projects
* Archive/Delete Projects (Soft Delete)
* View Projects
* Project Status Management

---

## Task Management

* Create Tasks
* Update Tasks
* Delete Tasks (Soft Delete)
* Task Assignment
* Task Status Updates
* Task Ownership
* Project Task Listing

---

## Collaboration

### Comments

* Create Comment
* Update Comment
* Delete Comment
* View Task Comments

### Attachments

* File Upload
* Cloudinary Integration
* Delete Attachment
* View Attachments

### Mentions

* Mention Team Members inside Comments

---

## Notifications

Current implementation includes:

* Invite Notifications
* Task Assignment Notifications
* Background Notification Queue
* Notification Worker

The notification system is implemented and will continue expanding as new collaborative features are added.

---

## Activity Timeline

ProjectFlow records important business events including:

* Organization Created
* Project Created
* Task Created
* Task Updated
* Task Assigned
* Invite Sent
* Additional activities as features evolve

Activity logging is powered by background jobs to avoid slowing down user requests.

---

## Background Jobs

Implemented using BullMQ.

Queues:

* Email Queue
* Notification Queue
* Activity Queue

Workers:

* Email Worker
* Notification Worker
* Activity Worker

---

## File Management

* Multer Upload Middleware
* Cloudinary Storage
* Upload Helpers
* File Cleanup Helpers

---

## Logging

Structured application logging powered by **Pino**.

Business events, warnings, and unexpected errors are logged separately to improve debugging and observability.

---

## Database

Built using PostgreSQL with Drizzle ORM.

Current entities include:

* Users
* Organizations
* Memberships
* Projects
* Tasks
* Comments
* Attachments
* Mentions
* Notifications
* Activity Logs
* Invites
* Refresh Tokens

---

# 🏗️ Architecture

The backend follows a layered architecture.

```text
Client
      │
      ▼
Express Routes
      │
      ▼
Controllers
      │
      ▼
Services
      │
      ▼
Repositories
      │
      ▼
Drizzle ORM
      │
      ▼
PostgreSQL
```

Background processing is completely separated from request handling.

```text
Service
      │
      ▼
BullMQ Queue
      │
      ▼
Worker
      │
      ▼
Email / Notification / Activity
```

---

# 📂 Project Structure

```text
src
├── configs
├── database
│   └── schemas
├── errors
├── features
│   ├── auth
│   ├── users
│   ├── organizations
│   ├── memberships
│   ├── invites
│   ├── projects
│   ├── tasks
│   ├── comments
│   ├── attachments
│   ├── mentions
│   ├── notifications
│   └── activity
├── jobs
│   ├── queues
│   └── workers
├── middlewares
├── shared
└── utils
```

---

# 🛠️ Tech Stack

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL
* Drizzle ORM

### Authentication

* JWT
* Refresh Tokens

### Caching & Queues

* Redis
* BullMQ

### Storage

* Cloudinary
* Multer

### Email

* Nodemailer

### Logging

* Pino

### Validation

* Zod

---

# 🔒 Security Features

* JWT Authentication
* Refresh Token Rotation
* Refresh Token Hashing
* Secure Logout
* RBAC
* Membership-Based Authorization
* Validation Layer
* Global Error Handler
* Soft Deletes
* Background Job Isolation

---

# 📚 Documentation

Additional documentation can be found in the `docs/` directory.

* VERSION_1.md
* VERSION_2.md
* VERSION_3.md
* ARCHITECTURE.md
* DATABASE.md
* API_GUIDE.md
* ROADMAP.md
* CHANGELOG.md

---

# 🚧 Current Status

The backend is fully functional and currently powers:

* Authentication
* Organization Management
* Membership System
* Projects
* Tasks
* Comments
* Attachments
* Mentions
* Notifications
* Activity Logs
* Background Workers

The next phase focuses on real-time collaboration, API documentation, automated testing, deployment, and frontend integration.

---

# 📈 Roadmap

* Complete notification coverage
* Full activity timeline
* Search, filtering & pagination
* Swagger/OpenAPI documentation
* Automated testing
* Docker Compose
* WebSocket-based real-time collaboration
* Frontend integration
* Deployment
* Advanced SaaS features

---

# 📄 License

This project is intended as a portfolio-grade enterprise backend demonstrating scalable architecture, secure authentication, collaborative workflows, and production-oriented engineering practices.
