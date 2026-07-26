export const taskResponses = {

  TaskResponse: {

    description: "Task details.",

    content: {

      "application/json": {

        schema: {

          type: "object",

          properties: {

            success: {
              type: "boolean",
            },

            task: {
              $ref: "#/components/schemas/Task",
            },

          },

        },

      },

    },

  },

  TaskListResponse: {

    description: "Tasks retrieved successfully.",

    content: {

      "application/json": {

        schema: {

          type: "object",

          properties: {

            success: {
              type: "boolean",
            },

            tasks: {

              type: "array",

              items: {
                $ref: "#/components/schemas/Task",
              },

            },

          },

        },

      },

    },

  },

};