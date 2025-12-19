"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo, Card } from "@/components/ui";
import AdminLogoutButton from "@/components/admin/LogoutButton";

interface PartnerStat {
  id: string;
  name: string;
  trackingId: string;
  email: string | null;
  active: boolean;
  totalLeads: number;
  neu: number;
  inBearbeitung: number;
  abgeschlossen: number;
  vollmachtSigniert: number;
  conversionRate: string;
  geschaetzterErtrag: number;
  createdAt: Date;
}

export default function PartnerStatsPage() {
  const router = useRouter();
  const [partnerStats, setPartnerStats] = useState<PartnerStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Hole Session und Statistiken
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push("/admin/login");
          return;
        }
        setSession(data);
        
        // Hole Partner-Statistiken
        fetch("/api/admin/partner/stats")
          .then((res) => res.json())
          .then((data) => {
            setPartnerStats(data.partners || []);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Fehler beim Laden der Statistiken:", error);
            setLoading(false);
          });
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [router]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Link kopiert!");
  };

  if (loading || !session) {
    return (
      <main className="min-h-screen bg-background-alt flex items-center justify-center">
        <div className="text-text-muted">Lade...</div>
      </main>
    );
  }

  const totalLeads = partnerStats.reduce((sum, p) => sum + p.totalLeads, 0);
  const totalErtrag = partnerStats.reduce((sum, p) => sum + p.geschaetzterErtrag, 0);

  return (
    <main className="min-h-screen bg-background-alt">
      {/* Header */}
      <header className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Logo size="sm" variant="icon" />
              <span className="font-semibold">Partner-Statistiken</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Dashboard
              </Link>
              <span className="text-white/70 text-sm">{session?.user?.email}</span>
              <AdminLogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Gesamt-Statistiken */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card variant="elevated" padding="md">
            <div className="text-text-muted text-sm mb-1">Gesamt Leads</div>
            <div className="text-3xl font-bold text-primary">{totalLeads}</div>
          </Card>
          <Card variant="elevated" padding="md">
            <div className="text-text-muted text-sm mb-1">Aktive Partner</div>
            <div className="text-3xl font-bold text-accent">
              {partnerStats.filter((p) => p.active).length}
            </div>
          </Card>
          <Card variant="elevated" padding="md">
            <div className="text-text-muted text-sm mb-1">Geschätzter Ertrag</div>
            <div className="text-3xl font-bold text-success">{totalErtrag} €</div>
          </Card>
        </div>

        {/* Partner-Liste */}
        <Card variant="elevated" padding="none">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-primary">Partner-Übersicht</h2>
          </div>

          {partnerStats.length === 0 ? (
            <div className="p-12 text-center text-text-muted">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-border"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p>Noch keine Partner vorhanden</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background-alt">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Partner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Tracking-ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Leads
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Abgeschlossen
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Conversion
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Ertrag
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Link
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {partnerStats.map((partner) => {
                    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://meta-klage.de";
                    const trackingUrl = `${baseUrl}/formular?partner=${partner.trackingId}`;
                    
                    return (
                      <tr key={partner.id} className="hover:bg-background-alt/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-primary">{partner.name}</div>
                          {partner.email && (
                            <div className="text-sm text-text-muted">{partner.email}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <code className="text-sm bg-background-alt px-2 py-1 rounded">
                            {partner.trackingId}
                          </code>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {partner.active ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                              Aktiv
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-border text-text-muted">
                              Inaktiv
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                          <div className="font-medium text-primary">{partner.totalLeads}</div>
                          <div className="text-xs">
                            Neu: {partner.neu} | Bearbeitung: {partner.inBearbeitung}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                          {partner.abgeschlossen}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                          {partner.conversionRate}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold text-success">
                            {partner.geschaetzterErtrag} €
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => copyToClipboard(trackingUrl)}
                            className="text-accent hover:text-accent-dark text-sm"
                            title="Tracking-Link kopieren"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Tracking-Link Generator */}
        <Card variant="elevated" padding="lg" className="mt-8">
          <h3 className="text-lg font-semibold text-primary mb-4">
            Tracking-Link Generator
          </h3>
          <p className="text-text-muted text-sm mb-4">
            Verwende diese Links, um Besucher von Partnern zu tracken. Die Partner-ID wird automatisch gespeichert, wenn ein Besucher über den Link kommt.
          </p>
          <div className="space-y-2">
            {partnerStats.map((partner) => {
              const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://meta-klage.de";
              const trackingUrl = `${baseUrl}/formular?partner=${partner.trackingId}`;
              return (
                <div key={partner.id} className="flex items-center gap-2 p-3 bg-background-alt rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-primary">{partner.name}</div>
                    <code className="text-xs text-text-muted break-all">{trackingUrl}</code>
                  </div>
                  <button
                    onClick={() => copyToClipboard(trackingUrl)}
                    className="px-3 py-1 bg-accent text-white rounded hover:bg-accent-dark text-sm"
                  >
                    Kopieren
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </main>
  );
}
