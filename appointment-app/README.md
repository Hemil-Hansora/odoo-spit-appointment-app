Appointment App — Next.js + shadcn UI

This project implements a scheduling and booking system with customer, organiser, and admin views. UI uses shadcn components styled with the neutral color tokens defined in `app/globals.css` (no gradients or purple/blue palettes).

## Getting Started

Run the development server:

```bash
pnpm -F appointment-app dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Key routes:

- `/` — Home: list available appointment types and “Book Appointment” actions.
- `/book/[serviceId]` — Booking flow: select provider, date, real-time slots, capacity, questions, confirm.
- `/auth/login`, `/auth/signup`, `/auth/verify-otp`, `/auth/forgot-password` — Auth flows (Better Auth integration stubbed).
- `/customer` — Profile management: update details, view upcoming and past appointments.
- `/organiser` — Configure appointment types and manage resources; view bookings.
- `/admin` — Admin dashboard with totals.

Tech:
- Next.js App Router
- shadcn components (Base UI powered) with tokens from `globals.css`
- In-memory mock data in `lib/data.ts` and types in `lib/types.ts`

Next steps:
- Integrate Better Auth fully with persistence (SQLite/Prisma) and OTP/email provider.
- Add server actions/APIs for booking creation, capacity validation, and conflict prevention.
- Add publish/unpublish, share links for unpublished appointments, and payment handling (advance payments).

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
