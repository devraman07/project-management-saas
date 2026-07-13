Current ProjectFlow Transactions
✅ 1. Organization Transaction
organizations
        ↓
memberships

Returns

{
  organization,
  ownerMembership,
}
✅ 2. Invite Acceptance Transaction
memberships
        ↓
invites

Returns

{
   membership,
   invite,
}
Next Transactions
3. Remove Member Transaction
Membership

↓

Check not Owner

↓

Delete Membership

↓

Update Assigned Tasks (optional)

↓

Commit

Future:

memberships

↓

tasks

↓

activity

Returns

{
   membership
}
4. Change Role Transaction
Membership

↓

Update Role

↓

Commit

Future

membership

↓

audit log

↓

activity

Returns

{
   membership
}
5. Archive Project Transaction

Currently

projects

Later

projects

↓

tasks

↓

project settings

Returns

{
    project
}
6. Delete Project Transaction
projects

↓

tasks

↓

activity

↓

notifications

Everything rolls back together.

7. Assign Task Transaction

This becomes important later.

tasks

↓

activity

↓

notifications

Notice

Activity and Notification queues happen after commit.

The transaction only updates DB.

8. Complete Task Transaction
tasks

↓

task_history

↓

statistics

Future

tasks

↓

task_history

↓

analytics
9. Restore Organization
organizations

↓

projects

↓

memberships
10. Delete Organization

This will become the largest one.

organizations

↓

projects

↓

tasks

↓

memberships

↓

invites

↓

activity_logs

↓

notifications
11. Create Project

Currently

projects

Not worth a transaction.

Future

projects

↓

project_settings

↓

default_columns

↓

default_labels

Then yes.

12. Create Task

Currently

tasks

Not worth it.

Future

tasks

↓

task_history

↓

attachments

↓

labels

Then yes.

Transactions We DON'T Need
Register

Login

Logout

Refresh Token

Profile

Get Tasks

Get Projects

Get Invites

Search

Pagination

These are single-table reads/writes or authentication operations and don't require coordinating multiple database changes.

Final Transaction Folder
src/

transactions/

    organization.transaction.js

    invite.transaction.js

    membership.transaction.js

    project.transaction.js

    task.transaction.js

Inside those files you'll eventually expose functions like:

organization.transaction.js
---------------------------
createOrganizationTransaction()

project.transaction.js
----------------------
archiveProjectTransaction()

deleteProjectTransaction()

membership.transaction.js
-------------------------
acceptInviteTransaction()

removeMemberTransaction()

changeRoleTransaction()

task.transaction.js
-------------------
assignTaskTransaction()

completeTaskTransaction()

deleteTaskTransaction()