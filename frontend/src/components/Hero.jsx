import React from 'react';
export default function Hero() {
  return (
    <section className="relative w-full h-[90vh] overflow-hidden flex items-center justify-center bg-black">
      <video autoPlay loop muted playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover">
        <source src="/vihiga-nature.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 text-white text-center px-4">
        <h1 className="text-5xl font-bold">Babira Ndeda Foundation</h1>
        <p className="mt-4">Vihiga County, Kenya - Empowering youth, Advancing education</p>
      </div>
    </section>
  );
}
