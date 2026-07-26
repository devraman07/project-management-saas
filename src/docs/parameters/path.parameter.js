export const pathParameters = {
  OrganizationId: {
    name: "organizationId",
    in: "path",
    required: true,

    description: "Organization ID",

    schema: {
      type: "string",
      format: "uuid",
    },

    example: "072829d0-098e-47e9-916c-d3029350d6d7",
  },

  ProjectId: {
    name: "projectId",
    in: "path",
    required: true,

    description: "Project ID",

    schema: {
      type: "string",
      format: "uuid",
    },

    example: "efb1cfe3-4bdb-44d4-b4e6-8d21dfe56710",
  },

  TaskId: {
    name: "taskId",
    in: "path",
    required: true,

    description: "Task ID",

    schema: {
      type: "string",
      format: "uuid",
    },

    example: "e0c0b134-bffd-4ece-b879-de2999d2f2b2",
  },

  CommentId: {
    name: "commentId",
    in: "path",
    required: true,

    description: "Comment ID",

    schema: {
      type: "string",
      format: "uuid",
    },

    example: "ca193eb4-fdda-48ff-9123-e04badbcc4e4",
  },

  ReplyId: {
    name: "replyId",
    in: "path",
    required: true,

    description: "Reply ID",

    schema: {
      type: "string",
      format: "uuid",
    },

    example: "9dbd7e7c-13db-4c08-8f58-c3e81d9d28f1",
  },

  MembershipId: {
    name: "membershipId",
    in: "path",
    required: true,

    description: "Membership ID",

    schema: {
      type: "string",
      format: "uuid",
    },

    example: "4c56f2d2-a9a9-49a2-8362-5216f096d240",
  },

  InviteId: {
    name: "inviteId",
    in: "path",
    required: true,

    description: "Invite ID",

    schema: {
      type: "string",
      format: "uuid",
    },

    example: "81d0b4d0-c85f-41dd-a90f-bfbe0fb7357b",
  },

  Token: {
    name: "token",
    in: "path",
    required: true,

    description: "Invitation token",

    schema: {
      type: "string",
    },

    example: "5c1b9f24f6d942c7b8d8f31ab43a8b72",
  },

  AttachmentId: {
    name: "attachmentId",
    in: "path",
    required: true,

    description: "Attachment ID",

    schema: {
      type: "string",
      format: "uuid",
    },

    example: "be8e8f4c-f74e-48fd-9d2f-f48af69fba52",
  },

  NotificationId: {
    name: "notificationId",
    in: "path",
    required: true,

    description: "Notification ID",

    schema: {
      type: "string",
      format: "uuid",
    },

    example: "d70ef9d7-8fd2-45ab-b639-c77ea59cfdfa",
  },

  UserId: {
    name: "id",
    in: "path",
    required: true,

    description: "User ID",

    schema: {
      type: "string",
      format: "uuid",
    },

    example: "1d92fe6d-5d47-4f4b-bb44-4ab2d2d91f13",
  },
};