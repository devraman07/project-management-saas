# Secure Team Task Manager API

A production-style backend revision project built with Node.js and Express.js to strengthen backend engineering fundamentals.

This project focuses on authentication, authorization, ownership-based access control, modular architecture, request lifecycle understanding, and workflow-driven task management.

---

## Project Goal

This project was built as a backend engineering revision system to deeply understand:

* Authentication flow
* Authorization (RBAC)
* Middleware chaining
* Service-controller architecture
* Request lifecycle
* Resource ownership
* Task workflows
* Validation & transformation
* Production-grade backend patterns

Current version uses in-memory arrays instead of database storage for learning core backend architecture first.

Database integration will be added in the next version.

---

## Tech Stack

* Node.js
* Express.js
* JWT
* bcrypt
* express-validator
* express-session
* Cookies
* Helmet
* CORS

---

## Architecture

Feature-based modular architecture:

```bash
src/
│── config/
│── data/
│── middlewares/
│── shared/
│
├── features/
│   ├── auth/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── validators/
│   │   ├── transformers/
│   │
│   ├── users/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── validators/
│   │   ├── transformers/
│   │
│   ├── tasks/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── validators/
│   │   ├── transformers/
```

---

## Features Completed

# Authentication Module

* User Registration
* User Login
* Logout
* Refresh Token Rotation
* Password Hashing with bcrypt
* JWT Access Token
* JWT Refresh Token
* Token Blacklisting
* Session-based fallback authentication

### Auth Middlewares

* Auth Middleware
* Role Middleware

---

# User Module

* Get All Users
* Get User Profile
* Update Profile
* Delete Profile

### User Access Patterns

* Ownership check
* Owner or Admin deletion

### User Middlewares

* Ownership Middleware
* OwnerOrAdmin Middleware

---

# Task Module

Workflow-driven task management system.

## Manager Actions

* Create Task
* Update Task
* Delete Task
* Assign Task
* Reassign Task
* Get Own Tasks

## Member Actions

* View Assigned Tasks
* Update Task Status

## Admin Actions

* View All Tasks

---

## Task Workflow System

Separate workflow routes:

```bash
PATCH /tasks/:id
PATCH /tasks/:id/assign
PATCH /tasks/:id/status
```

This separates:

* task structure updates
* task assignment
* task execution lifecycle

---

## Role System

Roles:

```bash
ADMIN
MANAGER
MEMBER
```

RBAC is implemented throughout the project.

---

## Task Status System

Task statuses:

```bash
PENDING
IN_PROGRESS
COMPLETED
```

Stored as constants.

---

## Security Implemented

* JWT Authentication
* Refresh Token Validation
* Password Hashing
* Protected Routes
* Token Blacklisting
* Ownership-based Access Control
* Role-based Authorization

---

## Core Backend Concepts Practiced

* Request lifecycle
* Middleware chaining
* Controller-Service separation
* DTO validation
* Input transformation
* RBAC
* Ownership pattern
* Resource relation integrity
* Session + JWT hybrid auth
* Modular backend architecture

---

## Future Upgrades (Version 2)

* MongoDB integration
* Mongoose schemas
* Centralized error handling
* Pagination
* Filtering
* Sorting
* Search
* Redis caching
* Rate limiting
* Secure cookies
* CSRF protection
* SaaS multi-team architecture
* Notifications system
* Audit logs
* Event-driven architecture

---

## Learning Focus

This project is part of my backend engineering journey to master:

* Backend fundamentals
* Scalable API design
* Production-grade architecture
* System design thinking

Next version will rebuild this with database persistence and advanced backend optimizations.
