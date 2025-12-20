# OTP Verification Flow Diagram

## Complete Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                            │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   Browser    │
│  /sign-up    │
└──────┬───────┘
       │
       │ 1. Fill form & Submit
       │
       ▼
┌──────────────────┐
│  SignUpForm.tsx  │
│  (Client Side)   │
└──────┬───────────┘
       │
       │ 2. POST /api/auth/signup
       │    { email, password, name, accountType }
       │
       ▼
┌───────────────────────┐
│  /api/auth/signup     │───────┐
│  route.ts             │       │
└───────┬───────────────┘       │
        │                       │
        │ 3. Create user        │ 4. If organiser:
        │    via better-auth    │    Create organization
        │                       │    & member records
        ▼                       │
┌───────────────────────┐       │
│  Better-Auth          │◄──────┘
│  /api/auth/sign-up    │
└───────┬───────────────┘
        │
        │ 5. Generate 6-digit OTP
        │    Store in 'verification' table
        │    Call sendVerificationEmail()
        │
        ▼
┌───────────────────────┐
│  lib/auth.ts          │
│  sendVerificationEmail│
└───────┬───────────────┘
        │
        │ 6. Send email with OTP
        │    (Console log in dev)
        │    (Email service in prod)
        │
        ▼
┌───────────────────────┐
│  📧 Email / Console   │
│  OTP: 123456          │
└───────────────────────┘


┌──────────────┐
│   Browser    │◄───────┐
│ /verify-otp  │        │ 7. Redirect with email param
│?email=...    │        │
└──────┬───────┘        │
       │                │
       │ 8. User enters OTP from email
       │
       ▼
┌──────────────────┐
│ VerifyOtpPage    │
│   (Client)       │
└──────┬───────────┘
       │
       │ 9. POST /api/auth/verify-otp
       │    { email, otp }
       │
       ▼
┌───────────────────────┐
│ /api/auth/verify-otp  │
│ route.ts              │
└───────┬───────────────┘
        │
        │ 10. Validate & verify
        │
        ▼
┌───────────────────────┐
│  Better-Auth          │
│  /api/auth/verify-    │
│  email                │
└───────┬───────────────┘
        │
        │ 11. Mark emailVerified = true
        │     Auto sign-in user
        │
        ▼
┌───────────────────────┐
│  Database             │
│  Update user record   │
└───────┬───────────────┘
        │
        │ 12. Check user role
        │     (customer vs organiser)
        │
        ▼
┌───────────────────────┐
│  Return redirect URL  │
│  - /book (customer)   │
│  - /organiser (owner) │
└───────┬───────────────┘
        │
        │ 13. Redirect response
        │
        ▼
┌──────────────┐
│   Browser    │
│  /book or    │
│  /organiser  │
└──────────────┘
```

## Database Schema

```
┌─────────────┐
│    user     │
├─────────────┤
│ id          │◄─────┐
│ name        │      │
│ email       │      │
│ emailVerified│     │ FK: userId
│ createdAt   │      │
└─────────────┘      │
                     │
┌─────────────┐      │
│verification │      │
├─────────────┤      │
│ id          │      │
│ identifier  │      │ (email)
│ value       │      │ (hashed OTP)
│ expiresAt   │      │
│ createdAt   │      │
└─────────────┘      │
                     │
┌─────────────┐      │
│   member    │      │
├─────────────┤      │
│ id          │      │
│ userId      │──────┘
│ orgId       │
│ role        │ (owner/admin/member)
└─────────────┘
```

## API Endpoints

```
POST /api/auth/signup
├─ Input:  { email, password, name, accountType, organizationName }
├─ Action: Create user + org (if organiser) + trigger OTP email
└─ Output: { success, user, accountType, role }

POST /api/auth/verify-otp
├─ Input:  { email, otp }
├─ Action: Verify OTP via better-auth
└─ Output: { success, redirect }

