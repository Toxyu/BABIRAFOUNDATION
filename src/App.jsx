import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient.js'

const tickers = ["Vihiga County Youth Digital Skills - Applications Open","Community Bursary Scheme - Allocations finalized","Health outreach camp - Vihiga County","M-PESA Paybill 522522 Account BABIRA - V2.0.2 Official Logo Locked","1,420+ Youth Empowered - Official Logo"]
const tabsList = [{ id: 'about', label: 'About Us' },{ id: 'objectives', label: 'Objectives and Values' },{ id: 'youth', label: 'Youth Empowerment' },{ id: 'education', label: 'Education' },{ id: 'health', label: 'Community Health' },{ id: 'geographical', label: 'Geographical Focus' },{ id: 'monitoring', label: 'Monitoring and Funding' },{ id: 'partnership', label: 'Partnership' },{ id: 'gallery', label: 'Gallery' },{ id: 'tools', label: 'Smart Tools' },{ id: 'contact', label: 'Contact' },{ id: 'donate', label: 'Donate' },]

export default function App() {
  const [tIdx, setTIdx] = useState(0)
  const [active, setActive] = useState('about')
  const [amount, setAmount] = useState(5000)
  const [choice, setChoice] = useState('general')
  const [posts, setPosts] = useState([])
  const [showCMS, setShowCMS] = useState(false)
  const [cmsTab, setCmsTab] = useState('create')
  const [loggedIn, setLoggedIn] = useState(false)
  const [preview, setPreview] = useState({ image: '', video: '' })
  const [manageList, setManageList] = useState([])

  useEffect(() => { const id = setInterval(() => setTIdx(i => (i + 1) % tickers.length), 4000); return () => clearInterval(id) }, [])
  useEffect(() => { loadPosts() }, [])
  const loadPosts = async () => { const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false }).limit(50); if (data) { setPosts(data); setManageList(data) } }

  const handleFiles = (files) => {
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = e => {
        const url = e.target.result
        if (file.type.startsWith('video')) setPreview(p => ({...p, video: url }))
        else setPreview(p => ({...p, image: url }))
      }
      reader.readAsDataURL(file)
    })
  }

  const publish = async () => {
    const title = document.getElementById('postTitle')?.value.trim()
    const short = document.getElementById('postShort')?.value.trim()
    const story = document.getElementById('postStory')?.value.trim()
    const type = document.getElementById('postType')?.value
    const imageUrl = document.getElementById('postImage')?.value.trim() || preview.image
    const videoUrl = document.getElementById('postVideo')?.value.trim() || preview.video
    if (!title) return alert('Title required - V2.0.2')
    if (!short &&!story) return alert('Add short description or story - V2.0.2')
    if (!imageUrl &&!videoUrl) return alert('Upload from gallery or paste URL - V2.0.2')
    const { error } = await supabase.from('blog_posts').insert([{ title, short_desc: short, story, body: short + ' ' + story, category: type, image_url: imageUrl, video_url: videoUrl }])
    if (error) { alert('Error: ' + error.message); return }
    alert('Published! Appears in Gallery instantly - Permanent - V2.0.2 Official Logo Locked')
    setPreview({ image: '', video: '' })
    loadPosts()
  }

  const getBreakdown = () => {
    if (choice === 'bursary') return [{ l: 'Direct School Fees', p: 85, c: '#fbbf24' }, { l: 'Learning Materials', p: 10, c: '#22c55e' }, { l: 'Monitoring', p: 5, c: '#86efac' }]
    if (choice === 'youth') return [{ l: 'Digital Skills Training', p: 40, c: '#fbbf24' }, { l: 'Entrepreneurship', p: 25, c: '#22c55e' }, { l: 'Mentorship', p: 20, c: '#86efac' }, { l: 'Monitoring', p: 10, c: '#16a34a' }, { l: 'Admin', p: 5, c: '#a3d9b1' }]
    if (choice === 'education') return [{ l: 'Direct Bursaries', p: 50, c: '#fbbf24' }, { l: 'Learning Materials', p: 20, c: '#22c55e' }, { l: 'Mentorship', p: 15, c: '#86efac' }, { l: 'Digital Literacy', p: 10, c: '#16a34a' }, { l: 'Monitoring', p: 5, c: '#a3d9b1' }]
    if (choice === 'health') return [{ l: 'Health Awareness', p: 35, c: '#fbbf24' }, { l: 'Hygiene & Sanitation', p: 25, c: '#22c55e' }, { l: 'Nutrition & Youth Health', p: 20, c: '#86efac' }, { l: 'Screening & Referrals', p: 15, c: '#16a34a' }, { l: 'Monitoring', p: 5, c: '#a3d9b1' }]
    return [{ l: 'Youth Empowerment', p: 35, c: '#fbbf24' }, { l: 'Education', p: 30, c: '#22c55e' }, { l: 'Community Health', p: 20, c: '#86efac' }, { l: 'Monitoring', p: 10, c: '#16a34a' }, { l: 'Capacity', p: 5, c: '#a3d9b1' }]
  }

  return (
    <div className="min-h-screen bg-[#0f221a] text-white flex flex-col">
      <div className="bg-[#091712] border-b border-white/10 h-9 flex items-center px-4 text-[11px] text-[#a3d9b1] overflow-hidden">
        <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse mr-2"></div><span>{tickers[tIdx]}</span><span className="ml-auto text-[9px]">V2.0.2 Official Logo</span>
      </div>
      <header className="sticky top-0 z-30 bg-[#0f221a]/90 backdrop-blur p-3 flex justify-between items-center border-b border-white/10">
        <div className="flex gap-3 items-center">
          <img src="/BABIRAFOUNDATION/logo.png" alt="Babira Ndeda Foundation Official Logo" className="w-12 h-12 rounded-xl bg-white p-1 object-contain border border-white/20" onError={(e) => { e.target.src = '/logo.png'; e.target.onerror = () => { e.target.style.display='none'; document.getElementById('fallbackLogo').style.display='flex' } }} />
          <div id="fallbackLogo" className="w-12 h-12 bg-white rounded-xl hidden items-center justify-center p-1"><img src="/mnt/data/wa_image_5915298501058043506" alt="logo" className="w-full h-full object-contain" /></div>
          <div><h1 className="font-extrabold text-[13px] leading-tight">Babira Ndeda Foundation</h1><p className="text-[9px] text-[#fbbf24] font-bold tracking-wider">OFFICIAL LOGO - V2.0.2 LOCKED</p></div>
        </div>
        <button onClick={() => setShowCMS(true)} className="text-[10px] px-3 py-1.5 rounded-lg bg-[#fbbf24]/10 border border-[#fbbf24]/30 text-[#fbbf24] font-bold">CMS Portal</button>
      </header>
      <div className="flex gap-1.5 overflow-auto p-2.5 sticky top-[56px] bg-[#0f221a] z-20 scrollbar-hide border-b border-white/5">
        {tabsList.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)} className={`px-4 py-2.5 rounded-xl text-[11px] whitespace-nowrap border font-semibold transition-all ${t.id === 'donate'? (active === t.id? 'bg-[#fbbf24] text-[#0f221a] border-[#fbbf24] shadow' : 'bg-[#fbbf24]/10 text-[#fbbf24] border-[#fbbf24]/30') : (active === t.id? 'bg-[#22c55e] text-white border-[#22c55e] scale-[1.02] shadow' : 'bg-[#16382c] text-white/60 border-white/10')}`}>{t.label}</button>
        ))}
      </div>

      <main className="p-3 max-w-6xl mx-auto w-full flex-1">
        {active === 'about' && (
          <div className="space-y-3">
            <div className="bg-[#16382c]/70 border border-white/10 rounded-2xl p-5 text-center">
              <img src="/BABIRAFOUNDATION/logo.png" alt="Official Logo" className="w-32 h-32 mx-auto bg-white rounded-2xl p-2 object-contain border border-white/20 shadow-xl" onError={(e) => e.target.src = '/logo.png'} />
              <h2 className="text-xl font-extrabold mt-4">Babira Ndeda Foundation - V2.0.2 Official Logo Locked</h2>
              <p className="text-[11px] text-[#fbbf24] font-bold tracking-widest mt-1">Empowering Youth • Advancing Education • Promoting Health</p>
              <p className="text-sm opacity-80 mt-3 leading-relaxed text-left">Babira Foundation is a community-focused non-profit organization committed to improving the lives and opportunities of young people and vulnerable members of communities in Vihiga County, Kenya. Official logo represents Youth (green and yellow figures), Education (graduation cap and book), Health (heart with cross), Community support (hands), Growth (leaves).</p>
            </div>
            <div className="bg-[#16382c]/70 border border-white/10 rounded-2xl p-4">
              <h3 className="font-bold text-[#fbbf24]">Live Community Feed - V2.0.2 Official Logo</h3>
              <div className="mt-3 space-y-2">
                {posts.length? posts.slice(0, 5).map(p => (
                  <div key={p.id} className="flex gap-3 p-3 bg-black/20 rounded-xl border border-white/5">
                    {p.image_url && <img src={p.image_url} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />}
                    <div className="min-w-0"><div className="text-[10px] text-[#86efac]">{p.category || 'Story'}</div><div className="font-bold text-sm truncate">{p.title}</div><div className="text-xs opacity-60 truncate">{p.short_desc || ''}</div></div>
                  </div>
                )) : <div className="text-xs opacity-60">No posts yet - publish from CMS Portal Create Post - Official Logo Locked V2.0.2</div>}
              </div>
            </div>
          </div>
        )}

        {active === 'gallery' && (
          <div className="bg-[#16382c]/70 border border-white/10 rounded-2xl p-4">
            <h2 className="font-extrabold text-xl">Gallery - V2.0.2 Official Logo - Permanent</h2>
            <div className="grid md:grid-cols-3 gap-3 mt-4">
              {posts.length? posts.map(p => (
                <div key={p.id} className="bg-black/20 border border-white/10 rounded-xl overflow-hidden">
                  <div className="h-48 bg-[#091712]">{p.video_url? <video src={p.video_url} controls className="w-full h-full object-cover" /> : p.image_url? <img src={p.image_url} alt="" className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full opacity-40">No media</div>}</div>
                  <div className="p-3"><div className="font-bold text-sm">{p.title}</div><div className="text-[11px] text-[#fbbf24] mt-1">{p.short_desc || ''}</div><div className="text-[11px] opacity-60 mt-1 line-clamp-2">{p.story || ''}</div></div>
                </div>
              )) : <div className="text-xs opacity-60 col-span-3">No posts - CMS Portal - Create Post - Upload from phone gallery - Title + Short + Story - Official Logo V2.0.2</div>}
            </div>
          </div>
        )}

        {active === 'donate' && (
          <div className="bg-gradient-to-br from-[#fbbf24]/10 to-[#22c55e]/10 border border-[#fbbf24]/20 rounded-[20px] p-5">
            <h2 className="text-[20px] font-extrabold">Support Vihiga Youth - V2.0.2 Official Logo - Transparent</h2>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div>
                <input type="range" min="100" max="100000" step="100" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full accent-[#fbbf24]" />
                <div className="flex justify-between text-[11px]"><span>100</span><span className="font-bold text-[#fbbf24]">KES {amount.toLocaleString()}</span><span>100k</span></div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {['general','youth','education','health','bursary','capacity'].map(id => (
                    <button key={id} onClick={() => setChoice(id)} className={`p-2 rounded-xl text-[10px] border ${choice === id? 'bg-[#22c55e]/20 border-[#22c55e]' : 'bg-black/20 border-white/10'}`}>{id.toUpperCase()}</button>
                  ))}
                </div>
                <button onClick={() => alert(`V2.0.2 Official Logo - Donation KES ${amount} for ${choice.toUpperCase()} - Paybill 522522 Account BABIRA`)} className="w-full mt-3 p-3 bg-[#fbbf24] text-[#0f221a] font-bold rounded-xl">Donate Now - 522522 - V2.0.2 Official</button>
              </div>
              <div className="bg-black/30 rounded-xl p-4">
                <div className="text-[10px] font-bold text-[#86efac]">GENIUS UTILIZATION - OFFICIAL LOGO V2.0.2</div>
                {getBreakdown().map(b => <div key={b.l} className="mt-2"><div className="flex justify-between text-[10px]"><span>{b.l}</span><span style={{ color: b.c }}>{b.p}% - KES {Math.round(amount * b.p / 100).toLocaleString()}</span></div><div className="h-2 bg-black/50 rounded-full mt-1"><div className="h-full rounded-full" style={{ width: `${b.p}%`, background: b.c }}></div></div></div>)}
              </div>
            </div>
          </div>
        )}

        {active!== 'about' && active!== 'gallery' && active!== 'donate' && (
          <div className="bg-[#16382c]/70 border border-white/10 rounded-2xl p-6 text-sm opacity-80">Content for {active} - V2.0.2 Official Logo Locked - Main core preserved.</div>
        )}
      </main>

      {showCMS && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 overflow-auto p-3 flex justify-center">
          <div className="bg-[#16382c] border border-white/20 rounded-2xl p-4 w-full max-w-2xl h-fit my-4">
            <div className="flex justify-between items-center"><h3 className="font-bold text-[#86efac] flex items-center gap-2"><img src="/BABIRAFOUNDATION/logo.png" className="w-6 h-6 bg-white rounded p-0.5" alt="" onError={(e) => e.target.style.display='none'} /> CMS Portal V2.0.2 Official Logo</h3><button onClick={() => setShowCMS(false)} className="text-xs px-3 py-1 bg-black/30 rounded-lg border border-white/10">Close</button></div>

            {!loggedIn? (
              <div className="mt-4 space-y-2">
                <input id="loginEmail" placeholder="admin@babirandedafoundation.org" className="w-full p-3 bg-[#091712] border border-white/10 rounded-xl text-white" />
                <input id="loginPass" type="password" placeholder="babira2026" className="w-full p-3 bg-[#091712] border border-white/10 rounded-xl text-white" />
                <button onClick={() => {
                  const e = document.getElementById('loginEmail').value.trim()
                  const p = document.getElementById('loginPass').value.trim()
                  if (['admin@babirandedafoundation.org','admin.babirafoundation.org@gmail.com'].includes(e) && ['babira2026','BABIRA2026','Babira2026!','admin123'].includes(p)) { setLoggedIn(true) }
                  else alert('Use admin@babirandedafoundation.org / babira2026')
                }} className="w-full p-3 bg-[#22c55e] rounded-xl font-bold">Sign In - Official Logo V2.0.2</button>
              </div>
            ) : (
              <div className="mt-4">
                <div className="flex gap-1 flex-wrap">
                  {['create','manage','media','ads'].map(tab => (
                    <button key={tab} onClick={() => setCmsTab(tab)} className={`px-4 py-2 rounded-xl text-xs font-bold border ${cmsTab === tab? 'bg-[#22c55e] text-white border-[#22c55e]' : 'bg-black/20 text-white/60 border-white/10'}`}>{tab === 'create'? 'Create Post - Gallery Upload' : tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
                  ))}
                </div>

                {cmsTab === 'create' && (
                  <div className="mt-4 space-y-3">
                    <div className="bg-[#0f221a] border-2 border-dashed border-[#22c55e]/30 rounded-xl p-6 text-center">
                      <div className="text-3xl">+</div>
                      <div className="font-bold mt-1">Gallery Uploading - Click to upload photo or video from phone gallery - V2.0.2 Official</div>
                      <input type="file" accept="image/*,video/*" multiple onChange={e => handleFiles(e.target.files)} className="w-full mt-3 text-xs" />
                      {(preview.image || preview.video) && (
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {preview.image && <img src={preview.image} alt="" className="w-full h-24 object-cover rounded-lg" />}
                          {preview.video && <video src={preview.video} controls className="w-full h-24 rounded-lg" />}
                        </div>
                      )}
                    </div>
                    <input id="postTitle" placeholder="Title - e.g. Youth Training - V2.0.2 Official" className="w-full p-3 bg-[#091712] border border-white/10 rounded-xl" />
                    <input id="postShort" placeholder="Short description - one line" className="w-full p-3 bg-[#091712] border border-white/10 rounded-xl" />
                    <textarea id="postStory" placeholder="Story behind it - full story" rows="4" className="w-full p-3 bg-[#091712] border border-white/10 rounded-xl"></textarea>
                    <select id="postType" className="w-full p-3 bg-[#091712] border border-white/10 rounded-xl"><option value="story">Story and Blog</option><option value="photo">Photo</option><option value="video">Video</option><option value="campaign">Campaign</option></select>
                    <input id="postImage" placeholder="Or Image URL https://..." className="w-full p-2 bg-[#091712] border border-white/10 rounded-xl text-xs" />
                    <input id="postVideo" placeholder="Or Video URL" className="w-full p-2 bg-[#091712] border border-white/10 rounded-xl text-xs" />
                    <button onClick={publish} className="w-full p-3 bg-[#fbbf24] text-[#0f221a] font-bold rounded-xl">Publish to Gallery - Permanent - Official Logo V2.0.2</button>
                  </div>
                )}

                {cmsTab === 'media' && (
                  <div className="mt-4 space-y-3">
                    <div className="bg-black/20 border border-white/10 rounded-xl p-3 text-center">
                      <img src="/BABIRAFOUNDATION/logo.png" alt="Official Logo" className="w-24 h-24 mx-auto bg-white rounded-xl p-2 object-contain" onError={(e) => e.target.src='/logo.png'} />
                      <h4 className="font-bold mt-2">Official Logo Locked - V2.0.2</h4>
                      <p className="text-[11px] opacity-60">This is your official logo - already set everywhere. Media tab is only for Background Video 24/7 Loop. For gallery photos/videos/stories use Create Post tab.</p>
                    </div>
                    <input placeholder="Background Video URL mp4 for loop" className="w-full p-3 bg-[#091712] border border-white/10 rounded-xl" />
                    <button className="w-full p-3 bg-[#22c55e] rounded-xl font-bold">Save Background Video - V2.0.2 Official</button>
                    <button onClick={() => setCmsTab('create')} className="w-full p-3 bg-[#16382c] border border-white/10 rounded-xl font-bold text-xs">Go to Create Post - Gallery Uploading</button>
                  </div>
                )}

                {cmsTab === 'manage' && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-bold">Manage Posts - V2.0.2 Official Logo</h4>
                    {manageList.map(p => (
                      <div key={p.id} className="flex gap-2 p-2 bg-black/20 border border-white/10 rounded-xl">
                        <div className="w-12 h-12 bg-[#091712] rounded overflow-hidden flex-shrink-0">{p.image_url? <img src={p.image_url} alt="" className="w-full h-full object-cover" /> : <video src={p.video_url} className="w-full h-full object-cover" />}</div>
                        <div className="flex-1 min-w-0"><div className="font-bold text-xs truncate">{p.title}</div><div className="text-[10px] opacity-60 truncate">{p.short_desc}</div></div>
                        <button onClick={async () => { if (confirm('Delete?')) { await supabase.from('blog_posts').delete().eq('id', p.id); loadPosts() } }} className="px-2 py-1 bg-red-900/30 border border-red-500/20 rounded text-[10px]">Delete</button>
                      </div>
                    ))}
                  </div>
                )}

                {cmsTab === 'ads' && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-bold">Ads - V2.0.2 Official Logo</h4>
                    <textarea placeholder="Meta Pixel Code" rows="2" className="w-full p-3 bg-[#091712] border border-white/10 rounded-xl"></textarea>
                    <textarea placeholder="Google AdSense Code" rows="2" className="w-full p-3 bg-[#091712] border border-white/10 rounded-xl"></textarea>
                    <button className="w-full p-3 bg-[#22c55e] rounded-xl font-bold">Save Ads - Official Logo V2.0.2</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="text-center p-4 text-[10px] opacity-60 border-t border-white/5 mt-6 flex flex-col items-center gap-2">
        <img src="/BABIRAFOUNDATION/logo.png" alt="Official Logo Footer" className="w-10 h-10 bg-white rounded-lg p-1 object-contain" onError={(e) => e.target.style.display='none'} />
        <div>2026 Babira Ndeda Foundation V2.0.2 Official Logo Locked - Empowering Youth • Advancing Education • Promoting Health - Vihiga County, Kenya</div>
      </footer>
    </div>
  )
}
