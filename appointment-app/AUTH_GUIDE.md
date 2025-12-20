# Authentication Setup with Better Auth

This application uses [Better Auth](https://better-auth.com) for authentication with role-based access control.

## Role-Based Access Control (RBAC)

The application supports 4 user roles:

| Role | Label | Permissions |
|------|-------|-------------|
| `owner` | Organisation Owner | Full access: billing, delete org, manage admins |
| `admin` | Organiser | Create services, slots, resources, view bookings |
| `member` | Provider/Staff | View assigned bookings, update status |
| (no org) | Customer | Book appointments only |

## Features Implemented

### 1. Email & Password Authentication
- ✅ Sign up with email and password
- ✅ Sign in with email and password
- ✅ Password reset functionality
- ✅ Session management
- ✅ Client-side form validation
- ✅ Error handling and loading states

### 2. Organization Support
- ✅ Better Auth organization plugin integrated
- ✅ Role assignment within organizations
- ✅ Customer accounts (no organization)
- ✅ Organization member accounts (owner, admin, member)

### 3. Role-Based Routing
- ✅ Automatic redirect based on user role after login
- ✅ Protected routes with role checking
- ✅ Permission-based access control

## File Structure

```
app/
├── (auth)/
│   ├── sign-in/
│   │   ├── page.tsx              # Sign-in page
│   │   └── sign-in-form.tsx      # Client-side sign-in form
│   ├── sign-up/
│   │   ├── page.tsx              # Sign-up page
│   │   └── sign-up-form.tsx      # Client-side sign-up form with role selection
│   └── forgot-password/
│       ├── page.tsx              # Forgot password page
│       └── forgot-password-form.tsx
│
├── api/
│   └── auth/
│       └── [...all]/
│           └── route.ts          # Better Auth API routes
│
components/
├── protected-route.tsx           # HOC for protected routes
└── user-nav.tsx                  # User navigation component

lib/
├── auth.ts                       # Better Auth server config
├── auth-client.ts                # Better Auth client config
├── auth-utils.ts                 # Server-side auth helpers
├── permissions.ts                # Permission definitions
└── rbac.ts                       # Role-based access control logic
```

## Usage Examples

### 1. Client-Side Authentication

```tsx
"use client";

import { useSession, signOut } from "@/lib/auth-client";

export function MyComponent() {
  const { data: session, isPending } = useSession();
  
  if (isPending) return <div>Loading...</div>;
  if (!session) return <div>Not authenticated</div>;
  
  return (
    <div>
      <p>Welcome, {session.user.name}</p>
      <p>Role: {session.user.role}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

### 2. Server-Side Authentication

```tsx
import { getSession, requireAuth, requireRole } from "@/lib/auth-utils";

// Get session (optional auth)
export async function MyServerComponent() {
  const session = await getSession();
  
  if (!session) {
    return <div>Please sign in</div>;
  }
  
  return <div>Hello, {session.user.name}</div>;
}

// Require authentication
export async function ProtectedServerComponent() {
  const session = await requireAuth(); // Throws if not authenticated
  
  return <div>Protected content for {session.user.name}</div>;
}

// Require specific role
export async function AdminOnlyComponent() {
  const session = await requireRole("admin"); // Throws if not admin+
  
  return <div>Admin dashboard</div>;
}
```

### 3. Protected Client Component

```tsx
"use client";

import { ProtectedRoute } from "@/components/protected-route";

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div>Admin content here</div>
    </ProtectedRoute>
  );
}
```

### 4. Check Permissions

```tsx
import { checkPermission } from "@/lib/auth-utils";

export async function ServiceEditor() {
  const canEdit = await checkPermission("service", "update");
  const canDelete = await checkPermission("service", "delete");
  
  return (
    <div>
      {canEdit && <button>Edit Service</button>}
      {canDelete && <button>Delete Service</button>}
    </div>
  );
}
```

## Environment Variables

Add these to your `.env.local`:

```env
# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Better Auth (optional, for production)
BETTER_AUTH_SECRET=your-secret-key-here
```

## Login Flow

1. User visits `/sign-in`
2. Enters email and password
3. Better Auth validates credentials
4. On success, user is redirected based on role:
   - **Customer** (no org) → `/customer`
   - **Member** → `/organiser/appointments`
   - **Admin** → `/organiser`
   - **Owner** → `/admin`

## Sign Up Flow

1. User visits `/sign-up`
2. Selects account type: **Customer** or **Organiser**
3. Enters name, email, and password
4. Better Auth creates account
5. User is redirected to appropriate dashboard

## Password Reset Flow

1. User visits `/forgot-password`
2. Enters email address
3. Better Auth sends reset email
4. User clicks link in email
5. User enters new password
6. Redirected to sign-in page

## Next Steps

### For Customers
- After signup, customers can browse services and book appointments
- No organization membership required

### For Organisers
- After signup, organisers need to:
  1. Create an organization (if owner)
  2. Join an existing organization (if admin/member)
  3. Set up services and availability

### For Admins
- Admins need to invite users to organizations
- Assign roles (owner, admin, member)
- Manage organization settings

## Security Notes

- Passwords are hashed using bcrypt
- Sessions are stored securely
- CSRF protection enabled
- Role checks on both client and server
- Permission checks before sensitive operations

## Troubleshooting

### "Unauthorized" error
- Make sure you're signed in
- Check if your session is still valid
- Try signing out and back in

### Wrong dashboard after login
- Check your user role in the database
- Verify organization membership
- Check role assignment in organization

### Can't access certain features
- Verify your role has the required permissions
- Check `lib/permissions.ts` for role capabilities
- Contact organization owner to update role
