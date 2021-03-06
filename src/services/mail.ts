import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USER!,
    pass: process.env.MAIL_PASSWORD!,
  },
});

export const sendActivationMail = (to: string, link: string) => {
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
