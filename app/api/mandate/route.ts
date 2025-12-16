import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { mandateFormSchema } from "@/lib/validations";
import { sendConfirmationEmail, sendKanzleiNotification } from "@/lib/email";
import { createVollmachtDocument } from "@/lib/pandadoc";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validierung
    const validatedData = mandateFormSchema.parse(body);

    // Prüfe, ob Rechtschutzversicherung vorhanden
    if (!validatedData.hatRechtschutz) {
      return NextResponse.json(
        { error: "Ohne Rechtschutzversicherung kann kein Mandat erstellt werden" },
        { status: 400 }
      );
    }

    // Erstelle Mandat in der Datenbank
    const mandate = await prisma.mandate.create({
      data: {
        vorname: validatedData.vorname,
        nachname: validatedData.nachname,
        email: validatedData.email,
        telefon: validatedData.telefon || null,
        adresse: validatedData.adresse,
        plz: validatedData.plz,
        wohnort: validatedData.wohnort,
        geburtsdatum: new Date(validatedData.geburtsdatum),
        instagramAccountDatum: validatedData.instagramAccountDatum
          ? new Date(validatedData.instagramAccountDatum)
          : null,
        facebookAccountDatum: validatedData.facebookAccountDatum
          ? new Date(validatedData.facebookAccountDatum)
          : null,
        versicherer: validatedData.versicherer || null,
        versicherungsnummer: validatedData.versicherungsnummer || null,
        versicherungsAbschlussdatum: validatedData.versicherungsAbschlussdatum
          ? new Date(validatedData.versicherungsAbschlussdatum)
          : null,
        versicherungsnehmer: validatedData.versicherungsnehmer || null,
        versicherungsnehmerVerhaeltnis: validatedData.versicherungsnehmerVerhaeltnis || null,
        status: "NEU",
      },
    });

    // E-Mail-Daten vorbereiten
    const emailData = {
      vorname: mandate.vorname,
      nachname: mandate.nachname,
      email: mandate.email,
      versicherer: mandate.versicherer || undefined,
      versicherungsnummer: mandate.versicherungsnummer || undefined,
      versicherungsAbschlussdatum: mandate.versicherungsAbschlussdatum
        ? mandate.versicherungsAbschlussdatum.toLocaleDateString("de-DE")
        : undefined,
      versicherungsnehmer: mandate.versicherungsnehmer || undefined,
      versicherungsnehmerVerhaeltnis: mandate.versicherungsnehmerVerhaeltnis || undefined,
    };

    // PandaDoc-Dokument für Vollmacht erstellen (vor dem E-Mail-Versand)
    let pandadocSigningUrl: string | undefined;
    
    // Prüfe ob PandaDoc API Key gesetzt ist
    if (!process.env.PANDADOC_API_KEY) {
      console.warn("PANDADOC_API_KEY ist nicht gesetzt - PandaDoc-Integration wird übersprungen");
    } else {
      try {
        console.log(`Erstelle PandaDoc-Dokument für Mandat ${mandate.id}...`);
        const { documentId, sessionId } = await createVollmachtDocument(
          mandate.id,
          mandate.vorname,
          mandate.nachname,
          mandate.email
        );

        // Speichere PandaDoc-Daten in der Datenbank
        await prisma.mandate.update({
          where: { id: mandate.id },
          data: {
            pandadocDocumentId: documentId,
            pandadocSessionId: sessionId,
          },
        });

        // Erstelle Signing-URL (Embedded Signing)
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        pandadocSigningUrl = `${baseUrl}/signing/${sessionId}`;
        
        console.log(`✓ PandaDoc-Dokument erstellt für Mandat ${mandate.id}`);
        console.log(`  - Document ID: ${documentId}`);
        console.log(`  - Session ID: ${sessionId}`);
        console.log(`  - Signing URL: ${pandadocSigningUrl}`);
      } catch (error) {
        console.error("✗ Fehler beim Erstellen des PandaDoc-Dokuments:", error);
        if (error instanceof Error) {
          console.error("  Fehlermeldung:", error.message);
          console.error("  Stack:", error.stack);
        }
        // Fehler wird geloggt, aber E-Mail wird trotzdem gesendet (ohne PandaDoc-Link)
      }
    }

    // Bestätigungs-E-Mail an Nutzer (nach PandaDoc-Erstellung)
    console.log(`Sende Bestätigungs-E-Mail an ${mandate.email}${pandadocSigningUrl ? " (mit PandaDoc-Link)" : " (ohne PandaDoc-Link)"}`);
    sendConfirmationEmail({
      ...emailData,
      pandadocSigningUrl,
    }).catch((error) => {
      console.error("✗ Fehler beim Senden der Bestätigungs-E-Mail:", error);
    });

    // Benachrichtigung an Kanzlei
    sendKanzleiNotification({
      ...emailData,
      telefon: mandate.telefon || undefined,
      adresse: mandate.adresse,
      plz: mandate.plz,
      wohnort: mandate.wohnort,
      geburtsdatum: mandate.geburtsdatum.toLocaleDateString("de-DE"),
      instagramAccountDatum: mandate.instagramAccountDatum
        ? mandate.instagramAccountDatum.toLocaleDateString("de-DE")
        : undefined,
      facebookAccountDatum: mandate.facebookAccountDatum
        ? mandate.facebookAccountDatum.toLocaleDateString("de-DE")
        : undefined,
    }).catch((error) => {
      console.error("Fehler beim Senden der Kanzlei-Benachrichtigung:", error);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Mandat erfolgreich erstellt",
        mandateId: mandate.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Fehler beim Erstellen des Mandats:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Ungültige Daten", details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}

