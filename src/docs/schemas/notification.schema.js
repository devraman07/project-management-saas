export const notificationSchemas = {
  Notification: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      recipientMembershipId: {
        type: "string",
        format: "uuid",
      },

      activityId: {
        type: "string",
        format: "uuid",
      },

      isRead: {
        type: "boolean",
      },

      readAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },

      createdAt: {
        type: "string",
        format: "date-time",
      },
    },
  },
};