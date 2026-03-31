import Link from 'next/link';

export default function Header() {
  return (
    <header className="navbar-custom text-white py-3 sticky-top">
      <div className="container d-flex flex-wrap justify-content-between align-items-center">
        <h1 className="m-0 h5 fw-bold">
          <Link href="/" className="text-white text-decoration-none d-flex align-items-center">
            <span className="me-2 fs-4">🏡</span> Verein für neue Wohnformen Hamm e.V.
          </Link>
        </h1>
        <nav className="mt-2 mt-md-0 d-flex gap-4">
          <Link href="/" className="text-white text-decoration-none fw-medium nav-link-custom">Home</Link>
          <Link href="/aktuelles" className="text-white text-decoration-none fw-medium nav-link-custom">Aktuelles</Link>
          <Link href="/about" className="text-white text-decoration-none fw-medium nav-link-custom">Über uns</Link>
          <Link href="/kontakt" className="text-white text-decoration-none fw-medium nav-link-custom">Kontakt</Link>
          <Link href="/impressum" className="text-white text-decoration-none fw-medium nav-link-custom">Impressum</Link>
        </nav>
      </div>
    </header>
  );
}
