export const projectResponses = {

  ProjectResponse: {

    description: "Project details.",

    content: {

      "application/json": {

        schema: {

          type: "object",

          properties: {

            success: {
              type: "boolean",
            },

            project: {
              $ref: "#/components/schemas/Project",
            },

          },

        },

      },

    },

  },

  ProjectListResponse: {

    description: "Projects retrieved successfully.",

    content: {

      "application/json": {

        schema: {

          type: "object",

          properties: {

            success: {
              type: "boolean",
            },

            projects: {

              type: "array",

              items: {
                $ref: "#/components/schemas/Project",
              },

            },

          },

        },

      },

    },

  },

};