import { NextResponse } from "next/server";
import { createVollmachtDocument } from "@/lib/pandadoc";

/**
 * Test-Endpoint um zu prüfen, ob PandaDoc korrekt konfiguriert ist
 */
export async function GET() {
  const checks = {
    PANDADOC_API_KEY: !!process.env.PANDADOC_API_KEY,
    PANDADOC_API_KEY_LENGTH: process.env.PANDADOC_API_KEY?.length || 0,
    PANDADOC_TEMPLATE_UUID: !!process.env.PANDADOC_TEMPLATE_UUID,
    PANDADOC_TEMPLATE_UUID_VALUE: process.env.PANDADOC_TEMPLATE_UUID || "NICHT GESETZT",
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "NICHT GESETZT",
    PANDADOC_API_URL: process.env.PANDADOC_API_URL || "https://api.pandadoc.com/public/v1",
  };

  // Test: Versuche ein Test-Dokument zu erstellen
  let testResult: any = null;
  if (checks.PANDADOC_API_KEY) {
    try {
      console.log("Teste PandaDoc-Dokument-Erstellung...");
      const result = await createVollmachtDocument(
        "test-mandate-id",
        "Test",
        "User",
        "test@example.com"
      );
      testResult = {
        success: true,
        documentId: result.documentId,
        sessionId: result.sessionId,
      };
    } catch (error) {
      testResult = {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      };
    }
  }

  return NextResponse.json({
    message: "PandaDoc Konfigurations-Check",
    checks,
    testResult,
    status: checks.PANDADOC_API_KEY ? "OK" : "FEHLER: PANDADOC_API_KEY nicht gesetzt",
  });
}

