export const attachmentSchemas = {
  Attachment: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      originalName: {
        type: "string",
      },

      fileName: {
        type: "string",
      },

      mimeType: {
        type: "string",
      },

      fileSize: {
        type: "integer",
      },

      url: {
        type: "string",
        format: "uri",
      },

      createdAt: {
        type: "string",
        format: "date-time",
      },
    },
  },
};