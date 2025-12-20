# Quick Start: Testing Authentication

## Prerequisites
1. Make sure your database is running (PostgreSQL)
2. Prisma migrations are applied
3. Better Auth is configured in `lib/auth.ts`

## Test Flow

### 1. Start the Development Server
```bash
pnpm run dev
```

### 2. Create a Customer Account
1. Navigate to: http://localhost:3000/sign-up
2. Fill in the form:
   - **Name**: John Doe
   - **Email**: john@example.com
   - **Account Type**: Customer
   - **Password**: password123
   - **Confirm Password**: password123
3. Click "Create account"
4. You should be redirected to `/customer`

### 3. Sign Out and Sign In
1. Click "Sign Out" in the navigation
2. Navigate to: http://localhost:3000/sign-in
3. Enter credentials:
   - **Email**: john@example.com
   - **Password**: password123
4. Click "Sign In"
5. You should be redirected to `/customer`

### 4. Create an Organiser Account
1. Sign out if you're logged in
2. Navigate to: http://localhost:3000/sign-up
3. Fill in the form:
   - **Name**: Jane Smith
   - **Email**: jane@example.com
   - **Account Type**: Organiser
   - **Password**: password123
   - **Confirm Password**: password123
4. Click "Create account"
5. You should be redirected to `/organiser`

### 5. Test Role-Based Access
1. While logged in as customer (john@example.com):
   - Try to access `/admin` → Should redirect to `/customer`
   - Try to access `/organiser` → Should redirect to `/customer`
   
2. While logged in as organiser (jane@example.com):
   - Try to access `/organiser` → Should work
   - Try to access `/admin` → Depends on role (owner/admin)

### 6. Test Forgot Password
1. Sign out
2. Navigate to: http://localhost:3000/forgot-password
3. Enter email address
4. Click "Send reset link"
5. You should see a confirmation message
   - **Note**: Email sending is not implemented yet (backend TODO)

## Verify in Database

Check your database to see the created users:

```sql
-- View all users
SELECT id, email, name, "emailVerified", "createdAt" 
FROM "User";

-- View user organizations (if any)
SELECT * FROM "Member";

-- View organizations
SELECT * FROM "Organization";
```

## Expected Behavior

### Customer Flow
- **Sign Up** → Select "Customer" → Redirected to `/customer`
- **Sign In** → Redirected to `/customer`
- **No organization membership**

### Organiser Flow
- **Sign Up** → Select "Organiser" → Redirected to `/organiser`
- **Sign In** → Redirected based on role:
  - **Owner** → `/admin`
  - **Admin** → `/organiser`
  - **Member** → `/organiser/appointments`

## Debugging Tips

### If sign-in fails:
1. Check browser console for errors
2. Verify database connection
3. Check that user exists in database
4. Verify password is correct

### If redirects don't work:
1. Check the user's role in database
2. Verify organization membership
3. Check browser console for errors
4. Review `app/(auth)/actions.ts` for redirect logic

### If session is not persisting:
1. Clear browser cookies
2. Check Better Auth configuration
3. Verify `BETTER_AUTH_SECRET` is set
4. Check database session table

## Next Steps

After testing basic authentication:

1. **For Customers**:
   - Browse available services
   - Book appointments
   - View booking history

2. **For Organisers**:
   - Create an organization (if owner)
   - Add team members
   - Create services
   - Manage bookings

3. **For Admins**:
   - Manage users
   - View system analytics
   - Configure settings

## Common Issues

### "Unauthorized" Error
- **Cause**: Session expired or invalid
- **Fix**: Sign out and sign in again

### Wrong Dashboard After Login
- **Cause**: Role not set correctly
- **Fix**: Check user role in database, update if needed

### Password Reset Not Working
- **Cause**: Email sending not implemented
- **Fix**: This is a TODO item, implement email service

### TypeScript Errors
- **Cause**: Missing types from Better Auth
- **Fix**: Restart TypeScript server in VSCode

## Support

If you encounter issues:
1. Check the error message in browser console
2. Review `AUTH_GUIDE.md` for detailed documentation
3. Verify all environment variables are set
4. Check Prisma schema matches Better Auth requirements

---

**Ready to test!** Start with creating a customer account and work through the flow.
