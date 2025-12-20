# 📧 Email OTP Setup - Visual Guide

## 🎯 What You Need to Do (3 Simple Steps)

```
┌─────────────────────────────────────────────────────────┐
│  Step 1: Get Free Resend Account (2 minutes)           │
│  ↓                                                       │
│  Step 2: Add API Key to .env.local (1 minute)          │
│  ↓                                                       │
│  Step 3: Test with Real Email (1 minute)               │
└─────────────────────────────────────────────────────────┘
```

---

## Step 1️⃣: Get Your Free Resend Account

### Visit: https://resend.com/signup

```
┌──────────────────────────────────────┐
│  Resend - Sign Up                    │
├──────────────────────────────────────┤
│                                      │
│  Email: your@email.com               │
│  Password: ********                  │
│                                      │
│  [Create Account] ← Click here       │
│                                      │
│  ✅ Free forever                     │
│  ✅ 100 emails/day                   │
│  ✅ No credit card                   │
└──────────────────────────────────────┘
```

### Get API Key: https://resend.com/api-keys

```
┌──────────────────────────────────────┐
│  API Keys                            │
├──────────────────────────────────────┤
│  [+ Create API Key]  ← Click here    │
│                                      │
│  Name: Appointment App               │
│                                      │
│  Your API Key:                       │
│  re_AbCd1234XyZ...  [📋 Copy]       │
│                                      │
│  ⚠️ Save this key securely!          │
└──────────────────────────────────────┘
```

**Copy the key that starts with `re_`**

---

## Step 2️⃣: Add API Key to Your Project

### Create `.env.local` file in `appointment-app/` folder:

```
appointment-app/
├── app/
├── lib/
├── prisma/
├── .env.example      ← Copy from this
├── .env.local        ← Create this file
└── package.json
```

### Add this content to `.env.local`:

```env
# Resend API Key (paste your actual key here)
RESEND_API_KEY="re_AbCd1234XyZ_your_actual_key_here"

# Sender email (use default for testing)
EMAIL_FROM="onboarding@resend.dev"
```

### Visual Steps:

```
1. Open VS Code or any text editor
   ↓
2. Create new file: .env.local
   ↓
3. Paste the content above
   ↓
4. Replace "re_AbCd..." with YOUR actual key
   ↓
5. Save the file (Ctrl+S or Cmd+S)
   ✅ Done!
```

---

## Step 3️⃣: Test the Email System

### Start Your Dev Server:

```bash
cd appointment-app
npm run dev
```

```
┌──────────────────────────────────────┐
│  Terminal Output:                    │
├──────────────────────────────────────┤
│  ▲ Next.js 16.1.0                    │
│  - Local:    http://localhost:3000   │
│  - Ready in 1.2s                     │
│                                      │
│  ✅ Server is running                │
└──────────────────────────────────────┘
```

### Go to Sign Up Page:

```
Browser: http://localhost:3000/sign-up

┌─────────────────────────────────────┐
│  Create an account                  │
├─────────────────────────────────────┤
│  Full Name: [John Doe          ]    │
│  Email:     [john@gmail.com    ] ←  Use YOUR real email!
│  Type:      [Customer ▼]            │
│  Password:  [••••••••••]             │
│  Confirm:   [••••••••••]             │
│                                     │
│  [Create account] ← Click           │
└─────────────────────────────────────┘
```

### Check Your Email! 📧

```
┌─────────────────────────────────────┐
│  Gmail / Outlook / Yahoo            │
├─────────────────────────────────────┤
│  From: onboarding@resend.dev        │
│  Subject: Verify your email address │
│                                     │
│  Hi John Doe,                       │
│                                     │
│  Your verification code is:         │
│                                     │
│       ┌─────────────┐                │
│       │   123456    │  ← Your OTP   │
│       └─────────────┘                │
│                                     │
│  ⚠️ Expires in 10 minutes            │
└─────────────────────────────────────┘
```

**Note:** Check spam folder if not in inbox!

### Enter OTP:

```
Browser automatically shows:
http://localhost:3000/verify-otp?email=john@gmail.com

┌─────────────────────────────────────┐
│  Verify OTP                         │
├─────────────────────────────────────┤
│  Enter the code sent to:            │
│  john@gmail.com                     │
│                                     │
│  Code: [1][2][3][4][5][6]          │
│         ↑ Enter OTP here            │
│                                     │
│  [Verify] ← Click                   │
│                                     │
│  Didn't receive? [Resend]           │
└─────────────────────────────────────┘
```

### Success! 🎉

