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

async function getPartnerFromSession(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    return null;
  }

  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => c.split("="))
  );

  const sessionToken = cookies.partner_session;
  if (!sessionToken) {
    return null;
  }

  try {
    const jwtSecret = getJWTSecret();
    const { payload } = await jwtVerify(sessionToken, jwtSecret);

    const partner = await prisma.partner.findUnique({
      where: { id: payload.partnerId as string },
    });

    if (!partner || !partner.active) {
      return null;
    }

    return partner;
  } catch (error) {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const partner = await getPartnerFromSession(request);

    if (!partner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Hole Statistiken für diesen Partner
    const mandates = await prisma.mandate.findMany({
      where: {
        partnerId: partner.id,
      },
      select: {
        status: true,
        vollmachtSignedAt: true,
        createdAt: true,
      },
    });

    const stats = {
      partner: {
        id: partner.id,
        name: partner.name,
        trackingId: partner.trackingId,
        email: partner.email,
      },
      totalLeads: mandates.length,
      neu: mandates.filter((m) => m.status === "NEU").length,
      inBearbeitung: mandates.filter((m) => m.status === "IN_BEARBEITUNG").length,
      abgeschlossen: mandates.filter((m) => m.status === "ABGESCHLOSSEN").length,
      vollmachtSigniert: mandates.filter((m) => m.vollmachtSignedAt !== null).length,
      conversionRate:
        mandates.length > 0
          ? ((mandates.filter((m) => m.status === "ABGESCHLOSSEN").length / mandates.length) * 100).toFixed(1)
          : "0.0",
      geschaetzterErtrag: mandates.length * 1,
      trackingUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "https://meta-klage.de"}/formular?partner=${partner.trackingId}`,
    };

    return NextResponse.json({ stats }, { status: 200 });
  } catch (error) {
    console.error("Fehler beim Abrufen der Partner-Statistiken:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
