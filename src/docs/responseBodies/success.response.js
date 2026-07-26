export const successResponses = {

  Success: {
    description: "Request completed successfully.",

    content: {
      "application/json": {
        schema: {
          type: "object",

          properties: {
            success: {
              type: "boolean",
              example: true,
            },

            message: {
              type: "string",
              example: "Operation completed successfully.",
            },
          },
        },
      },
    },
  },

  Created: {
    description: "Resource created successfully.",

    content: {
      "application/json": {
        schema: {
          type: "object",

          properties: {
            success: {
              type: "boolean",
              example: true,
            },

            message: {
              type: "string",
              example: "Created successfully.",
            },
          },
        },
      },
    },
  },

};