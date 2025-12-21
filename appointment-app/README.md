# 📅 SPIT Appointment Booking System

A modern, full-featured appointment booking platform built with Next.js 15, featuring role-based access control, real-time availability management, and a beautiful dark-themed UI with glass-morphism design.

## ✨ Features

### 🎭 Role-Based Access Control

#### 👥 Customer Portal
- **Service Discovery**: Browse and search available services from multiple organizers
- **Real-time Booking**: Book appointments with instant availability checking
- **Exclusive Slots**: One slot per customer - prevents double-booking
- **Appointment Management**: View, track, and manage all bookings in one place
- **Calendar Integration**: Export appointments to Google Calendar & Outlook
- **Status Tracking**: Monitor appointment status (Pending, Confirmed, Cancelled)
- **Custom Questions**: Answer service-specific questions during booking
- **Payment Processing**: Integrated payment flow for paid services

#### 🏢 Organizer Dashboard
- **Service Management**: Create, edit, and delete services with custom configurations
- **Resource Management**: Manage staff, rooms, or equipment with availability settings
- **Appointment Oversight**: View and manage all customer bookings
- **Multi-Organization Support**: Isolated data per organization
- **Custom Workflows**: Set custom questions, confirmation messages, and booking rules
- **Venue Management**: Configure multiple venues with detailed information

#### 👑 Admin Panel
- **System Overview**: Comprehensive dashboard with key metrics
- **User Management**: Monitor all customers and organizers
- **Analytics**: Total services, appointments, and user statistics
- **Recent Activity**: Track latest organizers, customers, and appointments
- **Full Access**: View all data across organizations

### 🎨 Modern UI/UX
- **Dark Theme**: Sophisticated gradient-based color scheme
- **Glass-morphism Design**: Frosted glass effects with backdrop blur
- **Responsive Layout**: Optimized for desktop, tablet, and mobile
- **Smooth Animations**: Polished transitions and hover effects
- **Color-Coded Status**: Visual indicators for appointment states
  - 🟢 Green: Confirmed appointments
  - 🟡 Yellow: Pending appointments
  - 🔴 Red: Cancelled appointments
  - 🟣 Purple: Primary actions and organizer elements
  - 🔵 Cyan: Customer-focused elements

### 🔐 Security & Authentication
- **Better Auth Integration**: Secure session-based authentication
- **Email Verification**: Account confirmation via email
- **Password Reset**: Forgot password functionality
- **Protected Routes**: Server-side authentication checks
- **Organization Isolation**: Strict data separation between organizations
- **Role Verification**: API-level access control

### 📊 Data Management
- **PostgreSQL Database**: Robust relational data storage
- **Prisma ORM**: Type-safe database queries
- **Server Components**: Optimized data fetching with Next.js 15
- **API Routes**: RESTful endpoints for all operations
- **Transaction Support**: Atomic operations for critical workflows

## 🏗️ Tech Stack

### Frontend
- **Next.js 16.1**: React framework with App Router
- **React 19.2**: Latest React with concurrent features
- **TypeScript**: Full type safety across the codebase
- **Tailwind CSS 4**: Utility-first styling
- **shadcn/ui**: High-quality UI components
- **Class Variance Authority**: Component variant management

### Backend
- **Better Auth 1.4**: Authentication & session management
- **Prisma 7.2**: Next-generation ORM
- **PostgreSQL**: Production-grade relational database
- **PostgreSQL Adapter**: Optimized Prisma adapter for PostgreSQL

### Development Tools
- **ESLint**: Code linting and quality checks
- **TypeScript 5.9**: Static type checking
- **Prisma Studio**: Database GUI (via `pnpm prisma studio`)
- **pnpm**: Fast, disk space efficient package manager

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **pnpm** 8.x or higher
- **PostgreSQL** 14.x or higher

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd odoo-spit-appointment-app/appointment-app
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/appointment_db"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# Email (for verification & notifications)
RESEND_API_KEY="your-resend-api-key"
```

4. **Initialize the database**
```bash
# Generate Prisma Client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# (Optional) Seed the database
pnpm prisma db seed
```

5. **Start the development server**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
appointment-app/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── sign-in/              # Login page
│   │   ├── sign-up/              # Registration page
│   │   └── forgot-password/      # Password reset
│   ├── (customer)/               # Customer portal
│   │   └── book/                 # Booking flow
│   │       ├── page.tsx          # Service selection
│   │       ├── select-resource/  # Resource selection
│   │       ├── select-slot/      # Date & time picker
│   │       ├── questions/        # Custom questions
│   │       ├── payment/          # Payment processing
│   │       ├── confirmation/     # Booking confirmation
│   │       └── my-appointments/  # Appointments dashboard
│   ├── (organiser)/              # Organizer dashboard
│   │   └── organiser/
│   │       ├── page.tsx          # Dashboard overview
│   │       ├── services/         # Service management
│   │       ├── resources/        # Resource management
│   │       └── bookings/         # Appointment management
│   ├── (admin)/                  # Admin panel
│   │   └── admin/
│   │       └── page.tsx          # Admin dashboard
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── customer/             # Customer API
│   │   └── organiser/            # Organizer API
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/                   # Reusable components
│   ├── ui/                       # shadcn/ui components
│   ├── protected-route.tsx       # Route protection
│   └── user-nav.tsx              # User navigation
├── lib/                          # Utility libraries
│   ├── auth.ts                   # Auth configuration
│   ├── auth-client.ts            # Client-side auth
│   ├── auth-utils.ts             # Auth helpers
│   ├── db.ts                     # Database client
│   ├── permissions.ts            # Permission checks
│   ├── rbac.ts                   # Role-based access
│   └── utils.ts                  # General utilities
├── prisma/                       # Database schema & migrations
│   ├── schema.prisma             # Prisma schema
│   └── migrations/               # Database migrations
├── public/                       # Static assets
│   └── landing.html              # Static landing page
└── generated/                    # Generated Prisma types
```