POST /api/auth/resend-otp
├─ Input:  { email }
├─ Action: Generate new OTP + send email
└─ Output: { success, message }
```

## State Transitions

```
User State Flow:

┌──────────┐
│   New    │
│  Visitor │
└────┬─────┘
     │
     │ Sign up
     ▼
┌──────────────┐
│ Registered   │
│ emailVerified│
│   = false    │
└────┬─────────┘
     │
     │ Enter valid OTP
     ▼
┌──────────────┐
│  Verified    │
│ emailVerified│
│   = true     │
└────┬─────────┘
     │
     │ Auto sign-in
     ▼
┌──────────────┐
│ Authenticated│
│   & Active   │
└──────────────┘
```

## Component Hierarchy

```
app/
├── (auth)/
│   ├── sign-up/
│   │   └── sign-up-form.tsx ────┐
│   │                             │ Redirects to
│   └── verify-otp/               │
│       └── page.tsx ◄─────────────┘
│
└── api/
    └── auth/
        ├── signup/
        │   └── route.ts ────┐
        │                    │ Calls
        ├── verify-otp/      │
        │   └── route.ts     │
        │                    │
        └── resend-otp/      │
            └── route.ts     │
                             │
                    ┌────────▼────────┐
                    │  Better-Auth    │
                    │  lib/auth.ts    │
                    └─────────────────┘
```

## Security Flow

```
┌──────────────┐
│ User signs up│
└──────┬───────┘
       │
       ▼
┌─────────────────────────┐
│ Better-Auth generates   │
│ cryptographically       │
│ secure 6-digit OTP      │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ OTP hashed & stored     │
│ in 'verification' table │
│ with expiration time    │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Email sent to user      │
│ (plain OTP for entry)   │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ User submits OTP        │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Backend hashes input    │
│ & compares with stored  │
│ hash + checks expiry    │
└──────┬──────────────────┘
       │
       ├──► Invalid/Expired ──► Error message
       │
       └──► Valid ──┐
                    │
                    ▼
           ┌─────────────────┐
           │ Mark verified   │
           │ Auto sign-in    │
           │ Grant access    │
           └─────────────────┘
```

## Error Handling

```
Signup Errors:
├─ Email already exists ────► "User with this email already exists"
├─ Missing fields ──────────► "Missing required fields"
├─ Invalid account type ────► "Invalid account type"
└─ Server error ────────────► "Internal server error"

OTP Verification Errors:
├─ Missing email ───────────► "Email is missing"
├─ Invalid OTP format ──────► "Please enter a valid 6-digit OTP"
├─ Wrong OTP ───────────────► "Invalid or expired OTP"
├─ Expired OTP ─────────────► "Invalid or expired OTP"
└─ User not found ──────────► "User not found"

Resend OTP Errors:
├─ Missing email ───────────► "Email is required"
├─ User not found ──────────► "User not found"
├─ Already verified ────────► "Email is already verified"
└─ Server error ────────────► "Internal server error"
```

## Success Flow

```
✓ Sign up successful
  ↓
✓ OTP sent to email
  ↓
✓ User enters OTP
  ↓
✓ OTP verified
  ↓
✓ Email marked as verified
  ↓
✓ User auto signed-in
  ↓
✓ Session created
  ↓
✓ Redirect to dashboard
  ↓
✓ User can access protected routes
```

## Development vs Production

```
Development:
├─ OTP printed to console
├─ No email service needed
├─ localhost URLs
└─ Quick testing

Production:
├─ OTP sent via email service
├─ Requires email API key
├─ Production domain
└─ Rate limiting recommended
```

---

## Quick Reference

**Signup:** `/sign-up` → Create account
**Verify:** `/verify-otp?email=...` → Enter OTP
**Success:** Redirect to `/book` or `/organiser`

**API Endpoints:**
- `POST /api/auth/signup` - Create account
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/resend-otp` - Resend OTP

**Database Tables:**
- `user` - User accounts
- `verification` - OTP tokens
- `member` - Organization memberships
