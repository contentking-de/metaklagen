import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { Logo, Card, Button } from "@/components/ui";
import AdminLogoutButton from "@/components/admin/LogoutButton";
import MandateStatusBadge from "@/components/admin/StatusBadge";
import { getDocumentStatus } from "@/lib/pandadoc";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const mandates = await prisma.mandate.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Prüfe Status für Mandate ohne vollmachtSignedAt aber mit pandadocDocumentId
  // Aktualisiere diese in der Datenbank, wenn sie signiert sind
  for (const mandate of mandates) {
    if (mandate.pandadocDocumentId && !mandate.vollmachtSignedAt) {
      try {
        const docStatus = await getDocumentStatus(mandate.pandadocDocumentId);
        if (docStatus.status === "document.completed") {
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
          const vollmachtDownloadUrl = `${baseUrl}/api/admin/mandate/${mandate.id}/vollmacht`;
          
          await prisma.mandate.update({
            where: { id: mandate.id },
            data: {
              signedVollmachtUrl: vollmachtDownloadUrl,
              vollmachtSignedAt: new Date(),
            },
          });
          
          // Aktualisiere lokales Objekt
          mandate.vollmachtSignedAt = new Date();
          mandate.signedVollmachtUrl = vollmachtDownloadUrl;
        }
      } catch (error) {
        console.error(`Fehler beim Prüfen des Status für Mandat ${mandate.id}:`, error);
        // Ignoriere Fehler und verwende vorhandene Daten
      }
    }
  }

  const stats = {
    total: mandates.length,
    neu: mandates.filter((m) => m.status === "NEU").length,
    inBearbeitung: mandates.filter((m) => m.status === "IN_BEARBEITUNG").length,
    abgeschlossen: mandates.filter((m) => m.status === "ABGESCHLOSSEN").length,
  };

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
              <Link
                href="/admin/passwort"
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Passwort ändern
              </Link>
              <AdminLogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card variant="elevated" padding="md">
            <div className="text-text-muted text-sm mb-1">Gesamt</div>
            <div className="text-3xl font-bold text-primary">{stats.total}</div>
          </Card>
          <Card variant="elevated" padding="md">
            <div className="text-text-muted text-sm mb-1">Neu</div>
            <div className="text-3xl font-bold text-accent">{stats.neu}</div>
          </Card>
          <Card variant="elevated" padding="md">
            <div className="text-text-muted text-sm mb-1">In Bearbeitung</div>
            <div className="text-3xl font-bold text-blue-500">{stats.inBearbeitung}</div>
          </Card>
          <Card variant="elevated" padding="md">
            <div className="text-text-muted text-sm mb-1">Abgeschlossen</div>
            <div className="text-3xl font-bold text-success">{stats.abgeschlossen}</div>
          </Card>
        </div>

        {/* Mandate List */}
        <Card variant="elevated" padding="none">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-primary">Mandate</h2>
          </div>

          {mandates.length === 0 ? (
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p>Noch keine Mandate vorhanden</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background-alt">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      E-Mail
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Versicherung
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Vollmacht
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Datum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Aktion
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mandates.map((mandate) => (
                    <tr key={mandate.id} className="hover:bg-background-alt/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-primary">
                          {mandate.vorname} {mandate.nachname}
                        </div>
                        <div className="text-sm text-text-muted">
                          {mandate.wohnort}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                        {mandate.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                        {mandate.versicherungsnummer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <MandateStatusBadge status={mandate.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {mandate.vollmachtSignedAt ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Signiert
                            </span>
                            {mandate.vollmachtSignedAt && (
                              <span className="text-xs text-text-muted">
                                {mandate.vollmachtSignedAt.toLocaleDateString("de-DE")}
                              </span>
                            )}
                            <a
                              href={`/api/admin/mandate/${mandate.id}/vollmacht`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent hover:text-accent-dark"
                              title="Signierte Vollmacht öffnen"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-border text-text-muted">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Ausstehend
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                        {mandate.createdAt.toLocaleDateString("de-DE")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/admin/mandate/${mandate.id}`}>
                          <Button variant="ghost" size="sm">
                            Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}

