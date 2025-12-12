import { Header, Footer } from "@/components/layout";
import { Card } from "@/components/ui";

export const metadata = {
  title: "Impressum | META Datenschutzklage",
  description: "Impressum und Angaben gemäß § 5 TMG",
};

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-background-alt">
      <Header />

      <section className="pt-28 pb-20 md:pt-32 md:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="elevated" padding="lg">
            <h1 className="text-3xl font-bold text-primary mb-8">Impressum</h1>

            <div className="prose prose-lg max-w-none text-text-muted">
              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                Angaben gemäß § 5 TMG
              </h2>
              <p>
                BEMK Rechtsanwälte Blazek Ellerbrock Malar Kronsbein PartGmbB<br />
                Artur-Ladebeck-Str. 8<br />
                33602 Bielefeld
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                Kontakt
              </h2>
              <p>
                Telefon: +49 (0) 521 977 940-0<br />
                Telefax: +49 (0) 521 977 940-10<br />
                E-Mail: info@rae-bemk.de
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                Partnerschaftsgesellschaft
              </h2>
              <p>
                Partnerschaftsgesellschaft mit beschränkter Berufshaftung im Sinne des 
                Partnerschaftsgesellschaftsgesetzes vom 25.07.1994 (BGBl. I 1744).<br /><br />
                Registergericht: Amtsgericht Essen<br />
                Registernummer: PR 4291<br />
                Sitz der Gesellschaft: Bielefeld
              </p>
              <p className="mt-4">
                <strong>Partner:</strong><br />
                Rechtsanwalt Daniel Blazek<br />
                Rechtsanwalt Marc Ellerbrock<br />
                Rechtsanwalt Michael Malar<br />
                Rechtsanwalt Dirk Kronsbein
              </p>
              <p className="mt-4">
                Jeder Partner vertritt die Partnerschaftsgesellschaft mit beschränkter 
                Berufshaftung einzeln.
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                Berufsbezeichnung und berufsrechtliche Regelungen
              </h2>
              <p>
                Berufsbezeichnung: Rechtsanwalt<br />
                Verleihender Staat: Bundesrepublik Deutschland
              </p>
              <p className="mt-4">
                Zuständige Kammer:<br />
                Rechtsanwaltskammer Hamm<br />
                Ostenallee 18<br />
                59063 Hamm
              </p>
              <p className="mt-4">
                Es gelten folgende berufsrechtliche Regelungen:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Bundesrechtsanwaltsordnung (BRAO)</li>
                <li>Berufsordnung für Rechtsanwälte (BORA)</li>
                <li>Fachanwaltsordnung (FAO)</li>
                <li>Rechtsanwaltsvergütungsgesetz (RVG)</li>
              </ul>
              <p className="mt-4">
                Die berufsrechtlichen Regelungen sind einsehbar unter:{" "}
                <a
                  href="https://www.brak.de/fuer-anwaelte/berufsrecht/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  www.brak.de
                </a>
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                Umsatzsteuer-ID
              </h2>
              <p>
                Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br />
                DE 269638666
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                Streitschlichtung
              </h2>
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p className="mt-4">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                Haftung für Inhalte
              </h2>
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
                nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als 
                Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde 
                Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige 
                Tätigkeit hinweisen.
              </p>
              <p className="mt-4">
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den 
                allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch 
                erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei 
                Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                Haftung für Links
              </h2>
              <p>
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen 
                Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
                Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der 
                Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf 
                mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung 
                nicht erkennbar.
              </p>
              <p className="mt-4">
                Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete 
                Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen 
                werden wir derartige Links umgehend entfernen.
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4">
                Urheberrecht
              </h2>
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
                dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
                der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
                Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind 
                nur für den privaten, nicht kommerziellen Gebrauch gestattet.
              </p>
              <p className="mt-4">
                Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die 
                Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. 
                Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen 
                entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige 
                Inhalte umgehend entfernen.
              </p>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}
