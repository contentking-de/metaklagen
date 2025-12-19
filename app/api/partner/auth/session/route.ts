import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

const getJWTSecret = () => {
  const secret = process.env.PARTNER_JWT_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("PARTNER_JWT_SECRET oder NEXTAUTH_SECRET muss gesetzt sein");
  }
  return new TextEncoder().encode(secret);
};

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => c.split("="))
    );

    const sessionToken = cookies.partner_session;
    if (!sessionToken) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    try {
      const jwtSecret = getJWTSecret();
      const { payload } = await jwtVerify(sessionToken, jwtSecret);

      // Hole aktuelle Partner-Daten aus DB
      const partner = await prisma.partner.findUnique({
        where: { id: payload.partnerId as string },
        select: {
          id: true,
          name: true,
          email: true,
          active: true,
        },
      });

      if (!partner || !partner.active) {
        return NextResponse.json({ authenticated: false }, { status: 200 });
      }

      return NextResponse.json({
        authenticated: true,
        partner: {
          id: partner.id,
          name: partner.name,
          email: partner.email,
        },
      });
    } catch (error) {
      // Token ungültig oder abgelaufen
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Session:", error);
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("partner_session");
  return response;
}
