# Testing Role-Based Authentication

This guide helps you test the role-based authentication system.

## Prerequisites

1. Make sure the development server is running:
```bash
pnpm run dev
```

2. Ensure the database is migrated:
```bash
pnpm prisma migrate dev
```

## Test Scenarios

### Scenario 1: Customer Account Creation

1. Navigate to http://localhost:3000/sign-up

2. Fill in the form:
   - Name: `Test Customer`
   - Email: `customer@test.com`
   - Account Type: `Customer - Book appointments`
   - Password: `password123`
   - Confirm Password: `password123`

3. Click "Create Account"

4. **Expected Results:**
   - User is created in the `user` table
   - NO organization is created
   - NO member record is created
   - User is redirected to `/customer`

5. **Verify in Database:**
```sql
-- Check user exists
SELECT * FROM "user" WHERE email = 'customer@test.com';

-- Verify NO member record
SELECT * FROM "member" WHERE "userId" = '<user_id_from_above>';

-- Should return 0 rows
```

### Scenario 2: Organiser Account Creation (Owner)

1. Navigate to http://localhost:3000/sign-up

2. Fill in the form:
   - Name: `Test Organiser`
   - Email: `organiser@test.com`
   - Account Type: `Organiser - Manage services`
   - Organization Name: `Test Clinic`
   - Password: `password123`
   - Confirm Password: `password123`

3. Click "Create Account"

4. **Expected Results:**
   - User is created in the `user` table
   - Organization "Test Clinic" is created with slug "test-clinic"
   - Member record is created linking user to organization with role "owner"
   - User is redirected to `/admin`

5. **Verify in Database:**
```sql
-- Check user exists
SELECT * FROM "user" WHERE email = 'organiser@test.com';

-- Check organization exists
SELECT * FROM "organization" WHERE name = 'Test Clinic';

-- Check member record with owner role
SELECT m.*, u.email, o.name as org_name
FROM "member" m
JOIN "user" u ON u.id = m."userId"
JOIN "organization" o ON o.id = m."organizationId"
WHERE u.email = 'organiser@test.com';

-- Should show role = 'owner'
```

### Scenario 3: Sign In and Role-Based Redirect

#### Test Customer Sign-In

1. Navigate to http://localhost:3000/sign-in

2. Enter credentials:
   - Email: `customer@test.com`
   - Password: `password123`

3. Click "Sign In"

4. **Expected Results:**
   - User is authenticated
   - User is redirected to `/customer`
   - Session has `accountType: "customer"`
   - Session has `role: "customer"`

#### Test Organiser Sign-In (Owner)

1. Sign out and navigate to http://localhost:3000/sign-in

2. Enter credentials:
   - Email: `organiser@test.com`
   - Password: `password123`

3. Click "Sign In"

4. **Expected Results:**
   - User is authenticated
   - User is redirected to `/admin`
   - Session has `accountType: "organiser"`
   - Session has `role: "owner"`
   - Session has `organizationId` set

### Scenario 4: Session API Verification

With user signed in, test the session endpoint:

```bash
# Get session (use browser's cookies)
curl -X GET http://localhost:3000/api/auth/session \
  -H "Cookie: better-auth.session_token=<your_token>"
```

**Expected Response:**
```json
{
  "session": {
    "user": {
      "id": "...",
      "name": "Test Organiser",
      "email": "organiser@test.com",
      "role": "owner",
      "accountType": "organiser",
      "organizationId": "org_...",
      "organizations": [
        {
          "id": "org_...",
          "name": "Test Clinic",
          "slug": "test-clinic",
          "role": "owner"
        }
      ]
    },
    "organization": {
      "id": "org_...",
      "name": "Test Clinic",
      "slug": "test-clinic",
      "logo": null
    }
  }
}
```

### Scenario 5: Access Control Testing

#### Test Customer Cannot Access Organiser Pages

1. Sign in as customer (`customer@test.com`)
2. Try to access:
   - http://localhost:3000/admin
   - http://localhost:3000/organiser
   - http://localhost:3000/organiser/appointments

