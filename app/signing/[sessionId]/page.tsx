"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Signing } from "pandadoc-signing";

export default function SigningPage() {
  const params = useParams();
  const router = useRouter();
  const signingRef = useRef<Signing | null>(null);
  const sessionId = params.sessionId as string;
  const [error, setError] = useState<string | null>(null);
  const containerId = "pandadoc-signing-container";

  useEffect(() => {
    if (!sessionId) {
      setError("Keine Session-ID gefunden");
      return;
    }

    console.log("Initialisiere PandaDoc Signing mit Session-ID:", sessionId);
    
    // WICHTIG: Sessions, die über api.pandadoc.com erstellt wurden, sind für die COM-Region
    // Da wir immer api.pandadoc.com verwenden (keine separate EU-API existiert),
    // müssen wir die Region auf 'com' setzen, damit die Session gefunden wird
    // Die Region wird auf 'com' gesetzt, unabhängig von NEXT_PUBLIC_PANDADOC_REGION,
    // da die Session über api.pandadoc.com erstellt wurde
    const region: "com" | "eu" = "com";
    console.log("Region:", region);
    console.log("HINWEIS: Session wurde über api.pandadoc.com erstellt, daher Region 'com'");

    // Warte kurz, damit das DOM-Element verfügbar ist
    const timer = setTimeout(() => {
      const container = document.getElementById(containerId);
      if (!container) {
        setError("Container-Element nicht gefunden");
        return;
      }

      try {
        // Erstelle Signing-Instanz mit Element-ID
        // WICHTIG: Region muss mit der API-Region übereinstimmen, über die die Session erstellt wurde
        // Höhe wird vom Container-Style übernommen, hier setzen wir eine große Höhe
        const containerHeight = Math.max(window.innerHeight - 180, 1200);
        const signing = new Signing(
          containerId,
          {
            sessionId: sessionId,
            width: "100%",
            height: `${containerHeight}px`, // Dynamische Höhe basierend auf Viewport
          },
          {
            region: region,
          }
        );

        signingRef.current = signing;

        // Event-Handler für erfolgreiche Signatur
        signing.on("document.completed", () => {
          // Weiterleitung nach erfolgreicher Signatur
          setTimeout(() => {
            router.push("/bestaetigung?signed=true");
          }, 2000);
        });

        // Event-Handler für Fehler
        signing.on("document.exception", (error: any) => {
          console.error("PandaDoc Signing Fehler:", error);
          console.error("Fehler-Details:", JSON.stringify(error, null, 2));
          setError(`Ein Fehler ist beim Laden des Dokuments aufgetreten: ${error?.message || "Unbekannter Fehler"}. Bitte versuche es erneut oder kontaktiere uns.`);
        });

        // Event-Handler für Dokument geladen
        signing.on("document.loaded", () => {
          console.log("PandaDoc Dokument erfolgreich geladen");
        });

        // Öffne das Signing-Fenster
        signing.open().catch((err) => {
          console.error("Fehler beim Öffnen des Signing-Fensters:", err);
          setError("Ein Fehler ist beim Öffnen des Signing-Fensters aufgetreten.");
        });
      } catch (err) {
        console.error("Fehler beim Initialisieren des PandaDoc Signing:", err);
        setError("Ein Fehler ist beim Initialisieren der Signatur aufgetreten.");
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      // Cleanup
      if (signingRef.current) {
        try {
          signingRef.current.close();
        } catch (err) {
          // Ignoriere Fehler beim Schließen
        }
      }
    };
  }, [sessionId, router]);

  return (
    <div className="min-h-screen bg-background-alt flex flex-col p-4">
      <div className="max-w-7xl w-full mx-auto">
        <h1 className="text-2xl font-bold text-primary mb-6 text-center">
          Vollmacht digital unterschreiben
        </h1>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        <div
          id={containerId}
          className="w-full bg-white rounded-lg shadow-lg"
          style={{ height: "calc(100vh - 180px)", minHeight: "1200px" }}
        />
      </div>
    </div>
  );
}

