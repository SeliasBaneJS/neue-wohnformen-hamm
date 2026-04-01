import { Metadata } from 'next';
import GrillpartyGame from '@/components/game/GrillpartyGame';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Grillparty Minispiel | Vicanus I',
  description: 'Ein kleines interaktives Minispiel für die Nachbarschaft am Kentroper Weg.',
};

export default function FunPage() {
  return (
    <main className="container-fluid py-4 min-vh-100 bg-light d-flex flex-column align-items-center">
      <div className="w-100" style={{ maxWidth: '1000px' }}>
        <header className="mb-4 text-center">
          <h1 className="display-5 fw-bold text-primary mb-2">
            <span className="fs-1 me-3">🌭</span> 
            Grillmeister am Kentroper Weg
          </h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
            Willkommen auf der Grillparty! Laufe durch den Garten von Vicanus I, triff deine Nachbarn und hol dir eine Wurst ab.
          </p>
        </header>

        <section className="shadow-lg rounded-4 overflow-hidden bg-white">
          <GrillpartyGame />
        </section>

        <footer className="mt-4 text-center text-muted small">
          <p>© {new Date().getFullYear()} Verein zur Förderung neuer Wohnformen in Hamm e. V.</p>
        </footer>
      </div>
    </main>
  );
}
