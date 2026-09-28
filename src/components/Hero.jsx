import React from 'react';

export default function Hero({ onExplore }) {
  return (
    <div className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden my-4 rounded-3xl shadow-2xl bg-emerald-950">
      
      {/* Continuous Looping Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover filter brightness-65 scale-105"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-drone-shot-of-a-lush-green-forest-41584-large.mp4" type="video/mp4" />
        Your browser does not support video background.
      </video>

      {/* Dark Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-black/40 to-black/20" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white space-y-6">
        <div className="inline-flex items-center space-x-2 bg-emerald-500/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-emerald-400/30">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-xs md:text-sm font-semibold tracking-wider text-emerald-200 uppercase">
            Vihiga County, Kenya
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight">
          BABIRA NDEDA FOUNDATION
        </h1>

        <p className="max-w-3xl mx-auto text-lg sm:text-2xl text-emerald-100 font-light leading-relaxed">
          Empowering youth. Advancing education. Promoting community health & sustainable agriculture across Kenya.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onExplore}
            className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-extrabold text-lg rounded-2xl shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Meet The Foundation ↓
          </button>
        </div>
      </div>
    </div>
  );
}
