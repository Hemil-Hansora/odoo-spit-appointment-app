# Organiser Service Management - Implementation Complete

## Overview
Implemented complete service and appointment configuration functionality for organisers with all requested features.

## Features Implemented

### ✅ 1. Create Appointment Types (Services)
**Location**: `/organiser/services/new`

The service creation form includes:
- **Basic Details**:
  - Service name and description
  - Duration selection (15, 30, 45, 60, 90 minutes)
  - Price configuration
  - Publish status (Draft/Published)
  
- **Availability & Rules**:
  - Weekly schedule configuration (multiple time slots per day)
  - Day of week selection (Sunday-Saturday)
  - Buffer time between appointments
  - Max capacity per slot
  
- **Booking Questions**:
  - Custom questions for customers (text, email, phone, textarea)
  - Required/optional question configuration
  
- **Resource Selection**:
  - Multi-select resources (people/rooms) that can provide the service
  - Only active resources are shown
  
- **Date-Specific Slots** (Advanced):
  - Configure specific dates with custom slot availability
  - Override weekly schedule for special dates

### ✅ 2. Share Unpublished Appointments
**Location**: Service list page with "Share Link" button on draft services

**How it works**:
1. Click "Share Link" button on any draft (unpublished) service
2. System generates a unique, secure share token
3. Link is automatically copied to clipboard
4. Share URL format: `https://yourdomain.com/book/[shareToken]`

**Features**:
- Secure token-based access (16-character nanoid)
- One-click copy to clipboard
- Visual feedback ("✓ Copied!")
- Share tokens persist in database
- Can be revoked by deleting the token

**Database Schema**:
```prisma
model Service {
  // ...existing fields
  shareToken  String? @unique  // For sharing unpublished services
}
```

**API Endpoints**:
- `POST /api/organiser/services/[id]/share` - Generate/retrieve share token
- `DELETE /api/organiser/services/[id]/share` - Revoke share access
- `GET /api/public/services/[shareToken]` - Public endpoint to view service

### ✅ 3. Define Duration
**Location**: Service creation form

**Options Available**:
- 15 minutes
- 30 minutes
- 45 minutes
- 60 minutes
- 90 minutes

Stored as `durationMinutes` in the database and used for:
- Calculating time slots
- Displaying to customers
- Booking validation

### ✅ 4. Select Appointment Type: User vs Resources
**Location**: Service creation form under "Resources" section

**How it works**:
- **User-based appointments**: Leave resources unselected
  - Service provided directly by the organiser
  - Single booking schedule
  
- **Resource-based appointments**: Select one or more resources
  - Service can be provided by multiple staff/rooms
  - Each resource has its own availability
  - Customers choose which resource when booking

**Resource Management**:
- Resources are managed separately at `/organiser/resources`
- Can be people (doctors, consultants, therapists) or things (rooms, equipment)
- Each resource can be active/inactive
- Multiple services can share the same resources

## Public Booking Flow with Share Links

### Customer Experience:
1. **Receive share link** from organiser (e.g., via email, WhatsApp)
2. **Click link** → Opens beautiful booking page with:
   - Service details and description
   - Duration, price, capacity
   - Available days and times
   - Resources (if applicable)
   - "Preview - Not publicly available" badge
   - "Shared by [Organization Name]" badge
   
3. **Click "Book Now"** → Redirects to booking flow
   - Select time slot
   - Select resource (if applicable)
   - Answer custom questions
   - Confirm booking

### Security:
- Share tokens are unique and unguessable
- Only people with the link can access
- Can be revoked anytime by the organiser
- Works for both published and unpublished services

## Technical Implementation

### Files Created/Modified:

1. **Database Schema** (`prisma/schema.prisma`):
   - Added `shareToken` field to Service model
   - Unique constraint for shareToken
   - Migration: `20251220224310_add_share_token`

2. **API Endpoints**:
   - `app/api/organiser/services/[id]/share/route.ts` - Generate/revoke tokens
   - `app/api/public/services/[shareToken]/route.ts` - Public service access

3. **Frontend Pages**:
   - `app/(organiser)/organiser/services/page.tsx` - Added share button
   - `app/book/[shareToken]/page.tsx` - Public booking landing page

4. **Existing Features** (Already Present):
   - `app/(organiser)/organiser/services/new/page.tsx` - Full service creation
   - `app/api/organiser/services/route.ts` - Service CRUD operations
   - Resource management system
   - Booking questions system
   - Schedule configuration system

### Dependencies:
- `nanoid` - Secure random token generation
- Better Auth - Authentication for organiser routes
- Prisma - Database ORM
- Shadcn UI - UI components

## Usage Examples

### Example 1: Creating a Draft Service with Share Link
```typescript
// Organiser creates service
1. Go to /organiser/services/new
2. Fill in details:
   - Name: "Initial Consultation"
   - Duration: 30 minutes
   - Price: ₹500
   - Status: Draft
3. Click "Create Service"
4. On services list, click "Share Link"
5. Link copied: https://app.com/book/abc123xyz456
6. Send link to specific customers
```

### Example 2: Resource-Based Appointment
```typescript
// Multiple doctors offering same service
1. Create resources: Dr. Smith, Dr. Jones, Dr. Lee
2. Create service: "General Checkup"
3. Select all three doctors as resources
4. Publish service
5. Customers can choose which doctor when booking
```

### Example 3: Revoking Share Access
```typescript
// Stop sharing unpublished service
1. Go to /organiser/services
2. Click on draft service with active share link
3. Click "Revoke Share Link" (DELETE endpoint)
4. Previous link becomes invalid (404)
```

## Database Migrations

Migration applied: `20251220224310_add_share_token`

```sql
-- Add shareToken column to service table
ALTER TABLE "service" ADD COLUMN "shareToken" TEXT;

-- Add unique constraint
CREATE UNIQUE INDEX "service_shareToken_key" ON "service"("shareToken");
```

## Benefits

1. **For Organisers**:
   - Preview services before public launch
   - Share with specific customers only
   - Test booking flow with real users
   - Gather feedback before publishing
   - Full control over duration and resources

2. **For Customers**:
   - Beautiful, professional booking page
   - Clear service information
   - Easy booking process
   - Resource selection if applicable
   - Mobile-friendly interface

3. **Security**:
   - Token-based access control
   - Unguessable URLs
   - Revocable access
   - No login required for customers
   - Organiser authentication for management

## Future Enhancements (Optional)

- **Analytics**: Track how many people viewed shared links
- **Expiration**: Add expiry dates to share tokens
- **Password Protection**: Add optional password for shared links
- **Branding**: Custom colors/logos for shared booking pages
- **Email Integration**: Automatically send share links to customers
- **Usage Limits**: Limit number of bookings via share link

## Testing Checklist

- [x] Database migration applied successfully
- [x] Share token generation working
- [x] Copy to clipboard functional
- [x] Public booking page loads with share token
- [x] Service details displayed correctly
- [x] Resources shown if applicable
- [x] Duration configuration working
- [x] Weekly schedule display
- [x] "Book Now" redirects correctly
- [x] Error handling for invalid tokens
- [x] Permission checks for share token generation

## Summary

All requested features have been successfully implemented:

✅ **Create appointment types** - Full service creation with duration, schedules, questions, resources
✅ **Share unpublished appointments** - Secure share links with token-based access
✅ **Define duration** - Configurable duration from 15 to 90 minutes
✅ **Select User/Resources type** - Multi-resource selection for appointment types

The system is production-ready and provides a complete booking solution for organisers!
