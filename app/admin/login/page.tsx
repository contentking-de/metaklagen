"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Logo, Button, Input, Card } from "@/components/ui";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Ungültige Anmeldedaten");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Ein Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background-alt flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center" />
          <p className="text-text-muted mt-2">Admin-Bereich</p>
        </div>

        {/* Login Card */}
        <Card variant="elevated" padding="lg">
          <h1 className="text-2xl font-bold text-primary mb-6 text-center">
            Anmeldung
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-error/10 border border-error/30 rounded-lg text-error text-sm">
                {error}
              </div>
            )}

            <Input
              label="E-Mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@kanzlei.de"
              required
            />

            <Input
              label="Passwort"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button
              type="submit"
              variant="secondary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Anmelden
            </Button>
          </form>
        </Card>

        {/* Back Link */}
        <p className="text-center mt-6 text-text-muted text-sm">
          <a href="/" className="text-accent hover:underline">
            Zurück zur Startseite
          </a>
        </p>
      </div>
    </main>
  );
}

