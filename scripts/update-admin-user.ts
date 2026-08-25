import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Updating admin user accounts...");

  const newEmail = "rajhansinternational.info@gmail.com";
  const newPassword = "raj_int_hotel";

  // 1. Remove all old admin/manager users
  const deletedUsers = await prisma.user.deleteMany({
    where: {
      email: {
        not: newEmail,
      },
    },
  });
  console.log(`Removed ${deletedUsers.count} old admin user accounts.`);

  // 2. Hash password and upsert the new Super Admin account
  const passwordHash = await bcrypt.hash(newPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: newEmail },
    update: {
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
    create: {
      email: newEmail,
      name: "Hotel Rajhans Administrator",
      passwordHash,
      role: "SUPER_ADMIN",
      phone: "+91 93081 89201",
      isActive: true,
    },
  });

  console.log(`Successfully created Super Admin user: ${admin.email}`);
  console.log("Password updated successfully!");
}

main()
  .catch((e) => {
    console.error("Update Admin User Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
