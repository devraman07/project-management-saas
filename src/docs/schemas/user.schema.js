export const userSchemas = {
  User: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      name: {
        type: "string",
        example: "Raman Patra",
      },

      username: {
        type: "string",
        example: "raman007",
      },

      email: {
        type: "string",
        format: "email",
        example: "raman@example.com",
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
