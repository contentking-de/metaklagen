import { Header, Footer } from "@/components/layout";
import { Card } from "@/components/ui";

export const metadata = {
  title: "Widerrufsbelehrung | META Datenschutzklage",
  description: "Widerrufsbelehrung für Verbraucher",
};

export default function WiderrufPage() {
  return (
    <main className="min-h-screen bg-background-alt">
      <Header />

      <section className="pt-28 pb-20 md:pt-32 md:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="elevated" padding="lg">
            <h1 className="text-3xl font-bold text-primary mb-8">Widerrufsbelehrung</h1>

            <div className="prose prose-lg max-w-none text-text-muted">
              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                Widerrufsrecht
              </h2>
              <p>
                Du hast das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag 
                zu widerrufen.
              </p>
              <p className="mt-4">
                Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.
              </p>
              <p className="mt-4">
                Um Dein Widerrufsrecht auszuüben, musst Du uns:
              </p>
              <div className="bg-background-alt p-4 rounded-lg mt-4">
                <p>
                  BEMK Rechtsanwälte Blazek Ellerbrock Malar Kronsbein PartGmbB<br />
                  Artur-Ladebeck-Str. 8<br />
                  33602 Bielefeld<br />
                  E-Mail: info@rae-bemk.de
                </p>
              </div>
              <p className="mt-4">
                mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter Brief oder 
                E-Mail) über Deinen Entschluss, diesen Vertrag zu widerrufen, informieren.
              </p>
              <p className="mt-4">
                Du kannst dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch 
                nicht vorgeschrieben ist.
              </p>
              <p className="mt-4">
                Zur Wahrung der Widerrufsfrist reicht es aus, dass Du die Mitteilung über die 
                Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absendest.
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                Folgen des Widerrufs
              </h2>
              <p>
                Wenn Du diesen Vertrag widerrufst, haben wir Dir alle Zahlungen, die wir von 
                Dir erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem 
                Tag zurückzuzahlen, an dem die Mitteilung über Deinen Widerruf dieses Vertrags 
                bei uns eingegangen ist.
              </p>
              <p className="mt-4">
                Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Du bei der 
                ursprünglichen Transaktion eingesetzt hast, es sei denn, mit Dir wurde 
                ausdrücklich etwas anderes vereinbart; in keinem Fall werden Dir wegen dieser 
                Rückzahlung Entgelte berechnet.
              </p>
              <p className="mt-4">
                Hast Du verlangt, dass die Dienstleistungen während der Widerrufsfrist beginnen 
                sollen, so hast Du uns einen angemessenen Betrag zu zahlen, der dem Anteil der 
                bis zu dem Zeitpunkt, zu dem Du uns von der Ausübung des Widerrufsrechts 
                hinsichtlich dieses Vertrags unterrichtest, bereits erbrachten Dienstleistungen 
                im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                Besondere Hinweise
              </h2>
              <p>
                Das Widerrufsrecht erlischt vorzeitig, wenn die Kanzlei die Dienstleistung 
                vollständig erbracht hat und mit der Ausführung der Dienstleistung erst begonnen 
                hat, nachdem Du dazu Deine ausdrückliche Zustimmung gegeben hast und gleichzeitig 
                Deine Kenntnis davon bestätigt hast, dass Du Dein Widerrufsrecht bei vollständiger 
                Vertragserfüllung durch die Kanzlei verlierst.
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                Muster-Widerrufsformular
              </h2>
              <p>
                (Wenn Du den Vertrag widerrufen willst, dann fülle bitte dieses Formular aus und 
                sende es zurück.)
              </p>
              
              <div className="bg-background-alt p-6 rounded-lg mt-4 border border-border">
                <p>An:</p>
                <p className="mt-2">
                  BEMK Rechtsanwälte Blazek Ellerbrock Malar Kronsbein PartGmbB<br />
                  Artur-Ladebeck-Str. 8<br />
                  33602 Bielefeld<br />
                  E-Mail: info@rae-bemk.de
                </p>
                <p className="mt-4">
                  Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag 
                  über die Erbringung der folgenden Dienstleistung:
                </p>
                <p className="mt-4">
                  Rechtsanwaltliche Vertretung bei der Datenschutzklage gegen META
                </p>
                <p className="mt-4">
                  Bestellt am (*)/erhalten am (*): _________________
                </p>
                <p className="mt-4">
                  Name des/der Verbraucher(s): _________________
                </p>
                <p className="mt-4">
                  Anschrift des/der Verbraucher(s): _________________
                </p>
                <p className="mt-4">
                  _________________<br />
                  Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)
                </p>
                <p className="mt-4">
                  _________________<br />
                  Datum
                </p>
                <p className="mt-4 text-sm">
                  (*) Unzutreffendes streichen.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}

