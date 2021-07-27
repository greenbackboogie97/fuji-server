const nodemailer = require('nodemailer');

const secure = process.env.NODE_ENV === 'development' ? false : true;

const sendEmail = async (recipient, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    secure,
    auth: {
      user: process.env.EMAIL_AUTH_USER,
      pass: process.env.EMAIL_AUTH_PASS,
    },
  });

  await transporter.sendMail({
    from: 'Phuji Admin 🗻',
    to: recipient,
    subject,
    text,
  });
};

module.exports = sendEmail;
