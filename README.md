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

## Hinweise

- Das Projekt ist strikt auf statischen Export ausgelegt. Kein eigener Node.js-Server in Produktion.
- Kontaktanfragen laufen über Netlify Forms.
- Der GitHub-Login für Decap CMS wird über `netlify/functions/auth.mjs` abgewickelt.
