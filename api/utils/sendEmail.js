const nodemailer = require("nodemailer");

const sendEmail = async (options) => {

    const transporter = nodemailer.createTransport({
        host: process.env.API_MAILER_HOST,
        port: process.env.API_MAILER_PORT,
        // auth: {
        //     user: process.env.API_MAILER_USERNAME,
        //     pass: process.env.API_MAILER_PASSWORD
        // }
    });

    const message = await transporter.sendMail({
        from:  `${process.env.API_MAILER_FROM_NAME} <${process.env.API_MAILER_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    });

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;