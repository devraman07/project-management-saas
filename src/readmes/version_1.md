# Secure Task Management API - Version 1.0

A production-inspired backend for a collaborative project and task management platform built with **Node.js**, **Express.js**, **PostgreSQL**, **Drizzle ORM**, **Redis**, and **BullMQ**.

The project follows a layered architecture (Repository → Service → Controller) and demonstrates authentication, role-based authorization, organization management, project management, task management, invitation workflows, and asynchronous background jobs.

---

# Features

## Authentication

* User Registration
* User Login
* JWT Access Tokens
* Refresh Token Authentication
* Secure Logout
* Password Hashing using bcrypt
* Refresh Token Persistence

---

## Organization Management

* Create Organization
* Update Organization
* Get Organization Details
* Organization Membership Management
* Multi-Organization Support

---

## Role-Based Access Control (RBAC)

Supported Roles:

* OWNER
* ADMIN
* PROJECT_MANAGER
* MEMBER
* VIEWER

Permissions are enforced through middleware across the application.

---

# Project Management

* Create Project
* Get All Projects
* Get Project by ID
* Update Project Details
* Update Project Status
* Archive Project

---

# Task Management

* Create Task
* Get Tasks for a Project
* Get Task by ID
* Update Task
* Assign Task
* Update Task Status
* Delete Task

---

# Invitation System

* Create Organization Invite
* Email Invitation using BullMQ
* Secure Invite Tokens
* Validate Invite Token
* Accept Invite
* Automatic Membership Creation

---

# Background Jobs

Powered by:

* BullMQ
* Redis

Implemented Jobs:

* Welcome Email
* Organization Invite Email

The API server remains responsive while email processing happens asynchronously through dedicated workers.

---

# Tech Stack

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL
* Drizzle ORM

### Authentication

* JWT
* bcrypt

### Background Processing

* Redis
* BullMQ

### Email

* Nodemailer

### Containerization

* Docker (Redis)

---

# Architecture

Repository Layer

Responsible for all database operations.

↓

Service Layer

Contains business logic and validation.

↓

Controller Layer

Handles HTTP requests and responses.

↓

Routes

Expose REST APIs.

↓

Middlewares

Authentication

Authorization

Validation

Organization Membership

Role Permissions

---

# Security Features

* JWT Authentication
* Refresh Token Strategy
* Password Hashing
* Role-Based Authorization
* Organization Membership Validation
* Invite Token Validation
* Secure Background Email Processing

---

# Project Structure

```
src/
│
├── configs/
├── database/
├── features/
│   ├── auth/
│   ├── organizations/
│   ├── memberships/
│   ├── projects/
│   ├── tasks/
│   ├── invites/
│
├── jobs/
│   ├── queues/
│   └── workers/
│
├── middlewares/
├── repositories/
├── shared/
│   ├── utils/
│   ├── validators/
│   └── transformers/
│
└── server.js
```

---

# Current API Modules

* Authentication
* Organizations
* Memberships
* Projects
* Tasks
* Invites

---

# Version 1 Highlights

* Layered Backend Architecture
* Multi-Tenant Organization Design
* Role-Based Access Control
* Background Job Processing
* Email Queue using BullMQ
* Secure Invitation Workflow
* Dockerized Redis
* Production-Oriented Folder Structure

---

# Planned Features (Version 2)

* Database Transactions
* Email Verification
* Forgot Password
* Password Reset
* Invite Revocation
* Invite Resend
* Invite Management
* Scheduled Cleanup Jobs
* Weekly Productivity Reports

---

# Planned Features (Version 3)

* Audit Logs
* Application Logging
* Monitoring
* Analytics Dashboard
* Notification System
* Webhooks
* Performance Metrics
* Production Optimizations

---

# Learning Objectives

This project was built to understand and implement production backend engineering concepts, including:

* REST API Design
* Authentication & Authorization
* Layered Architecture
* Repository Pattern
* RBAC
* PostgreSQL Data Modeling
* Background Job Processing
* Redis Integration
* Docker Basics
* Scalable Backend Design

---

# Status

**Version:** 1.0

**Development Status:** Complete

Version 1 provides a complete backend foundation for a collaborative SaaS application. Future versions will focus on production-grade reliability, scalability, observability, and advanced collaboration features.
