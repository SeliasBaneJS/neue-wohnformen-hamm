import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-4 mt-auto">
      <div className="container">
        <p className="mb-2">&copy; {new Date().getFullYear()} Verein zur Förderung neuer Wohnformen in Hamm e.V. Alle Rechte vorbehalten.</p>
        <p className="mb-0 small text-muted">1. Vorsitzende: Edeltraud Tümmers | Kentroper Weg 60 a | 59063 Hamm</p>
        <div className="mt-2 text-muted small">
           <Link href="/about" className="text-muted text-decoration-none me-2">Über uns</Link> | 
           <Link href="/impressum" className="text-muted text-decoration-none ms-2">Impressum</Link>
        </div>
      </div>
    </footer>
  );
}
