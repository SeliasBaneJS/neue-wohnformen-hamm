# Neue Wohnformen Hamm

Statische Next.js-Website für den Verein zur Förderung neuer Wohnformen in Hamm e.V.

## Stack

- Next.js 16 mit App Router
- Statischer Export nach `out/`
- Bootstrap 5 plus projektspezifisches CSS in `app/globals.css`
- Markdown-Inhalte in `content/pages` und `content/news`
- Decap CMS unter `public/admin`
- Netlify für Deployment, Forms und GitHub-OAuth-Proxy

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Entwicklungsserver: `http://localhost:3000`

## Lokales Testen mit Netlify-Rewrites

Fuer die lokale Simulation der produktiven Netlify-Redirects und des `/portal/`-Proxys zur Chat-App:

```bash
npm run dev:netlify
```

Lokale URLs:

- Hauptseite: `http://localhost:8888/`
- Chat-Fallback unter bestehender Hauptseite: `http://localhost:8888/portal/`

Voraussetzung:

- Der Chat-Origin unter `https://chat.neue-wohnformen-hamm.de/portal/` muss erreichbar sein, weil Netlify lokal dorthin proxyt.

## Qualitätssicherung

```bash
npm run lint
npm run build
```

Für die Prüfung des statischen Exports:

```bash
npm run start
```

`npm run start` liefert den Ordner `out/` lokal als statische Website aus.

## Inhaltsverwaltung

- Seiteninhalte: `content/pages`
- Aktuelles: `content/news`
- CMS-Konfiguration: `public/admin/config.yml`
- Uploads: `public/images/uploads`

## Deployment

Netlify führt bei jedem Deployment `npm run build` aus und veröffentlicht den Inhalt von `out/`.

- Primäre Domain: `https://neue-wohnformen-hamm.de`
- Netlify-Subdomain: `https://neue-wohnformen-hamm.netlify.app`

Zusätzlich ist ein Proxy-Pfad fuer die Chat-App konfiguriert:

- `https://neue-wohnformen-hamm.de/portal/`
- `https://www.neue-wohnformen-hamm.de/portal/`

Die Redirect-Regeln dafuer stehen in [netlify.toml](d:/dev/neue%20wohnen/netlify.toml) und leiten auf `https://chat.neue-wohnformen-hamm.de/portal/` weiter.

## Hinweise

- Das Projekt ist strikt auf statischen Export ausgelegt. Kein eigener Node.js-Server in Produktion.
- Kontaktanfragen laufen über Netlify Forms.
- Der GitHub-Login für Decap CMS wird über `netlify/functions/auth.mjs` abgewickelt.
- Lokale Netlify-Artefakte wie `.netlify/` und `deno.lock` gehören nicht ins Repository.
