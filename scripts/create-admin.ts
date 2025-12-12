/**
 * Script zum Erstellen eines Admin-Benutzers
 * 
 * Ausführung:
 * npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/create-admin.ts
 * 
 * Oder mit tsx:
 * npx tsx scripts/create-admin.ts
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@meta-datenschutzklage.de";
  const password = process.env.ADMIN_PASSWORD || "admin123456";
  const name = process.env.ADMIN_NAME || "Administrator";

  console.log(`Creating admin user: ${email}`);

  // Check if user already exists
  const existingUser = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log("Admin user already exists. Updating password...");
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    await prisma.adminUser.update({
      where: { email },
      data: { passwordHash, name },
    });
    
    console.log("Admin user updated successfully!");
  } else {
    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.adminUser.create({
      data: {
        email,
        passwordHash,
        name,
      },
    });

    console.log("Admin user created successfully!");
  }

  console.log(`\nLogin credentials:`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log(`\n⚠️  Please change the password after first login!`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

