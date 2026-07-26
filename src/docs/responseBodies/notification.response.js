export const notificationResponses = {

  NotificationListResponse: {

    description: "Notifications retrieved successfully.",

    content: {

      "application/json": {

        schema: {

          type: "object",

          properties: {

            success: {
              type: "boolean",
            },

            notifications: {

              type: "array",

              items: {
                $ref: "#/components/schemas/Notification",
              },

            },

          },

        },

      },

    },

  },

};