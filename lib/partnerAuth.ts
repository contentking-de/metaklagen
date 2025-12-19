import { randomBytes } from "crypto";
import prisma from "./db";

/**
 * Erstellt einen Magic Link Token für einen Partner
 */
export async function createMagicLinkToken(partnerId: string): Promise<string> {
  // Token generieren (32 Bytes = 64 hex Zeichen)
  const token = randomBytes(32).toString("hex");
  
  // Token in Datenbank speichern (gültig für 1 Stunde)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  await prisma.partnerToken.create({
    data: {
      token,
      partnerId,
      expiresAt,
    },
  });

  return token;
}

/**
 * Validiert einen Magic Link Token und gibt den Partner zurück
 */
export async function validateMagicLinkToken(token: string) {
  const partnerToken = await prisma.partnerToken.findUnique({
    where: { token },
    include: { partner: true },
  });

  if (!partnerToken) {
    return { valid: false, error: "Token nicht gefunden" };
  }

  if (partnerToken.used) {
    return { valid: false, error: "Token wurde bereits verwendet" };
  }

  if (new Date() > partnerToken.expiresAt) {
    return { valid: false, error: "Token ist abgelaufen" };
  }

  if (!partnerToken.partner.active) {
    return { valid: false, error: "Partner ist nicht aktiv" };
  }

  // Token als verwendet markieren
  await prisma.partnerToken.update({
    where: { id: partnerToken.id },
    data: { used: true },
  });

  return {
    valid: true,
    partner: partnerToken.partner,
  };
}

/**
 * Bereinigt abgelaufene oder verwendete Tokens (kann als Cron-Job verwendet werden)
 */
export async function cleanupExpiredTokens() {
  const deleted = await prisma.partnerToken.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: new Date() } },
        { used: true },
      ],
    },
  });

  return deleted.count;
}
