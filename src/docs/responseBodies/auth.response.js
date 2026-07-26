export const authResponses = {

  LoginSuccess: {

    description: "User logged in successfully.",

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
              example: "Login successful.",
            },

            accessToken: {
              type: "string",
            },

            refreshToken: {
              type: "string",
            },

            user: {
              $ref: "#/components/schemas/User",
            },

          },

        },

      },

    },

  },

};