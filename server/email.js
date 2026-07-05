import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const RESEND_API_KEY = process.env.RESEND_API_KEY;

let resend;

export function getResend() {
  if (!resend && RESEND_API_KEY) {
    resend = new Resend(RESEND_API_KEY);
  }
  return resend;
}

export async function sendWelcomeEmail(email, name) {
  const client = getResend();
  if (!client) {
    console.log('Resend not configured — skipping welcome email to', email);
    return;
  }

  try {
    await client.emails.send({
      from: 'Build Mode <noreply@buildmode.app>',
      to: email,
      subject: 'Welcome to Build Mode: The Man\'s Workshop',
      html: `
        <div style="font-family: 'Inter', system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <span style="font-size: 48px;">🔧</span>
            <h1 style="color: #166534; font-size: 24px; margin: 16px 0 4px;">Welcome to Build Mode</h1>
            <p style="color: #6b7280; font-size: 16px; margin: 0;">The Man's Workshop</p>
          </div>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hey${name ? ` ${name}` : ' there'},</p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">Welcome to Build Mode. You've taken the first step toward becoming more capable, emotionally mature, and resilient.</p>
          <div style="background-color: #f0fdf4; border-radius: 12px; padding: 24px; margin: 24px 0;">
            <h2 style="color: #166534; font-size: 18px; margin: 0 0 12px;">Here's what to do next:</h2>
            <ol style="color: #374151; font-size: 15px; line-height: 1.8; padding-left: 20px;">
              <li>Complete your first lesson</li>
              <li>Set up a daily habit</li>
              <li>Take on today's challenge</li>
            </ol>
          </div>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">Start building at <a href="https://buildmode.app" style="color: #16a34a; text-decoration: underline;">buildmode.app</a></p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
          <p style="color: #9ca3af; font-size: 13px; text-align: center;">Build Mode: The Man's Workshop</p>
        </div>
      `
    });
    console.log('Welcome email sent to', email);
  } catch (err) {
    console.error('Failed to send welcome email:', err.message);
  }
}