import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail({ to, subject, text, html, from }) {
  const sender = from || process.env.RESEND_FROM || process.env.EMAIL_USER || 'no-reply@resend.dev';
  return await resend.emails.send({
    from: sender,
    to,
    subject,
    text,
    html,
  });
}

export default sendEmail;
