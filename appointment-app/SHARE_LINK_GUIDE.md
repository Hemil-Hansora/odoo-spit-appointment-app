# Share Link Feature - Visual Guide

## How to Share Unpublished Services

### Step 1: Create a Draft Service
1. Navigate to `/organiser/services/new`
2. Fill in service details (name, duration, price, etc.)
3. Set status to **"Draft"** (not published)
4. Click "Create Service"

### Step 2: Generate Share Link
1. Go to `/organiser/services`
2. Find your draft service (has "draft" badge)
3. Click the **"Share Link"** button (blue outline button with share icon)
4. Link is automatically copied to clipboard
5. Button shows **"✓ Copied!"** confirmation

### Step 3: Share the Link
Share the copied URL with your customers via:
- Email
- WhatsApp
- SMS
- Slack
- Any other messaging platform

Example link: `https://yourapp.com/book/abc123xyz456`

### Step 4: Customer Views & Books
When customers click the link, they see:
- Beautiful landing page with gradient background
- Service details (title, description, duration)
- Organization name badge
- "Preview - Not publicly available" indicator
- Availability schedule
- Resources (if applicable)
- **"Book Now"** button

### Step 5: Booking Flow
After clicking "Book Now":
1. Customer selects time slot
2. Selects resource (if service has multiple staff/rooms)
3. Answers custom questions
4. Confirms booking
5. Receives confirmation

## Visual Elements

### Service List Page
```
┌─────────────────────────────────────────────────┐
│  Services                                       │
│  Manage your appointment types                  │
│                          [Create Service]       │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ Initial Consultation    [draft]           │ │
│  │ 30-minute consultation                    │ │
│  │ Duration: 30 min • Bookings: 0            │ │
│  │                                           │ │
│  │         [📤 Share Link] [Edit] [View]    │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ Follow-up Visit      [published]          │ │
│  │ Quick follow-up session                   │ │
│  │ Duration: 15 min • Bookings: 5            │ │
│  │                                           │ │
│  │                      [Edit] [View]        │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
└─────────────────────────────────────────────────┘

Note: Only DRAFT services show the "Share Link" button
```

### Public Booking Page (via Share Link)
```
┌─────────────────────────────────────────────────┐
│                                                 │
│     ┌─────────────────────────────────┐        │
│     │ Shared by [Organization Name] ⓘ │        │
│     └─────────────────────────────────┘        │
│                                                 │
│          Initial Consultation                   │
│     [Preview - Not publicly available]          │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ About this service                        │ │
│  │                                           │ │
│  │ 30-minute initial consultation to         │ │
│  │ understand your needs and goals.          │ │
│  │                                           │ │
│  │ ┌───────────┐ ┌───────────┐             │ │
│  │ │ Duration  │ │  Price    │             │ │
│  │ │ 30 min    │ │  ₹500     │             │ │
│  │ └───────────┘ └───────────┘             │ │
│  │                                           │ │
│  │ Availability                              │ │
│  │ Monday     09:00 - 17:00                  │ │
│  │ Tuesday    09:00 - 17:00                  │ │
│  │ Wednesday  09:00 - 17:00                  │ │
│  │                                           │ │
│  │ Available Resources                       │ │
│  │ [Dr. Smith] [Dr. Jones]                   │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│             [   Book Now   ]                    │
│                                                 │
│  This is a private booking link. Only people   │
│  with this link can book this service.         │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Key Features

### 🔐 Security
- **Unique tokens**: Each share link has a 16-character random token
- **Unguessable**: Cannot be brute-forced or predicted
- **Revocable**: Can be deleted anytime to disable access
- **Database-backed**: Tokens stored securely in database

### 🎨 User Experience
- **One-click sharing**: Generate and copy link instantly
- **Visual feedback**: "✓ Copied!" confirmation
- **Beautiful landing**: Professional booking page for customers
- **Mobile-friendly**: Works perfectly on all devices
- **Clear status**: Shows "Preview" badge for unpublished services

### 🚀 Use Cases

#### 1. Pre-Launch Testing
```
Scenario: Test new service before public release
1. Create service as draft
2. Share link with test users
3. Gather feedback
4. Make improvements
5. Publish when ready
```

#### 2. Exclusive Access
```
Scenario: VIP customers only
1. Keep service as draft (not visible publicly)
2. Share link only with VIP list
3. They can book without account
4. Regular customers can't find it
```

#### 3. Pilot Programs
```
Scenario: Limited rollout
1. Create new service type
2. Share with small group
3. Monitor bookings and feedback
4. Iterate based on results
5. Full public launch later
```

#### 4. Direct Sales
```
Scenario: Send to specific prospects
1. Create custom service
2. Generate share link
3. Send in sales email/WhatsApp
4. Track who books
5. Follow up personally
```

## Technical Details

### Share Token Generation
```typescript
// Generate secure 16-character token
import { nanoid } from 'nanoid';
const shareToken = nanoid(16);

// Example output: "V1StGXR8_Z5jdHi6"
```

### Database Storage
```prisma
model Service {
  id              String   @id
  title           String
  isPublished     Boolean  @default(false)
  shareToken      String?  @unique  // ⭐ New field
  // ... other fields
}
```

### API Endpoints
```
POST   /api/organiser/services/[id]/share
  → Generate or retrieve share token
  → Returns: { shareToken, shareUrl }

DELETE /api/organiser/services/[id]/share
  → Revoke share access
  → Returns: { success: true }

GET    /api/public/services/[shareToken]
  → Fetch service by token (public access)
  → Returns: { service: {...} }
```

### Security Checks
```typescript
// API validates:
✓ User is authenticated
✓ User is member of organization
✓ Service exists
✓ Token is unique
✓ Token is provided for public access
```

## Comparison: Published vs Shared

| Feature | Published Service | Shared Service |
|---------|------------------|----------------|
| Public visibility | ✅ Yes | ❌ No |
| Search engines | ✅ Indexed | ❌ Hidden |
| Service list page | ✅ Shows | ❌ Hidden |
| Direct URL | ✅ Works | ❌ 404 error |
| Share link | ⚠️ Works but not needed | ✅ Required |
| Revocable | ❌ No | ✅ Yes |
| Exclusive access | ❌ No | ✅ Yes |

## Best Practices

### ✅ DO:
- Share draft services for testing
- Use for exclusive/VIP access
- Revoke links when no longer needed
- Test the link before sharing
- Include context when sending link

### ❌ DON'T:
- Post share links publicly (defeats purpose)
- Share links for published services (not needed)
- Reuse same link across different services
- Share links of competitors' services
- Forget to revoke old links

## Troubleshooting

### Link doesn't work (404 error)
**Cause**: Token was revoked or doesn't exist
**Solution**: Generate new share link

### Can't generate share link
**Cause**: Not a member of the organization
**Solution**: Check organization membership

### Button shows loading forever
**Cause**: API timeout or network issue
**Solution**: Refresh page and try again

### Share button not visible
**Cause**: Service is published
**Solution**: Only draft services can be shared (published ones are already public)

## Summary

The share link feature provides:
- 🔒 Secure private access to unpublished services
- 📤 One-click link generation and copying
- 🎨 Beautiful public booking page
- ⚡ Fast and easy sharing workflow
- 🔧 Full control and revocability

Perfect for testing, exclusive access, and targeted marketing!
