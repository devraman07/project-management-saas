export const membershipSchemas = {
  Membership: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      userId: {
        type: "string",
        format: "uuid",
      },

      organizationId: {
        type: "string",
        format: "uuid",
      },

      role: {
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

      invitedBy: {
        type: "string",
        format: "uuid",
        nullable: true,
      },

      joinedAt: {
        type: "string",
        format: "date-time",
      },
    },
  },
};