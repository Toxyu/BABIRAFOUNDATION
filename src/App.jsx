import React, { useState, useEffect } from 'react';

const ANNOUNCEMENTS = [
  "📢 Applications open for Vihiga County Youth Digital Skills & Entrepreneurship Intake!",
  "💡 Community Bursary Scheme allocations finalized for secondary and tertiary learners.",
  "🏥 Free community health outreach and hygiene awareness camp scheduled next month.",
  "🌱 Submissions open for local innovation & youth business grants."
];

export default function App() {
  const [activeTab, setActiveTab] = useState('about');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isCmsOpen, setIsCmsOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const tickerInterval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(tickerInterval);
  }, []);

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a document first.');
      return;
    }
    setUploadStatus('Processing application document...');
    setTimeout(() => {
      setUploadStatus(`Document "${selectedFile.name}" submitted successfully to Babira Ndeda Foundation.`);
      setSelectedFile(null);
    }, 1200);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminEmail && adminPassword) setIsLoggedIn(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans">
      <div className="bg-emerald-950/90 border-b border-emerald-800/60 py-2 px-4 text-xs font-semibold text-emerald-100 flex items-center justify-between z-50">
        <div className="flex items-center space-x-3 w-full overflow-hidden h-5">
          <span className="bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] uppercase shrink-0">UPDATES</span>
          <p className="text-emerald-200 truncate">{ANNOUNCEMENTS[tickerIndex]}</p>
        </div>
        <span className="text-[10px] text-emerald-400 shrink-0 hidden sm:block">Vihiga Hub</span>
      </div>

      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/90 border-b border-emerald-900/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 text-lg shadow-lg">
            BNF
          </div>
          <div>
            <h1 className="font-extrabold text-base text-white tracking-wide">Babira Ndeda Foundation</h1>
            <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Vihiga County, Kenya
            </p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-1 bg-emerald-950/60 p-1.5 rounded-2xl border border-emerald-800/40">
          {[
            { id: 'about', label: 'About Us' },
            { id: 'objectives', label: 'Objectives & Values' },
            { id: 'programmes', label: 'Programmes' },
            { id: 'campaigns', label: 'Applications' },
            { id: 'contact', label: 'Partnerships & Contact' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'text-emerald-300 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <button onClick={() => setIsCmsOpen(true)} className="px-4 py-2 rounded-xl bg-emerald-900/40 hover:bg-emerald-800 text-emerald-200 text-xs font-bold border border-emerald-700/50">
          Admin Portal
        </button>
      </header>

      <div className="md:hidden flex overflow-x-auto space-x-2 p-3 bg-slate-900 border-b border-emerald-900/50 text-xs">
        {['about', 'objectives', 'programmes', 'campaigns', 'contact'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1.5 rounded-lg font-bold capitalize whitespace-nowrap ${activeTab === tab ? 'bg-emerald-600 text-white' : 'text-emerald-300 bg-slate-950'}`}>
            {tab}
          </button>
        ))}
      </div>

      <main className="max-w-5xl mx-auto px-6 py-10 flex-grow w-full">
        {activeTab === 'about' && (
          <div className="space-y-10">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950 px-3.5 py-1 rounded-full border border-emerald-800">
                Empowering Youth • Advancing Education • Promoting Community Health
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white">Babira Ndeda Foundation</h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                A community-focused non-profit organization committed to improving the lives and opportunities of young people and vulnerable members of communities in Vihiga County, Kenya.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900/70 border border-emerald-900/60 p-6 rounded-3xl space-y-3">
                <h3 className="text-xl font-bold text-white">Our Vision</h3>
                <p className="text-xs text-slate-300 leading-relaxed">A healthy, educated, and economically empowered community where young people have the opportunity to reach their full potential.</p>
              </div>
              <div className="bg-slate-900/70 border border-emerald-900/60 p-6 rounded-3xl space-y-3">
                <h3 className="text-xl font-bold text-white">Our Mission</h3>
                <p className="text-xs text-slate-300 leading-relaxed">To empower young people and vulnerable communities in Vihiga County through education, skills development, economic opportunities, mentorship, and health support.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'objectives' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">Main Objectives & Core Values</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Empower young people with practical, entrepreneurial, digital, and vocational skills.",
                "Promote access to education and learning opportunities for vulnerable learners.",
                "Support career guidance, mentorship, and leadership development.",
                "Create awareness regarding preventive healthcare, hygiene, and healthy lifestyles."
              ].map((obj, i) => (
                <div key={i} className="bg-slate-900/60 border border-emerald-900/40 p-4 rounded-2xl text-xs text-slate-300">
                  <strong className="text-emerald-400">{i + 1}.</strong> {obj}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'programmes' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">Our Core Programme Areas</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {['Youth Empowerment', 'Education & Skills', 'Community Health'].map((prog, i) => (
                <div key={i} className="bg-slate-900/70 border border-emerald-900/60 p-6 rounded-3xl space-y-3">
                  <h3 className="text-lg font-bold text-white">{prog}</h3>
                  <p className="text-xs text-slate-300">Targeted regional interventions designed for high community impact across Vihiga County.</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="bg-slate-900/80 border border-emerald-900/60 p-8 rounded-3xl space-y-6">
              <h3 className="text-xl font-bold text-white">Document & Application Portal</h3>
              <form onSubmit={handleFileUpload} className="space-y-4">
                <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500" />
                <button type="submit" className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs">Submit Application</button>
              </form>
              {uploadStatus && <p className="text-xs text-center text-teal-300 font-semibold">{uploadStatus}</p>}
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="bg-slate-900/70 border border-emerald-900/60 p-6 rounded-3xl space-y-3 text-xs text-slate-300">
              <h3 className="text-lg font-bold text-white">Contact Information</h3>
              <p><strong>Organization:</strong> Babira Ndeda Foundation</p>
              <p><strong>Location:</strong> Vihiga County, Kenya</p>
              <p><strong>Email:</strong> info@babirandedafoundation.org</p>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-emerald-900/40 bg-slate-950 py-6 text-center text-xs text-slate-400">
        <p className="font-bold text-emerald-200">Babira Ndeda Foundation • Vihiga County, Kenya</p>
      </footer>

      {isCmsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Admin Login</h3>
              <button onClick={() => setIsCmsOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            {!isLoggedIn ? (
              <form onSubmit={handleLogin} className="space-y-3 text-xs">
                <input type="email" placeholder="Admin Email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} required className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-emerald-900 text-white" />
                <input type="password" placeholder="Password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} required className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-emerald-900 text-white" />
                <button type="submit" className="w-full py-2.5 rounded-lg bg-emerald-600 text-white font-bold">Sign In</button>
              </form>
            ) : (
              <p className="text-xs text-emerald-400">Logged in successfully as {adminEmail}.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
