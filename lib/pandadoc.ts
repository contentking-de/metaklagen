/**
 * PandaDoc API Service
 * Dokumentation: https://developers.pandadoc.com/docs/embedded-signing
 */

import fs from "fs";
import path from "path";
import FormData from "form-data";

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

  // Wenn File Buffer vorhanden, verwende multipart/form-data
  if (params.fileBuffer) {
    const formData = new FormData();
    
    formData.append("name", params.name);
    formData.append("file", params.fileBuffer, {
      filename: "vollmacht.pdf",
      contentType: "application/pdf",
    });
    
    // Recipients als JSON-String
    formData.append("recipients", JSON.stringify(params.recipients));

    const response = await fetch(`${PANDADOC_API_URL}/documents`, {
      method: "POST",
      headers: {
        "Authorization": `API-Key ${PANDADOC_API_KEY}`,
        ...formData.getHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`PandaDoc API Fehler: ${response.status} - ${error}`);
    }

    return response.json();
  } else {
    // Fallback: Verwende URL
    const requestBody: any = {
      name: params.name,
      url: params.fileUrl,
      recipients: params.recipients,
    };

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
  // Lade PDF-Datei als Buffer für File Upload
  let fileBuffer: Buffer | undefined;
  let pdfUrl: string | undefined;
  
  try {
    // Versuche PDF-Datei direkt zu laden
    const publicPath = path.join(process.cwd(), "public");
    const vollmachtPath = path.join(publicPath, "Vollmacht-Meta.pdf");
    
    if (fs.existsSync(vollmachtPath)) {
      fileBuffer = fs.readFileSync(vollmachtPath);
      console.log("PDF-Datei erfolgreich geladen als Buffer");
    } else {
      // Fallback: Verwende öffentliche URL
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      pdfUrl = `${baseUrl}/Vollmacht-Meta.pdf`;
      console.log(`PDF-URL verwendet: ${pdfUrl}`);
    }
  } catch (error) {
    console.error("Fehler beim Laden der PDF-Datei:", error);
    // Fallback: Verwende öffentliche URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    pdfUrl = `${baseUrl}/Vollmacht-Meta.pdf`;
  }

  // 1. Dokument erstellen
  const documentParams: any = {
    name: `Vollmacht - ${vorname} ${nachname}`,
    recipients: [
      {
        email: email,
        first_name: vorname,
        last_name: nachname,
        role: "Signer",
      },
    ],
  };

  if (fileBuffer) {
    documentParams.fileBuffer = fileBuffer;
  } else {
    documentParams.fileUrl = pdfUrl;
  }

  const document = await createDocumentFromPdf(documentParams);

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

