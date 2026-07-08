INFO
────
✔ Successful business events
✔ Infrastructure startup/shutdown
✔ Background job completion

WARN
────
✔ Expected business failures
✔ Invalid user actions
✔ Authorization/authentication failures
✔ Resource conflicts

ERROR
─────
✔ Unexpected exceptions
✔ Infrastructure failures
✔ External service failures
✔ Worker failures
✔ Database/Redis failures

DEBUG (Future)
──────────────
✔ SQL queries
✔ Request timing
✔ Development-only diagnostics


📘 ProjectFlow V2 Logging Checklist
🟢 1. Authentication Module
logger.info()
✅ User Registered

✅ User Logged In

✅ Refresh Token Rotated

✅ User Logged Out

✅ Password Changed

✅ Password Reset Completed

✅ Email Verified
logger.warn()
⚠ User Already Exists

⚠ Login Failed

⚠ Wrong Password

⚠ Invalid Refresh Token

⚠ Revoked Refresh Token

⚠ Expired Refresh Token

⚠ Invalid JWT

⚠ Unauthorized Request
logger.error()
❌ Never inside Auth Service

Only inside:

• Email Worker

• Global Error Middleware

• Redis

• PostgreSQL

• Cron Jobs
🏢 2. Organization Module
logger.info()
✅ Organization Created

✅ Organization Updated

✅ Organization Deleted

✅ Organization Restored

✅ Ownership Transferred
logger.warn()
⚠ Duplicate Organization Name

⚠ User Already Owner

⚠ User Not Organization Member

⚠ Invalid Organization
👥 3. Membership Module
logger.info()
✅ Member Added

✅ Member Removed

✅ Member Role Changed

✅ User Left Organization
logger.warn()
⚠ Member Already Exists

⚠ Cannot Remove Owner

⚠ Invalid Role Change

⚠ User Not Member
✉ 4. Invite Module
logger.info()
✅ Invite Created

✅ Invite Sent

✅ Invite Accepted

✅ Invite Revoked

✅ Invite Expired
logger.warn()
⚠ Invite Already Exists

⚠ Invalid Invite Token

⚠ Expired Invite

⚠ Invite Already Accepted

⚠ Email Mismatch
📁 5. Project Module
logger.info()
✅ Project Created

✅ Project Updated

✅ Project Archived

✅ Project Restored

✅ Manager Assigned
logger.warn()
⚠ Duplicate Project Name

⚠ Invalid Project

⚠ User Cannot Access Project
✅ 6. Task Module
logger.info()
✅ Task Created

✅ Task Assigned

✅ Task Reassigned

✅ Task Updated

✅ Task Archived

✅ Task Restored

✅ Task Completed
logger.warn()
⚠ Task Already Assigned

⚠ Invalid Assignee

⚠ Invalid Task Status

⚠ Task Not Found
📧 7. Email Worker
logger.info()
✅ Welcome Email Sent

✅ Invite Email Sent

✅ Reminder Email Sent

✅ Daily Report Sent
logger.error()
❌ Email Failed

❌ SMTP Failure

❌ Queue Processing Failed
🔁 8. BullMQ
logger.info()
✅ Job Started

✅ Job Completed

✅ Job Retried
logger.warn()
⚠ Retry Attempt
logger.error()
❌ Job Failed

❌ Queue Failed

❌ Dead Letter Queue
🗄 9. PostgreSQL
logger.info()
✅ Database Connected
logger.error()
❌ Connection Failed

❌ Transaction Failed
🚀 10. Server
logger.info()
✅ Server Started

✅ Graceful Shutdown

✅ Health Check Passed
logger.warn()
⚠ High Memory Usage

⚠ Slow Request
logger.error()
❌ Server Crash

❌ Unhandled Rejection

❌ Uncaught Exception
🔴 11. Redis
logger.info()
✅ Redis Connected

✅ Cache Cleared
logger.warn()
⚠ Cache Miss
logger.error()
❌ Redis Disconnected

❌ Redis Timeout
📅 12. Cron Jobs
logger.info()
✅ Cleanup Started

✅ Cleanup Completed

✅ Expired Tokens Removed

✅ Expired Invites Removed
logger.error()
❌ Cleanup Failed
🌐 13. Global Error Middleware
logger.error()

Every unexpected exception should be logged here.

