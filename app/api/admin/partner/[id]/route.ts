import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const partnerUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  trackingId: z.string().min(1).optional(),
  email: z.string().email().optional().or(z.literal("")),
  active: z.boolean().optional(),
});

// PATCH: Partner aktualisieren
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = partnerUpdateSchema.parse(body);

    // Prüfe, ob trackingId bereits existiert (wenn geändert)
    if (validatedData.trackingId) {
      const existingPartner = await prisma.partner.findFirst({
        where: {
          trackingId: validatedData.trackingId,
          NOT: {
            id: id,
          },
        },
      });

      if (existingPartner) {
        return NextResponse.json(
          { error: "Tracking-ID existiert bereits" },
          { status: 400 }
        );
      }
    }

    const updateData: {
      name?: string;
      trackingId?: string;
      email?: string | null;
      active?: boolean;
    } = {};

    if (validatedData.name) updateData.name = validatedData.name;
    if (validatedData.trackingId) updateData.trackingId = validatedData.trackingId;
    if (validatedData.email !== undefined) {
      updateData.email = validatedData.email || null;
    }
    if (validatedData.active !== undefined) updateData.active = validatedData.active;

    const partner = await prisma.partner.update({
      where: { id: id },
      data: updateData,
    });

    return NextResponse.json({ partner }, { status: 200 });
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Partners:", error);

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

// DELETE: Partner löschen
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.partner.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: "Partner erfolgreich gelöscht" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fehler beim Löschen des Partners:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
