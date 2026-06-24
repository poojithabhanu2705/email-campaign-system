import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail({ to, subject, text, html }) {
  const sender = 'onboarding@resend.dev';

  console.log('RESEND API KEY EXISTS:', !!process.env.RESEND_API_KEY);
  console.log('FROM:', sender);
  console.log('TO:', to);
  console.log('SUBJECT:', subject);

  const response = await resend.emails.send({
    from: sender,
    to,
    subject,
    text,
    html,
  });

  console.log('RESEND RESPONSE:', JSON.stringify(response, null, 2));

  if (response.error) {
    throw new Error(JSON.stringify(response.error));
  }

  if (!response?.data?.id) {
    throw new Error('Resend did not return an email ID.');
  }

  return response;
}

export default sendEmail;
