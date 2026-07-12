

import nodemailer from "nodemailer";
import { logger } from "../shared/logger/logger.js";


export const transporter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : process.env.MAIL_USER,
        pass : process.env.MAIL_PASS,
    },
});

if(!transporter) {
   logger.error("mail config failed");
}