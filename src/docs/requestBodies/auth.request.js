export const authRequests = {

  Register: {
    required: true,

    content: {
      "application/json": {
        schema: {
          type: "object",

          required: [
            "name",
            "username",
            "email",
            "password",
          ],

          properties: {

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

            password: {
              type: "string",
              format: "password",
              example: "Password@123",
            },

          },
        },
      },
    },
  },

  Login: {
    required: true,

    content: {
      "application/json": {
        schema: {

          type: "object",

          required: [
            "email",
            "password",
          ],

          properties: {

            email: {
              type: "string",
              format: "email",
            },

            password: {
              type: "string",
              format: "password",
            },

          },

        },
      },
    },
  },

};