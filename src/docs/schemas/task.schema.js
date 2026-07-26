export const taskSchemas = {
  Task: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      title: {
        type: "string",
      },

      description: {
        type: "string",
        nullable: true,
      },

      status: {
        type: "string",

        enum: [
          "TODO",
          "IN_PROGRESS",
          "DONE",
          "BLOCKED",
        ],
      },

      priority: {
        type: "string",

        enum: [
          "LOW",
          "MEDIUM",
          "HIGH",
          "URGENT",
        ],
      },

      dueDate: {
        type: "string",
        format: "date",
        nullable: true,
      },

      assignedTo: {
        type: "string",
        format: "uuid",
        nullable: true,
      },

      createdBy: {
        type: "string",
        format: "uuid",
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