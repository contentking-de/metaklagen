/**
 * PandaDoc API Service
 * Dokumentation: https://developers.pandadoc.com/docs/embedded-signing
 */

import fs from "fs";
import path from "path";

const PANDADOC_API_KEY = process.env.PANDADOC_API_KEY;
const PANDADOC_API_URL = process.env.PANDADOC_API_URL || "https://api.pandadoc.com/public/v1";

interface CreateDocumentFromPdfParams {
  name: string;
  fileUrl: string;
  recipients: Array<{
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  }>;
}

interface CreateDocumentResponse {
  id: string;
  name: string;
  status: string;
}

interface CreateSessionResponse {
  id: string;
}

/**
 * Erstellt ein PandaDoc-Dokument aus einer PDF-Datei (via URL oder File Upload)
 */
export async function createDocumentFromPdf(
  params: CreateDocumentFromPdfParams & { fileBuffer?: Buffer }
): Promise<CreateDocumentResponse> {
  if (!PANDADOC_API_KEY) {
    throw new Error("PANDADOC_API_KEY ist nicht gesetzt");
  }

  // Verwende URL-Methode (zuverlässiger als File-Upload in Serverless-Umgebung)
  if (!params.fileUrl) {
    throw new Error("fileUrl ist erforderlich für die Dokument-Erstellung");
  }

  const requestBody: any = {
    name: params.name,
    url: params.fileUrl,
    recipients: params.recipients,
  };

  console.log("Erstelle PandaDoc-Dokument mit URL:", params.fileUrl);
  console.log("Name:", params.name);
  console.log("Recipients:", JSON.stringify(params.recipients));

  const response = await fetch(`${PANDADOC_API_URL}/documents`, {
    method: "POST",
    headers: {
      "Authorization": `API-Key ${PANDADOC_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`PandaDoc API Fehler: ${response.status} - ${error}`);
  }

  return response.json();
}

/**
 * Prüft den Status eines Dokuments
 */
export async function getDocumentStatus(documentId: string): Promise<{ status: string }> {
  if (!PANDADOC_API_KEY) {
    throw new Error("PANDADOC_API_KEY ist nicht gesetzt");
  }

  const response = await fetch(`${PANDADOC_API_URL}/documents/${documentId}`, {
    method: "GET",
    headers: {
      "Authorization": `API-Key ${PANDADOC_API_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`PandaDoc API Fehler: ${response.status} - ${error}`);
  }

  return response.json();
}

/**
 * Sendet ein Dokument (ohne Benachrichtigung)
 */
export async function sendDocument(documentId: string): Promise<void> {
  if (!PANDADOC_API_KEY) {
    throw new Error("PANDADOC_API_KEY ist nicht gesetzt");
  }

  const response = await fetch(`${PANDADOC_API_URL}/documents/${documentId}/send`, {
    method: "POST",
    headers: {
      "Authorization": `API-Key ${PANDADOC_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      silent: true, // Keine E-Mail-Benachrichtigung
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`PandaDoc API Fehler: ${response.status} - ${error}`);
  }
}

/**
 * Erstellt eine Signing-Session für ein Dokument
 */
export async function createSigningSession(
  documentId: string,
  recipientEmail: string
): Promise<CreateSessionResponse> {
  if (!PANDADOC_API_KEY) {
    throw new Error("PANDADOC_API_KEY ist nicht gesetzt");
  }

  const response = await fetch(`${PANDADOC_API_URL}/documents/${documentId}/session`, {
    method: "POST",
    headers: {
      "Authorization": `API-Key ${PANDADOC_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipient: recipientEmail,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`PandaDoc API Fehler: ${response.status} - ${error}`);
  }

  return response.json();
}

/**
 * Lädt ein signiertes Dokument herunter
 */
export async function downloadSignedDocument(documentId: string): Promise<Blob> {
  if (!PANDADOC_API_KEY) {
    throw new Error("PANDADOC_API_KEY ist nicht gesetzt");
  }

  const response = await fetch(`${PANDADOC_API_URL}/documents/${documentId}/download`, {
    method: "GET",
    headers: {
      "Authorization": `API-Key ${PANDADOC_API_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`PandaDoc API Fehler: ${response.status} - ${error}`);
  }

  return response.blob();
}

/**
 * Erstellt ein PandaDoc-Dokument für die Vollmacht und gibt die Session-ID zurück
 */
export async function createVollmachtDocument(
  mandateId: string,
  vorname: string,
  nachname: string,
  email: string
): Promise<{ documentId: string; sessionId: string }> {
  // Verwende öffentliche URL für PDF (einfacher und zuverlässiger als File-Upload)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const pdfUrl = `${baseUrl}/Vollmacht-Meta.pdf`;
  
  console.log(`Verwende PDF-URL: ${pdfUrl}`);

  // 1. Dokument erstellen mit URL (zuverlässiger als File-Upload in Serverless-Umgebung)
  const document = await createDocumentFromPdf({
    name: `Vollmacht - ${vorname} ${nachname}`,
    fileUrl: pdfUrl,
    recipients: [
      {
        email: email,
        first_name: vorname,
        last_name: nachname,
        role: "Signer",
      },
    ],
  });

  // 2. Warten bis Dokument bereit ist (polling)
  let documentReady = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!documentReady && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 Sekunde warten
    const status = await getDocumentStatus(document.id);
    
    if (status.status === "document.draft") {
      documentReady = true;
    }
    attempts++;
  }

  if (!documentReady) {
    throw new Error("Dokument ist nicht rechtzeitig bereit geworden");
  }

  // 3. Dokument senden (ohne Benachrichtigung)
  await sendDocument(document.id);

  // 4. Signing-Session erstellen
  const session = await createSigningSession(document.id, email);

  return {
    documentId: document.id,
    sessionId: session.id,
  };
}

