export const organizationResponses = {

  OrganizationResponse: {

    description: "Organization details.",

    content: {

      "application/json": {

        schema: {

          type: "object",

          properties: {

            success: {
              type: "boolean",
              example: true,
            },

            organization: {
              $ref: "#/components/schemas/Organization",
            },

          },

        },

      },

    },

  },

  OrganizationListResponse: {

    description: "Organizations retrieved successfully.",

    content: {

      "application/json": {

        schema: {

          type: "object",

          properties: {

            success: {
              type: "boolean",
            },

            organizations: {

              type: "array",

              items: {
                $ref: "#/components/schemas/Organization",
              },

            },

          },

        },

      },

    },

  },

};