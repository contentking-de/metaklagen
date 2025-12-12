# Product Requirements Document (PRD)
## META Datenschutzklage Portal

---

## 1. Projektübersicht

### 1.1 Vision
Eine moderne, benutzerfreundliche Web-Plattform, die es Nutzern ermöglicht, unkompliziert ein Mandat bei einer Anwaltskanzlei für Datenschutzklagen gegen META (Facebook/Instagram) zu erteilen.

### 1.2 Zielsetzung
- Einfache und schnelle Mandatserteilung für Betroffene
- Automatisierte Datenerfassung und -verarbeitung
- Professionelle Außendarstellung der Kanzlei
- Rechtskonforme Abwicklung gemäß DSGVO

### 1.3 Stakeholder
- **Primär**: Nutzer von Instagram/Facebook, die ihre Datenschutzrechte durchsetzen wollen
- **Sekundär**: Kanzlei-Mitarbeiter zur Mandatsverwaltung
- **Tertiär**: Rechtsschutzversicherungen

---

## 2. Zielgruppe

### 2.1 Benutzer-Personas

#### Persona 1: Der besorgte Social-Media-Nutzer
- **Alter**: 25-45 Jahre
- **Situation**: Nutzt Facebook und/oder Instagram seit Jahren
- **Motivation**: Hat von Datenschutzverstößen erfahren und möchte Schadensersatz
- **Technisches Know-how**: Durchschnittlich
- **Erwartung**: Einfacher, verständlicher Prozess

#### Persona 2: Der informierte Verbraucher
- **Alter**: 35-55 Jahre
- **Situation**: Hat Rechtschutzversicherung, kennt seine Rechte
- **Motivation**: Möchte Ansprüche professionell durchsetzen
- **Technisches Know-how**: Gering bis durchschnittlich
- **Erwartung**: Seriöse, vertrauenswürdige Abwicklung

---

## 3. Funktionale Anforderungen

### 3.1 Öffentlicher Bereich

#### 3.1.1 Landingpage
- Hero-Bereich mit klarem Value Proposition
- Vorteile der Mandatserteilung
- Ablauf in 3-4 Schritten erklärt
- FAQ-Sektion
- Call-to-Action Buttons
- Vertrauenselemente (Kanzlei-Infos, Erfolgsquote)

#### 3.1.2 Mandatsformular
**Erfasste Daten:**
| Feld | Typ | Pflicht | Validierung |
|------|-----|---------|-------------|
| Vorname | Text | Ja | Min. 2 Zeichen |
| Nachname | Text | Ja | Min. 2 Zeichen |
| E-Mail | E-Mail | Ja | Gültiges Format |
| Telefon | Tel | Nein | - |
| Adresse | Text | Ja | Min. 5 Zeichen |
| PLZ | Text | Ja | 5 Ziffern |
| Wohnort | Text | Ja | Min. 2 Zeichen |
| Geburtsdatum | Datum | Ja | Min. 18 Jahre |
| Instagram-Account seit | Datum | Nein* | - |
| Facebook-Account seit | Datum | Nein* | - |
| Rechtschutzversicherung | Ja/Nein | Ja | - |
| Versicherungsnummer | Text | Bedingt** | - |

*Mindestens eines der beiden Account-Daten muss angegeben werden
**Pflicht, wenn Rechtschutzversicherung = Ja

**Logik:**
- Bei "Keine Rechtschutzversicherung" → Weiterleitung zu meta-klage.de
- Bei "Rechtschutzversicherung vorhanden" → Formular absenden

#### 3.1.3 Bestätigungsseite
- Erfolgsbestätigung nach Formular-Absendung
- Zusammenfassung der nächsten Schritte
- Kontaktmöglichkeiten

#### 3.1.4 Rechtliche Seiten
- Impressum (§5 TMG)
- Datenschutzerklärung (Art. 13 DSGVO)
- AGB / Mandatsvereinbarung
- Widerrufsbelehrung

### 3.2 Admin-Bereich

#### 3.2.1 Authentifizierung
- Sichere Login-Seite
- Session-basierte Authentifizierung
- Passwort-Hashing (bcrypt)

