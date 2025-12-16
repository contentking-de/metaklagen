import { NextResponse } from "next/server";

/**
 * Test-Endpoint um zu prüfen, ob PandaDoc korrekt konfiguriert ist
 */
export async function GET() {
  const checks = {
    PANDADOC_API_KEY: !!process.env.PANDADOC_API_KEY,
    PANDADOC_API_KEY_LENGTH: process.env.PANDADOC_API_KEY?.length || 0,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "NICHT GESETZT",
    PANDADOC_API_URL: process.env.PANDADOC_API_URL || "https://api.pandadoc.com/public/v1",
  };

  return NextResponse.json({
    message: "PandaDoc Konfigurations-Check",
    checks,
    status: checks.PANDADOC_API_KEY ? "OK" : "FEHLER: PANDADOC_API_KEY nicht gesetzt",
  });
}

