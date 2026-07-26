export const errorResponses = {

  BadRequest: {
    description: "Bad Request",

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
              example: "Validation failed.",
            },
          },
        },
      },
    },
  },

  Unauthorized: {
    description: "Authentication required.",

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
              example: "Unauthorized.",
            },
          },
        },
      },
    },
  },

  Forbidden: {
    description: "Permission denied.",

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
              example: "Forbidden.",
            },
          },
        },
      },
    },
  },

  NotFound: {
    description: "Resource not found.",

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
              example: "Not found.",
            },
          },
        },
      },
    },
  },

  InternalServerError: {
    description: "Internal Server Error",

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
              example: "Internal server error.",
            },
          },
        },
      },
    },
  },

};