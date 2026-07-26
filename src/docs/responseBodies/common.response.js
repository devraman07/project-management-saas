export const commonResponses = {

  Unauthorized: {
    $ref: "#/components/responses/Unauthorized",
  },

  Forbidden: {
    $ref: "#/components/responses/Forbidden",
  },

  BadRequest: {
    $ref: "#/components/responses/BadRequest",
  },

  NotFound: {
    $ref: "#/components/responses/NotFound",
  },

  Conflict: {
    description: "Resource conflict.",

    content: {
      "application/json": {
        schema: {
          type: "object",

          properties: {
            success: {
              type: "boolean",
              example: false,
            },

            message: {
              type: "string",
              example: "Resource already exists.",
            },
          },
        },
      },
    },
  },

};