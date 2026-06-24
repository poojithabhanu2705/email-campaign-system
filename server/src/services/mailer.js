import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP transporter verification failed:', error);
  } else {
    console.log('SMTP transporter is ready');
  }
});

export async function sendEmail(to, subject, html) {
  const from = process.env.FROM_EMAIL || process.env.SMTP_USER;
  const info = await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });

  console.log('SMTP sendMail response:', info);

  if (!info?.messageId) {
    throw new Error('SMTP did not return a messageId');
  }

  return info;
}
