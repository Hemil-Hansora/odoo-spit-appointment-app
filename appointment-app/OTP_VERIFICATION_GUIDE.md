# OTP Email Verification Implementation Guide

## Overview

This implementation uses **better-auth** for OTP-based email verification during user signup. When users register, they receive a 6-digit OTP via email that they must verify before accessing the application.

## Flow Diagram

```
User Sign-up → OTP Sent to Email → User Enters OTP → Email Verified → Redirect to Dashboard
```

## Implementation Details

### 1. Authentication Configuration (`lib/auth.ts`)

```typescript
emailAndPassword: {
  enabled: true,
  requireEmailVerification: true,
  sendResetPassword: async ({ user, url }) => {
    // Password reset email logic
  },
},

emailVerification: {
  sendOnSignUp: true,
  autoSignInAfterVerification: true,
  sendVerificationEmail: async ({ user, url, token }) => {
    // Send OTP email using your email service
    console.log(`OTP for ${user.email}: ${token}`);
  },
}
```

### 2. Sign-up Flow

**File:** `app/(auth)/sign-up/sign-up-form.tsx`

1. User fills out registration form
2. Form submits to `/api/auth/signup`
3. Backend creates user account via better-auth
4. For organisers: creates organization and member records
5. Better-auth automatically sends OTP email
6. User is redirected to `/verify-otp?email={email}`

### 3. OTP Verification Page

**File:** `app/(auth)/verify-otp/page.tsx`

Features:
- 6-digit OTP input field (numbers only)
- Real-time validation
- Loading states for verify and resend actions
- Success/error message display
- Automatic redirect after successful verification

### 4. Backend API Routes

#### Verify OTP
**Endpoint:** `POST /api/auth/verify-otp`

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "redirect": "/organiser" // or "/book" for customers
}
```

**Logic:**
1. Validates email and OTP
2. Calls better-auth verification endpoint
3. Determines user role (customer vs organiser)
4. Returns appropriate redirect URL

#### Resend OTP
**Endpoint:** `POST /api/auth/resend-otp`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP resent successfully"
}
```

**Logic:**
1. Validates user exists
2. Checks if email is already verified
3. Requests better-auth to send new verification email

### 5. User Experience

#### Success Flow:
1. User signs up → Account created
2. Redirected to OTP page
3. Receives email with 6-digit code
4. Enters code → Email verified
5. Automatically signed in
6. Redirected to appropriate dashboard

#### Error Handling:
- Invalid OTP → Clear error message
- Expired OTP → Can resend
- Missing email → Redirect to sign-up
- Already verified → Inform user

## Email Service Integration

### TODO: Configure Email Service

You need to implement email sending in `lib/auth.ts`:

```typescript
sendVerificationEmail: async ({ user, url, token }) => {
  // Example using Resend, SendGrid, or Nodemailer
  await emailService.send({
    to: user.email,
    subject: "Verify your email",
    html: `
      <h1>Welcome ${user.name}!</h1>
      <p>Your verification code is: <strong>${token}</strong></p>
      <p>This code will expire in 10 minutes.</p>
    `
  });
}
```

### Popular Email Services:

#### 1. **Resend** (Recommended)
```bash
npm install resend
```

```typescript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'noreply@yourdomain.com',
  to: user.email,
  subject: 'Verify your email',
  html: `Your OTP: ${token}`
});
```

#### 2. **SendGrid**
```bash
npm install @sendgrid/mail
```

```typescript
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: user.email,
  from: 'noreply@yourdomain.com',
  subject: 'Verify your email',
  html: `Your OTP: ${token}`
});
```

#### 3. **Nodemailer** (SMTP)
```bash
npm install nodemailer
```

```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
});

await transporter.sendMail({
  from: 'noreply@yourdomain.com',
  to: user.email,
  subject: 'Verify your email',
  html: `Your OTP: ${token}`
});
```

## Environment Variables

Add to `.env`:

```env
# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email Service (choose one)
RESEND_API_KEY=your_resend_key
# or
SENDGRID_API_KEY=your_sendgrid_key
# or
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## Testing

### Development Testing (Console Logs)

When testing locally, the OTP appears in your server console:
```
OTP for user@example.com: 123456
```

### Test the Flow:

1. **Sign up**: Go to `/sign-up`
2. **Create account**: Fill form and submit
3. **Check console**: Copy OTP from server logs
4. **Verify**: Enter OTP on verification page
5. **Success**: Should redirect to dashboard

### Manual Testing Checklist:

- [ ] User can sign up successfully
- [ ] OTP is generated (check console)
- [ ] Redirects to `/verify-otp` with email param
- [ ] Can enter 6-digit OTP (numbers only)
- [ ] Invalid OTP shows error
- [ ] Can resend OTP
- [ ] Successful verification redirects correctly
- [ ] Customer goes to `/book`
- [ ] Organiser goes to `/organiser`

## Security Considerations

1. **OTP Expiration**: Better-auth handles OTP expiration automatically
2. **Rate Limiting**: Consider adding rate limiting to prevent OTP spam
3. **HTTPS**: Always use HTTPS in production for secure transmission
4. **Environment Variables**: Never commit API keys to version control

## Database Schema

Better-auth automatically creates verification tables:
- Stores OTP tokens
- Tracks expiration times
- Manages verification status

No additional migration needed - better-auth handles everything!

## Troubleshooting

### OTP Not Received
1. Check server console for OTP (development)
2. Verify email service is configured
3. Check spam folder
4. Ensure `emailVerification.sendOnSignUp: true`

### Verification Fails
1. Ensure OTP hasn't expired
2. Check database connection
3. Verify better-auth configuration
4. Check network requests in browser DevTools

### Wrong Redirect
1. Check member table for user role
2. Verify organization creation for organisers
3. Check redirect logic in `/api/auth/verify-otp`

## Next Steps

1. ✅ Configure email service in `lib/auth.ts`
2. ✅ Add rate limiting to OTP endpoints
3. ✅ Create email templates with branding
4. ✅ Add OTP resend cooldown timer
5. ✅ Implement email verification reminder emails

## References

- [Better-Auth Documentation](https://better-auth.com/docs)
- [Better-Auth Email Verification](https://better-auth.com/docs/plugins/email-verification)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
