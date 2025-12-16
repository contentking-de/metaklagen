import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { downloadSignedDocument } from "@/lib/pandadoc";
import crypto from "crypto";

export const dynamic = "force-dynamic";

/**
 * PandaDoc Webhook Handler
 * Verarbeitet Events von PandaDoc, insbesondere wenn ein Dokument signiert wurde
 */
export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-pandadoc-signature");

    // Webhook-Signatur verifizieren (optional, aber empfohlen)
    if (process.env.PANDADOC_WEBHOOK_SECRET && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", process.env.PANDADOC_WEBHOOK_SECRET)
        .update(body)
        .digest("hex");

      if (signature !== expectedSignature) {
        console.error("Ungültige Webhook-Signatur");
        return NextResponse.json({ error: "Ungültige Signatur" }, { status: 401 });
      }
    }

    const event = JSON.parse(body);

    // Prüfe Event-Typ
    if (event.type === "document_state_changed" && event.data?.status === "document.completed") {
      const documentId = event.data.id;

      // Finde Mandat mit dieser PandaDoc-Dokument-ID
      const mandate = await prisma.mandate.findFirst({
        where: {
          pandadocDocumentId: documentId,
        },
      });

      if (mandate) {
        try {
          // Verwende unsere eigene API-Route zum Download der Vollmacht
          // Diese Route lädt die PDF von PandaDoc herunter und leitet sie an den Browser weiter
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
          const vollmachtDownloadUrl = `${baseUrl}/api/admin/mandate/${mandate.id}/vollmacht`;

          await prisma.mandate.update({
            where: { id: mandate.id },
            data: {
              signedVollmachtUrl: vollmachtDownloadUrl, // URL zu unserer API-Route
              vollmachtSignedAt: new Date(),
            },
          });

          console.log(`Vollmacht für Mandat ${mandate.id} wurde signiert`);
          console.log(`Vollmacht-Download-URL: ${vollmachtDownloadUrl}`);
        } catch (error) {
          console.error("Fehler beim Verarbeiten der signierten Vollmacht:", error);
          // Aktualisiere trotzdem den Status
          await prisma.mandate.update({
            where: { id: mandate.id },
            data: {
              vollmachtSignedAt: new Date(),
            },
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Fehler beim Verarbeiten des PandaDoc-Webhooks:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}

