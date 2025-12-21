/**
 * Script to make a user an admin
 * 
 * Usage: npx ts-node scripts/make-admin.ts <email>
 * 
 * Example: npx ts-node scripts/make-admin.ts admin@example.com
 */

import db from "../lib/db";

async function makeAdmin(email: string) {
  if (!email) {
    console.error("❌ Please provide an email address");
    console.log("Usage: npx ts-node scripts/make-admin.ts <email>");
    process.exit(1);
  }

  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`❌ User with email ${email} not found`);
      process.exit(1);
    }

    const updatedUser = await db.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });

    console.log(`✅ Successfully made ${email} an admin!`);
    console.log(`   User ID: ${updatedUser.id}`);
    console.log(`   Role: ${updatedUser.role}`);
  } catch (error) {
    console.error("❌ Error making user admin:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

const email = process.argv[2];
makeAdmin(email);
