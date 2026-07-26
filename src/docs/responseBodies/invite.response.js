export const inviteResponses = {

  InviteResponse: {

    description: "Invite details.",

    content: {

      "application/json": {

        schema: {

          type: "object",

          properties: {

            success: {
              type: "boolean",
            },

            invite: {
              $ref: "#/components/schemas/Invite",
            },

          },

        },

      },

    },

  },

};