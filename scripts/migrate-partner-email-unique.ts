import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Füge Unique Constraint auf Partner-E-Mail hinzu...\n");

  try {
    // Prüfe zuerst auf Duplikate
    const partners = await prisma.partner.findMany({
      select: { email: true },
    });

    const emails = partners.map((p) => p.email).filter((e): e is string => !!e);
    const duplicates = emails.filter((email, index) => emails.indexOf(email) !== index);

    if (duplicates.length > 0) {
      console.error("❌ Duplikate gefunden! Bitte zuerst bereinigen.");
      console.error("Duplikate:", [...new Set(duplicates)]);
      process.exit(1);
    }

    // Füge Unique Constraint hinzu (PostgreSQL)
    // In PostgreSQL sind mehrere NULL-Werte in einer unique column erlaubt
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "partners_email_key" 
      ON "partners" ("email") 
      WHERE "email" IS NOT NULL;
    `);

    console.log("✅ Unique Constraint erfolgreich hinzugefügt!");
    console.log("\nHinweis: Mehrere NULL-Werte sind weiterhin erlaubt.");
    console.log("Nur nicht-NULL E-Mails müssen eindeutig sein.\n");
  } catch (error: any) {
    if (error.code === "P2014" || error.message?.includes("already exists")) {
      console.log("✅ Constraint existiert bereits!");
    } else {
      console.error("❌ Fehler:", error);
      process.exit(1);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
