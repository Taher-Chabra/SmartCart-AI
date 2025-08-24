import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.GMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const sendVerificationEmail = async (
  email: string,
  verificationCode: string
): Promise<{ success: boolean; error?: string }> => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Verification email from SmartCart AI',
    html: `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px; border-radius: 8px; max-width: 480px; margin: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
         <h2 style="color: #2d3748; margin-bottom: 16px;">Welcome to SmartCart AI!</h2>
         <p style="font-size: 16px; color: #4a5568;">Please use the verification code below to verify your email address:</p>
         <div style="margin: 32px 0; text-align: center;">
            <span style="display: inline-block; background: #e6f7ff; color: #0070f3; font-size: 24px; font-weight: bold; letter-spacing: 4px; padding: 16px 32px; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.06);">
               ${verificationCode}
            </span>
         </div>
         <p style="color: #718096; font-size: 14px;">This code is only valid for <strong>3 minutes</strong>.</p>
         <hr style="margin: 24px 0; border: none; border-top: 1px solid #e2e8f0;">
      </div>
      `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send verification email' };
  }
};

export { sendVerificationEmail };
