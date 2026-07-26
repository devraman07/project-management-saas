export const organizationSchemas = {
  Organization: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      name: {
        type: "string",
        example: "ProjectFlow Inc",
      },

      createdBy: {
        type: "string",
        format: "uuid",
      },

      createdAt: {
        type: "string",
        format: "date-time",
      },

      isDeleted: {
        type: "boolean",
      },

      deletedAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },
    },
  },
};