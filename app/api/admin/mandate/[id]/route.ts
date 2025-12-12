import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["NEU", "IN_BEARBEITUNG", "ABGESCHLOSSEN", "ABGELEHNT"]),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Validate input
    const { status } = updateSchema.parse(body);

    // Update mandate
    const mandate = await prisma.mandate.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, mandate });
  } catch (error) {
    console.error("Error updating mandate:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Ungültige Daten" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const { id } = await params;

    const mandate = await prisma.mandate.findUnique({
      where: { id },
    });

    if (!mandate) {
      return NextResponse.json({ error: "Mandat nicht gefunden" }, { status: 404 });
    }

    return NextResponse.json(mandate);
  } catch (error) {
    console.error("Error fetching mandate:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}

