export const inviteSchemas = {
  Invite: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      invitedEmail: {
        type: "string",
        format: "email",
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
      },

      status: {
        type: "string",

        enum: [
          "PENDING",
          "ACCEPTED",
          "EXPIRED",
          "REVOKED",
        ],
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