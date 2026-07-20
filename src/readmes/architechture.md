# 🏛️ ProjectFlow Architecture

> ProjectFlow follows a **feature-based modular architecture** built around the **Repository-Service-Controller (RSC)** pattern. The application is designed to separate business logic, data access, infrastructure, and background processing into independent layers, making the system scalable, maintainable, and easy to extend.

---

# 🎯 Architectural Goals

The backend was designed around the following principles:

* Separation of Concerns
* Feature-Based Organization
* Scalable Folder Structure
* Thin Controllers
* Reusable Business Logic
* Database Abstraction
* Asynchronous Processing
* Multi-Tenant Design
* Membership-Based Authorization
* Production-Oriented Codebase

---

# 🏗️ High-Level Architecture

```text
                        Client (Frontend / Postman)
                                   │
                                   ▼
                           Express Application
                                   │
                                   ▼
                               Route Layer
                                   │
                                   ▼
                           Middleware Pipeline
                                   │
                                   ▼
                            Controller Layer
                                   │
                                   ▼
                              Service Layer
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
            Repository Layer             Background Queue
                    │                             │
                    ▼                             ▼
              PostgreSQL                  BullMQ + Redis
                                                  │
                                                  ▼
                                             Worker Layer
                                                  │
                    ┌──────────────┬──────────────┴──────────────┐
                    ▼              ▼                             ▼
                Email Worker   Activity Worker         Notification Worker
```

---

# 📂 Project Structure

```text
src
│
├── configs
├── database
│   └── schemas
├── errors
├── features
├── jobs
│   ├── queues
│   └── workers
├── middlewares
├── shared
└── server.js
```

Each directory has a single responsibility.

---

# 📦 Feature-Based Architecture

Every business module lives inside its own feature directory.

Example:

```text
features/
└── projects/
    ├── project.controller.js
    ├── project.service.js
    ├── project.repository.js
    ├── project.routes.js
    ├── project.validator.js
    └── project.transformer.js
```

This keeps related logic together, making features easier to develop, test, and maintain.

---

# 🌐 Request Lifecycle

Every HTTP request follows the same pipeline.

```text
Client
   │
   ▼
Route
   │
   ▼
Authentication Middleware
   │
   ▼
Authorization Middleware
   │
   ▼
Validation
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
Database
```

Each layer has a clearly defined responsibility.

---

# 🛣️ Route Layer

Routes expose REST endpoints and compose middleware.

Responsibilities:

* Define API endpoints
* Apply middleware
* Forward requests to controllers

Routes never contain business logic.

---

# 🧠 Controller Layer

Controllers act as the bridge between HTTP and business logic.

Responsibilities:

* Read request data
* Call services
* Return API responses
* Forward errors to the global error handler

Controllers remain intentionally thin.

---

# ⚙️ Service Layer

The Service Layer contains the application's business logic.

Responsibilities:

* Implement business rules
* Coordinate multiple repositories
* Execute transactions
* Trigger background jobs
* Enforce complex authorization when required

Examples:

* Creating organizations
* Accepting invitations
* Assigning tasks
* Uploading attachments

---

# 🗄️ Repository Layer

Repositories isolate database access from business logic.

Responsibilities:

* Execute SQL queries through Drizzle ORM
* Perform CRUD operations
* Return database models
* Hide persistence details from services

This abstraction allows services to remain database-agnostic.

---

# 🛢️ Database Layer

The application uses:

* PostgreSQL
* Drizzle ORM

Design principles:

* UUID primary keys
* Foreign key constraints
* PostgreSQL enums
* Soft deletes
* Multi-tenant relationships

---

# 🔐 Authentication Flow

ProjectFlow uses JWT authentication.

```text
Register/Login
      │
      ▼
Generate Access Token
Generate Refresh Token
      │
      ▼
Store Hashed Refresh Token
      │
      ▼
Return Tokens
```

Refresh tokens support:

* Rotation
* Revocation
* Secure Logout

---

# 👥 Membership-Based Authorization

Authorization is centered around memberships rather than users.

```text
User
   │
   ▼
Membership
   │
   ▼
Organization
```

A single user can belong to multiple organizations while holding different roles in each.

Example:

```text
Organization A
Raman → Owner

Organization B
Raman → Member

Organization C
Raman → Project Manager
```

This design enables true multi-tenant authorization.

---

# 🔄 Transactions

Complex operations are executed inside database transactions.

Implemented transactional workflows include:

* Organization Creation
* Invite Acceptance
* Task Assignment

Transactions guarantee data consistency across multiple database operations.

---

# ⚡ Background Processing

Time-consuming operations are processed asynchronously.

Workflow:

```text
Business Event
      │
      ▼
Queue
      │
      ▼
Worker
      │
      ▼
Background Processing
```

Benefits:

* Faster API responses
* Retry capability
* Better scalability
* Fault isolation

---

# 📧 Email Architecture

```text
Invite Created
      │
      ▼
Email Queue
      │
      ▼
Email Worker
      │
      ▼
Nodemailer
      │
      ▼
SMTP
```

Email sending never blocks an API request.

---

# 📜 Activity Logging

Business events generate activity records.

```text
Business Action
      │
      ▼
Activity Queue
      │
      ▼
Activity Worker
      │
      ▼
Activity Log
```

The activity system forms the foundation for audit trails, analytics, and collaboration history.

---

# 🔔 Notification Pipeline

Notifications are built on top of activity events.

```text
Business Event
      │
      ▼
Notification Queue
      │
      ▼
Notification Worker
      │
      ▼
Notification Table
```

This decoupled architecture makes it easy to introduce WebSocket-based real-time notifications later.

---

# ☁️ File Upload Pipeline

```text
Client Upload
      │
      ▼
Multer Middleware
      │
      ▼
Cloudinary
      │
      ▼
Attachment Metadata
      │
      ▼
PostgreSQL
```

Only metadata is stored in the database; files are stored in Cloudinary.

---

# 📝 Logging

ProjectFlow uses **Pino** for structured logging.

Log levels:

* **Info** – Successful business events
* **Warn** – Expected business failures
* **Error** – Unexpected application or infrastructure failures

This improves debugging and production monitoring.

---

# ⚠️ Error Handling

Custom error classes are used throughout the application.

A centralized Global Error Middleware ensures:

* Consistent API responses
* Proper HTTP status codes
* Structured logging
* Simplified debugging

---

# 🎯 Design Principles

The architecture is guided by these principles:

* Feature-Based Modules
* Repository-Service-Controller Pattern
* Thin Controllers
* Business Logic in Services
* Database Isolation
* Membership-Based RBAC
* Queue-Based Background Processing
* Soft Delete Strategy
* Modular Middleware
* Scalable Infrastructure

---

# 🚀 Future Architecture

The current architecture is intentionally designed to support future enhancements without major refactoring.

Planned additions include:

* WebSocket Gateway
* Real-Time Collaboration
* Presence Tracking
* Live Notifications
* Search Engine Integration
* Analytics Service
* Audit Reporting
* AI-Assisted Productivity Features

The layered design allows these capabilities to be introduced while preserving clear separation of concerns and maintaining a scalable, maintainable codebase.
