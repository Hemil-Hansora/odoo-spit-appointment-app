# Role-Based Authentication System

This document explains the role-based authentication system implemented in the appointment booking application using Better Auth.

## Overview

The system supports two types of accounts:
- **Customer**: Users who can browse and book appointments
- **Organiser**: Users who can create organizations, manage services, and handle bookings

### Roles Hierarchy

For organiser accounts, there are three organizational roles:

1. **Owner** (highest level)
   - Full control over the organization
   - Can manage all services, resources, schedules
   - Can invite and manage members
   - Access: `/admin` dashboard

2. **Admin** (mid level)
   - Can manage services and bookings
   - Can manage resources and schedules
   - Cannot manage organization settings
   - Access: `/organiser` dashboard

3. **Member** (basic level)
   - Can view and manage appointments
   - Limited access to configuration
   - Access: `/organiser/appointments`

## Database Structure

### User Table
Stores basic user information (created by Better Auth)
```prisma
model User {
  id            String
  name          String
  email         String
  emailVerified Boolean
  createdAt     DateTime
  updatedAt     DateTime
  
  members       Member[]      // Organization memberships
  bookings      Booking[]     // Customer bookings
}
```

### Organization Table
Stores organization information
```prisma
model Organization {
  id        String
  name      String
  slug      String   @unique
  logo      String?
  metadata  String?  // JSON with accountType, etc.
  
  members   Member[]
  services  Service[]
}
```

### Member Table
Links users to organizations with roles
```prisma
model Member {
  id             String
  organizationId String
  userId         String
  role           String   @default("member")  // "owner", "admin", "member"
  createdAt      DateTime
  
  organization   Organization
  user           User
}
```

## Sign-Up Flow

### Customer Sign-Up
1. User fills out sign-up form with account type "Customer"
2. POST request to `/api/auth/signup` creates:
   - User record
   - No organization or member records
3. User is redirected to `/customer` dashboard

### Organiser Sign-Up
1. User fills out sign-up form with:
   - Account type: "Organiser"
   - Organization name
2. POST request to `/api/auth/signup` creates:
   - User record
   - Organization record with unique slug
   - Member record linking user to organization with "owner" role
3. User is redirected to `/admin` dashboard

## Sign-In Flow

1. User signs in with email/password
2. System fetches user's organization memberships
3. Determines active organization (from session or first membership)
4. Sets role based on membership
5. Redirects to appropriate dashboard:
   - Customer → `/customer`
   - Owner → `/admin`
   - Admin → `/organiser`
   - Member → `/organiser/appointments`

## Session Enhancement

The session is enhanced with role and organization information:

```typescript
{
  user: {
    id: string
    name: string
    email: string
    role: "owner" | "admin" | "member" | "customer"
    accountType: "customer" | "organiser"
    organizationId: string | null
    organizations: Array<{
      id: string
      name: string
      slug: string
      role: string
    }>
  }
  organization: {
    id: string
    name: string
    slug: string
    logo: string | null
  } | null
}
```

## API Endpoints

### POST /api/auth/signup
Enhanced sign-up that creates user, organization, and member records.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "accountType": "organiser",
  "organizationName": "My Company"  // Only for organiser
}
```

**Response:**
```json
{
  "success": true,
  "user": { "id": "...", "name": "...", "email": "..." },
  "organization": { "id": "...", "name": "...", "slug": "..." },
  "role": "owner",
  "accountType": "organiser"
}
```

### GET /api/auth/session
Get enhanced session with role and organization information.

**Response:**
```json
{
  "session": {
    "user": {
      "id": "...",
      "role": "owner",
      "accountType": "organiser",
      "organizationId": "org_...",
      "organizations": [...]
    },
    "organization": { "id": "...", "name": "...", "slug": "..." }
  }
}
```

### PATCH /api/auth/session
Switch active organization (for users with multiple memberships).

**Request Body:**
```json
{
  "organizationId": "org_..."
}
```

## Frontend Integration

### Sign-Up Form
Located in: `app/(auth)/sign-up/sign-up-form.tsx`

Features:
- Account type selection (Customer/Organiser)
- Organization name field (shown only for Organiser)
- Calls `/api/auth/signup` with account details
- Auto sign-in after registration
- Role-based redirection

### Sign-In Form
Located in: `app/(auth)/sign-in/sign-in-form.tsx`

Features:
- Standard email/password authentication
- Calls `redirectToDashboard()` server action
- Role-based redirection after successful login

### Server Actions
Located in: `app/(auth)/actions.ts`

**redirectToDashboard()**
- Gets session with role information
- Redirects based on accountType and role

**getUserRole()**
- Returns user's role, accountType, and organization status
- Used for client-side routing decisions

### Auth Utils
Located in: `lib/auth-utils.ts`

**getSession()**
- Enhanced session retrieval
- Automatically fetches organization memberships
- Calculates role and account type
- Returns complete session with role information

**requireAuth()**
- Ensures user is authenticated
- Throws error if not authenticated

**requireRole(role)**
- Ensures user has required role
- Checks role hierarchy
- Throws error if insufficient permissions

## Using Role-Based Auth in Components

### Server Components
```typescript
import { getSession, requireRole } from "@/lib/auth-utils";

