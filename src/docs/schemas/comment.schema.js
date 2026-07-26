export const commentSchemas = {
  Comment: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      taskId: {
        type: "string",
        format: "uuid",
      },

      membershipId: {
        type: "string",
        format: "uuid",
      },

      parentCommentId: {
        type: "string",
        format: "uuid",
        nullable: true,
      },

      content: {
        type: "string",
      },

      edited: {
        type: "boolean",
      },

      createdAt: {
        type: "string",
        format: "date-time",
      },

      updatedAt: {
        type: "string",
        format: "date-time",
      },
    },
  },
};