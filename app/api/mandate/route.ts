import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { mandateFormSchema } from "@/lib/validations";
import { sendConfirmationEmail, sendKanzleiNotification } from "@/lib/email";

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
        versicherungsnummer: validatedData.versicherungsnummer!,
        status: "NEU",
      },
    });

    // E-Mails versenden (async, nicht blockierend)
    const emailData = {
      vorname: mandate.vorname,
      nachname: mandate.nachname,
      email: mandate.email,
      versicherungsnummer: mandate.versicherungsnummer,
    };

    // Bestätigungs-E-Mail an Nutzer
    sendConfirmationEmail(emailData).catch((error) => {
      console.error("Fehler beim Senden der Bestätigungs-E-Mail:", error);
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

