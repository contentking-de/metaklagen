import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  
  // Wenn keine Argumente übergeben werden, erstelle Mimikama als Standard
  let name: string;
  let trackingId: string;
  let email: string | null;
  
  if (args.length < 2) {
    if (args.length === 0) {
      // Standard: Mimikama erstellen
      name = "Mimikama";
      trackingId = "MIMIKAMA";
      email = "tom@mimikama.org";
      console.log("📝 Erstelle Standard-Partner: Mimikama");
    } else {
      console.error("Verwendung: npm run create-partner [<name> <tracking-id> [email]]");
      console.error("Ohne Argumente wird Mimikama erstellt.");
      console.error("Beispiel: npm run create-partner 'Partner Name' 'PARTNER123' 'partner@example.com'");
      process.exit(1);
    }
  } else {
    name = args[0];
    trackingId = args[1];
    email = args[2] || null;
  }

  try {
    // Prüfe, ob Tracking-ID bereits existiert
    const existing = await prisma.partner.findUnique({
      where: {
        trackingId: trackingId,
      },
    });

    if (existing) {
      console.error(`❌ Partner mit Tracking-ID "${trackingId}" existiert bereits!`);
      process.exit(1);
    }

    const partner = await prisma.partner.create({
      data: {
        name,
        trackingId,
        email,
        active: true,
      },
    });

    console.log("✅ Partner erfolgreich erstellt:");
    console.log(`   ID: ${partner.id}`);
    console.log(`   Name: ${partner.name}`);
    console.log(`   Tracking-ID: ${partner.trackingId}`);
    console.log(`   E-Mail: ${partner.email || "Keine"}`);
    console.log(`   Status: ${partner.active ? "Aktiv" : "Inaktiv"}`);
    console.log("\n📋 Tracking-Link:");
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://meta-klage.de";
    console.log(`   ${baseUrl}/formular?partner=${partner.trackingId}`);
  } catch (error) {
    console.error("❌ Fehler beim Erstellen des Partners:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
