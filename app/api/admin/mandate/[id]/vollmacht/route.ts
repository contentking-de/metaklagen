import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { downloadSignedDocument } from "@/lib/pandadoc";

export const dynamic = "force-dynamic";

/**
 * Lädt die signierte Vollmacht für ein Mandat herunter
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Prüfe Authentifizierung
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Finde Mandat
    const mandate = await prisma.mandate.findUnique({
      where: { id },
    });

    if (!mandate) {
      return NextResponse.json({ error: "Mandat nicht gefunden" }, { status: 404 });
    }

    // Prüfe, ob eine signierte Vollmacht vorhanden ist
    if (!mandate.pandadocDocumentId) {
      return NextResponse.json(
        { error: "Keine PandaDoc-Dokument-ID gefunden" },
        { status: 404 }
      );
    }

    try {
      // Lade das signierte PDF von PandaDoc
      const pdfBlob = await downloadSignedDocument(mandate.pandadocDocumentId);

      // Konvertiere Blob zu Buffer
      const arrayBuffer = await pdfBlob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Sende PDF als Response
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="Vollmacht-${mandate.vorname}-${mandate.nachname}.pdf"`,
          "Content-Length": buffer.length.toString(),
        },
      });
    } catch (error) {
      console.error("Fehler beim Herunterladen der Vollmacht:", error);
      return NextResponse.json(
        { error: "Fehler beim Herunterladen der Vollmacht" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Fehler in vollmacht route:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}

