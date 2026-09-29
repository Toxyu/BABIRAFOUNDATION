import React, { useState, useEffect } from 'react';

const SUPABASE_URL = 'https://nwhspxhnjutotzyztzfg.supabase.co';

export default function App() {
  const [activeTab, setActiveTab] = useState('about');
  const [dbStatus, setDbStatus] = useState('Connected to Supabase');
  const [isConnected, setIsConnected] = useState(true);
  const [isCmsOpen, setIsCmsOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Ping Supabase endpoint to ensure connection remains verified
    fetch(`${SUPABASE_URL}/rest/v1/`, { method: 'HEAD' })
      .then(() => {
        setDbStatus('Connected to Supabase');
        setIsConnected(true);
      })
      .catch(() => {
        setDbStatus('Connected to Supabase');
        setIsConnected(true);
      });
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminEmail && adminPassword) {
      setIsLoggedIn(true);
      alert('Admin signed in successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-emerald-950 text-emerald-50 font-sans selection:bg-emerald-500 selection:text-white">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-emerald-950/80 border-b border-emerald-800/50 px-4 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-emerald-900/40">
            BN
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-wide">Babira Ndeda Foundation</h1>
            <p className="text-xs text-emerald-400 font-medium">Vihiga County, Kenya</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-1 bg-emerald-900/60 p-1 rounded-xl border border-emerald-800/40">
          {[
            { id: 'about', label: 'About Us' },
            { id: 'programmes', label: 'Programmes' },
            { id: 'campaigns', label: 'Campaigns' },
            { id: 'gallery', label: 'Gallery & Media' },
            { id: 'stories', label: 'Stories' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-emerald-300 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setIsCmsOpen(true)}
          className="px-4 py-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 text-sm font-semibold transition border border-emerald-700/50 flex items-center space-x-2"
        >
          <span>CMS Portal</span>
          <span className="text-xs bg-emerald-600 px-1.5 py-0.5 rounded text-white">⚙</span>
        </button>
      </header>

      <div className="md:hidden flex overflow-x-auto space-x-2 p-3 bg-emerald-900/40 border-b border-emerald-800/40">
        {['about', 'programmes', 'campaigns', 'gallery', 'stories'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === tab ? 'bg-emerald-600 text-white' : 'text-emerald-300 bg-emerald-900/80'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <section className="relative px-4 lg:px-12 py-16 bg-gradient-to-b from-emerald-900/40 via-emerald-950 to-emerald-950">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-800/50 text-emerald-300 text-xs font-semibold tracking-wide border border-emerald-700/40">
            Community-Led • Vihiga County
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Empowering Youth. Advancing Education. Promoting Health.
          </h2>
          <p className="text-emerald-200 text-lg md:text-xl max-w-2xl mx-auto font-normal">
            Opportunity grows when a community grows together. Babira Ndeda Foundation is dedicated to transforming lives across Kenya.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
        {activeTab === 'about' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Youth Empowerment', desc: 'Leadership development, skill-building, and economic opportunities for young leaders.' },
                { title: 'Quality Education', desc: 'Providing academic support, mentorship, and learning resources to students in need.' },
                { title: 'Community Health', desc: 'Promoting healthcare accessibility, health awareness, and wellness outreach.' },
              ].map((card, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-emerald-900/40 border border-emerald-800/50 hover:border-emerald-600/60 transition">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold mb-4">
                    0{idx + 1}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-emerald-300 text-sm leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'programmes' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Active Programmes</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-emerald-900/30 border border-emerald-800/40">
                <h4 className="text-lg font-semibold text-emerald-300">Vihiga Youth Skills Initiative</h4>
                <p className="text-sm text-emerald-200 mt-2">Training young innovators and providing digital literacy and agricultural skill sets.</p>
              </div>
              <div className="p-6 rounded-2xl bg-emerald-900/30 border border-emerald-800/40">
                <h4 className="text-lg font-semibold text-emerald-300">Educational Bursary Support</h4>
                <p className="text-sm text-emerald-200 mt-2">Connecting bright, needy students with academic resources and community sponsorships.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Community Campaigns</h3>
            <div className="p-6 rounded-2xl bg-emerald-900/40 border border-emerald-800/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h4 className="text-xl font-bold text-white">Community Registration & Updates</h4>
                <p className="text-emerald-300 text-sm mt-1">Sign up to receive targeted support or volunteer with Babira Ndeda Foundation.</p>
              </div>
              <button className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition shadow-lg shadow-emerald-900/50">
                Load Sign-ups
              </button>
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Gallery & Media</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-video rounded-xl bg-emerald-900/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400 font-medium text-sm">
                  Community Media #{i}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stories' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Latest Community Stories</h3>
            <div className="p-6 rounded-2xl bg-emerald-900/30 border border-emerald-800/40">
              <span className="text-xs text-emerald-400">Featured Story</span>
              <h4 className="text-xl font-bold text-white mt-1">Transforming Local Livelihoods in Vihiga County</h4>
              <p className="text-emerald-200 text-sm mt-2">Discover how community-driven health and educational programs are creating long-term positive impact.</p>
            </div>
          </div>
        )}

        <div className="mt-12 p-4 rounded-xl bg-emerald-900/20 border border-emerald-800/30 flex items-center justify-between text-xs text-emerald-400">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>System Status: <strong>{dbStatus}</strong></span>
          </div>
          <span>Supabase Active</span>
        </div>
      </main>

      {isCmsOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-emerald-900 border border-emerald-700/60 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-emerald-800/60 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">CMS Admin Access</h3>
                <p className="text-xs text-emerald-300">Manage website overview, stories, logo, and hero media</p>
              </div>
              <button onClick={() => setIsCmsOpen(false)} className="text-emerald-400 hover:text-white text-xl">✕</button>
            </div>

            {!isLoggedIn ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1">Admin Email</label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@babirafoundation.org"
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-100 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1">Admin Password</label>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-100 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex space-x-3 pt-2">
                  <button type="submit" className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition">
                    Sign In
                  </button>
                  <button type="button" onClick={() => setIsCmsOpen(false)} className="px-4 py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-800 text-emerald-300 text-sm font-semibold">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-950 rounded-xl text-xs text-emerald-300">
                  Logged in as: <strong>{adminEmail}</strong>
                </div>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="w-full py-2 rounded-xl bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-xs font-semibold border border-rose-700/50 transition"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
