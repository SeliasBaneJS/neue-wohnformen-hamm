'use client';

import { useState, useEffect } from 'react';

export default function HeroSection({ title, subtitle, images }: { title: string, subtitle: string, images?: string[] }) {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 7000); // 7 seconds (not too fast)
    return () => clearInterval(timer);
  }, [images]);

  const bgStyle = images && images.length > 0 ? { backgroundImage: `url('${images[currentIdx]}')` } : {};

  return (
    <section className="hero-image-bg text-white text-center" style={bgStyle}>
      <div className="hero-overlay"></div>
      <div className="container py-4 py-md-5 hero-content">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="glass-panel p-4 p-md-5 text-dark mx-auto shadow-lg" style={{ marginTop: '2rem' }}>
              <h2 className="display-4 fw-bold mb-4">{title}</h2>
              <p className="lead mb-4 fs-5">{subtitle}</p>
              <div className="d-flex justify-content-center gap-3 gap-md-4 mt-4 flex-wrap">
                <a href="/about" className="btn btn-primary btn-lg shadow-sm">Mehr erfahren</a>
                <a href="/aktuelles" className="btn btn-accent btn-lg shadow-sm">Aktuelles</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
