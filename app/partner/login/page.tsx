"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Button, Input, Card } from "@/components/ui";
import { Logo } from "@/components/ui";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [verifying, setVerifying] = useState(!!token);

  // Wenn Token in URL vorhanden, automatisch verifizieren
  useEffect(() => {
    if (token) {
      verifyToken(token);
    }
  }, [token]);

  const verifyToken = async (tokenToVerify: string) => {
    setVerifying(true);
    try {
      const response = await fetch("/api/partner/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: tokenToVerify }),
      });

      const data = await response.json();

      if (data.success) {
        // Weiterleitung zum Dashboard
        router.push("/partner/dashboard");
      } else {
        setMessage({ type: "error", text: data.error || "Ungültiger oder abgelaufener Link" });
        setVerifying(false);
      }
    } catch (error) {
      console.error("Fehler beim Verifizieren:", error);
      setMessage({ type: "error", text: "Fehler beim Verifizieren des Links" });
      setVerifying(false);
    }
  };

  const handleRequestLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/partner/auth/request-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Falls diese E-Mail registriert ist, wurde ein Login-Link gesendet. Bitte prüfe Dein Postfach.",
        });
        setEmail("");
      } else {
        setMessage({ type: "error", text: data.error || "Fehler beim Senden des Links" });
      }
    } catch (error) {
      console.error("Fehler:", error);
      setMessage({ type: "error", text: "Es ist ein Fehler aufgetreten. Bitte versuche es erneut." });
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <main className="min-h-screen bg-background-alt">
        <Header />
        <section className="pt-28 pb-20 md:pt-32 md:pb-24">
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            <Card variant="elevated" padding="lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                <p className="text-text-muted">Verifiziere Login-Link...</p>
              </div>
            </Card>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background-alt">
      <Header />

      <section className="pt-28 pb-20 md:pt-32 md:pb-24">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Logo size="lg" />
            <h1 className="text-3xl font-bold text-primary mt-4 mb-2">Partner-Login</h1>
            <p className="text-text-muted">Melde Dich mit Deiner Partner-E-Mail an</p>
          </div>

          <Card variant="elevated" padding="lg">
            <form onSubmit={handleRequestLink} className="space-y-6">
              <div>
                <Input
                  label="E-Mail-Adresse"
                  type="email"
                  placeholder="partner@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              {message && (
                <div
                  className={`p-4 rounded-lg ${
                    message.type === "success"
                      ? "bg-success/10 text-success border border-success/20"
                      : "bg-error/10 text-error border border-error/20"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                disabled={loading}
                className="w-full"
              >
                Login-Link anfordern
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-text-muted text-center">
                Du erhältst einen Magic Link per E-Mail, mit dem Du Dich ohne Passwort anmelden kannst.
              </p>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function PartnerLoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background-alt">
        <Header />
        <section className="pt-28 pb-20 md:pt-32 md:pb-24">
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-text-muted">Lade...</div>
          </div>
        </section>
        <Footer />
      </main>
    }>
      <LoginContent />
    </Suspense>
  );
}
