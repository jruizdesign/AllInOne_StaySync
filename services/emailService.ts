/**
 * Service to handle email sending.
 * intended to connect to a backend endpoint (e.g. Firebase Cloud Function or Next.js API route)
 * that wraps an SMTP transporter (like Nodemailer).
 */

interface EmailPayload {
  to: string;
  subject: string;
  body: string; // HTML or Text
}

export const sendEmail = async (payload: EmailPayload): Promise<{ success: boolean; message: string }> => {
  console.log('Attempting to send email:', payload);

  // TODO: Replace with actual API call to your SMTP backend
  // const response = await fetch('/api/send-email', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // return response.json();

  // Mock response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Email queued successfully via SMTP service.' });
    }, 1500);
  });
};
