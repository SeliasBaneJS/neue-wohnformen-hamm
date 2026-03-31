import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Danke() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-7 text-center">
            <div className="card border-0 shadow-sm bg-white p-5">
              <div className="fs-1 mb-4">✅</div>
              <h1 className="fw-bold text-primary mb-3">Vielen Dank!</h1>
              <p className="fs-5 text-muted mb-4">
                Ihre Nachricht wurde erfolgreich gesendet. Wir werden uns so schnell wie möglich bei Ihnen melden.
              </p>
              <div>
                <Link href="/" className="btn btn-primary btn-lg shadow-sm">Zurück zur Startseite</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
