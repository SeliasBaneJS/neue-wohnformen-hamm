'use client';

import { useState } from 'react';

export default function ImageCarousel({ images, id }: { images: string[], id: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;
  if (images.length === 1) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={images[0]} className="img-fluid rounded shadow-sm mb-4 w-100" style={{maxHeight: '500px', objectFit: 'cover'}} alt="Beitragsbild" />;
  }

  return (
    <div id={id} className="carousel slide mb-4 shadow-sm rounded overflow-hidden">
      <div className="carousel-indicators">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            className={idx === activeIndex ? "active" : ""}
            onClick={() => setActiveIndex(idx)}
            aria-label={`Slide ${idx + 1}`}
          ></button>
        ))}
      </div>
      <div className="carousel-inner bg-light text-center">
        {images.map((img, idx) => (
          <div key={idx} className={`carousel-item ${idx === activeIndex ? "active" : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} className="d-inline-block w-100" style={{ maxHeight: '500px', objectFit: 'contain', backgroundColor: '#e9ecef' }} alt={`Slide ${idx}`} />
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" onClick={() => setActiveIndex(activeIndex === 0 ? images.length - 1 : activeIndex - 1)}>
        <span className="carousel-control-prev-icon bg-dark bg-opacity-50 rounded-circle p-3" aria-hidden="true"></span>
        <span className="visually-hidden">Zurück</span>
      </button>
      <button className="carousel-control-next" type="button" onClick={() => setActiveIndex(activeIndex === images.length - 1 ? 0 : activeIndex + 1)}>
        <span className="carousel-control-next-icon bg-dark bg-opacity-50 rounded-circle p-3" aria-hidden="true"></span>
        <span className="visually-hidden">Weiter</span>
      </button>
    </div>
  );
}
