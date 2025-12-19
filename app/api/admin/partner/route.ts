import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const partnerSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich"),
  trackingId: z.string().min(1, "Tracking-ID ist erforderlich"),
  email: z.string().email().optional().or(z.literal("")),
  active: z.boolean().optional().default(true),
});

// GET: Alle Partner abrufen
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const partners = await prisma.partner.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ partners }, { status: 200 });
  } catch (error) {
    console.error("Fehler beim Abrufen der Partner:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}

// POST: Neuen Partner erstellen
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = partnerSchema.parse(body);

    // Prüfe, ob trackingId bereits existiert
    const existingPartner = await prisma.partner.findUnique({
      where: {
        trackingId: validatedData.trackingId,
      },
    });

    if (existingPartner) {
      return NextResponse.json(
        { error: "Tracking-ID existiert bereits" },
        { status: 400 }
      );
    }

    const partner = await prisma.partner.create({
      data: {
        name: validatedData.name,
        trackingId: validatedData.trackingId,
        email: validatedData.email || null,
        active: validatedData.active ?? true,
      },
    });

    return NextResponse.json({ partner }, { status: 201 });
  } catch (error) {
    console.error("Fehler beim Erstellen des Partners:", error);

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
