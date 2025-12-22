import { Resend } from "resend";
import fs from "fs";
import path from "path";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

/**
 * Lädt PDF-Dateien aus dem public Ordner und konvertiert sie zu Base64 für E-Mail-Anhänge
 */
function getPdfAttachments() {
  const publicPath = path.join(process.cwd(), "public");
  
  const pdfFiles = [
    {
      filename: "Mandanteninformationsblatt-Datenschutz.pdf",
      path: path.join(publicPath, "Mandanteninformationsblatt-Datenschutz.pdf"),
    },
    {
      filename: "Vollmacht-Meta.pdf",
      path: path.join(publicPath, "Vollmacht-Meta.pdf"),
    },
    {
      filename: "Widerrufsbelehrung-Meta.pdf",
      path: path.join(publicPath, "Widerrufsbelehrung-Meta.pdf"),
    },
  ];

  return pdfFiles.map((file) => {
    try {
      const fileBuffer = fs.readFileSync(file.path);
      const base64Content = fileBuffer.toString("base64");
      return {
        filename: file.filename,
        content: base64Content,
      };
    } catch (error) {
      console.error(`Fehler beim Laden der PDF-Datei ${file.filename}:`, error);
      return null;
    }
  }).filter((attachment): attachment is { filename: string; content: string } => attachment !== null);
}

interface MandateEmailData {
  vorname: string;
  nachname: string;
  email: string;
  versicherer?: string;
  versicherungsnummer?: string;
  versicherungsAbschlussdatum?: string;
  versicherungsnehmer?: string;
  versicherungsnehmerVerhaeltnis?: string;
  pandadocSigningUrl?: string;
}

