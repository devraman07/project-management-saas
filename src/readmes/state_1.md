# Secure Team Task Manager API — State 1

## Version: v1.0.0

Initial functional version of the Secure Team Task Manager API.

This version focuses on mastering backend fundamentals using in-memory architecture before introducing database persistence.

The goal of this phase was to deeply understand:

* Request lifecycle
* Middleware chaining
* JWT authentication
* Refresh token flow
* RBAC
* Ownership-based authorization
* Workflow-based API design

---

## Architecture (Initial)

```text
Route
↓
Middleware
↓
Controller
↓
Service
↓
In-memory Arrays
```

No repository layer.

Services directly accessed:

* users array
* tasks array
* refreshTokens array
* blacklistedTokens array

---

## Tech Stack

* Node.js
* Express.js
* JWT
* bcrypt
* express-validator
* express-session
* Helmet
* CORS

---

## Modules Completed

### Authentication

Implemented:

* Register
* Login
* Logout
* Refresh Token
* Session-based auth fallback

Features:

* Access Token
* Refresh Token
* Token Blacklisting

---

### Users

Implemented:

* Get All Users
* Get Profile
* Update Profile
* Delete Profile

Features:

* Ownership checks
* Owner/Admin access pattern

---

### Tasks

Implemented:

* Create Task
* Get Tasks
* Update Task
* Delete Task
* Assign Task
* Update Task Status

Workflow roles:

Admin:

* View all tasks

Manager:

* Create
* Assign
* Reassign
* Update
* Delete

Member:

* View assigned tasks
* Update task status

---

## Validation Layer

Implemented:

* Register validation
* Login validation
* User update validation
* Task creation validation
* Task update validation
* Task assignment validation
* Task status validation

---

## Transformer Layer

Implemented:

* Name trimming
* Email normalization
* Task title normalization
* Task description normalization
* Status normalization

---

## Problems in State 1

* Fat controllers
* Services tightly coupled to arrays
* Direct data mutation inside services
* No repository abstraction
* Repeated try/catch blocks
* Mixed transport + business logic
* Harder database migration path

---

## Learning Outcome
s
Built strong understanding of:

* API workflow design
* JWT lifecycle
* Access control
* Middleware architecture
* Service-controller separation (basic)

State 1 established the core backend foundation.
