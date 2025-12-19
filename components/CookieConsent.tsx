"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";

type ConsentType = "all" | "necessary" | null;

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Check if consent was already given
    const consent = localStorage.getItem("cookie-consent");
    if (consent) {
      setHasConsent(true);
    } else {
      // Small delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (type: ConsentType) => {
    localStorage.setItem("cookie-consent", type || "necessary");
    localStorage.setItem("cookie-consent-date", new Date().toISOString());
    setShowBanner(false);
    setHasConsent(true);

    // Dispatch custom event to notify other components about consent change
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cookieConsentUpdated"));
    }

    // Here you would typically initialize analytics/tracking if type === "all"
    if (type === "all") {
      // Initialize optional cookies/analytics
      console.log("All cookies accepted");
    }
  };

  const openSettings = () => {
    setShowBanner(true);
    setShowDetails(true);
  };

  return (
    <>
      {/* Cookie Settings Button - shown when consent was already given */}
      {hasConsent && !showBanner && (
        <button
          onClick={openSettings}
          className="fixed bottom-4 right-4 z-40 w-12 h-12 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
          aria-label="Cookie-Einstellungen öffnen"
          title="Cookie-Einstellungen"
        >
          <svg 
            className="w-6 h-6 group-hover:scale-110 transition-transform" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10c0-.347-.018-.69-.052-1.028a1 1 0 00-.897-.878 3 3 0 01-2.123-2.123 1 1 0 00-.878-.897A10.05 10.05 0 0012 2zm-1 4a1 1 0 112 0 1 1 0 01-2 0zm-3 3a1 1 0 112 0 1 1 0 01-2 0zm2 5a2 2 0 114 0 2 2 0 01-4 0zm-4 0a1 1 0 112 0 1 1 0 01-2 0zm8-2a1 1 0 112 0 1 1 0 01-2 0z"/>
          </svg>
        </button>
      )}

      {/* Cookie Banner */}
      {showBanner && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" 
            onClick={() => hasConsent && setShowBanner(false)}
          />
          
          {/* Banner */}
          <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-fade-in">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-border overflow-hidden">
              {/* Close Button (only when reopening) */}
              {hasConsent && (
                <button
                  onClick={() => setShowBanner(false)}
                  className="absolute top-4 right-4 text-text-muted hover:text-primary transition-colors"
                  aria-label="Schließen"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              {/* Main Content */}
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Cookie Icon */}
                  <div className="hidden sm:flex w-12 h-12 bg-accent/10 rounded-xl items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10c0-.347-.018-.69-.052-1.028a1 1 0 00-.897-.878 3 3 0 01-2.123-2.123 1 1 0 00-.878-.897A10.05 10.05 0 0012 2zm-1 4a1 1 0 112 0 1 1 0 01-2 0zm-3 3a1 1 0 112 0 1 1 0 01-2 0zm2 5a2 2 0 114 0 2 2 0 01-4 0zm-4 0a1 1 0 112 0 1 1 0 01-2 0zm8-2a1 1 0 112 0 1 1 0 01-2 0z"/>
                    </svg>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-primary mb-2">
                      {hasConsent ? "Cookie-Einstellungen" : "Wir respektieren Deine Privatsphäre"}
                    </h3>
                    <p className="text-text-muted text-sm leading-relaxed">
                      {hasConsent 
                        ? "Hier kannst Du Deine Cookie-Einstellungen anpassen."
                        : "Wir verwenden Cookies, um Dir die bestmögliche Erfahrung auf unserer Website zu bieten. Einige Cookies sind technisch notwendig, andere helfen uns, die Website zu verbessern."
                      }{" "}
                      <Link href="/datenschutz" className="text-accent hover:underline">
                        Mehr erfahren
                      </Link>
                    </p>
                  </div>
                </div>

                {/* Details Section */}
                {showDetails && (
                  <div className="mt-6 p-4 bg-background-alt rounded-xl animate-fade-in">
                    <h4 className="font-medium text-primary mb-3">Cookie-Kategorien</h4>
                    
                    <div className="space-y-4">
                      {/* Necessary Cookies */}
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <input
                            type="checkbox"
                            checked
                            disabled
                            className="w-4 h-4 rounded border-border text-accent"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-primary text-sm">
                            Notwendige Cookies
                            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                              Immer aktiv
                            </span>
                          </div>
                          <p className="text-text-muted text-xs mt-1">
                            Diese Cookies sind für das Funktionieren der Website erforderlich und können nicht 
                            deaktiviert werden. Sie werden nur als Reaktion auf von Dir vorgenommene Aktionen 
                            gesetzt (z.B. Anmeldung, Formularübermittlung).
                          </p>
                        </div>
                      </div>

                      {/* Analytics Cookies */}
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <input
                            type="checkbox"
                            id="analytics-cookies"
                            defaultChecked={localStorage.getItem("cookie-consent") === "all"}
                            className="w-4 h-4 rounded border-border text-accent"
                          />
                        </div>
                        <div>
                          <label htmlFor="analytics-cookies" className="font-medium text-primary text-sm cursor-pointer">
                            Analyse-Cookies
                          </label>
                          <p className="text-text-muted text-xs mt-1">
                            Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren. 
                            Alle Daten werden anonymisiert erfasst.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleConsent("all")}
                    className="flex-1 sm:flex-none"
                  >
                    Alle akzeptieren
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => handleConsent("necessary")}
                    className="flex-1 sm:flex-none"
                  >
                    Nur notwendige
                  </Button>
                  
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-text-muted hover:text-primary text-sm underline underline-offset-2 py-2"
                  >
                    {showDetails ? "Weniger anzeigen" : "Einstellungen anzeigen"}
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-3 bg-background-alt border-t border-border flex flex-wrap items-center justify-center gap-4 text-xs text-text-muted">
                <Link href="/datenschutz" className="hover:text-accent">
                  Datenschutzerklärung
                </Link>
                <span>•</span>
                <Link href="/impressum" className="hover:text-accent">
                  Impressum
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
