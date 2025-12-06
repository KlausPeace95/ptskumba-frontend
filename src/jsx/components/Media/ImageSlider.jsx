import React, { useEffect, useRef } from 'react';

export default function ImageSlider({ images = [], intervalMs = 3500, height = 360 }) {
  const idxRef = useRef(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!containerRef.current || images.length === 0) return;
      idxRef.current = (idxRef.current + 1) % images.length;
      const offset = idxRef.current * 100;
      containerRef.current.style.transform = `translateX(-${offset}%)`;
    }, intervalMs);
    return () => clearInterval(timer);
  }, [images, intervalMs]);

  if (!images.length) return null;

  return (
    <div className="overflow-hidden rounded-4 shadow-sm" style={{height}}>
      <div ref={containerRef} className="d-flex transition-all" style={{width: `${images.length * 100}%`, transition: 'transform 600ms ease'}}> 
        {images.map((src, i) => (
          <div key={i} style={{width:'100%'}} className="flex-shrink-0">
            <img src={src} alt={`slide-${i}`} style={{objectFit:'cover', width:'100%', height:'100%'}}/>
          </div>
        ))}
      </div>
    </div>
  );
}


