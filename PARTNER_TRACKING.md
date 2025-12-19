# Partner-Tracking System

Dieses System ermöglicht es, Conversion-Tracking für Kooperationspartner zu implementieren. Pro Lead, den ein Partner vermittelt, erhält er 1 Euro.

## Funktionsweise

### 1. URL-Parameter-Tracking

Partner erhalten einen speziellen Tracking-Link mit ihrer eindeutigen Partner-ID:

```
https://meta-klage.de/formular?partner=PARTNER123
```

Wenn ein Besucher über diesen Link kommt:
- Die Partner-ID wird in `localStorage` gespeichert (für die gesamte Session)
- Beim Absenden des Formulars wird die Partner-ID automatisch mit dem Mandat verknüpft
- Der Referrer (Herkunfts-URL) wird ebenfalls gespeichert

### 2. Datenbank-Struktur

#### Partner-Modell
- `id`: Eindeutige ID
- `name`: Name des Partners
- `trackingId`: Eindeutige Tracking-ID (wird in der URL verwendet)
- `email`: Optional - E-Mail des Partners
- `active`: Status (aktiv/inaktiv)

#### Mandat-Erweiterung
- `partnerId`: Verknüpfung zum Partner
- `referrer`: Referrer-URL (falls vorhanden)

## Setup

### 1. Datenbank-Migration

Nach dem Update des Prisma-Schemas muss die Datenbank migriert werden:

```bash
npx prisma db push
npx prisma generate
```

### 2. Partner erstellen

Partner können über das Script erstellt werden:

```bash
npx tsx scripts/create-partner.ts "Partner Name" "PARTNER123" "partner@example.com"
```

Oder direkt in der Datenbank:

```sql
INSERT INTO partners (id, name, "trackingId", email, active, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Partner Name', 'PARTNER123', 'partner@example.com', true, NOW(), NOW());
```

### 3. Tracking-Link generieren

Der Tracking-Link für einen Partner hat folgendes Format:

```
https://meta-klage.de/formular?partner=<TRACKING_ID>
```

Beispiel:
```
https://meta-klage.de/formular?partner=PARTNER123
```

## Admin-Interface

### Partner-Statistiken

Unter `/admin/partner` können alle Partner-Statistiken eingesehen werden:

- **Gesamt Leads**: Anzahl aller Leads pro Partner
- **Abgeschlossen**: Anzahl abgeschlossener Mandate
- **Conversion-Rate**: Prozentsatz abgeschlossener Mandate
- **Geschätzter Ertrag**: Anzahl Leads × 1 Euro

### Tracking-Link Generator

Auf der Partner-Statistik-Seite gibt es einen Link-Generator, der alle Tracking-Links für alle Partner anzeigt und zum Kopieren bereitstellt.

## API-Endpunkte

### Partner-Statistiken abrufen

```
GET /api/admin/partner/stats
```

Gibt eine Liste aller Partner mit detaillierten Statistiken zurück.

### Partner verwalten

```
GET /api/admin/partner          # Alle Partner abrufen
POST /api/admin/partner         # Neuen Partner erstellen
PATCH /api/admin/partner/[id]   # Partner aktualisieren
DELETE /api/admin/partner/[id]  # Partner löschen
```

## Verwendung

### Für Partner

1. Partner erhält seinen Tracking-Link (z.B. `https://meta-klage.de/formular?partner=PARTNER123`)
2. Partner platziert den Link auf seiner Webseite
3. Wenn ein Besucher über den Link kommt und das Formular ausfüllt, wird der Lead automatisch dem Partner zugeordnet

### Für Admin

1. Partner über `/admin/partner` verwalten
2. Statistiken einsehen
3. Tracking-Links kopieren und an Partner weitergeben

## Technische Details

### Session-Persistenz

Die Partner-ID wird in `localStorage` gespeichert, damit sie auch nach Navigation zwischen Seiten erhalten bleibt. Nach erfolgreichem Absenden des Formulars wird sie entfernt.

### Validierung

- Die Partner-ID wird beim Erstellen des Mandats validiert
- Nur aktive Partner werden akzeptiert
- Ungültige Partner-IDs werden ignoriert (kein Fehler, aber auch keine Zuordnung)

### Referrer-Tracking

Zusätzlich zur Partner-ID wird auch der Referrer (Herkunfts-URL) gespeichert, falls verfügbar. Dies ermöglicht zusätzliche Analysen.

## Beispiel-Workflow

1. Partner "Beispiel GmbH" wird erstellt mit Tracking-ID "BEISPIEL123"
2. Partner erhält Link: `https://meta-klage.de/formular?partner=BEISPIEL123`
3. Partner platziert Link auf seiner Webseite
4. Besucher klickt auf Link → Partner-ID wird gespeichert
5. Besucher füllt Formular aus → Mandat wird mit Partner-ID erstellt
6. Admin sieht in `/admin/partner`: 1 Lead für "Beispiel GmbH", geschätzter Ertrag: 1 €
