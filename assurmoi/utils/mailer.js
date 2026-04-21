const { createTransport } = require('nodemailer');
require('dotenv').config();

const transporter = createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE === 'true' ?? false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
})

const mail = async (to, subject, text, html) => {
    try{
        const result = await transporter.sendMail({
            from: process.env.MAIL_FORM,
            to,
            subject,
            text,
            html
        })

        console.log('Mail sent: %s', result.messageId);
        return true;
    } catch (err) {
        console.log('Error while sending mail: %s', err);
    }
    
}

module.exports = {
    mail
}