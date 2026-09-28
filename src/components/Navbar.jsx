import React, { useState } from 'react';

export default function Navbar({ onTabChange, activeTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Clean Unified Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('home')}>
            <div className="w-12 h-12 rounded-full bg-emerald-800 text-white font-black text-xl flex items-center justify-center shadow-md border-2 border-emerald-600">
              BNF
            </div>
            <div>
              <span className="text-lg md:text-xl font-extrabold text-emerald-950 tracking-tight block leading-tight">
                BABIRA NDEDA
              </span>
              <span className="text-xs font-semibold text-emerald-700 tracking-widest uppercase block">
                FOUNDATION
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {['programmes', 'stories', 'announcements', 'campaigns'].map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`text-sm font-semibold capitalize transition-colors duration-200 ${
                  activeTab === tab ? 'text-emerald-700 border-b-2 border-emerald-600 pb-1' : 'text-gray-600 hover:text-emerald-800'
                }`}
              >
                {tab}
              </button>
            ))}
            
            <button
              onClick={() => onTabChange('cms')}
              className="px-4 py-2 bg-emerald-900 text-white text-sm font-semibold rounded-xl hover:bg-emerald-800 transition-all shadow-md"
            >
              CMS Portal
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-emerald-900 p-2 focus:outline-none"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-emerald-100 px-4 pt-2 pb-4 space-y-2">
          {['programmes', 'stories', 'announcements', 'campaigns'].map((tab) => (
            <button
              key={tab}
              onClick={() => { onTabChange(tab); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-900"
            >
              {tab.toUpperCase()}
            </button>
          ))}
          <button
            onClick={() => { onTabChange('cms'); setMobileMenuOpen(false); }}
            className="block w-full text-center px-3 py-2.5 bg-emerald-900 text-white rounded-xl font-semibold mt-2"
          >
            CMS PORTAL
          </button>
        </div>
      )}
    </nav>
  );
}
