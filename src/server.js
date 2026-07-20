import express from "express";

import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { AuthRouter } from "./features/auth/auth.routes.js";
import { userRouter } from "./features/users/users.routes.js";
import { orgRouter } from "./features/organizations/organization.routes.js";
import { memberShipRouter } from "./features/memberships/memberships.routes.js";
import { projectRouter } from "./features/projects/project.route.js";
import { taskRouter } from "./features/tasks/task.route.js";
import { inviteRouter } from "./features/Invites/invites.routes.js";
import "./jobs/workers/email.worker.js";
import { logger } from "./shared/logger/logger.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { notificationRouter } from "./features/notifications/notification.routes.js";
import { multerErrorMiddleware } from "./middlewares/multererror.middleware.js";
import { db } from "./configs/db.js";
import { redisConnection } from "./configs/redis.js";
import { cloudinaryConnect } from "./configs/cloudinary.js";
import { attachmentRouter } from "./features/attachments/attachment.router.js";
dotenv.config();

const app = express();


const port = 3000;

app.use((req, res, next) => {
  console.log("Method:", req.method);
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("Content-Length:", req.headers["content-length"]);
  next();
});

app.use(express.json());
app.use(cookieParser());





app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/organizations", orgRouter);
app.use("/api/v1/memberships", memberShipRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/invites", inviteRouter);
app.use("/api/v1/organizations", notificationRouter);
app.use("/api/v1/attachments", attachmentRouter);

app.get("/", (req, res) => {
    res.send("Task management api working");
});




app.use(multerErrorMiddleware);
app.use(errorMiddleware);



await cloudinaryConnect();

app.listen(port, () => {
    logger.info(`server is running on port 3000`);
});