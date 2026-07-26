export const membershipSchemas = {
  Membership: {
    type: "object",

    properties: {
      id: {
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
      },

      joinedAt: {
        type: "string",
        format: "date-time",
      },

      user: {
        $ref: "#/components/schemas/User",
      },

      organization: {
        $ref: "#/components/schemas/Organization",
      },
    },
  },
};