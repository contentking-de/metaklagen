import { NextResponse } from "next/server";
import { validateMagicLinkToken } from "@/lib/partnerAuth";
import { z } from "zod";
import { SignJWT } from "jose";

export const dynamic = "force-dynamic";

const verifySchema = z.object({
  token: z.string().min(1, "Token ist erforderlich"),
});

// JWT Secret für Partner-Sessions
const getJWTSecret = () => {
  const secret = process.env.PARTNER_JWT_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("PARTNER_JWT_SECRET oder NEXTAUTH_SECRET muss gesetzt sein");
  }
  return new TextEncoder().encode(secret);
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = verifySchema.parse(body);

    // Validiere Token
    const validation = await validateMagicLinkToken(token);

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || "Ungültiger Token" },
        { status: 401 }
      );
    }

    const partner = validation.partner!;

    // Erstelle JWT Session Token
    const jwtSecret = getJWTSecret();
    const sessionToken = await new SignJWT({
      partnerId: partner.id,
      email: partner.email,
      name: partner.name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d") // Session gültig für 30 Tage
      .sign(jwtSecret);

    // Setze Cookie
    const response = NextResponse.json(
      {
        success: true,
        partner: {
          id: partner.id,
          name: partner.name,
          email: partner.email,
        },
      },
      { status: 200 }
    );

    response.cookies.set("partner_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 Tage
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Fehler beim Verifizieren des Tokens:", error);

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
