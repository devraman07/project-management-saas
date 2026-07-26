export const inviteSchemas = {
  Invite: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      organizationId: {
        type: "string",
        format: "uuid",
      },

      invitedEmail: {
        type: "string",
        format: "email",
        example: "member@example.com",
      },

      roleToAssign: {
        type: "string",
        enum: [
          "OWNER",
          "ADMIN",
          "PROJECT_MANAGER",
          "MEMBER",
          "VIEWER",
        ],
        example: "MEMBER",
      },

      token: {
        type: "string",
        example: "9cdd7db5-5db8-43d0-b7b7-99e36bbaf1fd",
      },

      status: {
        type: "string",
        enum: [
          "PENDING",
          "ACCEPTED",
          "EXPIRED",
          "REVOKED",
        ],
        example: "PENDING",
      },

      invitedBy: {
        type: "string",
        format: "uuid",
        nullable: true,
      },

      expiresAt: {
        type: "string",
        format: "date-time",
      },

      createdAt: {
        type: "string",
        format: "date-time",
      },
    },
  },
};