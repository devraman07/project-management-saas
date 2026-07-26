export const paginationResponse = {

  PaginationMeta: {

    type: "object",

    properties: {

      page: {
        type: "integer",
        example: 1,
      },

      limit: {
        type: "integer",
        example: 10,
      },

      totalItems: {
        type: "integer",
        example: 250,
      },

      totalPages: {
        type: "integer",
        example: 25,
      },

      hasNextPage: {
        type: "boolean",
        example: true,
      },

      hasPreviousPage: {
        type: "boolean",
        example: false,
      },

    },

  },

};