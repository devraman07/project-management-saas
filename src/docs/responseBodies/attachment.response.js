export const attachmentResponses = {
  AttachmentResponse: {
    description: "Attachment retrieved successfully.",

    content: {
      "application/json": {
        schema: {
          type: "object",

          properties: {
            success: {
              type: "boolean",
              example: true,
            },

            statusCode: {
              type: "integer",
              example: 200,
            },

            message: {
              type: "string",
              example: "Attachment retrieved successfully.",
            },

            attachment: {
              $ref: "#/components/schemas/Attachment",
            },
          },
        },
      },
    },
  },

  AttachmentListResponse: {
    description: "Attachments retrieved successfully.",

    content: {
      "application/json": {
        schema: {
          type: "object",

          properties: {
            success: {
              type: "boolean",
              example: true,
            },

            statusCode: {
              type: "integer",
              example: 200,
            },

            message: {
              type: "string",
              example: "Attachments retrieved successfully.",
            },

            attachments: {
              type: "array",

              items: {
                $ref: "#/components/schemas/Attachment",
              },
            },
          },
        },
      },
    },
  },

  AttachmentCreatedResponse: {
    description: "Attachment uploaded successfully.",

    content: {
      "application/json": {
        schema: {
          type: "object",

          properties: {
            success: {
              type: "boolean",
              example: true,
            },

            statusCode: {
              type: "integer",
              example: 201,
            },

            message: {
              type: "string",
              example: "Attachment uploaded successfully.",
            },

            attachment: {
              $ref: "#/components/schemas/Attachment",
            },
          },
        },
      },
    },
  },

  AttachmentDeletedResponse: {
    description: "Attachment deleted successfully.",

    content: {
      "application/json": {
        schema: {
          type: "object",

          properties: {
            success: {
              type: "boolean",
              example: true,
            },

            statusCode: {
              type: "integer",
              example: 200,
            },

            message: {
              type: "string",
              example: "Attachment deleted successfully.",
            },
          },
        },
      },
    },
  },
};