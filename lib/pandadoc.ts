/**
 * PandaDoc API Service
 * Dokumentation: https://developers.pandadoc.com/docs/embedded-signing
 */

import fs from "fs";
import path from "path";

const PANDADOC_API_KEY = process.env.PANDADOC_API_KEY;
// API-URL ist immer api.pandadoc.com (keine separate EU-API)
// ABER: Sessions sind regionsspezifisch!
// Wenn NEXT_PUBLIC_PANDADOC_REGION='eu' ist, muss die Frontend-Region 'eu' sein
// Wenn NEXT_PUBLIC_PANDADOC_REGION='com' ist, muss die Frontend-Region 'com' sein
const PANDADOC_REGION = process.env.NEXT_PUBLIC_PANDADOC_REGION || "com";
const PANDADOC_API_URL = process.env.PANDADOC_API_URL || "https://api.pandadoc.com/public/v1";

console.log(`PandaDoc Konfiguration: Region=${PANDADOC_REGION}, API_URL=${PANDADOC_API_URL}`);
console.log(`WICHTIG: Frontend-Region muss mit NEXT_PUBLIC_PANDADOC_REGION übereinstimmen!`);

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

interface CreateDocumentFromTemplateParams {
  name: string;
  templateUuid: string;
  recipients: Array<{
    email: string;
    first_name: string;
    last_name: string;
    role?: string; // Optional - wird nur gesetzt wenn angegeben
  }>;
  content?: Array<{
    field_id: string;
    value: string;
  }>; // Optional - Content-Felder zum Vorbefüllen
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
 * Erstellt ein PandaDoc-Dokument aus einem Template
 */
export async function createDocumentFromTemplate(
  params: CreateDocumentFromTemplateParams
): Promise<CreateDocumentResponse> {
  if (!PANDADOC_API_KEY) {
    throw new Error("PANDADOC_API_KEY ist nicht gesetzt");
  }

  const requestBody: any = {
    name: params.name,
    template_uuid: params.templateUuid,
    recipients: params.recipients,
  };

  // Content-Felder hinzufügen, falls vorhanden
  if (params.content && params.content.length > 0) {
    requestBody.content = params.content;
    console.log("Content-Felder:", JSON.stringify(params.content));
  }

  console.log("Erstelle PandaDoc-Dokument aus Template:", params.templateUuid);
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
 * Ruft Template-Informationen ab (inkl. verfügbarer Rollen)
 */
export async function getTemplateInfo(templateUuid: string): Promise<any> {
  if (!PANDADOC_API_KEY) {
    throw new Error("PANDADOC_API_KEY ist nicht gesetzt");
  }

  const response = await fetch(`${PANDADOC_API_URL}/templates/${templateUuid}`, {
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

  const url = `${PANDADOC_API_URL}/documents/${documentId}/session`;
  console.log(`Erstelle Signing-Session: POST ${url}`);
  console.log(`Recipient: ${recipientEmail}`);

  const response = await fetch(url, {
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
    console.error(`PandaDoc API Fehler beim Erstellen der Session: ${response.status}`);
    console.error(`Fehler-Details: ${error}`);
    throw new Error(`PandaDoc API Fehler: ${response.status} - ${error}`);
  }

  const sessionData = await response.json();
  console.log(`Signing-Session erfolgreich erstellt:`, sessionData);
  return sessionData;
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
  // Verwende PandaDoc Template (löst Berechtigungsprobleme)
  const templateUuid = process.env.PANDADOC_TEMPLATE_UUID;
  const recipientRole = process.env.PANDADOC_RECIPIENT_ROLE; // Optional - nur setzen wenn gesetzt
  
  if (!templateUuid) {
    throw new Error("PANDADOC_TEMPLATE_UUID ist nicht gesetzt");
  }

  console.log(`Verwende PandaDoc Template: ${templateUuid}`);
  if (recipientRole) {
    console.log(`Verwende Rolle: ${recipientRole}`);
  } else {
    console.log("Keine Rolle gesetzt - PandaDoc verwendet Standard-Rolle aus Template");
  }

  // 1. Dokument aus Template erstellen
  // Bei Templates müssen die Rollen mit den Rollen im Template übereinstimmen
  // Wenn keine Rolle gesetzt ist, verwendet PandaDoc die Standard-Rolle aus dem Template
  const recipient: any = {
    email: email,
    first_name: vorname,
    last_name: nachname,
  };
  
  // Nur Rolle hinzufügen wenn explizit gesetzt
  if (recipientRole) {
    recipient.role = recipientRole;
  }

  // Vollständiger Name für das Namensfeld
  const vollstaendigerName = `${vorname} ${nachname}`;

  const document = await createDocumentFromTemplate({
    name: `Vollmacht - ${vollstaendigerName}`,
    templateUuid: templateUuid,
    recipients: [recipient],
    // Vorbefüllen des Namensfeldes
    content: [
      {
        field_id: "text9d382e27-0966-41f3-aedb-d885e816db0b_0",
        value: vollstaendigerName,
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
  console.log(`Sende Dokument ${document.id}...`);
  await sendDocument(document.id);
  console.log(`Dokument ${document.id} wurde gesendet`);

  // 4. Warte kurz, damit das Dokument vollständig verarbeitet wird
  // Reduziert auf 1 Sekunde - sollte ausreichen
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 5. Signing-Session erstellen (mit Retry-Logik)
  console.log(`Erstelle Signing-Session für Dokument ${document.id} und E-Mail ${email}...`);
  console.log(`Verwende API-URL: ${PANDADOC_API_URL}`);
  console.log(`Verwende Region: ${PANDADOC_REGION}`);
  
  let session: CreateSessionResponse | null = null;
  let sessionAttempts = 0;
  const maxSessionAttempts = 3;
  
  while (sessionAttempts < maxSessionAttempts) {
    try {
      session = await createSigningSession(document.id, email);
      console.log(`Signing-Session erfolgreich erstellt: ${session.id}`);
      break;
    } catch (error) {
      sessionAttempts++;
      if (sessionAttempts >= maxSessionAttempts) {
        console.error(`Session-Erstellung fehlgeschlagen nach ${maxSessionAttempts} Versuchen`);
        throw error;
      }
      console.log(`Session-Erstellung fehlgeschlagen, Versuch ${sessionAttempts}/${maxSessionAttempts}, warte 1 Sekunde...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  
  if (!session) {
    throw new Error("Session konnte nicht erstellt werden");
  }

  return {
    documentId: document.id,
    sessionId: session.id,
  };
}

