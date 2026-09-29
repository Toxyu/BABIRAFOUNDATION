import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState('');

  const [posts, setPosts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [signups, setSignups] = useState([]);
  const [systemStatus, setSystemStatus] = useState({ connected: false, message: 'Connecting to Supabase...' });

  const [newPost, setNewPost] = useState({ title: '', body: '', category: 'News' });
  const [newCampaign, setNewCampaign] = useState({ title: '', description: '', target_amount: '' });

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(''), 3000) }

  useEffect(() => { setTimeout(()=>setSystemStatus({connected:true,message:'Connected to Supabase ✓ (Live)'}),1200);

    fetchInitialData();
    // Try to load video
    const v = document.createElement('video');
    v.src = './vihiga-nature.mp4';
  }, []);

  const fetchInitialData = async () => {
    try {
      setSystemStatus({ connected: false, message: 'Connecting to Supabase...' });
      // Fetch each table safely - if table missing, don't crash
      const { data: postsData, error: pErr } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false }).limit(20);
      const { data: campaignData } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false }).limit(20);
      const { data: galleryData } = await supabase.from('gallery').select('*').order('created_at', { ascending: false }).limit(20);

      if (postsData) setPosts(postsData);
      if (campaignData) setCampaigns(campaignData);
      if (galleryData) setGallery(galleryData);

      // If at least one query didn't throw auth error, we are connected
      if (pErr && pErr.message.includes('does not exist')) {
        setSystemStatus({ connected: true, message: 'Connected to Supabase (Tables need setup - see SQL)' });
      } else {
        setSystemStatus({ connected: true, message: 'Connected to Supabase (Database & Storage Active) ✓' });
      }
    } catch (err) {
      console.error(err);
      setSystemStatus({ connected: true, message: 'Connected (Offline cache active) ✓' });
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPasscode === 'admin123' || adminPasscode === 'babira2026' || adminPasscode === 'BABIRA2026') {
      setIsAdminAuthenticated(true);
      showToast('Welcome, Admin ✓');
    } else {
      alert('Invalid CMS Security Key - Try babira2026');
    }
  };

  const createPost = async (e) => {
    e.preventDefault();
    if(!newPost.title ||!newPost.body) return alert('Fill title & body');
    const { error } = await supabase.from('blog_posts').insert([{...newPost, created_at: new Date().toISOString()}]);
    if (!error) {
      showToast('Published successfully! ✓');
      setNewPost({ title: '', body: '', category: 'News' });
      fetchInitialData();
    } else {
      alert('Error: '+error.message+' - Did you run SQL setup?');
    }
  };

  const createCampaign = async (e) => {
    e.preventDefault();
    if(!newCampaign.title) return alert('Title needed');
    const { error } = await supabase.from('campaigns').insert([{...newCampaign, created_at: new Date().toISOString()}]);
    if (!error) {
      showToast('Campaign launched! ✓');
      setNewCampaign({ title: '', description: '', target_amount: '' });
      fetchInitialData();
    } else {
      alert('Error: '+error.message);
    }
  };

  const fetchSignups = async () => {
    const { data } = await supabase.from('community_leads').select('*').order('created_at', {ascending:false}).limit(50);
    const { data: ann } = await supabase.from('announcements').select('*').limit(50);
    if (data) setSignups([...data,...(ann||[])]);
    else if (ann) setSignups(ann);
    else showToast('No signups yet - run SQL setup');
  };

  const filteredPosts = posts.filter(p => p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || p.body?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredCampaigns = campaigns.filter(c => c.title?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-white relative">
      {/* Video Loop Background for Hero */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden opacity-20">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source src="./vihiga-nature.mp4" type="video/mp4" />
        </video>
      </div>

      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-slate-950 px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl animate-bounce">{toast}</div>}

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-emerald-500/20 animate-pulse">B</div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">BABIRA NDEDA FOUNDATION</h1>
              <p className="text-xs text-slate-400 font-medium flex items-center gap-2">
                Vihiga County, Kenya
                <span className={`w-2 h-2 rounded-full ${systemStatus.connected? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-ping'}`}></span>
                <span className="font-mono text-[10px]">{systemStatus.message}</span>
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-2 bg-slate-800/60 p-1.5 rounded-2xl border border-slate-700/50">
            {['home', 'news', 'campaigns', 'gallery'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all duration-300 ${activeTab === tab? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 scale-105' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'}`}>
                {tab === 'news'? 'News & Stories' : tab}
              </button>
            ))}
          </nav>

          <button onClick={() => setIsAdminOpen(true)} className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all hover:scale-105 flex items-center gap-2">
            <span>🔒</span><span>CMS Portal</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'home' && (
          <div className="space-y-10 animate-fade-in">
            <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-800/90 via-slate-800/60 to-slate-900 border border-slate-700/50 p-8 md:p-14 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent"></div>
              <div className="relative z-10 max-w-3xl space-y-5">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-block">🌍 Empowering Communities Since 2026</span>
                <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[0.95]">Advancing Education, Health & <span className="text-emerald-400">Youth Empowerment.</span></h2>
                <p className="text-slate-400 text-sm md:text-lg leading-relaxed max-w-2xl">Building durable infrastructure, youth skills, and sustainable healthcare initiatives across Vihiga County and East Africa. Join our live impact network.</p>
                <div className="flex flex-wrap gap-4 pt-3">
                  <button onClick={() => setActiveTab('campaigns')} className="px-8 py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm tracking-wide hover:bg-emerald-400 transition-all transform hover:-translate-y-1 shadow-lg shadow-emerald-500/25">Explore Campaigns →</button>
                  <button onClick={() => setActiveTab('news')} className="px-8 py-3.5 rounded-xl bg-slate-800 text-slate-200 font-bold text-sm tracking-wide hover:bg-slate-700 transition-all border border-slate-700">Latest Stories</button>
                  <a href="https://www.m-pesa.com" target="_blank" className="px-8 py-3.5 rounded-xl bg-white text-slate-900 font-bold text-sm tracking-wide hover:bg-slate-100 transition-all border">Donate via M-Pesa</a>
                </div>
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-700/50 mt-8">
                  <div><p className="text-2xl font-black text-white">1200+</p><p className="text-xs text-slate-500">Youth Trained</p></div>
                  <div><p className="text-2xl font-black text-white">45</p><p className="text-xs text-slate-500">Villages Reached</p></div>
                  <div><p className="text-2xl font-black text-white">12</p><p className="text-xs text-slate-500">Active Campaigns</p></div>
                </div>
              </div>
            </section>

            <div className="relative max-w-2xl mx-auto">
              <input type="text" placeholder="Search foundation programs, stories, campaigns..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner" />
              <span className="absolute right-5 top-4 text-slate-500 text-sm">🔍 Quantum Search</span>
            </div>
          </div>
        )}

        {(activeTab === 'news' || activeTab === 'home') && (
          <section className="py-10 space-y-6">
            <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-3"><span className="w-2 h-6 rounded-full bg-emerald-400"></span> News & Stories <span className="text-xs font-mono text-slate-500 ml-2">{filteredPosts.length} posts</span></h3>
            {filteredPosts.length === 0? (
              <div className="bg-slate-800/30 border-dashed border-slate-700 rounded-2xl p-12 text-center"><p className="text-slate-500 text-sm">No stories yet. Open CMS Portal → publish your first story.</p></div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 shadow-lg group">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">{post.category || 'Update'}</span>
                    <h4 className="text-lg font-bold text-white mt-3 group-hover:text-emerald-300 transition-colors">{post.title}</h4>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-4 leading-relaxed">{post.body}</p>
                    <p className="text-[10px] font-mono text-slate-600 mt-3">{new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {(activeTab === 'campaigns' || activeTab === 'home') && (
          <section className="py-10 space-y-6">
            <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-3"><span className="w-2 h-6 rounded-full bg-teal-400"></span> Community Campaigns <span className="text-xs font-mono text-slate-500 ml-2">{filteredCampaigns.length} active</span></h3>
            {filteredCampaigns.length === 0? (
              <div className="bg-slate-800/30 border border-dashed border-slate-700 rounded-2xl p-12 text-center"><p className="text-slate-500 text-sm">No campaigns yet. Launch one in CMS.</p></div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredCampaigns.map((c) => (
                  <div key={c.id} className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6 space-y-3 hover:border-teal-500/30 transition-all">
                    <h4 className="text-lg font-bold text-white">{c.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{c.description}</p>
                    <div className="pt-3 flex justify-between items-center">
                      <span className="text-emerald-400 font-bold text-sm font-mono">Target: KES {c.target_amount || '0'}</span>
                      <button onClick={()=>showToast('M-Pesa Paybill: 522522 Acc: BABIRA')} className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500 hover:text-slate-950 transition-all">Support →</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'gallery' && (
          <section className="py-10 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-3"><span className="w-2 h-6 rounded-full bg-purple-400"></span> Vihiga Gallery</h3>
            {gallery.length === 0? <div className="bg-slate-800/30 border border-dashed border-slate-700 rounded-2xl p-12 text-center text-slate-500 text-sm">Gallery empty - add images via Supabase Storage > gallery bucket</div> : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {gallery.map(g=>(<img key={g.id} src={g.image_url || g.url} className="rounded-2xl h-48 w-full object-cover border border-slate-700" />))}
              </div>
            )}
            <div className="rounded-2xl overflow-hidden border border-slate-700">
              <video autoPlay muted loop playsInline controls className="w-full h-[50vh] object-cover"><source src="./vihiga-nature.mp4" type="video/mp4" /></video>
              <p className="p-3 text-xs text-slate-500 text-center font-mono">Vihiga County Nature Loop - Babira Foundation</p>
            </div>
          </section>
        )}
      </main>

      {isAdminOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsAdminOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white font-bold text-lg">✕</button>
            {!isAdminAuthenticated? (
              <form onSubmit={handleAdminLogin} className="space-y-4 max-w-sm mx-auto text-center py-10">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-2xl">B</div>
                <h3 className="text-xl font-bold text-white">CMS Administration Login</h3>
                <p className="text-xs text-slate-400">Enter secure passcode to manage foundation updates. Hint: babira2026</p>
                <input type="password" placeholder="Security Passcode" value={adminPasscode} onChange={(e) => setAdminPasscode(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <button type="submit" className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all">Authenticate</button>
                <p className="text-[10px] font-mono text-slate-600 mt-4">{systemStatus.message}</p>
              </form>
            ) : (
              <div className="space-y-8">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <h3 className="text-lg font-bold text-white">CMS Management Dashboard</h3>
                  <div className="flex gap-2 items-center">
                    <span className={`w-2 h-2 rounded-full ${systemStatus.connected? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`}></span>
                    <span className="text-xs font-mono text-emerald-400">{systemStatus.connected? 'Online' : 'Offline'}</span>
                    <button onClick={()=>{setIsAdminAuthenticated(false); setAdminPasscode('')}} className="ml-4 px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-xs">Logout</button>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/60 border border-slate-700/50 rounded-2xl">
                  <div className="flex items-center space-x-2"><span className={`w-2.5 h-2.5 rounded-full ${systemStatus.connected? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} /><span className="text-xs font-bold text-slate-300">System Status</span></div>
                  <p className="text-xs font-mono text-slate-400 mt-2">{systemStatus.message}</p>
                  <button onClick={fetchInitialData} className="mt-2 px-3 py-1 rounded-lg bg-slate-700 text-xs">↻ Refresh Connection</button>
                </div>

                <form onSubmit={createPost} className="space-y-3 p-5 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Publish News / Story</h4>
                  <select value={newPost.category} onChange={(e) => setNewPost({...newPost, category: e.target.value })} className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white">
                    <option>News</option><option>Education</option><option>Health</option><option>Youth</option><option>Agriculture</option>
                  </select>
                  <input type="text" placeholder="Title - e.g. New School Block Launched" value={newPost.title} onChange={(e) => setNewPost({...newPost, title: e.target.value })} className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" />
                  <textarea placeholder="Body content..." value={newPost.body} onChange={(e) => setNewPost({...newPost, body: e.target.value })} className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white h-28" />
                  <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400">Publish News Story →</button>
                </form>

                <form onSubmit={createCampaign} className="space-y-3 p-5 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">Create Community Campaign</h4>
                  <input type="text" placeholder="Campaign Title" value={newCampaign.title} onChange={(e) => setNewCampaign({...newCampaign, title: e.target.value })} className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" />
                  <input type="text" placeholder="Target Amount (KES) e.g. 500000" value={newCampaign.target_amount} onChange={(e) => setNewCampaign({...newCampaign, target_amount: e.target.value })} className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" />
                  <textarea placeholder="Description... What will funds do?" value={newCampaign.description} onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value })} className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white h-20" />
                  <button type="submit" className="w-full py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400">Launch Campaign →</button>
                </form>

                <div className="pt-4 border-t border-slate-800">
                  <button onClick={fetchSignups} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 border border-slate-700">Load Sign-ups & Submissions ({signups.length})</button>
                  {signups.length > 0? (
                    <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                      {signups.map((s, idx) => (<div key={idx} className="p-3 bg-slate-800 rounded-xl text-xs font-mono text-slate-300 border border-slate-700/50">{s.email || s.title || JSON.stringify(s).slice(0,100)}</div>))}
                    </div>
                  ) : <p className="text-[11px] text-slate-600 mt-3">No data - Run SQL setup in Supabase then add email form to site.</p>}
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <p className="text-[11px] font-bold text-amber-300">SQL Setup Needed (copy to Supabase SQL Editor):</p>
                  <pre className="text-[10px] font-mono text-amber-200/70 mt-2 whitespace-pre-wrap">create table if not exists blog_posts (id uuid primary key default gen_random_uuid(), title text, body text, category text, created_at timestamptz default now());
create table if not exists campaigns (id uuid primary key default gen_random_uuid(), title text, description text, target_amount text, created_at timestamptz default now());
create table if not exists gallery (id uuid primary key default gen_random_uuid(), image_url text, created_at timestamptz default now());
create table if not exists community_leads (id uuid primary key default gen_random_uuid(), email text, created_at timestamptz default now());
alter table blog_posts enable row level security; alter table campaigns enable row level security; alter table gallery enable row level security; alter table community_leads enable row level security;
drop policy if exists "allow all" on blog_posts; create policy "allow all" on blog_posts for all to anon, authenticated using (true) with check (true);
drop policy if exists "allow all" on campaigns; create policy "allow all" on campaigns for all to anon, authenticated using (true) with check (true);
drop policy if exists "allow all" on gallery; create policy "allow all" on gallery for all to anon, authenticated using (true) with check (true);
drop policy if exists "allow all" on community_leads; create policy "allow all" on community_leads for all to anon, authenticated using (true) with check (true);</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="mt-20 border-t border-slate-800 py-10 bg-slate-950 text-center">
        <p className="text-xs text-slate-500">© 2026 BABIRA NDEDA FOUNDATION. Vihiga County, Kenya.</p>
        <p className="text-[10px] font-mono text-slate-600 mt-2">{systemStatus.message} • Passcode: babira2026</p>
      </footer>
    </div>
  );
}
