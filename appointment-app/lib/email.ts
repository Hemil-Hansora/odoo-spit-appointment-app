import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendOTPEmailParams {
  email: string;
  otp: string;
  name?: string;
}

/**
 * Send OTP verification email
 */
export async function sendOTPEmail({ email, otp, name }: SendOTPEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: email,
      subject: 'Verify your email address',
      html: getOTPEmailTemplate(otp, name),
    });

    if (error) {
      console.error('Email sending error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    throw error;
  }
}

/**
 * Email template for OTP verification
 */
function getOTPEmailTemplate(otp: string, name?: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f6f9fc;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px 40px; text-align: center;">
                            <h1 style="margin: 0; color: #1a1a1a; font-size: 24px; font-weight: 600;">
                                Verify Your Email Address
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 0 40px 20px 40px;">
                            <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 24px;">
                                ${name ? `Hi ${name},` : 'Hello,'}
                            </p>
                            <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 24px;">
                                Thank you for signing up! To complete your registration, please use the verification code below:
                            </p>
                        </td>
                    </tr>
                    
                    <!-- OTP Code -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px;">
                            <div style="background-color: #f7fafc; border-radius: 8px; padding: 30px; text-align: center; border: 2px dashed #e2e8f0;">
                                <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                                    Your Verification Code
                                </p>
                                <p style="margin: 0; color: #1a1a1a; font-size: 42px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                    ${otp}
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Instructions -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px;">
                            <p style="margin: 0 0 15px 0; color: #4a5568; font-size: 14px; line-height: 20px;">
                                Enter this code on the verification page to activate your account.
                            </p>
                            <p style="margin: 0; color: #e53e3e; font-size: 14px; line-height: 20px;">
                                ⚠️ This code will expire in <strong>10 minutes</strong>.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Divider -->
                    <tr>
                        <td style="padding: 0 40px;">
                            <div style="border-top: 1px solid #e2e8f0;"></div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px 40px 40px;">
                            <p style="margin: 0 0 10px 0; color: #718096; font-size: 13px; line-height: 20px;">
                                If you didn't request this verification code, you can safely ignore this email.
                            </p>
                            <p style="margin: 0; color: #a0aec0; font-size: 12px; line-height: 18px;">
                                This is an automated message, please do not reply to this email.
                            </p>
                        </td>
                    </tr>
                </table>
                
                <!-- Bottom Footer -->
                <table role="presentation" style="width: 600px; border-collapse: collapse; margin-top: 20px;">
                    <tr>
                        <td style="text-align: center; padding: 20px;">
                            <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                                © ${new Date().getFullYear()} Appointment App. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
}

/**
 * Send welcome email after successful verification
 */
export async function sendWelcomeEmail({ email, name }: { email: string; name: string }) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: email,
      subject: 'Welcome to Appointment App! 🎉',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f6f9fc;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    <tr>
                        <td style="padding: 40px; text-align: center;">
                            <h1 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 28px; font-weight: 600;">
                                Welcome, ${name}! 🎉
                            </h1>
                            <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 24px;">
                                Your email has been verified successfully. You're all set to start using Appointment App!
                            </p>
                            <p style="margin: 0; color: #718096; font-size: 14px; line-height: 20px;">
                                If you have any questions, feel free to reach out to our support team.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
      `,
    });

    if (error) {
      console.error('Welcome email error:', error);
      // Don't throw error for welcome email - it's not critical
    }

    return data;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    // Don't throw - welcome email is optional
  }
}
