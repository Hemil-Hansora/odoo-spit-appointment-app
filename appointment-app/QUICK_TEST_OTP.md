# Quick Test: OTP Verification

## 🚀 Quick Start

Follow these steps to test the OTP verification flow:

### 1. Start the Development Server

```bash
cd appointment-app
npm run dev
# or
pnpm dev
```

### 2. Go to Sign Up Page

Navigate to: `http://localhost:3000/sign-up`

### 3. Fill the Registration Form

- **Full Name**: Test User
- **Email**: test@example.com
- **Account Type**: Customer or Organiser
- **Organization Name**: (if Organiser selected) Test Org
- **Password**: testpassword123
- **Confirm Password**: testpassword123

### 4. Submit the Form

Click "Create account" button

### 5. Get OTP from Console

After form submission, check your terminal/console where the dev server is running.

You should see something like:
```
OTP for test@example.com: 123456
Verification URL: http://localhost:3000/verify-email?token=123456
```

**Copy the 6-digit OTP code** (e.g., `123456`)

### 6. Verify OTP

You will be automatically redirected to:
```
http://localhost:3000/verify-otp?email=test@example.com
```

- Enter the 6-digit OTP from the console
- Click "Verify"

### 7. Success!

If verification is successful:
- ✅ You'll see "Email verified successfully! Redirecting..."
- ✅ You'll be automatically redirected to:
  - `/book` (for customers)
  - `/organiser` (for organisers)

## 🧪 Testing Resend OTP

1. On the verify-otp page, click "Resend"
2. Check console for new OTP
3. Enter the new OTP

## ⚠️ Common Issues

### Issue: "Email is missing. Please sign up again."
**Solution**: Make sure you're accessing `/verify-otp` with the `email` parameter in the URL.

### Issue: "Invalid or expired OTP"
**Solutions**:
- Check if you copied the correct OTP from console
- OTP might have expired (default: 10 minutes) - use "Resend"
- Make sure there are no extra spaces when pasting

### Issue: OTP not showing in console
**Solutions**:
- Check that your development server is running
- Look in the terminal where you started `npm run dev`
- Verify `lib/auth.ts` has `console.log` statements

### Issue: Database errors
**Solutions**:
- Make sure Prisma is set up: `npx prisma generate`
- Run migrations: `npx prisma migrate dev`
- Check database connection in `.env`

## 📧 Production: Email Service Setup

For production, you MUST configure an actual email service. See `OTP_VERIFICATION_GUIDE.md` for detailed instructions on:

- Resend (Recommended)
- SendGrid
- Nodemailer (SMTP)

## 🔍 Debugging

### View Database Records

```bash
npx prisma studio
```

Check tables:
- `user` - User accounts
- `verification` - OTP tokens and expiration
- `member` - Organization memberships (for organisers)
- `organization` - Organization details (for organisers)

### Test Different Scenarios

1. **Invalid OTP**: Enter wrong code → Should show error
2. **Resend OTP**: Click resend → Should generate new OTP
3. **Customer Account**: Sign up as customer → Should redirect to `/book`
4. **Organiser Account**: Sign up as organiser → Should redirect to `/organiser`

## ✅ Expected Behavior Checklist

- [ ] Sign-up form submits successfully
- [ ] User is created in database
- [ ] OTP appears in console
- [ ] Redirect to `/verify-otp` with email parameter
- [ ] Can enter 6-digit OTP
- [ ] Invalid OTP shows error message
- [ ] Valid OTP verifies email
- [ ] User is redirected to correct dashboard
- [ ] Can resend OTP if needed
- [ ] Resent OTP is different from original

## 🎯 Next Steps After Testing

1. Configure email service (see `OTP_VERIFICATION_GUIDE.md`)
2. Test with real email addresses
3. Customize email templates
4. Add rate limiting to prevent abuse
5. Deploy to production

## 📝 Test Data

Use these test accounts:

**Customer:**
- Email: customer@test.com
- Password: customer123
- Type: Customer

**Organiser:**
- Email: organiser@test.com
- Password: organiser123
- Type: Organiser
- Organization: Test Organization

---

**Need Help?** Check `OTP_VERIFICATION_GUIDE.md` for detailed documentation.