#### 3.2.2 Dashboard
- Übersicht aller eingegangenen Mandate
- Filterung nach Status
- Suchfunktion
- Export-Möglichkeit (optional)

#### 3.2.3 Mandate-Verwaltung
- Detailansicht einzelner Mandate
- Status-Änderung (Neu, In Bearbeitung, Abgeschlossen, Abgelehnt)
- Notizen (optional)

### 3.3 E-Mail-System

#### 3.3.1 Bestätigungs-E-Mail (an Nutzer)
- Trigger: Nach erfolgreicher Formular-Absendung
- Inhalt: Bestätigung, Zusammenfassung, nächste Schritte

#### 3.3.2 Benachrichtigung (an Kanzlei)
- Trigger: Nach erfolgreicher Formular-Absendung
- Inhalt: Alle erfassten Daten des neuen Mandats

---

## 4. Nicht-funktionale Anforderungen

### 4.1 Performance
- Ladezeit der Landingpage < 3 Sekunden
- Time to Interactive < 5 Sekunden
- Lighthouse Score > 90

### 4.2 Sicherheit
- HTTPS-Verschlüsselung
- CSRF-Schutz
- Rate Limiting für Formular
- Sichere Passwort-Speicherung
- DSGVO-konforme Datenspeicherung

### 4.3 Barrierefreiheit
- WCAG 2.1 Level AA
- Keyboard-Navigation
- Screen Reader kompatibel
- Ausreichende Farbkontraste

### 4.4 SEO
- Meta-Tags optimiert
- Strukturierte Daten
- Sitemap
- robots.txt

### 4.5 Responsivität
- Mobile-first Design
- Breakpoints: 640px, 768px, 1024px, 1280px
- Touch-optimierte Interaktionen

---

## 5. Technische Spezifikation

### 5.1 Tech-Stack

| Komponente | Technologie | Version |
|------------|-------------|---------|
| Framework | Next.js | 15.x |
| Sprache | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Datenbank | PostgreSQL (NEON) | - |
| ORM | Prisma | 7.x |
| E-Mail | Resend | - |
| Authentifizierung | NextAuth.js | 4.x |
| Validierung | Zod | 3.x |
| Formulare | React Hook Form | 7.x |
| Hosting | Vercel | - |

### 5.2 Datenmodell

```
Mandate
├── id: UUID (PK)
├── vorname: String
├── nachname: String
├── email: String
├── telefon: String?
├── adresse: String
├── plz: String
├── wohnort: String
├── geburtsdatum: DateTime
├── instagramAccountDatum: DateTime?
├── facebookAccountDatum: DateTime?
├── versicherungsnummer: String
├── status: Enum (NEU, IN_BEARBEITUNG, ABGESCHLOSSEN, ABGELEHNT)
├── createdAt: DateTime
└── updatedAt: DateTime

AdminUser
├── id: UUID (PK)
├── email: String (unique)
├── passwordHash: String
├── name: String?
└── createdAt: DateTime
```

### 5.3 API-Endpunkte

| Methode | Endpoint | Beschreibung | Auth |
|---------|----------|--------------|------|
| POST | /api/mandate | Neues Mandat erstellen | Nein |
| GET | /api/admin/mandate | Alle Mandate abrufen | Ja |
| GET | /api/admin/mandate/[id] | Einzelnes Mandat | Ja |
| PATCH | /api/admin/mandate/[id] | Status aktualisieren | Ja |
| POST | /api/auth/[...nextauth] | Authentifizierung | - |

---

## 6. Design-Spezifikation

### 6.1 Farbpalette

| Farbe | Hex | Verwendung |
|-------|-----|------------|
| Primary | #1e3a5f | Hauptfarbe, Texte, Header |
| Primary Dark | #152a45 | Hover-States, Footer |
| Primary Light | #2a4d7a | Akzente |
| Accent | #c9a227 | CTAs, Highlights |
| Accent Dark | #a8871f | Hover auf Accent |
| Background | #ffffff | Haupthintergrund |
| Background Alt | #f8f9fb | Sektionen |
| Text Muted | #5a6e82 | Sekundärer Text |
| Border | #e2e8f0 | Rahmen, Trennlinien |
| Success | #10b981 | Erfolgsmeldungen |
| Error | #ef4444 | Fehlermeldungen |

