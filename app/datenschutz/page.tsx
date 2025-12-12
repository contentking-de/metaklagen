import { Header, Footer } from "@/components/layout";
import { Card } from "@/components/ui";

export const metadata = {
  title: "Datenschutzerklärung | META Datenschutzklage",
  description: "Informationen zum Datenschutz gemäß DSGVO",
};

export default function DatenschutzPage() {
  return (
    <main className="min-h-screen bg-background-alt">
      <Header />

      <section className="pt-28 pb-20 md:pt-32 md:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="elevated" padding="lg">
            <h1 className="text-3xl font-bold text-primary mb-8">Datenschutzerklärung</h1>

            <div className="prose prose-lg max-w-none text-text-muted">
              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                Allgemeines zum Datenschutz
              </h2>
              <p>
                Die BEMK Rechtsanwälte Blazek Ellerbrock Malar Kronsbein PartGmbB nimmt als 
                Betreiberin dieser Seiten den Schutz Ihrer persönlichen Daten sehr ernst. 
                Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den 
                gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
              </p>
              <p className="mt-4">
                Die Nutzung unserer Website ist ohne Angabe personenbezogener Daten möglich. 
                Soweit Sie uns personenbezogene Daten (beispielsweise Name, Anschrift oder 
                E-Mail-Adressen) übermitteln, erfolgt dies, soweit möglich, stets auf freiwilliger 
                Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte 
                weitergegeben.
              </p>
              <p className="mt-4">
                Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der 
                Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser 
                Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                Verantwortliche Stelle
              </h2>
              <p>
                BEMK Rechtsanwälte Blazek Ellerbrock Malar Kronsbein PartGmbB<br />
                Artur-Ladebeck-Str. 8<br />
                33602 Bielefeld<br /><br />
                Telefon: +49 (0) 521 977 940-0<br />
                E-Mail: info@rae-bemk.de
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                Erhebung und Speicherung personenbezogener Daten
              </h2>
              <p>
                Beim Aufrufen unserer Website werden durch den auf Ihrem Endgerät zum Einsatz 
                kommenden Browser automatisch Informationen an den Server unserer Website gesendet. 
                Diese Informationen werden temporär in einem sog. Logfile gespeichert. Folgende 
                Informationen werden dabei ohne Ihr Zutun erfasst und bis zur automatisierten 
                Löschung gespeichert:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>IP-Adresse des anfragenden Rechners</li>
                <li>Datum und Uhrzeit des Zugriffs</li>
                <li>Name und URL der abgerufenen Datei</li>
                <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
                <li>Verwendeter Browser und ggf. das Betriebssystem Ihres Rechners sowie der Name Ihres Access-Providers</li>
              </ul>
              <p className="mt-4">
                Die genannten Daten werden durch uns zu folgenden Zwecken verarbeitet:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Gewährleistung eines reibungslosen Verbindungsaufbaus der Website</li>
                <li>Gewährleistung einer komfortablen Nutzung unserer Website</li>
                <li>Auswertung der Systemsicherheit und -stabilität</li>
                <li>Zu weiteren administrativen Zwecken</li>
              </ul>
              <p className="mt-4">
                Die Rechtsgrundlage für die Datenverarbeitung ist Art. 6 Abs. 1 S. 1 lit. f DSGVO. 
                Unser berechtigtes Interesse folgt aus oben aufgelisteten Zwecken zur Datenerhebung. 
                In keinem Fall verwenden wir die erhobenen Daten zu dem Zweck, Rückschlüsse auf 
                Ihre Person zu ziehen.
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                Mandatsformular
              </h2>
              <p>
                Wenn Sie uns über das Mandatsformular Daten übermitteln, werden diese Daten 
                einschließlich der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung 
                Ihres Mandats und für den Fall von Anschlussfragen bei uns gespeichert. 
                Folgende Daten werden erhoben:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-4">
                <li>Vorname und Nachname</li>
                <li>E-Mail-Adresse</li>
                <li>Telefonnummer (optional)</li>
                <li>Adresse (Straße, PLZ, Ort)</li>
                <li>Geburtsdatum</li>
                <li>Datum der Account-Eröffnung (Instagram/Facebook)</li>
                <li>Versicherungsnummer der Rechtschutzversicherung</li>
              </ul>
              <p className="mt-4">
                Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, 
                sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur 
                Durchführung vorvertraglicher Maßnahmen erforderlich ist.
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                E-Mail-Kommunikation
              </h2>
              <p>
                Für den Versand von E-Mails nutzen wir den Dienst Resend (Resend, Inc.). 
                Die Datenverarbeitung erfolgt auf Grundlage unseres berechtigten Interesses 
                an einer zuverlässigen E-Mail-Zustellung (Art. 6 Abs. 1 lit. f DSGVO).
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                Weitergabe personenbezogener Daten an Dritte
              </h2>
              <p>
                Eine Übermittlung Ihrer persönlichen Daten an Dritte zu anderen als den im 
                Folgenden aufgeführten Zwecken findet nicht statt. Wir geben Ihre persönlichen 
                Daten nur an Dritte weiter, wenn:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Sie Ihre nach Art. 6 Abs. 1 S. 1 lit. a DSGVO ausdrückliche Einwilligung dazu erteilt haben</li>
                <li>Die Weitergabe nach Art. 6 Abs. 1 S. 1 lit. f DSGVO zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist</li>
                <li>Für die Weitergabe nach Art. 6 Abs. 1 S. 1 lit. c DSGVO eine gesetzliche Verpflichtung besteht</li>
                <li>Dies gesetzlich zulässig und nach Art. 6 Abs. 1 S. 1 lit. b DSGVO für die Abwicklung von Vertragsverhältnissen mit Ihnen erforderlich ist</li>
              </ul>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                Cookies
              </h2>
              <p>
                Wir setzen auf unserer Seite Cookies ein. Hierbei handelt es sich um kleine Dateien, 
                die Ihr Browser automatisch erstellt und die auf Ihrem Endgerät gespeichert werden, 
                wenn Sie unsere Seite besuchen. Cookies richten auf Ihrem Endgerät keinen Schaden an, 
                enthalten keine Viren, Trojaner oder sonstige Schadsoftware.
              </p>
              <p className="mt-4">
                Der Einsatz von Cookies dient dazu, die Nutzung unseres Angebots für Sie angenehmer 
                zu gestalten. So setzen wir sogenannte Session-Cookies ein, um zu erkennen, dass Sie 
                einzelne Seiten unserer Website bereits besucht haben. Diese werden nach Verlassen 
                unserer Seite automatisch gelöscht.
              </p>
              <p className="mt-4">
                Die meisten Browser akzeptieren Cookies automatisch. Sie können Ihren Browser jedoch 
                so konfigurieren, dass keine Cookies auf Ihrem Computer gespeichert werden oder stets 
                ein Hinweis erscheint, bevor ein neuer Cookie angelegt wird.
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                Betroffenenrechte
              </h2>
              <p>Sie haben das Recht:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Auskunft (Art. 15 DSGVO):</strong> Sie können Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten verlangen.</li>
                <li><strong>Berichtigung (Art. 16 DSGVO):</strong> Sie können unverzüglich die Berichtigung unrichtiger oder Vervollständigung Ihrer bei uns gespeicherten personenbezogenen Daten verlangen.</li>
                <li><strong>Löschung (Art. 17 DSGVO):</strong> Sie können die Löschung Ihrer bei uns gespeicherten personenbezogenen Daten verlangen, soweit nicht die Verarbeitung zur Ausübung des Rechts auf freie Meinungsäußerung und Information, zur Erfüllung einer rechtlichen Verpflichtung oder zur Geltendmachung von Rechtsansprüchen erforderlich ist.</li>
                <li><strong>Einschränkung (Art. 18 DSGVO):</strong> Sie können die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten verlangen.</li>
                <li><strong>Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie können Ihre personenbezogenen Daten in einem strukturierten, gängigen und maschinenlesbaren Format erhalten oder die Übermittlung an einen anderen Verantwortlichen verlangen.</li>
                <li><strong>Widerruf (Art. 7 Abs. 3 DSGVO):</strong> Sie können Ihre einmal erteilte Einwilligung jederzeit gegenüber uns widerrufen.</li>
                <li><strong>Beschwerde (Art. 77 DSGVO):</strong> Sie können sich bei einer Aufsichtsbehörde beschweren.</li>
              </ul>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                Widerspruchsrecht
              </h2>
              <p>
                Sofern Ihre personenbezogenen Daten auf Grundlage von berechtigten Interessen gemäß 
                Art. 6 Abs. 1 S. 1 lit. f DSGVO verarbeitet werden, haben Sie das Recht, gemäß 
                Art. 21 DSGVO Widerspruch gegen die Verarbeitung Ihrer personenbezogenen Daten 
                einzulegen, soweit dafür Gründe vorliegen, die sich aus Ihrer besonderen Situation 
                ergeben oder sich der Widerspruch gegen Direktwerbung richtet.
              </p>
              <p className="mt-4">
                Möchten Sie von Ihrem Widerrufs- oder Widerspruchsrecht Gebrauch machen, genügt 
                eine E-Mail an{" "}
                <a href="mailto:info@rae-bemk.de" className="text-accent hover:underline">
                  info@rae-bemk.de
                </a>
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                Anwaltliche Schweigepflicht
              </h2>
              <p>
                Als Rechtsanwälte unterliegen wir der berufsrechtlichen Schweigepflicht gemäß 
                § 43a Abs. 2 BRAO. Alle im Rahmen des Mandats übermittelten Informationen werden 
                streng vertraulich behandelt.
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                SSL-/TLS-Verschlüsselung
              </h2>
              <p>
                Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung 
                vertraulicher Inhalte eine SSL-/TLS-Verschlüsselung. Eine verschlüsselte 
                Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von 
                &quot;http://&quot; auf &quot;https://&quot; wechselt und an dem Schloss-Symbol.
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                Aktualität und Änderung dieser Datenschutzerklärung
              </h2>
              <p>
                Diese Datenschutzerklärung ist aktuell gültig und hat den Stand Dezember 2024.
              </p>
              <p className="mt-4">
                Durch die Weiterentwicklung unserer Website und Angebote darüber oder aufgrund 
                geänderter gesetzlicher beziehungsweise behördlicher Vorgaben kann es notwendig 
                werden, diese Datenschutzerklärung zu ändern. Die jeweils aktuelle Datenschutzerklärung 
                kann jederzeit auf der Website abgerufen und ausgedruckt werden.
              </p>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}
