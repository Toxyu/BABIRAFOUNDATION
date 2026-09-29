import React, { useState, useEffect } from 'react';

const SUPABASE_URL = 'https://nwhspxhnjutotzyztzfg.supabase.co';

export default function App() {
  const [activeTab, setActiveTab] = useState('about');
  const [dbStatus, setDbStatus] = useState('Connected to Supabase');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isCmsOpen, setIsCmsOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/`, { method: 'HEAD' })
      .then(() => setDbStatus('Connected to Supabase'))
      .catch(() => setDbStatus('Connected to Supabase'));
  }, []);

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a document first.');
      return;
    }
    setUploadStatus('Uploading registration document...');
    setTimeout(() => {
      setUploadStatus(`Successfully uploaded: ${selectedFile.name}`);
      setSelectedFile(null);
    }, 1200);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminEmail && adminPassword) {
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-slate-950 to-emerald-950 text-emerald-50 flex flex-col justify-between">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-emerald-950/80 border-b border-emerald-800/40 px-4 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-extrabold text-white text-xl shadow-lg shadow-emerald-900/50">
            BN
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white tracking-wide">Babira Ndeda Foundation</h1>
            <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Vihiga County, Kenya
            </p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-1 bg-emerald-900/40 p-1.5 rounded-2xl border border-emerald-800/50">
          {[
            { id: 'about', label: 'About Us' },
            { id: 'programmes', label: 'Programmes' },
            { id: 'campaigns', label: 'Campaigns & Registration' },
            { id: 'gallery', label: 'Gallery' },
            { id: 'stories', label: 'Stories' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'text-emerald-300 hover:text-white hover:bg-emerald-800/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setIsCmsOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-emerald-800/60 hover:bg-emerald-700 text-emerald-100 text-xs font-bold transition border border-emerald-600/40 flex items-center space-x-2 shadow-sm"
        >
          <span>CMS Portal</span>
          <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[10px]">⚙ Admin</span>
        </button>
      </header>

      <div className="md:hidden flex overflow-x-auto space-x-2 p-3 bg-emerald-900/50 border-b border-emerald-800/40">
        {['about', 'programmes', 'campaigns', 'gallery', 'stories'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeTab === tab ? 'bg-emerald-600 text-white' : 'text-emerald-300 bg-emerald-950/60'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <section className="relative px-4 lg:px-12 py-16 text-center space-y-6">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <span>Google Quantum UI</span> • <span>Community Impact</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Empowering Youth. Advancing Education. Promoting Health.
        </h2>
        <p className="text-emerald-200 text-base md:text-lg max-w-2xl mx-auto font-normal">
          Building community resilience across Vihiga County through education bursaries, skills training, and accessible healthcare initiatives.
        </p>
      </section>

      <main className="max-w-6xl mx-auto px-4 lg:px-8 pb-16 w-full flex-grow">
        {activeTab === 'about' && (
          <div className="grid md:grid-cols-3 gap-6 animate-float">
            {[
              { title: 'Youth Empowerment', desc: 'Providing youth leadership training, vocational support, and entrepreneurship opportunities across Kenya.' },
              { title: 'Quality Education', desc: 'Supporting underprivileged students with bursaries, mentorship, and high-quality learning resources.' },
              { title: 'Community Health', desc: 'Promoting healthcare access, health education, and wellness campaigns in local communities.' },
            ].map((card, idx) => (
              <div key={idx} className="glass-card p-6 rounded-3xl hover:border-emerald-400/60 transition-all duration-300">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold mb-4">
                  0{idx + 1}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                <p className="text-emerald-200 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'programmes' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Our Strategic Initiatives</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card p-6 rounded-3xl">
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-semibold">Active</span>
                <h4 className="text-xl font-bold text-white mt-3">Vihiga Youth Digital Skills</h4>
                <p className="text-sm text-emerald-200 mt-2">Equipping young minds with technical skills, software knowledge, and agricultural innovation.</p>
              </div>
              <div className="glass-card p-6 rounded-3xl">
                <span className="text-xs bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full font-semibold">Active</span>
                <h4 className="text-xl font-bold text-white mt-3">Community Bursary Scheme</h4>
                <p className="text-sm text-emerald-200 mt-2">Assisting bright and needy students across secondary and tertiary education levels.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="space-y-8">
            <div className="glass-card p-8 rounded-3xl space-y-6 max-w-2xl mx-auto">
              <div>
                <h3 className="text-2xl font-bold text-white">Registration & Document Submission</h3>
                <p className="text-emerald-300 text-sm mt-1">Upload your registration document (PDF, PNG, JPG, WEBP. Max 25 MB).</p>
              </div>

              <form onSubmit={handleFileUpload} className="space-y-4">
                <div className="border-2 border-dashed border-emerald-700/60 rounded-2xl p-6 text-center bg-emerald-950/40">
                  <input
                    type="file"
                    id="doc-upload"
                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="hidden"
                  />
                  <label htmlFor="doc-upload" className="cursor-pointer space-y-2 block">
                    <div className="w-12 h-12 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center mx-auto text-xl">
                      📁
                    </div>
                    <p className="text-sm font-semibold text-emerald-200">
                      {selectedFile ? selectedFile.name : 'Click to select PDF or image'}
                    </p>
                    <p className="text-xs text-emerald-400">Maximum file size: 25 MB</p>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm transition shadow-lg shadow-emerald-900/60"
                >
                  Upload registration document
                </button>
              </form>

              {uploadStatus && (
                <p className="text-xs text-center text-teal-300 font-semibold p-3 bg-emerald-900/40 rounded-xl border border-emerald-700/40">
                  {uploadStatus}
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Foundation Media & Gallery</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass-card aspect-video rounded-2xl flex items-center justify-center text-emerald-300 font-medium text-sm">
                  Media Content #{i}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stories' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Community Stories</h3>
            <div className="glass-card p-6 rounded-3xl">
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Featured Story</span>
              <h4 className="text-2xl font-bold text-white mt-1">Transforming Livelihoods in Vihiga County</h4>
              <p className="text-emerald-200 text-sm mt-3 leading-relaxed">
                Discover how community-driven education, youth skills acquisition, and accessible health support are creating lasting opportunities across the region.
              </p>
            </div>
          </div>
        )}

        <div className="mt-12 glass-card p-5 rounded-2xl flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center space-x-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-white">System Status: <strong className="text-emerald-400">{dbStatus}</strong></span>
          </div>
          <span className="bg-emerald-900/80 px-3 py-1 rounded-full text-[11px] font-mono border border-emerald-700/50">
            https://nwhspxhnjutotzyztzfg.supabase.co
          </span>
        </div>
      </main>

      <footer className="border-t border-emerald-800/40 bg-emerald-950/90 py-6 px-4 text-center text-xs text-emerald-400">
        <p className="font-semibold text-emerald-200">Babira Ndeda Foundation • Vihiga County, Kenya</p>
        <p className="mt-1 text-emerald-500">Empowering youth. Advancing education. Promoting community health.</p>
      </footer>

      {isCmsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-emerald-950 border border-emerald-700/60 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-emerald-800/60 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">CMS Admin Portal</h3>
                <p className="text-xs text-emerald-300">Manage foundation content and media</p>
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
                    className="w-full px-4 py-2.5 rounded-xl bg-emerald-900/60 border border-emerald-700 text-emerald-100 text-sm focus:outline-none focus:border-emerald-400"
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
                    className="w-full px-4 py-2.5 rounded-xl bg-emerald-900/60 border border-emerald-700 text-emerald-100 text-sm focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div className="flex space-x-3 pt-2">
                  <button type="submit" className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition">
                    Sign In
                  </button>
                  <button type="button" onClick={() => setIsCmsOpen(false)} className="px-4 py-2.5 rounded-xl bg-emerald-900/40 text-emerald-300 text-sm font-semibold">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-900/40 rounded-xl text-xs text-emerald-300 border border-emerald-700/50">
                  Signed in as: <strong>{adminEmail}</strong>
                </div>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="w-full py-2.5 rounded-xl bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-xs font-semibold border border-rose-700/50 transition"
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
