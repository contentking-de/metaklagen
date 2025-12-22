import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { sendVollmachtReminder } from "@/lib/email";
import { createSigningSession } from "@/lib/pandadoc";

export const dynamic = "force-dynamic";

/**
 * Sendet eine Erinnerungsmail mit Link zur Vollmacht
 */
export async function POST(
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

    // Prüfe, ob Vollmacht bereits signiert wurde
    if (mandate.vollmachtSignedAt) {
      return NextResponse.json(
        { error: "Vollmacht wurde bereits signiert" },
        { status: 400 }
      );
    }

    // Prüfe, ob PandaDoc-Dokument vorhanden ist
    if (!mandate.pandadocDocumentId) {
      return NextResponse.json(
        { error: "Kein PandaDoc-Dokument vorhanden. Bitte erstelle zuerst ein Dokument." },
        { status: 400 }
      );
    }

    // Erstelle oder verwende vorhandene Signing-Session
    let signingUrl: string;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    if (mandate.pandadocSessionId) {
      // Verwende vorhandene Session
      signingUrl = `${baseUrl}/signing/${mandate.pandadocSessionId}`;
    } else {
      // Erstelle neue Signing-Session
      try {
        const session = await createSigningSession(
          mandate.pandadocDocumentId,
          mandate.email
        );

        // Speichere Session-ID in der Datenbank
        await prisma.mandate.update({
          where: { id: mandate.id },
          data: {
            pandadocSessionId: session.id,
          },
        });

        signingUrl = `${baseUrl}/signing/${session.id}`;
      } catch (error) {
        console.error("Fehler beim Erstellen der Signing-Session:", error);
        return NextResponse.json(
          { error: "Fehler beim Erstellen der Signing-Session" },
          { status: 500 }
        );
      }
    }

    // Sende Reminder-E-Mail
    try {
      await sendVollmachtReminder({
        vorname: mandate.vorname,
        nachname: mandate.nachname,
        email: mandate.email,
        pandadocSigningUrl: signingUrl,
      });

      return NextResponse.json(
        { success: true, message: "Reminder-E-Mail erfolgreich gesendet" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Fehler beim Senden der Reminder-E-Mail:", error);
      return NextResponse.json(
        { error: "Fehler beim Senden der E-Mail" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Fehler in reminder route:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}

