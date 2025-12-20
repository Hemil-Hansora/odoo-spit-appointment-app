const { prisma } = require("../lib/prisma");
const bcrypt = require("bcryptjs");

const DEMO_ACCOUNTS = [
  {
    email: "organizer@demo.com",
    password: "demo123",
    name: "Demo Organizer",
    role: "organizer",
  },
  {
    email: "admin@demo.com",
    password: "demo123",
    name: "Demo Admin",
    role: "admin",
  },
  {
    email: "customer@demo.com",
    password: "demo123",
    name: "Demo Customer",
    role: "customer",
  },
];

async function seed() {
  console.log("🌱 Seeding demo accounts...");

  for (const account of DEMO_ACCOUNTS) {
    const hashedPassword = await bcrypt.hash(account.password, 10);

    try {
      // Try to find existing user
      let user = await prisma.user.findUnique({
        where: { email: account.email },
      });

      // Create if doesn't exist
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: account.email,
            name: account.name,
          },
        });
        console.log(`✅ Created user: ${account.email}`);
      } else {
        console.log(`ℹ️  User already exists: ${account.email}`);
      }

      // Check if account already exists
      const existingAccount = await prisma.account.findFirst({
        where: {
          userId: user.id,
          providerId: "email",
        },
      });

      if (!existingAccount) {
        // Create new account
        await prisma.account.create({
          data: {
            userId: user.id,
            accountId: user.id,
            providerId: "email",
            password: hashedPassword,
          },
        });
        console.log(`✅ Created account with password: ${account.email} / ${account.password}`);
      } else {
        console.log(`ℹ️  Account already exists for: ${account.email}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${account.email}:`, error);
    }
  }

  console.log("\n📋 Demo Accounts Ready:");
  console.log("Organizer: organizer@demo.com / demo123");
  console.log("Admin: admin@demo.com / demo123");
  console.log("Customer: customer@demo.com / demo123");
}

seed()
  .then(() => {
    console.log("\n✨ Seeding complete!");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
