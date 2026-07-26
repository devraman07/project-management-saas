export const projectSchemas = {
  Project: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      name: {
        type: "string",
      },

      description: {
        type: "string",
        nullable: true,
      },

      status: {
        type: "string",

        enum: [
          "ACTIVE",
          "PLANNING",
          "COMPLETED",
          "ON_HOLD",
        ],
      },

      managerId: {
        type: "string",
        format: "uuid",
        nullable: true,
      },

      isArchived: {
        type: "boolean",
      },

      createdAt: {
        type: "string",
        format: "date-time",
      },
    },
  },
};