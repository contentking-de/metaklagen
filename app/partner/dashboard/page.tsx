"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Card, Button } from "@/components/ui";
import { Logo } from "@/components/ui";

interface PartnerStats {
  partner: {
    id: string;
    name: string;
    trackingId: string;
    email: string | null;
  };
  totalLeads: number;
  neu: number;
  inBearbeitung: number;
  abgeschlossen: number;
  vollmachtSigniert: number;
  conversionRate: string;
  geschaetzterErtrag: number;
  trackingUrl: string;
}

export default function PartnerDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [stats, setStats] = useState<PartnerStats | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const sessionResponse = await fetch("/api/partner/auth/session");
      const sessionData = await sessionResponse.json();

      if (!sessionData.authenticated) {
        router.push("/partner/login");
        return;
      }

      setAuthenticated(true);

      // Hole Statistiken
      const statsResponse = await fetch("/api/partner/stats");
      if (statsResponse.ok) {
        const data = await statsResponse.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Fehler beim Laden:", error);
      router.push("/partner/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/partner/auth/session", { method: "DELETE" });
    router.push("/partner/login");
  };

  const copyTrackingLink = () => {
    if (stats?.trackingUrl) {
      navigator.clipboard.writeText(stats.trackingUrl);
      alert("Tracking-Link wurde kopiert!");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background-alt">
        <Header />
        <section className="pt-28 pb-20 md:pt-32 md:pb-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-text-muted">Lade Dashboard...</div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  if (!authenticated || !stats) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background-alt">
      <Header />

      <section className="pt-28 pb-20 md:pt-32 md:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">Partner-Dashboard</h1>
              <p className="text-text-muted">Willkommen, {stats.partner.name}</p>
            </div>
            <Button variant="ghost" onClick={handleLogout}>
              Abmelden
            </Button>
          </div>

          {/* Statistiken */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card variant="elevated" padding="md">
              <div className="text-text-muted text-sm mb-1">Gesamt Leads</div>
              <div className="text-3xl font-bold text-primary">{stats.totalLeads}</div>
              <div className="text-xs text-text-muted mt-2">
                Neu: {stats.neu} | Bearbeitung: {stats.inBearbeitung}
              </div>
            </Card>
            <Card variant="elevated" padding="md">
              <div className="text-text-muted text-sm mb-1">Abgeschlossen</div>
              <div className="text-3xl font-bold text-success">{stats.abgeschlossen}</div>
              <div className="text-xs text-text-muted mt-2">
                Conversion: {stats.conversionRate}%
              </div>
            </Card>
            <Card variant="elevated" padding="md">
              <div className="text-text-muted text-sm mb-1">Geschätzter Ertrag</div>
              <div className="text-3xl font-bold text-accent">{stats.geschaetzterErtrag} €</div>
              <div className="text-xs text-text-muted mt-2">
                1 € pro Lead
              </div>
            </Card>
          </div>

          {/* Tracking-Link */}
          <Card variant="elevated" padding="lg" className="mb-8">
            <h2 className="text-xl font-semibold text-primary mb-4">Dein Tracking-Link</h2>
            <p className="text-text-muted text-sm mb-4">
              Verwende diesen Link, um Besucher von Deiner Webseite zu tracken. Alle Leads, die über diesen Link kommen, werden Dir automatisch zugeordnet.
            </p>
            <div className="flex items-center gap-2 p-3 bg-background-alt rounded-lg">
              <code className="flex-1 text-sm break-all text-text-muted">
                {stats.trackingUrl}
              </code>
              <Button variant="secondary" size="sm" onClick={copyTrackingLink}>
                Kopieren
              </Button>
            </div>
          </Card>

          {/* Detaillierte Statistiken */}
          <Card variant="elevated" padding="lg">
            <h2 className="text-xl font-semibold text-primary mb-6">Detaillierte Statistiken</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-text-muted">Vollmacht signiert</span>
                <span className="font-semibold text-primary">{stats.vollmachtSigniert}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-text-muted">In Bearbeitung</span>
                <span className="font-semibold text-primary">{stats.inBearbeitung}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-text-muted">Partner-ID</span>
                <code className="text-sm bg-background-alt px-2 py-1 rounded">
                  {stats.partner.trackingId}
                </code>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}
