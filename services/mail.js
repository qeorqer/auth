const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

module.exports.sendActivationMail = (to, link) => {
  transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject: 'Account activation',
    text: '',
    html:
      `
                    <div>
                        <h1>For activation follow the link</h1>
                        <a href='${link}'>${link}</a>
                    </div>
                `,
  });
};
