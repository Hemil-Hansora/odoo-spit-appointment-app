# Email Setup Guide - Resend Integration

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Resend Package

```bash
npm install resend
# or
pnpm add resend
# or
yarn add resend
```

### Step 2: Get Your Resend API Key

1. Go to [https://resend.com/signup](https://resend.com/signup)
2. Sign up for a free account (no credit card required)
3. Verify your email
4. Go to [API Keys](https://resend.com/api-keys)
5. Click "Create API Key"
6. Give it a name (e.g., "Appointment App")
7. Copy the API key (starts with `re_`)

**Free Tier Includes:**
- ✅ 100 emails/day
- ✅ 3,000 emails/month
- ✅ Perfect for testing and small projects

### Step 3: Configure Environment Variables

Create or update your `.env.local` file:

```env
# Resend Email Service
RESEND_API_KEY="re_your_actual_api_key_here"
EMAIL_FROM="onboarding@resend.dev"

# For custom domain (after verification):
# EMAIL_FROM="noreply@yourdomain.com"
```

### Step 4: Test the Integration

```bash
# Start your dev server
npm run dev

# Go to http://localhost:3000/sign-up
# Complete the signup form
# Check your actual email for the OTP!
```

## ✅ What's Included

The implementation includes:
- ✅ **Professional email templates** with HTML styling
- ✅ **OTP verification emails** with 6-digit code
- ✅ **Welcome emails** after successful verification
- ✅ **Error handling** with console fallback
- ✅ **Responsive design** that works on all devices

## 📧 Email Features

### OTP Verification Email
- Clean, professional design
- Large, easy-to-read OTP code
- Expiration warning (10 minutes)
- Mobile-responsive
- Branded footer

### Welcome Email
- Sent after successful verification
- Personalized greeting
- Non-critical (won't break flow if it fails)

## 🎨 Customizing Email Templates

Edit `lib/email.ts` to customize:

```typescript
// Change the email subject
subject: 'Your Custom Subject Here',

// Modify the HTML template
html: getOTPEmailTemplate(otp, name),

// Update sender name
from: 'Your App <noreply@yourdomain.com>',
```

## 🌐 Using Your Own Domain

### Step 1: Add Domain to Resend

1. Go to [Resend Domains](https://resend.com/domains)
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Follow DNS setup instructions

### Step 2: Verify Domain

Add these DNS records to your domain:

**SPF Record:**
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all
```

**DKIM Records:**
(Provided by Resend after adding domain)

### Step 3: Update Environment Variable

```env
EMAIL_FROM="noreply@yourdomain.com"
# or
EMAIL_FROM="Appointment App <hello@yourdomain.com>"
```

## 🔧 Troubleshooting

### Issue: "API key not found"

**Solution:**
```bash
# Make sure .env.local exists
cat .env.local | grep RESEND_API_KEY

# Restart dev server after adding env vars
npm run dev
```

### Issue: Email not received

**Check:**
1. ✅ Spam/Junk folder
2. ✅ Correct email address
3. ✅ Resend dashboard for delivery status
4. ✅ Console logs for errors

**Test API Key:**
```bash
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "your@email.com",
    "subject": "Test Email",
    "html": "<p>Test</p>"
  }'
```

### Issue: "Rate limit exceeded"

**Solution:**
- Free tier: 100 emails/day
- Wait 24 hours or upgrade plan
- Check [Resend Dashboard](https://resend.com/emails) for usage

### Issue: OTP shows in console but no email

**Check:**
1. API key is correct in `.env.local`
2. Server restarted after adding env vars
3. No errors in terminal
4. Resend dashboard shows email sent

## 💰 Pricing

### Free Tier (Perfect for Development)
- 100 emails/day
- 3,000 emails/month
- All features included
- No credit card required

### Paid Plans (When You Scale)
- **Pro**: $20/month - 50,000 emails
- **Custom**: Enterprise plans available

## 🔐 Security Best Practices

1. **Never commit `.env.local`** to Git
   ```bash
   # Already in .gitignore
   .env.local
   ```

2. **Use different keys for environments**
   - Development: Test API key
   - Production: Production API key

3. **Rotate keys regularly**
   - Create new key in Resend
   - Update environment variables
   - Delete old key

4. **Monitor usage**
   - Check [Resend Dashboard](https://resend.com/emails)
   - Set up usage alerts

## 📊 Monitoring Emails

### Resend Dashboard
View in [Resend Dashboard](https://resend.com/emails):
- ✅ Delivery status
- ✅ Open rates (if enabled)
- ✅ Bounce rates
- ✅ Error logs

### Application Logs
Check your terminal for:
```
✅ OTP email sent successfully to user@example.com
❌ Failed to send OTP email to user@example.com: [error]
📧 Fallback - OTP for user@example.com: 123456
```

## 🚀 Alternative Email Services

If you prefer not to use Resend:

### Option 1: SendGrid
```bash
npm install @sendgrid/mail
```

```typescript
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: email,
  from: 'noreply@yourdomain.com',
  subject: 'Verify your email',
  html: getOTPEmailTemplate(otp, name),
});
```

### Option 2: AWS SES
```bash
npm install @aws-sdk/client-ses
```

### Option 3: Nodemailer (SMTP)
```bash
npm install nodemailer
```

See `OTP_VERIFICATION_GUIDE.md` for detailed alternative implementations.

## ✅ Testing Checklist

- [ ] Resend account created
- [ ] API key obtained and added to `.env.local`
- [ ] `npm install resend` completed
- [ ] Server restarted
- [ ] Test signup completed
- [ ] Email received (check spam)
- [ ] OTP code works
- [ ] Welcome email received
- [ ] Email templates look good on mobile
- [ ] Custom domain configured (optional)

## 🎉 You're All Set!

Your OTP email verification is now fully functional! Users will receive:
1. **Professional OTP email** upon signup
2. **Welcome email** after verification

Need help? Check the [Resend Documentation](https://resend.com/docs) or the troubleshooting section above.

---

**Quick Links:**
- [Resend Dashboard](https://resend.com/overview)
- [API Keys](https://resend.com/api-keys)
- [Domains](https://resend.com/domains)
- [Email Logs](https://resend.com/emails)
- [Documentation](https://resend.com/docs)
