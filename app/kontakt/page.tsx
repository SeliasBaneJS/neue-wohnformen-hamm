import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontaktieren Sie den Verein zur Förderung neuer Wohnformen in Hamm e.V. — Wir freuen uns auf Ihre Anfrage zum Mehrgenerationenwohnen.",
  openGraph: {
    title: "Kontakt — Neue Wohnformen Hamm",
    description: "Nehmen Sie Kontakt mit uns auf — Fragen zum generationenübergreifenden Wohnen in Hamm.",
  },
};

export default function Kontakt() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm bg-white p-4 p-md-5">
              <h1 className="mb-2 fw-bold text-primary text-center">Kontakt</h1>
              <p className="text-center text-muted mb-5 fs-5">
                Haben Sie Fragen zu unserem Wohnprojekt? Schreiben Sie uns — wir freuen uns auf Ihre Nachricht!
              </p>

              <form name="kontakt" method="POST" data-netlify="true" action="/kontakt/danke">
                <input type="hidden" name="form-name" value="kontakt" />

                <div className="mb-4">
                  <label htmlFor="name" className="form-label fw-medium">Ihr Name</label>
                  <input type="text" className="form-control form-control-lg rounded-3" id="name" name="name" required placeholder="Max Mustermann" />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="form-label fw-medium">Ihre E-Mail-Adresse</label>
                  <input type="email" className="form-control form-control-lg rounded-3" id="email" name="email" required placeholder="max@beispiel.de" />
                </div>

                <div className="mb-4">
                  <label htmlFor="betreff" className="form-label fw-medium">Betreff</label>
                  <input type="text" className="form-control form-control-lg rounded-3" id="betreff" name="betreff" placeholder="z. B. Interesse am Wohnprojekt" />
                </div>

                <div className="mb-4">
                  <label htmlFor="nachricht" className="form-label fw-medium">Ihre Nachricht</label>
                  <textarea className="form-control form-control-lg rounded-3" id="nachricht" name="nachricht" rows={6} required placeholder="Schreiben Sie uns Ihr Anliegen..."></textarea>
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-primary btn-lg px-5 shadow-sm">Nachricht senden</button>
                </div>
              </form>

              <hr className="my-5" />
              <div className="text-center text-muted">
                <p className="mb-1 fs-5">Oder direkt per E-Mail:</p>
                <a href="mailto:etummers@web.de" className="text-primary fw-bold fs-5 text-decoration-none">etummers@web.de</a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