**Expected Results:**
- Should redirect to `/customer`
- Or show access denied message

#### Test Owner Can Access All Pages

1. Sign in as owner (`organiser@test.com`)
2. Access:
   - http://localhost:3000/admin ✅
   - http://localhost:3000/organiser ✅
   - http://localhost:3000/organiser/appointments ✅

**Expected Results:**
- All pages are accessible

### Scenario 6: Organization Context in API Calls

1. Sign in as organiser
2. Navigate to http://localhost:3000/organiser/appointments
3. Open browser DevTools → Network tab
4. Switch to "Bookings" tab

**Expected API Call:**
```
GET /api/organiser/bookings?organizationId=org_...
```

**Expected Response:**
```json
{
  "bookings": [],
  "total": 0
}
```

5. Switch to "Configuration" tab

**Expected API Calls:**
```
GET /api/organiser/services?organizationId=org_...
GET /api/organiser/services/{serviceId}/config
```

### Scenario 7: Create Service with Organization

1. Sign in as organiser
2. Navigate to http://localhost:3000/organiser/services/new
3. Create a service

**Expected Database Entry:**
```sql
SELECT * FROM "service" WHERE "organizationId" = 'org_...';
```

Should show the created service linked to the organization.

## Common Issues and Solutions

### Issue: Organization ID not found

**Problem:** `organizationId` is null or undefined in API calls

**Solution:**
1. Check that user is signed in
2. Verify Member record exists in database
3. Check session API response
4. Clear browser cookies and sign in again

### Issue: Cannot access organiser pages

**Problem:** Redirected to `/customer` when trying to access `/admin` or `/organiser`

**Solution:**
1. Verify account was created with "Organiser" type
2. Check Member record has correct role
3. Check session has `organizationId` and correct `role`

### Issue: Multiple organizations showing

**Problem:** User belongs to multiple organizations

**Solution:**
- Use the session PATCH endpoint to switch active organization:
```bash
curl -X PATCH http://localhost:3000/api/auth/session \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=<your_token>" \
  -d '{"organizationId": "org_..."}'
```

## Database Queries for Debugging

### Check User's Organizations
```sql
SELECT 
  u.email,
  o.name as organization,
  m.role,
  m."createdAt"
FROM "member" m
JOIN "user" u ON u.id = m."userId"
JOIN "organization" o ON o.id = m."organizationId"
WHERE u.email = 'your-email@test.com';
```

### Check All Members of an Organization
```sql
SELECT 
  u.name,
  u.email,
  m.role,
  m."createdAt"
FROM "member" m
JOIN "user" u ON u.id = m."userId"
WHERE m."organizationId" = 'org_...';
```

### Check Services by Organization
```sql
SELECT 
  s.title,
  s."isPublished",
  o.name as organization
FROM "service" s
JOIN "organization" o ON o.id = s."organizationId"
WHERE s."organizationId" = 'org_...';
```

## Automated Testing

You can create automated tests using these curl commands:

```bash
# 1. Create organiser account
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-org@example.com",
    "password": "password123",
    "name": "Test Organiser",
    "accountType": "organiser",
    "organizationName": "Test Organization"
  }'

# 2. Sign in and get session token
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-org@example.com",
    "password": "password123"
  }' \
  -c cookies.txt

# 3. Get session with role info
curl -X GET http://localhost:3000/api/auth/session \
  -b cookies.txt

# 4. Test API access
curl -X GET "http://localhost:3000/api/organiser/services?organizationId=org_..." \
  -b cookies.txt
```

## Success Criteria

✅ Customer accounts:
- User created without organization
- Redirects to `/customer`
- Cannot access organiser pages

✅ Organiser accounts:
- User, organization, and member records created
- Role is "owner"
- Redirects to `/admin`
- Can access all organiser pages

✅ Session enhancement:
- Session includes role and organizationId
- Organization data is available
- Multiple organizations are listed

✅ API authorization:
- API calls include organizationId
- Membership is verified
- Data is scoped to organization

✅ Role-based routing:
- Users redirect to appropriate dashboard
- Access control is enforced
- Permission checks work correctly
