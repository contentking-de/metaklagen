import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface MandateEmailData {
  vorname: string;
  nachname: string;
  email: string;
  versicherer?: string;
  versicherungsnummer?: string;
  versicherungsAbschlussdatum?: string;
  versicherungsnehmer?: string;
  versicherungsnehmerVerhaeltnis?: string;
}

export async function sendConfirmationEmail(data: MandateEmailData) {
  try {
    await resend.emails.send({
      from: "META Datenschutzklage <noreply@meta-datenschutzklage.de>",
      to: data.email,
      subject: "Bestätigung Ihrer Mandatserteilung - META Datenschutzklage",
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
              <h1>Vielen Dank für Ihre Mandatserteilung</h1>
              <p>Sehr geehrte/r ${data.vorname} ${data.nachname},</p>
              <p>wir haben Ihre Mandatserteilung erfolgreich erhalten und werden uns zeitnah bei Ihnen melden.</p>
              ${data.versicherungsnummer ? `<p><strong>Ihre Versicherungsnummer:</strong> ${data.versicherungsnummer}</p>` : ""}
              <p>Unser Team wird sich in den nächsten Werktagen mit Ihnen in Verbindung setzen, um die weiteren Schritte zu besprechen.</p>
              <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
              <p>Mit freundlichen Grüßen,<br>Ihr Team von META Datenschutzklage</p>
            </div>
            <div class="footer">
              <p>Diese E-Mail wurde automatisch versendet. Bitte antworten Sie nicht direkt auf diese E-Mail.</p>
              <p>© ${new Date().getFullYear()} META Datenschutzklage | meta-datenschutzklage.de</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Fehler beim Senden der Bestätigungs-E-Mail:", error);
    return { success: false, error };
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
  try {
    await resend.emails.send({
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
    return { success: true };
  } catch (error) {
    console.error("Fehler beim Senden der Kanzlei-Benachrichtigung:", error);
    return { success: false, error };
  }
}

