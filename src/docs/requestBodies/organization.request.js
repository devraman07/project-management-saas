export const organizationRequests = {

  CreateOrganization: {

    required: true,

    content: {

      "application/json": {

        schema: {

          type: "object",

          required: [
            "name",
          ],

          properties: {

            name: {
              type: "string",
              minLength: 3,
              maxLength: 255,
              example: "ProjectFlow",
            },

          },

        },

      },

    },

  },

  UpdateOrganization: {

    required: true,

    content: {

      "application/json": {

        schema: {

          type: "object",

          properties: {

            name: {
              type: "string",
              example: "ProjectFlow v2",
            },

          },

        },

      },

    },

  },

};