### 6.2 Typografie

| Element | Font | Gewicht | Größe |
|---------|------|---------|-------|
| H1 | DM Sans | Bold (700) | 48px |
| H2 | DM Sans | Semibold (600) | 36px |
| H3 | DM Sans | Semibold (600) | 24px |
| Body | DM Sans | Regular (400) | 16px |
| Small | DM Sans | Regular (400) | 14px |

### 6.3 Logo

Das Logo besteht aus:
1. **Icon**: Stilisiertes Schild mit integriertem Paragraphen-Symbol (§)
   - Schild: Primary Color (#1e3a5f)
   - Paragraph: Accent Color (#c9a227)
2. **Wortmarke**: "META Datenschutzklage"
   - "META" in Primary Color
   - "Datenschutzklage" in Accent Color

---

## 7. Seitenstruktur

```
/                       → Landingpage
/formular              → Mandatsformular
/bestaetigung          → Erfolgsseite nach Absendung
/impressum             → Impressum
/datenschutz           → Datenschutzerklärung
/agb                   → AGB / Mandatsvereinbarung
/widerruf              → Widerrufsbelehrung
/admin                 → Admin Dashboard (geschützt)
/admin/login           → Admin Login
/admin/mandate/[id]    → Mandate Detailansicht (geschützt)
```

---

## 8. Umgebungsvariablen

```env
DATABASE_URL           # NEON PostgreSQL Connection String
RESEND_API_KEY         # Resend API Key
NEXTAUTH_SECRET        # NextAuth Secret (min. 32 Zeichen)
NEXTAUTH_URL           # Basis-URL der Anwendung
KANZLEI_EMAIL          # E-Mail für Benachrichtigungen
```

---

## 9. Deployment

### 9.1 Hosting
- **Platform**: Vercel
- **Domain**: meta-datenschutzklage.de
- **SSL**: Automatisch via Vercel

### 9.2 CI/CD
- Automatisches Deployment bei Push auf `main`
- Preview Deployments für Pull Requests

### 9.3 Monitoring
- Vercel Analytics für Performance
- Error Tracking (optional: Sentry)

---

## 10. Meilensteine

| Phase | Beschreibung | Status |
|-------|--------------|--------|
| 1 | Projektsetup & Grundstruktur | ✅ Abgeschlossen |
| 2 | Datenbank & Schema | ✅ Abgeschlossen |
| 3 | UI-Komponenten | ✅ Abgeschlossen |
| 4 | Landingpage | 🔄 In Arbeit |
| 5 | Mandatsformular | ⏳ Ausstehend |
| 6 | E-Mail-Integration | ⏳ Ausstehend |
| 7 | Rechtliche Seiten | ⏳ Ausstehend |
| 8 | Admin-Bereich | ⏳ Ausstehend |
| 9 | Testing & Deployment | ⏳ Ausstehend |

---

## 11. Risiken & Mitigationen

| Risiko | Wahrscheinlichkeit | Auswirkung | Mitigation |
|--------|-------------------|------------|------------|
| DSGVO-Verstöße | Mittel | Hoch | Rechtliche Prüfung vor Launch |
| E-Mail-Deliverability | Niedrig | Mittel | Verifizierte Domain bei Resend |
| Datenverlust | Niedrig | Hoch | Regelmäßige DB-Backups bei NEON |
| Hohe Last | Niedrig | Mittel | Vercel Auto-Scaling |

---

## 12. Anhang

### 12.1 Glossar
- **DSGVO**: Datenschutz-Grundverordnung
- **META**: Mutterkonzern von Facebook und Instagram
- **RSV**: Rechtsschutzversicherung
- **Mandat**: Beauftragung eines Anwalts zur Rechtsvertretung

### 12.2 Referenzen
- [DSGVO Volltext](https://dsgvo-gesetz.de/)
- [Next.js Dokumentation](https://nextjs.org/docs)
- [Prisma Dokumentation](https://www.prisma.io/docs)
- [Resend Dokumentation](https://resend.com/docs)