export default async function AdminPage() {
  // Require owner role
  const session = await requireRole("owner");
  
  // Access organization info
  const organizationId = session.user.organizationId;
  const role = session.user.role;
  
  return <div>Admin Dashboard</div>;
}
```

### Client Components
```typescript
"use client";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [organizationId, setOrganizationId] = useState("");
  
  useEffect(() => {
    const fetchSession = async () => {
      const response = await fetch("/api/auth/session");
      const data = await response.json();
      
      if (data.session?.user?.organizationId) {
        setOrganizationId(data.session.user.organizationId);
      }
    };
    
    fetchSession();
  }, []);
  
  return <div>Dashboard</div>;
}
```

### API Routes
```typescript
import { auth } from "@/lib/auth";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  // Get session
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Get organization ID from query
  const organizationId = searchParams.get("organizationId");
  
  // Verify user is member of organization
  const membership = await db.member.findFirst({
    where: {
      userId: session.user.id,
      organizationId,
    },
  });
  
  if (!membership) {
    return NextResponse.json(
      { error: "Not a member of this organization" },
      { status: 403 }
    );
  }
  
  // Proceed with authorized request
  // ...
}
```

## Permission System

Permissions are defined in `lib/permissions.ts` and enforced through `lib/rbac.ts`.

### Role Permissions

**Owner:**
- Full CRUD on services, resources, schedules, bookings
- Organization management
- Member management

**Admin:**
- Full CRUD on services, resources, schedules, bookings
- Cannot manage organization or members

**Member:**
- Read services and resources
- CRUD on bookings
- Limited configuration access

### Checking Permissions

```typescript
import { checkPermission } from "@/lib/auth-utils";

// Check if user can create services
const canCreate = await checkPermission("service", "create");

if (!canCreate) {
  return NextResponse.json(
    { error: "Permission denied" },
    { status: 403 }
  );
}
```

## Testing the System

### Test Customer Account
1. Sign up with account type "Customer"
2. Verify no organization is created
3. Verify redirect to `/customer`
4. Check that user cannot access `/admin` or `/organiser`

### Test Organiser Account (Owner)
1. Sign up with account type "Organiser"
2. Provide organization name
3. Verify organization and member records are created
4. Verify role is "owner"
5. Verify redirect to `/admin`
6. Check full access to all features

### Test Role Hierarchy
1. Create organization with owner
2. Invite member with "admin" role
3. Invite member with "member" role
4. Test access levels for each role
5. Verify permission enforcement

## Troubleshooting

### User can't access organization
- Check if Member record exists
- Verify organizationId is set in session
- Check role is correctly assigned

### Organization not created on sign-up
- Verify `/api/auth/signup` endpoint is being called
- Check database for organization and member records
- Review server logs for errors

### Wrong dashboard redirect
- Check `redirectToDashboard()` logic
- Verify session has correct role and accountType
- Check membership records in database

## Security Considerations

1. **Session Security**: Sessions are managed by Better Auth with secure tokens
2. **Role Verification**: Always verify role on server-side, never trust client
3. **Organization Membership**: Verify membership before allowing access to organization data
4. **Password Security**: Passwords are hashed by Better Auth
5. **API Authorization**: Every API route checks authentication and organization membership

## Future Enhancements

- Multi-organization support (user can belong to multiple orgs)
- Role-based UI rendering (show/hide features based on role)
- Audit logging for role changes
- Team invitations and onboarding flow
- Organization settings management
- Custom roles and permissions
