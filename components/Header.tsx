import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white py-3 border-bottom sticky-top shadow-sm">
      <div className="container d-flex flex-wrap justify-content-between align-items-center">
        <h1 className="m-0 h4 fw-bold text-dark">
          <Link href="/" className="text-dark text-decoration-none d-flex align-items-center">
            <span className="me-2 fs-4">🏡</span> Neue Wohnformen e.V.
          </Link>
        </h1>
        <nav className="mt-3 mt-md-0 d-flex flex-wrap gap-2 justify-content-center">
          <Link href="/" className="btn btn-light rounded-pill px-4 text-nowrap fw-medium">Home</Link>
          <Link href="/aktuelles" className="btn btn-light rounded-pill px-4 text-nowrap fw-medium">Aktuelles</Link>
          <Link href="/about" className="btn btn-light rounded-pill px-4 text-nowrap fw-medium">Über uns</Link>
          <Link href="/kontakt" className="btn btn-primary rounded-pill px-4 text-nowrap shadow-sm fw-medium">Kontakt</Link>
          <Link href="/impressum" className="btn btn-light rounded-pill px-4 text-nowrap fw-medium">Impressum</Link>
        </nav>
      </div>
    </header>
  );
}
