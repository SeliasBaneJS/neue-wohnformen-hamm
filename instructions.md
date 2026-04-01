# Projekt-Richtlinien (Antigravity Instructions)

Dieses Projekt unterliegt spezifischen Architekturentscheidungen. Bei allen Änderungen müssen diese Randbedingungen strikt eingehalten werden:

1. **Statischer Export (Static Site Generation)**
   Das Projekt ist **strikt statisch** und für ein Zero-Config Deployment ausgelegt.
   In Next.js ist der `output: 'export'` Modus aktiviert.
   **Folge:**
   - Keine serverseitigen Funktionen (`getServerSideProps`, Server Actions, API Routes).
   - Sitemap und alle dynamischen Seiten müssen beim Build-Prozess (`npm run build`) als statische Dateien gerendert werden (`export const dynamic = 'force-static'`).
   - **Deployment-Workflow (Netlify + GitHub):** Der Code liegt in einem GitHub-Repository. Bei jedem `git push` in den Hauptbranch zieht sich Netlify den Code, führt automatisch `npm run build` aus und liefert die fertigen HTML/CSS/JS Dateien aus dem `out/` Verzeichnis über sein CDN aus. Ein eigener Node.js Server in Produktion existiert nicht.
   - **Lokales Testen:** Wenn lokales Testen mit dynamischem Re-Build (Hot Reload) gewünscht ist, verwende `npm run dev`. Für die finale Prüfung ist `npm run build` (und anschließendes Serven des `out/` Ordners, z. B. auf Port 3000) der "Wahrheits-Check".

2. **Decap CMS**
   Inhalte werden primär über Markdown verwaltet (`content/pages/` und `content/news/`), welche durch Decap CMS im Browser editiert werden.

3. **Design-Standard**
   Premium-Anmutung mit Glassmorphism-Elementen, Bootstrap 5 + eigenen CSS-Klassen (`globals.css`) und Responsivität für alle Viewports.
