# META Datenschutzklage Portal

Eine moderne Web-Applikation für die Mandatserfassung bei Datenschutzklagen gegen META (Facebook/Instagram).

## Tech-Stack

- **Framework**: Next.js 15 (App Router)
- **Sprache**: TypeScript
- **Styling**: Tailwind CSS 4
- **Datenbank**: PostgreSQL (NEON)
- **ORM**: Prisma 7
- **E-Mail**: Resend
- **Authentifizierung**: NextAuth.js

## Voraussetzungen

- Node.js 18+
- npm oder yarn
- NEON Datenbank Account
- Resend Account

## Installation

1. **Repository klonen und Abhängigkeiten installieren:**

```bash
cd meta-datenschutzklage
npm install
```

2. **Umgebungsvariablen einrichten:**

Kopiere `.env.example` zu `.env` und fülle die Werte aus:

```bash
cp .env.example .env
```

Erforderliche Variablen:
- `DATABASE_URL` - NEON PostgreSQL Connection String
- `RESEND_API_KEY` - Resend API Key
- `NEXTAUTH_SECRET` - Mindestens 32 Zeichen (z.B. `openssl rand -base64 32`)
- `NEXTAUTH_URL` - URL der Anwendung (z.B. `http://localhost:3000`)
- `KANZLEI_EMAIL` - E-Mail für Mandats-Benachrichtigungen

3. **Datenbank migrieren:**

```bash
npx prisma db push
```

4. **Admin-Benutzer erstellen:**

```bash
ADMIN_EMAIL="admin@kanzlei.de" ADMIN_PASSWORD="sicheres-passwort" npx tsx scripts/create-admin.ts
```

5. **Entwicklungsserver starten:**

```bash
npm run dev
```

Die Anwendung ist nun unter [http://localhost:3000](http://localhost:3000) erreichbar.

## Projektstruktur

```
meta-datenschutzklage/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landingpage
│   ├── formular/                 # Mandatsformular
│   ├── bestaetigung/            # Erfolgsseite
│   ├── admin/                    # Admin-Bereich
│   │   ├── login/               # Admin Login
│   │   └── mandate/[id]/        # Mandate Detailansicht
│   ├── impressum/               # Impressum
│   ├── datenschutz/             # Datenschutzerklärung
│   ├── agb/                     # AGB
│   ├── widerruf/                # Widerrufsbelehrung
│   └── api/                     # API Routes
│       ├── mandate/             # Formular-Submission
│       ├── admin/               # Admin CRUD
│       └── auth/                # NextAuth
├── components/
│   ├── ui/                      # UI Komponenten (Button, Input, Card, Logo)
│   ├── layout/                  # Header, Footer
│   └── admin/                   # Admin-Komponenten
├── lib/
│   ├── db.ts                    # Prisma Client
│   ├── email.ts                 # Resend Integration
│   ├── validations.ts           # Zod Schemas
│   └── auth.ts                  # NextAuth Config
├── prisma/
│   └── schema.prisma            # Datenbankschema
├── scripts/
│   └── create-admin.ts          # Admin-Erstellungsskript
└── PRD.md                       # Product Requirements Document
```

## Features

### Öffentlicher Bereich
- Moderne Landingpage mit Hero, Vorteilen, Ablauf und FAQ
- Multi-Step Mandatsformular mit Validierung
- Weiterleitung bei fehlender Rechtschutzversicherung
- Automatische Bestätigungs-E-Mails

### Admin-Bereich
- Sicherer Login mit Session-Management
- Dashboard mit Statistiken
- Mandate-Übersicht und -Verwaltung
- Status-Aktualisierung (Neu, In Bearbeitung, Abgeschlossen, Abgelehnt)

## Deployment

### Vercel (empfohlen)

1. Projekt bei Vercel importieren
2. Umgebungsvariablen in den Projekt-Einstellungen hinzufügen
3. Deployen

### Manuell

```bash
npm run build
npm start
```

## Rechtliche Hinweise

⚠️ **Wichtig**: Die rechtlichen Seiten (Impressum, Datenschutz, AGB, Widerruf) enthalten Platzhalter (`[Kanzleiname]`, `[Adresse]`, etc.), die vor dem produktiven Einsatz mit den tatsächlichen Daten der Kanzlei ersetzt werden müssen.

## Lizenz

Proprietär - Alle Rechte vorbehalten.