```
┌─────────────────────────────────────┐
│  ✅ Email verified successfully!    │
│  Redirecting...                     │
└─────────────────────────────────────┘
```

You'll also receive a welcome email!

---

## 🔍 Checking if It Works

### ✅ Good Signs:

**In Terminal:**
```
✅ OTP email sent successfully to john@gmail.com
```

**In Email:**
```
✅ Received "Verify your email address"
✅ See 6-digit code
✅ Email looks professional
```

**After Verification:**
```
✅ "Email verified successfully!"
✅ Redirected to dashboard
✅ Received welcome email
```

### ❌ Problems?

**Terminal shows:**
```
❌ Failed to send OTP email: Invalid API key
```

**Fix:** Check API key in `.env.local`

**Terminal shows:**
```
❌ Failed to send OTP email: Unauthorized
```

**Fix:** 
1. Verify API key is correct
2. Check Resend account is active
3. Restart dev server

**No email received:**
```
1. Check spam/junk folder ⚠️
2. Wait 1-2 minutes
3. Try "Resend" button
4. Check terminal for errors
```

---

## 📊 Visual Flow

```
User Signs Up
     ↓
Backend Creates Account
     ↓
lib/email.ts sends OTP via Resend
     ↓
     ├─→ Success ✅ → Email delivered → User enters OTP → ✅ Verified
     │
     └─→ Fail ❌ → Shows in console → Dev can copy OTP → Still works
```

---

## 🎨 Email Preview

### What Users See:

```
╔══════════════════════════════════════╗
║                                      ║
║    Verify Your Email Address         ║
║                                      ║
╠══════════════════════════════════════╣
║                                      ║
║  Hi John Doe,                        ║
║                                      ║
║  Thank you for signing up! To        ║
║  complete your registration, use     ║
║  the code below:                     ║
║                                      ║
║  ┌────────────────────────────────┐  ║
║  │   Your Verification Code       │  ║
║  │                                │  ║
║  │         1 2 3 4 5 6           │  ║
║  │                                │  ║
║  └────────────────────────────────┘  ║
║                                      ║
║  ⚠️ This code expires in 10 minutes  ║
║                                      ║
║  If you didn't request this, you     ║
║  can safely ignore this email.       ║
║                                      ║
╠══════════════════════════════════════╣
║  © 2025 Appointment App              ║
╚══════════════════════════════════════╝
```

---

## 🎯 Quick Reference

### Files You Need to Know:

```
lib/email.ts        ← Email sending logic
lib/auth.ts         ← Calls email.ts
.env.local          ← Your API key goes here
```

### Environment Variables:

```
RESEND_API_KEY      ← REQUIRED - Your Resend key
EMAIL_FROM          ← OPTIONAL - Default: onboarding@resend.dev
```

### Useful Links:

```
🔑 Get API Key:    https://resend.com/api-keys
📊 Dashboard:      https://resend.com/overview
📧 Email Logs:     https://resend.com/emails
📖 Docs:           https://resend.com/docs
```

---

## 💰 Free Tier Info

```
┌─────────────────────────────────────┐
│  Resend Free Plan                   │
├─────────────────────────────────────┤
│  ✅ 100 emails per day              │
│  ✅ 3,000 emails per month          │
│  ✅ All features included           │
│  ✅ No credit card required         │
│  ✅ Perfect for testing             │
│  ✅ Use test domain immediately     │
└─────────────────────────────────────┘
```

For production (paid plans):
- 💰 $20/month = 50,000 emails
- 💰 Custom plans available

---

## ✅ Checklist

Copy this and check off as you go:

```
[ ] Created Resend account
[ ] Got API key
[ ] Created .env.local file
[ ] Added RESEND_API_KEY to .env.local
[ ] Restarted dev server
[ ] Went to /sign-up
[ ] Used real email address
[ ] Received OTP email
[ ] Checked spam folder
[ ] Entered OTP successfully
[ ] Redirected to dashboard
[ ] Received welcome email
[ ] Everything works! 🎉
```

---

## 🆘 Need Help?

1. **Read:** `EMAIL_SETUP_GUIDE.md` for detailed instructions
2. **Check:** Terminal for error messages
3. **View:** https://resend.com/emails for delivery logs
4. **Test:** API key at https://resend.com/api-keys

---

## 🎉 Success!

If you can sign up and receive the OTP email, you're done! 

**Email verification is now fully functional!** 🚀

Users will receive:
- ✅ Professional OTP emails
- ✅ Beautiful HTML templates
- ✅ 6-digit verification codes
- ✅ Welcome emails after verification

**Everything is production-ready!**
