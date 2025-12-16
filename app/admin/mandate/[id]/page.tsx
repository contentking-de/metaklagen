import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { Logo, Card, Button } from "@/components/ui";
import AdminLogoutButton from "@/components/admin/LogoutButton";
import MandateStatusBadge from "@/components/admin/StatusBadge";
import StatusUpdateForm from "@/components/admin/StatusUpdateForm";
import { getDocumentStatus } from "@/lib/pandadoc";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MandateDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const mandate = await prisma.mandate.findUnique({
    where: { id },
  });

  if (!mandate) {
    notFound();
  }

  // Prüfe Dokumentstatus von PandaDoc, wenn pandadocDocumentId vorhanden ist
  let isDocumentCompleted = false;
  if (mandate.pandadocDocumentId && !mandate.vollmachtSignedAt) {
    try {
      const docStatus = await getDocumentStatus(mandate.pandadocDocumentId);
      isDocumentCompleted = docStatus.status === "document.completed";
      
      // Wenn Dokument signiert ist, aber vollmachtSignedAt nicht gesetzt, aktualisiere es
      if (isDocumentCompleted) {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const vollmachtDownloadUrl = `${baseUrl}/api/admin/mandate/${mandate.id}/vollmacht`;
        
        await prisma.mandate.update({
          where: { id: mandate.id },
          data: {
            signedVollmachtUrl: vollmachtDownloadUrl,
            vollmachtSignedAt: new Date(), // Verwende aktuelles Datum, da wir das echte Datum nicht kennen
          },
        });
        
        // Lade Mandat neu, um aktualisierte Daten zu haben
        const updatedMandate = await prisma.mandate.findUnique({
          where: { id },
        });
        if (updatedMandate) {
          Object.assign(mandate, updatedMandate);
        }
      }
    } catch (error) {
      console.error("Fehler beim Abrufen des Dokumentstatus:", error);
      // Ignoriere Fehler und verwende vorhandene Daten
    }
  }

  return (
    <main className="min-h-screen bg-background-alt">
      {/* Header */}
      <header className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Logo size="sm" variant="icon" />
              <span className="font-semibold">Admin Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white/70 text-sm">{session.user?.email}</span>
              <AdminLogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/admin" className="inline-flex items-center text-text-muted hover:text-primary mb-6">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Zurück zur Übersicht
        </Link>

        {/* Header Card */}
        <Card variant="elevated" padding="lg" className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary mb-2">
                {mandate.vorname} {mandate.nachname}
              </h1>
              <p className="text-text-muted">{mandate.email}</p>
            </div>
            <MandateStatusBadge status={mandate.status} />
          </div>
        </Card>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Personal Data */}
          <Card variant="elevated" padding="lg">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Persönliche Daten
            </h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-text-muted">Name</dt>
                <dd className="font-medium">{mandate.vorname} {mandate.nachname}</dd>
              </div>
              <div>
                <dt className="text-sm text-text-muted">E-Mail</dt>
                <dd className="font-medium">{mandate.email}</dd>
              </div>
              <div>
                <dt className="text-sm text-text-muted">Telefon</dt>
                <dd className="font-medium">{mandate.telefon || "Nicht angegeben"}</dd>
              </div>
              <div>
                <dt className="text-sm text-text-muted">Geburtsdatum</dt>
                <dd className="font-medium">
                  {mandate.geburtsdatum.toLocaleDateString("de-DE")}
                </dd>
              </div>
            </dl>
          </Card>

          {/* Address */}
          <Card variant="elevated" padding="lg">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Adresse
            </h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-text-muted">Straße</dt>
                <dd className="font-medium">{mandate.adresse}</dd>
              </div>
              <div>
                <dt className="text-sm text-text-muted">PLZ / Ort</dt>
                <dd className="font-medium">{mandate.plz} {mandate.wohnort}</dd>
              </div>
            </dl>
          </Card>

          {/* Account Data */}
          <Card variant="elevated" padding="lg">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Account-Daten
            </h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-text-muted">Instagram seit</dt>
                <dd className="font-medium">
                  {mandate.instagramAccountDatum
                    ? mandate.instagramAccountDatum.toLocaleDateString("de-DE")
                    : "Nicht angegeben"}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-text-muted">Facebook seit</dt>
                <dd className="font-medium">
                  {mandate.facebookAccountDatum
                    ? mandate.facebookAccountDatum.toLocaleDateString("de-DE")
                    : "Nicht angegeben"}
                </dd>
              </div>
            </dl>
          </Card>

          {/* Insurance */}
          <Card variant="elevated" padding="lg">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Rechtschutzversicherung
            </h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-text-muted">Versicherer</dt>
                <dd className="font-medium">{mandate.versicherer || "Nicht angegeben"}</dd>
              </div>
              <div>
                <dt className="text-sm text-text-muted">Versicherungsnummer</dt>
                <dd className="font-medium font-mono bg-background-alt px-3 py-2 rounded">
                  {mandate.versicherungsnummer || "Nicht angegeben"}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-text-muted">Abschlussdatum</dt>
                <dd className="font-medium">
                  {mandate.versicherungsAbschlussdatum
                    ? mandate.versicherungsAbschlussdatum.toLocaleDateString("de-DE")
                    : "Nicht angegeben"}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-text-muted">Versicherungsnehmer</dt>
                <dd className="font-medium">
                  {mandate.versicherungsnehmer 
                    ? mandate.versicherungsnehmer 
                    : <span className="text-success">Selbst (Antragsteller)</span>}
                </dd>
              </div>
              {mandate.versicherungsnehmer && mandate.versicherungsnehmerVerhaeltnis && (
                <div>
                  <dt className="text-sm text-text-muted">Verhältnis zum Versicherungsnehmer</dt>
                  <dd className="font-medium">{mandate.versicherungsnehmerVerhaeltnis}</dd>
                </div>
              )}
            </dl>
          </Card>
        </div>

        {/* Signierte Vollmacht */}
        {(mandate.vollmachtSignedAt || isDocumentCompleted) ? (
          <Card variant="elevated" padding="lg" className="mb-6 border-2 border-success/20">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Signierte Vollmacht
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Signiert
                </span>
                <span className="text-text-muted">
                  am {mandate.vollmachtSignedAt
                    ? mandate.vollmachtSignedAt.toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "unbekannt"}
                </span>
              </div>
              <div className="flex gap-3">
                <a
                  href={`/api/admin/mandate/${mandate.id}/vollmacht`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark font-medium transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Vollmacht öffnen
                </a>
                <a
                  href={`/api/admin/mandate/${mandate.id}/vollmacht`}
                  download={`Vollmacht-${mandate.vorname}-${mandate.nachname}.pdf`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-background-alt border border-border rounded-lg hover:bg-background font-medium transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Herunterladen
                </a>
              </div>
            </div>
          </Card>
        ) : (
          <Card variant="outlined" padding="lg" className="mb-6">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Signierte Vollmacht
            </h2>
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Vollmacht wurde noch nicht signiert
            </div>
          </Card>
        )}

        {/* Status Update */}
        <Card variant="elevated" padding="lg" className="mb-6">
          <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Status ändern
          </h2>
          <StatusUpdateForm mandateId={mandate.id} currentStatus={mandate.status} />
        </Card>

        {/* Meta Info */}
        <Card variant="outlined" padding="md">
          <div className="flex items-center justify-between text-sm text-text-muted">
            <span>
              Erstellt am: {mandate.createdAt.toLocaleDateString("de-DE")} um{" "}
              {mandate.createdAt.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
            </span>
            <span>
              Zuletzt geändert: {mandate.updatedAt.toLocaleDateString("de-DE")} um{" "}
              {mandate.updatedAt.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </Card>
      </div>
    </main>
  );
}

