import { userSchemas } from "./schemas/user.schema.js";
import { organizationSchemas } from "./schemas/organization.schema.js";
import { membershipSchemas } from "./schemas/membership.schema.js";
import { inviteSchemas } from "./schemas/invite.schema.js";
import { projectSchemas } from "./schemas/project.schema.js";
import { taskSchemas } from "./schemas/task.schema.js";
import { commentSchemas } from "./schemas/comment.schema.js";
import { attachmentSchemas } from "./schemas/attachment.schema.js";
import { notificationSchemas } from "./schemas/notification.schema.js";
import { activitySchemas } from "./schemas/activity.schema.js";
import { pathParameters } from "./parameters/path.parameter.js";
import { idParameters } from "./parameters/ids.parameter.js";
import { paginationParameters } from "./parameters/pagination.parameter.js";

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

    schemas: {
      ...userSchemas,
      ...organizationSchemas,
      ...membershipSchemas,
      ...inviteSchemas,
      ...projectSchemas,
      ...taskSchemas,
      ...commentSchemas,
      ...attachmentSchemas,
      ...notificationSchemas,
      ...activitySchemas,
    },
  },

  parameters : {
      ...pathParameters,
      ...idParameters,
      ...paginationParameters
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

  apis: [
    "./src/features/**/*.route.js",
    "./src/features/**/*.routes.js",
    "./src/features/**/*.controller.js",
  ],
};