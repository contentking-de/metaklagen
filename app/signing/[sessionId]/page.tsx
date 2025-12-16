"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Signing } from "pandadoc-signing";

export default function SigningPage() {
  const params = useParams();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const signingRef = useRef<Signing | null>(null);
  const sessionId = params.sessionId as string;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId || !containerRef.current) return;

    try {
      // Erstelle Signing-Instanz
      const signing = new Signing(
        containerRef.current,
        {
          sessionId: sessionId,
          width: "100%",
          height: "800px",
        },
        {
          region: (process.env.NEXT_PUBLIC_PANDADOC_REGION as "com" | "eu") || "com",
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
        setError("Ein Fehler ist beim Laden des Dokuments aufgetreten. Bitte versuche es erneut.");
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

    return () => {
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
    <div className="min-h-screen bg-background-alt flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-2xl font-bold text-primary mb-6 text-center">
          Vollmacht digital unterschreiben
        </h1>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        <div
          ref={containerRef}
          className="w-full bg-white rounded-lg shadow-lg"
          style={{ minHeight: "800px" }}
        />
      </div>
    </div>
  );
}

