"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function SigningPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const [error, setError] = useState<string | null>(null);
  
  // Verwende direkte Signing-URL statt SDK
  // Sessions, die über api.pandadoc.com erstellt wurden, sind für die COM-Region
  const signingUrl = `https://app.pandadoc.com/s/${sessionId}`;

  useEffect(() => {
    if (!sessionId) {
      setError("Keine Session-ID gefunden");
      return;
    }

    console.log("Lade PandaDoc Signing-URL:", signingUrl);
    
    // Überwache Nachrichten vom iframe für Signatur-Abschluss
    const handleMessage = (event: MessageEvent) => {
      // Prüfe, ob die Nachricht von PandaDoc kommt
      if (event.origin.includes("pandadoc.com")) {
        console.log("Nachricht von PandaDoc:", event.data);
        
        // Wenn das Dokument signiert wurde, leite weiter
        if (event.data?.type === "document.completed" || event.data?.status === "completed") {
          setTimeout(() => {
            router.push("/bestaetigung?signed=true");
          }, 2000);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [sessionId, router, signingUrl]);

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-background-alt flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
          Keine Session-ID gefunden
        </div>
      </div>
    );
  }

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
        <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <iframe
            src={signingUrl}
            className="w-full"
            style={{
              height: "calc(100vh - 180px)",
              minHeight: "1200px",
              border: "none",
              display: "block"
            }}
            title="PandaDoc Signing"
            allow="camera; microphone; geolocation"
          />
        </div>
      </div>
    </div>
  );
}

