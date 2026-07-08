

import {transporter} from  "../../configs/mails.js";


export const sendMail = async ({
    to, subject , html,
}) =>  {
    await transporter.sendMail({
        from : process.env.MAIL_USER,
        to,
        subject,
        html,
    });
};