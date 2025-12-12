import { Header, Footer } from "@/components/layout";
import { Card } from "@/components/ui";

export const metadata = {
  title: "AGB | META Datenschutzklage",
  description: "Allgemeine Geschäftsbedingungen und Mandatsvereinbarung",
};

export default function AGBPage() {
  return (
    <main className="min-h-screen bg-background-alt">
      <Header />

      <section className="pt-28 pb-20 md:pt-32 md:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="elevated" padding="lg">
            <h1 className="text-3xl font-bold text-primary mb-8">
              Allgemeine Geschäftsbedingungen
            </h1>

            <div className="prose prose-lg max-w-none text-text-muted">
              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                § 1 Geltungsbereich
              </h2>
              <p>
                (1) Diese Allgemeinen Geschäftsbedingungen gelten für alle Mandatsverträge 
                zwischen [Kanzleiname] (nachfolgend &quot;Kanzlei&quot;) und dem Mandanten im 
                Zusammenhang mit der Durchsetzung von Datenschutzansprüchen gegen META 
                Platforms, Inc. und verbundene Unternehmen.
              </p>
              <p className="mt-4">
                (2) Abweichende Bedingungen des Mandanten werden nicht anerkannt, es sei denn, 
                die Kanzlei stimmt ihrer Geltung ausdrücklich schriftlich zu.
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                § 2 Vertragsschluss
              </h2>
              <p>
                (1) Der Mandatsvertrag kommt durch die Übermittlung des ausgefüllten 
                Mandatsformulars auf dieser Website und die Annahme durch die Kanzlei zustande.
              </p>
              <p className="mt-4">
                (2) Die Kanzlei behält sich vor, Mandate ohne Angabe von Gründen abzulehnen.
              </p>
              <p className="mt-4">
                (3) Der Mandant versichert, dass alle im Formular gemachten Angaben wahrheitsgemäß 
                und vollständig sind.
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                § 3 Leistungsumfang
              </h2>
              <p>
                (1) Die Kanzlei übernimmt die außergerichtliche und gerichtliche Vertretung des 
                Mandanten bei der Durchsetzung von Schadensersatzansprüchen gegen META wegen 
                Datenschutzverstößen.
              </p>
              <p className="mt-4">
                (2) Die Leistungen umfassen insbesondere:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Prüfung der Erfolgsaussichten</li>
                <li>Einholung der Deckungszusage bei der Rechtschutzversicherung</li>
                <li>Außergerichtliche Geltendmachung der Ansprüche</li>
                <li>Gerichtliche Durchsetzung der Ansprüche bei Bedarf</li>
                <li>Regelmäßige Information über den Verfahrensstand</li>
              </ul>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                § 4 Voraussetzungen
              </h2>
              <p>
                (1) Voraussetzung für die Mandatsübernahme ist das Vorliegen einer 
                Rechtschutzversicherung, die die Kosten des Verfahrens deckt.
              </p>
              <p className="mt-4">
                (2) Der Mandant muss zum Zeitpunkt der Mandatserteilung mindestens 18 Jahre 
                alt sein und seinen Wohnsitz in Deutschland haben.
              </p>
              <p className="mt-4">
                (3) Der Mandant muss ein Facebook- und/oder Instagram-Konto besitzen oder 
                besessen haben.
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                § 5 Vergütung
              </h2>
              <p>
                (1) Die Vergütung der Kanzlei richtet sich nach dem Rechtsanwaltsvergütungsgesetz (RVG).
              </p>
              <p className="mt-4">
                (2) Bei Vorliegen einer Rechtschutzversicherung werden die Kosten von dieser 
                übernommen. Der Mandant trägt in diesem Fall kein Kostenrisiko.
              </p>
              <p className="mt-4">
                (3) Ein etwaig erstrittener Schadensersatz verbleibt vollständig beim Mandanten.
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                § 6 Mitwirkungspflichten
              </h2>
              <p>
                (1) Der Mandant ist verpflichtet, der Kanzlei alle für die Mandatsbearbeitung 
                erforderlichen Informationen und Unterlagen zur Verfügung zu stellen.
              </p>
              <p className="mt-4">
                (2) Der Mandant informiert die Kanzlei unverzüglich über alle Änderungen seiner 
                Kontaktdaten sowie über alle relevanten Umstände, die das Mandat betreffen.
              </p>
              <p className="mt-4">
                (3) Der Mandant reagiert auf Anfragen der Kanzlei innerhalb angemessener Frist.
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                § 7 Haftung
              </h2>
              <p>
                (1) Die Kanzlei haftet für Schäden nur bei Vorsatz und grober Fahrlässigkeit.
              </p>
              <p className="mt-4">
                (2) Die Haftung für leichte Fahrlässigkeit ist auf die Verletzung wesentlicher 
                Vertragspflichten beschränkt und der Höhe nach auf den vertragstypischen, 
                vorhersehbaren Schaden begrenzt.
              </p>
              <p className="mt-4">
                (3) Eine Erfolgsgarantie wird nicht übernommen. Die Durchsetzung von Ansprüchen 
                hängt von verschiedenen Faktoren ab, auf die die Kanzlei keinen Einfluss hat.
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                § 8 Datenschutz
              </h2>
              <p>
                Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer Datenschutzerklärung 
                und den Vorgaben der DSGVO. Der Mandant erklärt sich mit der Verarbeitung seiner 
                Daten zum Zweck der Mandatsbearbeitung einverstanden.
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                § 9 Beendigung des Mandats
              </h2>
              <p>
                (1) Das Mandat kann von beiden Seiten jederzeit gekündigt werden.
              </p>
              <p className="mt-4">
                (2) Bei Kündigung durch den Mandanten können bereits entstandene Kosten in 
                Rechnung gestellt werden, soweit diese nicht von der Rechtschutzversicherung 
                übernommen werden.
              </p>
              <p className="mt-4">
                (3) Die Kanzlei kann das Mandat aus wichtigem Grund niederlegen, insbesondere 
                bei Vertrauensverlust oder mangelnder Mitwirkung des Mandanten.
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                § 10 Schlussbestimmungen
              </h2>
              <p>
                (1) Es gilt das Recht der Bundesrepublik Deutschland.
              </p>
              <p className="mt-4">
                (2) Gerichtsstand ist, soweit gesetzlich zulässig, der Sitz der Kanzlei.
              </p>
              <p className="mt-4">
                (3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, 
                bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
              </p>

              <p className="mt-8 text-sm">
                Stand: {new Date().toLocaleDateString("de-DE", { month: "long", year: "numeric" })}
              </p>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}

