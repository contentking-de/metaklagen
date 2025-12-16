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
          // Lade das signierte Dokument herunter
          const signedPdfBlob = await downloadSignedDocument(documentId);

          // Konvertiere Blob zu Base64
          const arrayBuffer = await signedPdfBlob.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64Pdf = buffer.toString("base64");

          // Speichere die signierte Vollmacht (als Base64 oder URL)
          // Option 1: Als Base64 in der DB speichern (nicht ideal für große Dateien)
          // Option 2: In einem Storage-Service hochladen und URL speichern
          // Für jetzt speichern wir die URL zum PandaDoc-Dokument

          const pandadocDocumentUrl = `https://app.pandadoc.com/document/${documentId}`;

          await prisma.mandate.update({
            where: { id: mandate.id },
            data: {
              signedVollmachtUrl: pandadocDocumentUrl,
              vollmachtSignedAt: new Date(),
            },
          });

          console.log(`Vollmacht für Mandat ${mandate.id} wurde signiert`);
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

