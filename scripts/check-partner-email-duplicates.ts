import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Prüfe Partner-E-Mails auf Duplikate...\n");

  // Hole alle Partner
  const partners = await prisma.partner.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      trackingId: true,
    },
  });

  console.log(`Gefundene Partner: ${partners.length}\n`);

  // Gruppiere nach E-Mail
  const emailMap = new Map<string, typeof partners>();
  
  partners.forEach((partner) => {
    if (partner.email) {
      if (!emailMap.has(partner.email)) {
        emailMap.set(partner.email, []);
      }
      emailMap.get(partner.email)!.push(partner);
    }
  });

  // Finde Duplikate
  const duplicates = Array.from(emailMap.entries()).filter(
    ([, partners]) => partners.length > 1
  );

  if (duplicates.length === 0) {
    console.log("✅ Keine Duplikate gefunden! Die Migration sollte problemlos durchlaufen.\n");
    console.log("Partner ohne E-Mail:");
    const withoutEmail = partners.filter((p) => !p.email);
    if (withoutEmail.length === 0) {
      console.log("  (keine)");
    } else {
      withoutEmail.forEach((p) => {
        console.log(`  - ${p.name} (${p.trackingId})`);
      });
    }
  } else {
    console.log(`⚠️  Gefundene Duplikate: ${duplicates.length}\n`);
    duplicates.forEach(([email, partnerList]) => {
      console.log(`E-Mail: ${email}`);
      partnerList.forEach((p) => {
        console.log(`  - ${p.name} (ID: ${p.id}, Tracking: ${p.trackingId})`);
      });
      console.log();
    });
    console.log("\n⚠️  Bitte bereinige die Duplikate, bevor Du die Migration durchführst.");
    console.log("   Du kannst die E-Mail für einen der Partner auf null setzen oder ändern.");
  }

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("Fehler:", error);
  process.exit(1);
});
