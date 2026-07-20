Authentication
│
├── POST /auth/register
├── POST /auth/login
├── POST /auth/refresh
├── POST /auth/logout
└── GET  /auth/profile

Users
│
├── GET    /users
├── GET    /users/profile
├── PATCH  /users/profile/:id
└── DELETE /users/profile/:id

Organizations
│
├── POST   /organizations
├── GET    /organizations
├── GET    /organizations/:id
├── PATCH  /organizations/:id
└── DELETE /organizations/:id

Memberships
│
├── GET    /memberships/me
├── GET    /organizations/:organizationId/members
├── POST   /organizations/:organizationId/members
├── PATCH  /organizations/:organizationId/members/:membershipId/role
└── DELETE /organizations/:organizationId/members/:membershipId

Invites
│
├── POST   /organizations/:organizationId/invites
├── GET    /invites/:token
└── POST   /invites/:token/accept

Projects
│
├── POST   /organizations/:organizationId/projects
├── GET    /organizations/:organizationId/projects
├── GET    /projects/:projectId
├── PATCH  /projects/:projectId
├── PATCH  /projects/:projectId/status
└── DELETE /projects/:projectId

Tasks
│
├── POST   /projects/:projectId/tasks
├── GET    /projects/:projectId/tasks
├── GET    /tasks/:taskId
├── PATCH  /tasks/:taskId
├── PATCH  /tasks/:taskId/status
├── PATCH  /tasks/:taskId/assign
└── DELETE /tasks/:taskId

Comments
│
├── POST   /tasks/:taskId/comments
├── GET    /tasks/:taskId/comments
├── PATCH  /tasks/:taskId/comments/:commentId/update
└── PATCH  /tasks/:taskId/comments/:commentId/delete

Attachments
│
├── POST   /tasks/:taskId/attachments
├── GET    /tasks/:taskId/attachments
├── GET    /attachments/:attachmentId
└── PATCH  /attachments/:attachmentId/delete

Notifications
│
├── GET    /organizations/:organizationId/notifications
├── PATCH  /organizations/:organizationId/notifications/:notificationId/read
└── PATCH  /organizations/:organizationId/notifications/read-all