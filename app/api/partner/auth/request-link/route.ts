import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createMagicLinkToken } from "@/lib/partnerAuth";
import { sendPartnerMagicLink } from "@/lib/email";
import { z } from "zod";

export const dynamic = "force-dynamic";

const requestLinkSchema = z.object({
  email: z.string().email("Bitte gib eine gültige E-Mail-Adresse ein"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = requestLinkSchema.parse(body);

    // Prüfe, ob Partner mit dieser E-Mail existiert
    const partner = await prisma.partner.findUnique({
      where: { email },
    });

    if (!partner) {
      // Aus Sicherheitsgründen geben wir keine Details zurück
      return NextResponse.json(
        { success: true, message: "Falls diese E-Mail registriert ist, wurde ein Login-Link gesendet." },
        { status: 200 }
      );
    }

    if (!partner.active) {
      return NextResponse.json(
        { error: "Dieser Partner-Account ist nicht aktiv" },
        { status: 403 }
      );
    }

    // Erstelle Magic Link Token
    const token = await createMagicLinkToken(partner.id);

    // Erstelle Magic Link URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const magicLink = `${baseUrl}/partner/login?token=${token}`;

    // Sende Magic Link per E-Mail
    await sendPartnerMagicLink(partner.email!, magicLink, partner.name);

    return NextResponse.json(
      { success: true, message: "Login-Link wurde gesendet" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fehler beim Anfordern des Magic Links:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Ungültige Daten", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
