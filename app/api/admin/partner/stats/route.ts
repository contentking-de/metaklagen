import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Hole alle Partner mit ihren Statistiken
    const partners = await prisma.partner.findMany({
      include: {
        _count: {
          select: {
            mandates: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Detaillierte Statistiken pro Partner
    const partnerStats = await Promise.all(
      partners.map(async (partner) => {
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
          id: partner.id,
          name: partner.name,
          trackingId: partner.trackingId,
          email: partner.email,
          active: partner.active,
          totalLeads: mandates.length,
          neu: mandates.filter((m) => m.status === "NEU").length,
          inBearbeitung: mandates.filter((m) => m.status === "IN_BEARBEITUNG").length,
          abgeschlossen: mandates.filter((m) => m.status === "ABGESCHLOSSEN").length,
          vollmachtSigniert: mandates.filter((m) => m.vollmachtSignedAt !== null).length,
          // Conversion-Rate: Abgeschlossene Mandate / Gesamt
          conversionRate:
            mandates.length > 0
              ? ((mandates.filter((m) => m.status === "ABGESCHLOSSEN").length / mandates.length) * 100).toFixed(1)
              : "0.0",
          // Geschätzter Ertrag: 1 Euro pro Lead
          geschaetzterErtrag: mandates.length * 1,
          createdAt: partner.createdAt,
        };

        return stats;
      })
    );

    return NextResponse.json({ partners: partnerStats }, { status: 200 });
  } catch (error) {
    console.error("Fehler beim Abrufen der Partner-Statistiken:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
