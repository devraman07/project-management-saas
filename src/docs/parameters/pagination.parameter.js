export const paginationParameters = {
  Page: {
    name: "page",
    in: "query",
    required: false,

    description: "Page number",

    schema: {
      type: "integer",
      minimum: 1,
      default: 1,
    },

    example: 1,
  },

  Limit: {
    name: "limit",
    in: "query",
    required: false,

    description: "Number of records per page",

    schema: {
      type: "integer",
      minimum: 1,
      maximum: 100,
      default: 10,
    },

    example: 10,
  },

  Search: {
    name: "search",
    in: "query",
    required: false,

    description: "Search keyword",

    schema: {
      type: "string",
    },

    example: "authentication",
  },

  SortBy: {
    name: "sortBy",
    in: "query",
    required: false,

    description: "Field used for sorting",

    schema: {
      type: "string",
      default: "createdAt",
    },

    example: "createdAt",
  },

  SortOrder: {
    name: "sortOrder",
    in: "query",
    required: false,

    description: "Sorting direction",

    schema: {
      type: "string",
      enum: ["asc", "desc"],
      default: "desc",
    },

    example: "desc",
  },
};