## 🗄️ Database Schema

### Core Models

- **User**: System users with role-based access (CUSTOMER, ORGANISER, ADMIN)
- **Organization**: Multi-tenant organizations for organizers
- **Member**: Organization membership and roles
- **Service**: Bookable services offered by organizers
- **Resource**: Staff, rooms, or equipment available for booking
- **Slot**: Time slots with availability management
- **Booking**: Customer appointments with status tracking
- **Venue**: Physical or virtual locations for services

### Authentication Models

- **Session**: User session management
- **Account**: OAuth and credential accounts
- **Verification**: Email verification tokens
- **Invitation**: Organization invitations

## 🔧 Configuration

### Prisma Configuration

The project uses a custom Prisma configuration (`prisma.config.ts`) for enhanced type safety and code generation.

### Authentication

Authentication is configured in `lib/auth.ts` using Better Auth with:
- Email/Password authentication
- Session-based auth
- Email verification
- Password reset functionality

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `BETTER_AUTH_SECRET` | Secret key for session encryption | Yes |
| `BETTER_AUTH_URL` | Application URL | Yes |
| `RESEND_API_KEY` | Email service API key | Yes |

## 🎯 Key Features Implementation

### Exclusive Slot Booking

Slots are created with `capacity: 1` and the booking API checks for existing active bookings before allowing new reservations:

```typescript
// Prevents double-booking
const existingBookings = await db.booking.findMany({
  where: {
    slotId: slotId,
    status: { in: ["PENDING", "CONFIRMED"] }
  }
});

if (existingBookings.length > 0) {
  return error("Slot already booked");
}
```

### Organization Isolation

All organizer endpoints verify organization membership before data access:

```typescript
const member = await db.member.findFirst({
  where: {
    organizationId,
    userId: session.user.id,
  },
});

if (!member) {
  return error("Access denied");
}
```

### Server-Side Authentication

All protected routes use server-side session validation:

```typescript
const session = await auth.api.getSession({
  headers: await headers(),
});

if (!session?.user) {
  redirect("/sign-in");
}
```

## 🧪 Development

### Run Development Server
```bash
pnpm dev
```

### Build for Production
```bash
pnpm build
```

### Start Production Server
```bash
pnpm start
```

### Database Commands
```bash
# Open Prisma Studio
pnpm prisma studio

# Create a migration
pnpm prisma migrate dev --name migration_name

# Reset database
pnpm prisma migrate reset

# Generate Prisma Client
pnpm prisma generate
```

### Linting
```bash
pnpm lint
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- **Railway**: Easy PostgreSQL + Next.js deployment
- **Render**: Full-stack deployment with managed database
- **AWS/Azure/GCP**: Custom infrastructure setup

### Database Considerations

Ensure your production database:
- Has sufficient connection limits
- Uses SSL connections
- Has regular backups configured
- Is accessible from your deployment platform

## 🎨 UI Theme Customization

The app uses a dark theme with customizable colors in `app/globals.css`:

- **Primary**: Purple gradient (`rgb(168, 85, 247)`)
- **Secondary**: Cyan accents (`rgb(34, 211, 238)`)
- **Warning**: Yellow (`rgb(250, 204, 21)`)
- **Success**: Green (`rgb(34, 197, 94)`)
- **Danger**: Red (`rgb(239, 68, 68)`)

Glass-morphism effects use:
```css
background: rgba(255, 255, 255, 0.03);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

## 📝 API Endpoints

### Customer APIs
- `GET /api/customer/services` - List available services
- `GET /api/customer/resources` - Get resources for a service
- `GET /api/customer/slots` - Get available time slots
- `POST /api/customer/bookings` - Create a booking
- `GET /api/customer/bookings` - List user bookings

### Organizer APIs
- `GET /api/organiser/services` - List organization services
- `POST /api/organiser/services` - Create a service
- `GET /api/organiser/resources` - List resources
- `POST /api/organiser/resources` - Create a resource
- `GET /api/organiser/bookings` - List all bookings

### Authentication APIs
- `POST /api/auth/sign-in` - User login
- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-out` - User logout
- `POST /api/auth/forgot-password` - Password reset

## 👥 Team Members

- **Meet Soni** - Developer
- **Hemil Hansora** - Developer
- **Vrund Patel** - Developer

## 🎥 Project Demo

Watch our project demonstration video: [View Demo Video](https://drive.google.com/file/d/1oBYWmxd4RjWLn21sUQHXqjpvSweMERsk/view?usp=drivesdk)

## 👨‍💼 Reviewer

- **temo@odoo.com**

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Better Auth](https://www.better-auth.com/) - Authentication library
- [Prisma](https://www.prisma.io/) - Database ORM
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework

## 📧 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

**Built with ❤️ using Next.js 16 and TypeScript**
