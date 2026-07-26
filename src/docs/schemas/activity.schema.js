export const activitySchemas = {
  Activity: {
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

      actorMembershipId: {
        type: "string",
        format: "uuid",
        nullable: true,
      },

      action: {
        type: "string",
      },

      entityType: {
        type: "string",
      },

      entityId: {
        type: "string",
        format: "uuid",
      },

      metadata: {
        type: "object",
      },

      createdAt: {
        type: "string",
        format: "date-time",
      },
    },
  },
};