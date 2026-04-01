# Projekt-Richtlinien (Antigravity Instructions)

Dieses Projekt unterliegt spezifischen Architekturentscheidungen. Bei allen Änderungen müssen diese Randbedingungen strikt eingehalten werden:

1. **Statischer Export (Static Site Generation)**
   Das Projekt ist **strikt statisch** und für ein Zero-Config Deployment ausgelegt.
   In Next.js ist der `output: 'export'` Modus aktiviert.
   **Folge:**
   - Keine serverseitigen Funktionen (`getServerSideProps`, Server Actions, API Routes).
   - Sitemap und alle dynamischen Seiten müssen beim Build-Prozess (`npm run build`) als statische Dateien gerendert werden (`export const dynamic = 'force-static'`).
   - **Deployment-Workflow (Netlify + GitHub):** Der Code liegt in einem GitHub-Repository. Bei jedem `git push` in den Hauptbranch zieht sich Netlify den Code, führt automatisch `npm run build` aus und liefert die fertigen HTML/CSS/JS Dateien aus dem `out/` Verzeichnis über sein CDN aus. Ein eigener Node.js Server in Produktion existiert nicht.
   - **Lokales Testen:** Wenn lokales Testen mit dynamischem Re-Build (Hot Reload) gewünscht ist, verwende `npm run dev`. Für die finale Prüfung ist `npm run build` und anschließend `npm run start` der "Wahrheits-Check".
   - **Verboten:** `next start` ist für dieses Projekt kein gültiger Produktions- oder Test-Workflow.

2. **Decap CMS**
   Inhalte werden primär über Markdown verwaltet (`content/pages/` und `content/news/`), welche durch Decap CMS im Browser editiert werden.
   - Frontmatter-Felder in Markdown und Felder in `public/admin/config.yml` müssen zueinander passen.
   - Pflichtinhalte dürfen nicht durch UI-Fallbacks wie `Loading...` kaschiert werden. Fehlende Inhalte müssen über `notFound()` oder einen klaren Build-Fehler auffallen.
   - Hilfsfunktionen für Markdown und CMS-nahe Datenstrukturen müssen typisiert bleiben. Kein neues `any` in diesem Bereich.

3. **Domain, SEO und Metadaten**
   - Die produktive Primärdomain ist `https://neue-wohnformen-hamm.de`.
   - Die Domain darf im Code nicht mehrfach frei verteilt hart verdrahtet werden. Änderungen an der Basis-URL laufen zentral über `lib/site.ts`.
   - Davon abgeleitete Stellen wie Metadaten, Sitemap, `robots.txt` und Decap-CMS-Konfiguration müssen konsistent gehalten werden.

4. **Mobile UX und Spielsteuerung**
   - Mobile Bedienbarkeit ist Pflicht, insbesondere für `/fun`.
   - Touch-Nutzer dürfen nicht auf präzises Tippen kleiner Ziele angewiesen sein, wenn die Aktion spielentscheidend ist. Wichtige Aktionen brauchen klar erreichbare Mobile-Buttons.
   - Das Jump-and-Run im Grillparty-Spiel wird auf Mobilgeräten im Querformat gespielt. Portrait-Modus muss dort abgefangen und mit einer klaren Rotate-Aufforderung blockiert werden.
   - Änderungen an Mobile-Layouts, Touch-Steuerung oder Orientation-Verhalten müssen immer auch in `public/test-mobile.html` nachvollziehbar testbar gemacht werden, und zwar für Hoch- und Querformat.

5. **Design-Standard**
   Premium-Anmutung mit Glassmorphism-Elementen, Bootstrap 5 + eigenen CSS-Klassen (`globals.css`) und Responsivität für alle Viewports.

6. **Pflicht-Verifikation vor Abschluss**
   - Nach Codeänderungen mindestens `npm run lint` und `npm run build` ausführen.
   - Bei Änderungen an Domain, SEO, Routing oder statischen Ausgaben zusätzlich `npm run start` gegen den exportierten `out/` Stand prüfen.
   - Bei Änderungen an Mobile-UX oder Spielsteuerung zusätzlich die Vorschau in `public/test-mobile.html` und die relevanten Portrait-/Landscape-Fälle prüfen.
