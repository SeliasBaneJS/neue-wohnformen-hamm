'use client';

import { useState, useEffect } from 'react';

export type House = {
  image: string;
  title: string;
  text: string;
};

export default function HousesCarousel({ houses }: { houses: House[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto sliding effect
  useEffect(() => {
    if (!houses || houses.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current === houses.length - 1 ? 0 : current + 1));
    }, 6000); // 6 seconds per slide
    return () => clearInterval(interval);
  }, [houses]);

  if (!houses || houses.length === 0) return null;

  return (
    <section className="container py-5 mb-5 mt-4">
      <div className="text-center mb-5">
        <h2 className="display-6 fw-bold text-primary">Unsere Standorte</h2>
        <p className="text-muted fs-5">Lernen Sie unsere beiden Wohnprojekte kennen.</p>
      </div>

      <div className="card shadow-lg rounded-4 overflow-hidden border-0 bg-white">
        <div className="row g-0 align-items-center">
          
          {/* Images Side */}
          <div className="col-md-6 position-relative d-none d-md-block" style={{ height: '500px' }}>
            {houses.map((house, idx) => (
               <div 
                 key={"img-"+idx} 
                 className="position-absolute top-0 start-0 w-100 h-100"
                 style={{
                   opacity: idx === activeIndex ? 1 : 0,
                   transition: 'opacity 0.8s ease-in-out',
                 }}
               >
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img 
                   src={house.image} 
                   alt={house.title} 
                   className="w-100 h-100 object-fit-cover" 
                 />
               </div>
            ))}
          </div>
          
          {/* Image side - Mobile Fallback (Static height for mobile) */}
          <div className="col-12 position-relative d-block d-md-none" style={{ height: '300px' }}>
            {houses.map((house, idx) => (
               <div 
                 key={"img-mob-"+idx} 
                 className="position-absolute top-0 start-0 w-100 h-100"
                 style={{
                   opacity: idx === activeIndex ? 1 : 0,
                   transition: 'opacity 0.8s ease-in-out',
                 }}
               >
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img 
                   src={house.image} 
                   alt={house.title} 
                   className="w-100 h-100 object-fit-cover" 
                 />
               </div>
            ))}
          </div>

          {/* Texts Side */}
          <div className="col-md-6 p-4 p-md-5 d-flex flex-column justify-content-center">
             <div style={{ display: 'grid' }}>
                {houses.map((house, idx) => (
                  <div 
                    key={"txt-"+idx}
                    style={{
                      gridArea: '1 / 1',
                      opacity: idx === activeIndex ? 1 : 0,
                      visibility: idx === activeIndex ? 'visible' : 'hidden',
                      transition: 'all 0.8s ease-in-out',
                      transform: idx === activeIndex ? 'translateY(0)' : 'translateY(20px)',
                      pointerEvents: idx === activeIndex ? 'auto' : 'none',
                    }}
                  >
                    <h3 className="h2 fw-bold text-primary mb-3">{house.title}</h3>
                    <p className="fs-5 text-secondary lh-lg mb-0">{house.text}</p>
                  </div>
                ))}
             </div>
             
             {/* Indicators */}
             <div className="mt-4 pt-3 d-flex justify-content-center gap-2">
                {houses.map((_, idx) => (
                  <button
                    key={"btn-"+idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`btn rounded-circle p-0 ${idx === activeIndex ? 'bg-primary' : 'bg-secondary bg-opacity-25'}`}
                    style={{ width: '14px', height: '14px', transition: 'background-color 0.3s' }}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
             </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
