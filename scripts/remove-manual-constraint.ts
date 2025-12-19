import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Entferne manuell erstellten Constraint...\n");

  try {
    await prisma.$executeRawUnsafe(`
      DROP INDEX IF EXISTS "partners_email_key";
    `);

    console.log("✅ Constraint entfernt! Prisma kann jetzt die Migration durchführen.\n");
  } catch (error: any) {
    console.error("❌ Fehler:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
