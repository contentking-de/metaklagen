import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Button, Card } from "@/components/ui";

export default function BestaetigungPage() {
  return (
    <main className="min-h-screen bg-background-alt">
      <Header />

      <section className="pt-28 pb-20 md:pt-32 md:pb-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="elevated" padding="lg" className="text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-success"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Headline */}
            <h1 className="text-3xl font-bold text-primary mb-4">
              Vielen Dank für Dein Vertrauen!
            </h1>
            
            <p className="text-text-muted text-lg mb-8">
              Dein Mandat wurde erfolgreich übermittelt. Du erhältst in Kürze eine Bestätigungs-E-Mail.
            </p>

            {/* What's Next */}
            <div className="bg-background-alt rounded-xl p-6 text-left mb-8">
              <h2 className="font-semibold text-primary mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                So geht es weiter:
              </h2>
              
              <ol className="space-y-4 text-text-muted">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-accent text-primary text-sm font-bold rounded-full flex items-center justify-center">
                    1
                  </span>
                  <div>
                    <strong className="text-primary">Prüfung Deiner Daten</strong>
                    <p className="text-sm mt-1">
                      Wir prüfen Deine Angaben und bereiten die Deckungsanfrage vor.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-accent text-primary text-sm font-bold rounded-full flex items-center justify-center">
                    2
                  </span>
                  <div>
                    <strong className="text-primary">Deckungszusage einholen</strong>
                    <p className="text-sm mt-1">
                      Wir kontaktieren Deine Rechtschutzversicherung und holen die Deckungszusage ein.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-accent text-primary text-sm font-bold rounded-full flex items-center justify-center">
                    3
                  </span>
                  <div>
                    <strong className="text-primary">Klage einreichen</strong>
                    <p className="text-sm mt-1">
                      Nach Erhalt der Deckungszusage reichen wir die Klage für Dich ein.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-accent text-primary text-sm font-bold rounded-full flex items-center justify-center">
                    4
                  </span>
                  <div>
                    <strong className="text-primary">Laufende Updates</strong>
                    <p className="text-sm mt-1">
                      Du wirst per E-Mail über jeden Fortschritt informiert.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            {/* Contact Info */}
            <div className="border-t border-border pt-6 mb-8">
              <p className="text-text-muted text-sm">
                Bei Fragen erreichst Du uns unter{" "}
                <a href="mailto:info@meta-datenschutzklage.de" className="text-accent hover:underline">
                  info@meta-datenschutzklage.de
                </a>
              </p>
            </div>

            {/* Back to Home */}
            <Link href="/">
              <Button variant="outline">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                Zurück zur Startseite
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}

