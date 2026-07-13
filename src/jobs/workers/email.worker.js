import dotenv from "dotenv";

dotenv.config();
import { Worker } from "bullmq";
import { redisConnection } from "../../configs/redis.js";
import { sendMail } from "../../shared/utils/sendMail.js";


console.log("email worker started");

export const emailWorker = new Worker(
  "email",
  async (job) => {
    console.log("Processing email job:", job.name);

    try {
      if (job.name === "welcome-email") {
        await sendMail({
          to: job.data.email,
          subject: "Welcome to TaskFlow",
          html: `
            <h1>Welcome ${job.data.name}</h1>
            <p>Your account has been created successfully.</p>
          `,
        });

        console.log(`Welcome email sent to ${job.data.email}`);
      }

      if (job.name === "invite-email") {
        const inviteLink = `http://localhost:3000/invites/${job.data.token}`;

        console.log("Sending invite email...");
        console.log(job.data);

        await sendMail({
          to: job.data.email,
          subject: "Organization Invite",
          html: `
            <h1>You have been invited</h1>
            <p>Click below to join organization</p>
            <a href="${inviteLink}">
              Accept Invite
            </a>
          `,
        });

        console.log(`Invite email sent to ${job.data.email}`);
      }
    } catch (err) {
      console.error("Worker error:", err);
      throw err;
    }
  },
  {
    connection: redisConnection,
  },
);
