export const swaggerDefinition = {
  openapi: "3.0.3",

  info: {
    title: "ProjectFlow API",
    version: "1.0.0",
    description:
      "ProjectFlow is a multi-tenant project management API built with Node.js, Express, PostgreSQL, Drizzle ORM, Redis, BullMQ, Cloudinary, and JWT authentication.",
    contact: {
      name: "Raman Patra",
    },
  },

  servers: [
    {
      url: "http://localhost:3000/api/v1",
      description: "Local Development",
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },

  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    { name: "Authentication" },
    { name: "Users" },
    { name: "Organizations" },
    { name: "Memberships" },
    { name: "Invites" },
    { name: "Projects" },
    { name: "Tasks" },
    { name: "Comments" },
    { name: "Replies" },
    { name: "Attachments" },
    { name: "Notifications" },
  ],
};

export const swaggerOptions = {
  definition: swaggerDefinition,

  apis: ["./src/modules/**/*.routes.js", "./src/modules/**/*.controller.js"],
};