export async function sendConfirmationEmail(data: MandateEmailData) {
  if (!RESEND_API_KEY || !resend) {
    throw new Error("RESEND_API_KEY ist nicht gesetzt - E-Mail kann nicht gesendet werden");
  }

  try {
    // PDF-Anhänge laden
    const attachments = getPdfAttachments();

    // Debug-Logging
    console.log("E-Mail wird gesendet mit folgenden Daten:");
    console.log("  - E-Mail:", data.email);
    console.log("  - PandaDoc Signing URL:", data.pandadocSigningUrl || "NICHT GESETZT");

    const result = await resend.emails.send({
      from: "META Datenschutzklage <noreply@meta-datenschutzklage.de>",
      to: data.email,
      subject: "Bestätigung Deiner Einsendung - META Datenschutzklage",
      attachments: attachments,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, sans-serif; line-height: 1.6; color: #1e3a5f; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #1e3a5f; }
            .gold { color: #c9a227; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 8px; }
            h1 { color: #1e3a5f; font-size: 22px; margin-bottom: 20px; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">§ META <span class="gold">Datenschutzklage</span></div>
            </div>
            <div class="content">
              <h1>Vielen Dank für Deine Einsendung</h1>
              <p>Hallo ${data.vorname},</p>
              <p>wir haben Deine Daten erfolgreich erhalten und freuen uns, Dich bei Deinem Anspruch gegen Meta zu unterstützen. Das Mandat erteilst Du erst mit der Signatur der Vollmacht.</p>
              ${data.versicherungsnummer ? `<p><strong>Deine Versicherungsnummer:</strong> ${data.versicherungsnummer}</p>` : ""}
              <p>Anbei findest Du wichtige Dokumente zu Deiner Mandatserteilung:</p>
              <ul>
                <li>Mandanteninformationsblatt-Datenschutz</li>
                <li>Vollmacht-Meta</li>
                <li>Widerrufsbelehrung-Meta</li>
              </ul>
              
              ${data.pandadocSigningUrl ? `
              <div style="background: #fff; border: 2px solid #c9a227; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
                <h2 style="color: #1e3a5f; font-size: 18px; margin-bottom: 15px;">Vollmacht digital unterschreiben</h2>
                <p style="margin-bottom: 20px;">Bitte unterschreibe Deine Vollmacht jetzt digital. Der Vorgang dauert nur wenige Minuten:</p>
                <a href="${data.pandadocSigningUrl}" style="display: inline-block; background: #c9a227; color: #1e3a5f; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Jetzt Vollmacht unterschreiben</a>
              </div>
              ` : ""}
              
              <h2 style="color: #1e3a5f; font-size: 18px; margin-top: 25px; margin-bottom: 15px;">Und so geht es nun weiter:</h2>
              <p>Wir werden zunächst Deine Rechtsschutzversicherung kontaktieren, damit diese die Kosten für das Verfahren gegen Meta übernimmt. Nach erfolgter Deckungszusage werden wir beim zuständigen Gericht die Klage einreichen.</p>
              
              <h2 style="color: #1e3a5f; font-size: 18px; margin-top: 25px; margin-bottom: 15px;">Verfahrensdauer</h2>
              <p>Ein Verfahren in der 1. Instanz nimmt mindestens 6-8 Monate in Anspruch. In Einzelfällen, z.B. bei hoher Auslastung des Gerichts, kann es auch länger dauern. Es ist jedoch nicht davon auszugehen, dass das Verfahren in 1. Instanz rechtskräftig entschieden sein wird. Vielmehr wird die in 1. Instanz unterlegene Partei in der Regel Berufung einlegen. Auch in der Berufungsinstanz muss mit einer Verfahrensdauer von mindestens 6-8 Monaten gerechnet werden.</p>
              
              <p>Du wirst also Geduld benötigen, um Deinen Anspruch gegen Meta mit unserer Hilfe durchzusetzen. Positiv ist aber, dass Du Dich in dieser Zeit im Regelfall um nichts kümmern musst. Wir werden Dich ungefragt über alle wesentlichen Schritte auf dem Laufenden halten. Im Bedarfsfall kannst Du selbstverständlich auch immer Kontakt zu uns aufnehmen.</p>
              
              <p>Bei Fragen stehen wir Dir gerne zur Verfügung.</p>
              <p>Mit freundlichen Grüßen,<br>Dein Team von META Datenschutzklage</p>
            </div>
            <div class="footer">
              <p>Diese E-Mail wurde automatisch versendet. Bitte antworte nicht direkt auf diese E-Mail.</p>
              <p>© ${new Date().getFullYear()} META Datenschutzklage | www.meta-datenschutzklage.de</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (result.error) {
      throw new Error(`Resend API Fehler: ${JSON.stringify(result.error)}`);
    }

    console.log(`✓ Bestätigungs-E-Mail erfolgreich gesendet an ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error("Fehler beim Senden der Bestätigungs-E-Mail:", error);
    throw error; // Fehler weiterwerfen, damit er in der API-Route behandelt werden kann
  }
}

export async function sendPartnerMagicLink(email: string, magicLink: string, partnerName: string) {
  if (!RESEND_API_KEY || !resend) {
    throw new Error("RESEND_API_KEY ist nicht gesetzt - E-Mail kann nicht gesendet werden");
  }

  try {
    const result = await resend.emails.send({
      from: "META Datenschutzklage <noreply@meta-datenschutzklage.de>",
      to: email,
      subject: "Dein Login-Link für das Partner-Dashboard",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, sans-serif; line-height: 1.6; color: #1e3a5f; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #1e3a5f; }
            .gold { color: #c9a227; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 8px; }
            h1 { color: #1e3a5f; font-size: 22px; margin-bottom: 20px; }
            .button { display: inline-block; background: #c9a227; color: #1e3a5f; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; margin: 20px 0; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">§ META <span class="gold">Datenschutzklage</span></div>
            </div>
            <div class="content">
              <h1>Login-Link für Partner-Dashboard</h1>
              <p>Hallo ${partnerName},</p>
              <p>Du hast einen Login-Link für Dein Partner-Dashboard angefordert. Klicke auf den Button unten, um Dich anzumelden:</p>
              
              <div style="text-align: center;">
                <a href="${magicLink}" class="button">Zum Partner-Dashboard</a>
              </div>
              
              <div class="warning">
                <strong>Wichtig:</strong> Dieser Link ist nur für 1 Stunde gültig und kann nur einmal verwendet werden.
              </div>
              
              <p>Falls Du den Button nicht anklicken kannst, kopiere diesen Link in Deinen Browser:</p>
              <p style="word-break: break-all; font-size: 12px; color: #666;">${magicLink}</p>
              
              <p>Falls Du diesen Login-Link nicht angefordert hast, kannst Du diese E-Mail ignorieren.</p>
            </div>
            <div class="footer">
              <p>Diese E-Mail wurde automatisch versendet. Bitte antworte nicht direkt auf diese E-Mail.</p>
              <p>© ${new Date().getFullYear()} META Datenschutzklage | www.meta-datenschutzklage.de</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (result.error) {
      throw new Error(`Resend API Fehler: ${JSON.stringify(result.error)}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Fehler beim Senden des Magic Link:", error);
    throw error;
  }
}

export async function sendKanzleiNotification(data: MandateEmailData & {
  telefon?: string;
  adresse: string;
  plz: string;
  wohnort: string;
  geburtsdatum: string;
  instagramAccountDatum?: string;
  facebookAccountDatum?: string;
}) {
  if (!RESEND_API_KEY || !resend) {
    throw new Error("RESEND_API_KEY ist nicht gesetzt - E-Mail kann nicht gesendet werden");
  }

  if (!process.env.KANZLEI_EMAIL) {
    throw new Error("KANZLEI_EMAIL ist nicht gesetzt - Kanzlei-Benachrichtigung kann nicht gesendet werden");
  }

  try {
    const result = await resend.emails.send({
      from: "META Datenschutzklage <noreply@meta-datenschutzklage.de>",
      to: process.env.KANZLEI_EMAIL!,
      subject: `Neues Mandat: ${data.vorname} ${data.nachname}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            h1 { color: #1e3a5f; border-bottom: 2px solid #c9a227; padding-bottom: 10px; }
            .data-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .data-table td { padding: 10px; border-bottom: 1px solid #eee; }
            .data-table td:first-child { font-weight: bold; color: #1e3a5f; width: 40%; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Neues Mandat eingegangen</h1>
            <table class="data-table">
              <tr><td>Name:</td><td>${data.vorname} ${data.nachname}</td></tr>
              <tr><td>E-Mail:</td><td>${data.email}</td></tr>
              <tr><td>Telefon:</td><td>${data.telefon || "Nicht angegeben"}</td></tr>
              <tr><td>Adresse:</td><td>${data.adresse}, ${data.plz} ${data.wohnort}</td></tr>
              <tr><td>Geburtsdatum:</td><td>${data.geburtsdatum}</td></tr>
              <tr><td>Instagram Account seit:</td><td>${data.instagramAccountDatum || "Nicht angegeben"}</td></tr>
              <tr><td>Facebook Account seit:</td><td>${data.facebookAccountDatum || "Nicht angegeben"}</td></tr>
              <tr><td>Versicherer:</td><td>${data.versicherer || "Nicht angegeben"}</td></tr>
              <tr><td>Versicherungsnummer:</td><td>${data.versicherungsnummer || "Nicht angegeben"}</td></tr>
              <tr><td>Versicherungs-Abschlussdatum:</td><td>${data.versicherungsAbschlussdatum || "Nicht angegeben"}</td></tr>
              <tr><td>Versicherungsnehmer:</td><td>${data.versicherungsnehmer || "Nicht angegeben"}</td></tr>
              ${data.versicherungsnehmerVerhaeltnis ? `<tr><td>Verhältnis zum VN:</td><td>${data.versicherungsnehmerVerhaeltnis}</td></tr>` : ""}
            </table>
          </div>
        </body>
        </html>
      `,
    });

    if (result.error) {
      throw new Error(`Resend API Fehler: ${JSON.stringify(result.error)}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Fehler beim Senden der Kanzlei-Benachrichtigung:", error);
    throw error;
  }
}

