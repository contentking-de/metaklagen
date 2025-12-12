import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Button, Card } from "@/components/ui";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-pattern">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent font-medium text-sm mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              Jetzt Ansprüche sichern – Kostenlos mit Rechtschutz
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-6 animate-fade-in stagger-1">
              Datenschutzverstoß durch{" "}
              <span className="text-gradient">META?</span>
              <br />
              <span className="text-3xl md:text-4xl lg:text-5xl">
                Hol Dir bis zu 10.000€ Schadensersatz!
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10 animate-fade-in stagger-2">
              META (Facebook & Instagram) hat gegen den Datenschutz verstoßen. 
              Mit Deiner Rechtschutzversicherung vertreten wir Dich <strong>kostenlos</strong> und 
              holen Dir Deinen Schadensersatz.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in stagger-3">
              <Link href="/formular">
                <Button variant="primary" size="lg" className="animate-pulse-glow">
                  Jetzt Mandat erteilen
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <Link href="#ablauf">
                <Button variant="outline" size="lg">
                  So funktioniert&apos;s
                </Button>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-text-muted animate-fade-in stagger-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Kein Kostenrisiko</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Erfahrene Anwälte</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Schnelle Bearbeitung</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vorteile Section */}
      <section id="vorteile" className="py-20 bg-background-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Warum mit uns klagen?
            </h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              Wir machen es Dir so einfach wie möglich, Deine Rechte durchzusetzen.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Vorteil 1 */}
            <Card variant="elevated" padding="lg" className="group hover:scale-105 transition-transform duration-300">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Kein Kostenrisiko</h3>
              <p className="text-text-muted">
                Mit Deiner Rechtschutzversicherung ist die Vertretung für Dich komplett kostenlos. 
                Du behältst 100% des Schadensersatzes.
              </p>
            </Card>

            {/* Vorteil 2 */}
            <Card variant="elevated" padding="lg" className="group hover:scale-105 transition-transform duration-300">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Erfahrene Anwälte</h3>
              <p className="text-text-muted">
                Unser spezialisiertes Team hat bereits hunderte Fälle gegen META erfolgreich vertreten 
                und kennt alle rechtlichen Feinheiten.
              </p>
            </Card>

            {/* Vorteil 3 */}
            <Card variant="elevated" padding="lg" className="group hover:scale-105 transition-transform duration-300">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Schnell & Digital</h3>
              <p className="text-text-muted">
                Der gesamte Prozess läuft digital ab. In nur 5 Minuten hast Du Dein Mandat erteilt – 
                ohne Papierkram oder Termine.
              </p>
            </Card>

            {/* Vorteil 4 */}
            <Card variant="elevated" padding="lg" className="group hover:scale-105 transition-transform duration-300">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Transparente Kommunikation</h3>
              <p className="text-text-muted">
                Du wirst über jeden Schritt informiert. Per E-Mail erhältst Du regelmäßige Updates 
                zum Stand Deines Verfahrens.
              </p>
            </Card>

            {/* Vorteil 5 */}
            <Card variant="elevated" padding="lg" className="group hover:scale-105 transition-transform duration-300">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Persönlicher Ansprechpartner</h3>
              <p className="text-text-muted">
                Bei Fragen steht Dir immer ein persönlicher Ansprechpartner zur Verfügung – 
                kein anonymes Callcenter.
              </p>
            </Card>

            {/* Vorteil 6 */}
            <Card variant="elevated" padding="lg" className="group hover:scale-105 transition-transform duration-300">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Hohe Erfolgsquote</h3>
              <p className="text-text-muted">
                Durch unsere Erfahrung und Spezialisierung erreichen wir eine überdurchschnittlich 
                hohe Erfolgsquote bei Datenschutzklagen.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Ablauf Section */}
      <section id="ablauf" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              So einfach geht&apos;s
            </h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              In nur 4 Schritten zu Deinem Schadensersatz – wir kümmern uns um den Rest.
            </p>
          </div>

          <div className="relative">
            {/* Connection Line (Desktop) */}
            <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-accent via-primary to-accent" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Schritt 1 */}
              <div className="relative text-center">
                <div className="w-16 h-16 bg-accent text-primary font-bold text-2xl rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10">
                  1
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3">Formular ausfüllen</h3>
                <p className="text-text-muted">
                  Gib Deine Daten in unser Online-Formular ein. Das dauert nur etwa 5 Minuten.
                </p>
              </div>

              {/* Schritt 2 */}
              <div className="relative text-center">
                <div className="w-16 h-16 bg-accent text-primary font-bold text-2xl rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10">
                  2
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3">Deckungsanfrage</h3>
                <p className="text-text-muted">
                  Wir prüfen Deinen Fall und holen die Deckungszusage bei Deiner Versicherung ein.
                </p>
              </div>

              {/* Schritt 3 */}
              <div className="relative text-center">
                <div className="w-16 h-16 bg-accent text-primary font-bold text-2xl rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10">
                  3
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3">Klage einreichen</h3>
                <p className="text-text-muted">
                  Nach der Deckungszusage reichen wir die Klage gegen META für Dich ein.
                </p>
              </div>

              {/* Schritt 4 */}
              <div className="relative text-center">
                <div className="w-16 h-16 bg-accent text-primary font-bold text-2xl rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10">
                  4
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3">Schadensersatz erhalten</h3>
                <p className="text-text-muted">
                  Bei Erfolg erhältst Du Deinen Schadensersatz von bis zu 1.000€ – komplett für Dich.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/formular">
              <Button variant="primary" size="lg">
                Jetzt starten
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-background-alt">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Häufige Fragen
            </h2>
            <p className="text-text-muted text-lg">
              Hier findest Du Antworten auf die wichtigsten Fragen.
            </p>
          </div>

          <div className="space-y-4">
            <FAQItem
              question="Worum geht es bei der Datenschutzklage gegen META?"
              answer="META (Facebook/Instagram) hat über Jahre hinweg Nutzerdaten ohne ausreichende Rechtsgrundlage verarbeitet und an Dritte weitergegeben. Dies verstößt gegen die DSGVO. Betroffene Nutzer haben Anspruch auf Schadensersatz für den immateriellen Schaden, der ihnen dadurch entstanden ist."
            />
            <FAQItem
              question="Wer kann klagen?"
              answer="Alle Personen, die ein Facebook- oder Instagram-Konto haben oder hatten und in Deutschland wohnen, können klagen. Du benötigst lediglich eine Rechtschutzversicherung, die das Kostenrisiko übernimmt."
            />
            <FAQItem
              question="Was kostet mich die Klage?"
              answer="Mit einer Rechtschutzversicherung ist die Klage für Dich komplett kostenlos. Alle Anwalts- und Gerichtskosten werden von Deiner Versicherung übernommen. Den erhaltenen Schadensersatz behältst Du zu 100%."
            />
            <FAQItem
              question="Wie hoch ist der Schadensersatz?"
              answer="Die Gerichte sprechen typischerweise Schadensersatz zwischen 300€ und 1.000€ zu. Die genaue Höhe hängt vom Einzelfall ab, insbesondere davon, wie lange Du die Plattformen genutzt hast."
            />
            <FAQItem
              question="Wie lange dauert das Verfahren?"
              answer="Die Dauer variiert je nach Gericht. In der Regel dauert ein Verfahren zwischen 6 und 18 Monaten. Wir halten Dich über jeden Fortschritt auf dem Laufenden."
            />
            <FAQItem
              question="Was passiert ohne Rechtschutzversicherung?"
              answer="Ohne Rechtschutzversicherung können wir Dich leider nicht vertreten, da dann ein Kostenrisiko für Dich bestehen würde. Du kannst aber unter meta-klage.de alternative Möglichkeiten prüfen."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bereit, Deine Rechte durchzusetzen?
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
            Lass nicht zu, dass META ungestraft mit Deinen Daten umgeht. 
            Starte jetzt – kostenlos und unverbindlich.
          </p>
          <Link href="/formular">
            <Button variant="primary" size="lg" className="bg-accent hover:bg-accent-dark text-primary">
              Jetzt Mandat erteilen
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group bg-white rounded-xl shadow-sm border border-border overflow-hidden">
      <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-background-alt transition-colors">
        <h3 className="font-semibold text-primary pr-4">{question}</h3>
        <svg
          className="w-5 h-5 text-accent flex-shrink-0 transition-transform group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="px-6 pb-6 text-text-muted">
        {answer}
      </div>
    </details>
  );
}
