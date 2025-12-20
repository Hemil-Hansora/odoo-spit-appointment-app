# Email OTP Verification - Quick Setup

## ✅ Email Sending is Now Configured!

Your appointment app now sends **real OTP emails** using Resend.

## 🚀 Quick Start (3 Steps)

### 1. Get Your Free Resend API Key

1. Visit [https://resend.com/signup](https://resend.com/signup)
2. Sign up (free, no credit card needed)
3. Go to [API Keys](https://resend.com/api-keys)
4. Click "Create API Key"
5. Copy the key (starts with `re_`)

**Free tier includes:**
- ✅ 100 emails/day
- ✅ 3,000 emails/month
- ✅ Perfect for testing!

### 2. Add API Key to Environment

Create `.env.local` file in the `appointment-app` folder:

```env
RESEND_API_KEY="re_your_actual_api_key_here"
EMAIL_FROM="onboarding@resend.dev"
```

**Or use the setup script:**

**Windows:**
```bash
setup-email.bat
```

**Mac/Linux:**
```bash
chmod +x setup-email.sh
./setup-email.sh
```

### 3. Test It!

```bash
# Restart your dev server
npm run dev

# Go to signup page
# http://localhost:3000/sign-up

# Complete signup form
# Check your real email for OTP! 📧
```

## 📧 What Happens Now?

When users sign up:

1. **Account Created** ✅
2. **Professional Email Sent** 📧
   - Beautiful HTML template
   - 6-digit OTP code
   - Expires in 10 minutes
3. **User Verifies** ✔️
4. **Welcome Email** (optional) 🎉

## 📁 What Was Added?

```
appointment-app/
├── lib/
│   └── email.ts              ← Email service & templates
├── lib/
│   └── auth.ts               ← Updated to send real emails
├── .env.example              ← Environment variables template
├── .env.local                ← Your actual config (create this)
├── EMAIL_SETUP_GUIDE.md      ← Detailed setup guide
├── setup-email.bat           ← Windows setup script
└── setup-email.sh            ← Mac/Linux setup script
```

## 🎨 Email Features

### OTP Verification Email
- ✅ Professional HTML design
- ✅ Large, easy-to-read code
- ✅ Mobile responsive
- ✅ Expiration warning
- ✅ Branded footer

### Welcome Email
- ✅ Sent after verification
- ✅ Personalized greeting
- ✅ Optional (won't break signup)

## 🔧 Configuration Options

### Default (Resend's Test Domain)
```env
EMAIL_FROM="onboarding@resend.dev"
```
- Works immediately
- Shows "via resend.dev" in email

### Your Own Domain (Recommended for Production)
```env
EMAIL_FROM="noreply@yourdomain.com"
```
- Professional appearance
- Requires domain verification in Resend
- See `EMAIL_SETUP_GUIDE.md` for setup

## 🧪 Testing

### Test Signup Flow

1. Go to `http://localhost:3000/sign-up`
2. Fill out the form with **your real email**
3. Click "Create account"
4. **Check your email** (might be in spam initially)
5. Copy the 6-digit OTP
6. Enter it on the verification page
7. You should receive a welcome email!

### Check Console Logs

Your terminal will show:
```
✅ OTP email sent successfully to user@example.com
```

Or if there's an issue:
```
❌ Failed to send OTP email to user@example.com: [error]
📧 Fallback - OTP for user@example.com: 123456
```

## ⚠️ Troubleshooting

### Email not received?

1. **Check spam/junk folder** (especially for first email)
2. **Verify API key** in `.env.local`
3. **Restart dev server** after adding env vars
4. **Check console** for error messages
5. **View logs** at [Resend Dashboard](https://resend.com/emails)

### "API key not found" error?

```bash
# Make sure .env.local exists
ls -la .env.local

# Check if API key is set
cat .env.local | grep RESEND_API_KEY

# Restart server
npm run dev
```

### Rate limit exceeded?

- Free tier: 100 emails/day
- Check usage at [Resend Dashboard](https://resend.com/overview)
- Wait 24 hours or upgrade plan

## 🎯 Environment Variables

Required:
```env
RESEND_API_KEY="re_xxxxx"           # Get from resend.com
```

Optional:
```env
EMAIL_FROM="noreply@yourdomain.com" # Your sender email
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 📊 Monitoring

### Resend Dashboard
Check [https://resend.com/emails](https://resend.com/emails) for:
- Delivery status
- Error logs
- Usage statistics
- Domain verification

### Application Logs
Check your terminal for:
- ✅ Success messages
- ❌ Error messages
- 📧 Fallback OTPs (if email fails)

## 🚀 Production Checklist

Before deploying:

- [ ] Add RESEND_API_KEY to production env vars
- [ ] Set up custom domain in Resend
- [ ] Update EMAIL_FROM with your domain
- [ ] Test with multiple email providers (Gmail, Outlook, etc.)
- [ ] Move app to production API key (not test key)
- [ ] Set up monitoring/alerts
- [ ] Check emails don't go to spam

## 💡 Tips

### Development
- Use `onboarding@resend.dev` - works immediately
- No domain verification needed
- Perfect for testing

### Production
- Use your own domain for professional emails
- Verify domain with DNS records
- Set up SPF and DKIM
- Monitor deliverability

## 📚 Documentation

- **`EMAIL_SETUP_GUIDE.md`** - Complete setup instructions
- **`OTP_VERIFICATION_GUIDE.md`** - OTP system overview
- **`QUICK_TEST_OTP.md`** - Testing guide
- [Resend Docs](https://resend.com/docs) - Official documentation

## 🎉 Success!

You're all set! Users will now receive professional OTP verification emails when they sign up.

**Test it now:**
1. Go to [http://localhost:3000/sign-up](http://localhost:3000/sign-up)
2. Use your real email address
3. Check your inbox for OTP! 📧

---

**Need help?** Check `EMAIL_SETUP_GUIDE.md` or [Resend Support](https://resend.com/support)
