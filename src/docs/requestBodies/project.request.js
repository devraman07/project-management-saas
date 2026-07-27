export const projectRequests = {

  CreateProject: {

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
              example: "Backend API",
            },

            description: {
              type: "string",
              example: "Handles authentication.",
            },

            managerId: {
              type: "string",
              format: "uuid",
            },

          },

        },

      },

    },

  },

  UpdateProject: {

    required: true,

    content: {

      "application/json": {

        schema: {

          type: "object",

          properties: {

            name: {
              type: "string",
            },

            description: {
              type: "string",
            },

            managerId: {
              type: "string",
              format: "uuid",
            },

          },

        },

      },

    },

  },

  UpdateProjectStatus: {

    required: true,

    content: {

      "application/json": {

        schema: {

          type: "object",

          required: [
            "status",
          ],

          properties: {

            status: {

              type: "string",

              enum: [
                "ACTIVE",
                "PLANNING",
                "COMPLETED",
                "ON_HOLD",
              ],

            },

          },

        },

      },

    },

  },

};