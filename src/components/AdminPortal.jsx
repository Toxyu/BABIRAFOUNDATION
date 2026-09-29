import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminPortal() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' | 'stories' | 'announcements' | 'campaigns'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [mediaType, setMediaType] = useState('photo');
  const [mediaUrl, setMediaUrl] = useState('');
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) fetchTabData();
  }, [session, activeTab]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoginError(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const fetchTabData = async () => {
    setLoading(true);
    let table = activeTab === 'stories' ? 'blog_posts' : activeTab;
    const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
    if (!error) setItems(data || []);
    setLoading(false);
  };

  const handleFileUpload = async (selectedFile) => {
    if (!selectedFile) return mediaUrl;
    setUploading(true);
    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('media').upload(filePath, selectedFile);
    if (uploadError) {
      alert('Upload failed: ' + uploadError.message);
      setUploading(false);
      return mediaUrl;
    }

    const { data } = supabase.storage.from('media').getPublicUrl(filePath);
    setUploading(false);
    return data.publicUrl;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !story) {
      alert('Title and Story content are required.');
      return;
    }

    let finalMediaUrl = mediaUrl;
    if (file) {
      finalMediaUrl = await handleFileUpload(file);
    }

    let table = activeTab === 'stories' ? 'blog_posts' : activeTab;
    let payload = {};

    if (activeTab === 'gallery') {
      payload = { title, story, media_type: mediaType, media_url: finalMediaUrl };
    } else if (activeTab === 'stories') {
      payload = { title, body: story, media_url: finalMediaUrl, published: true };
    } else {
      payload = { title, content: story, active: true };
    }

    if (editingId) {
      await supabase.from(table).update(payload).eq('id', editingId);
    } else {
      await supabase.from(table).insert([payload]);
    }

    resetForm();
    fetchTabData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry permanently?')) return;
    let table = activeTab === 'stories' ? 'blog_posts' : activeTab;
    await supabase.from(table).delete().eq('id', id);
    fetchTabData();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setTitle(item.title || '');
    setStory(item.story || item.body || item.content || '');
    setMediaType(item.media_type || 'photo');
    setMediaUrl(item.media_url || item.image_url || '');
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setStory('');
    setMediaUrl('');
    setFile(null);
  };

  if (!session) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white border border-emerald-100 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-black text-emerald-950 text-center mb-2">Admin Portal Login</h2>
        <p className="text-xs text-gray-500 text-center mb-6">Sign in to edit site tabs, stories, and media gallery</p>

        {loginError && <p className="p-3 mb-4 text-xs bg-rose-50 text-rose-600 rounded-xl">{loginError}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase">Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-emerald-900 text-white font-bold rounded-xl hover:bg-emerald-800 transition-all shadow-md"
          >
            Sign In to CMS
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-8 p-6 bg-white border border-gray-100 rounded-3xl shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-black text-emerald-950">BABIRA NDEDA FOUNDATION CMS</h2>
          <p className="text-xs text-gray-500">Authenticated Admin Desk ({session.user.email})</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-rose-50 text-rose-600 font-bold text-xs rounded-xl hover:bg-rose-100 transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Tabs Selection */}
      <div className="flex space-x-2 border-b pb-3 overflow-x-auto">
        {['gallery', 'stories', 'announcements', 'campaigns'].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); resetForm(); }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              activeTab === tab ? 'bg-emerald-900 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Form */}
      <form onSubmit={handleSave} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
        <h3 className="font-bold text-gray-800 uppercase text-sm">
          {editingId ? `Edit ${activeTab} Entry` : `Create New ${activeTab} Entry`}
        </h3>

        <input
          type="text"
          placeholder="Title (Required)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
        />

        <textarea
          placeholder="Story / Body Content (Required)"
          value={story}
          onChange={(e) => setStory(e.target.value)}
          rows="4"
          required
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
        />

        {activeTab === 'gallery' && (
          <div className="flex gap-4">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 cursor-pointer">
              <input
                type="radio"
                value="photo"
                checked={mediaType === 'photo'}
                onChange={() => setMediaType('photo')}
              />
              <span>Photo Story</span>
            </label>
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 cursor-pointer">
              <input
                type="radio"
                value="video"
                checked={mediaType === 'video'}
                onChange={() => setMediaType('video')}
              />
              <span>Video Story</span>
            </label>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase block mb-1">Direct Media File Upload</label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase block mb-1">Or Media URL</label>
            <input
              type="url"
              placeholder="https://..."
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-3 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 shadow-md transition-all text-xs uppercase"
          >
            {uploading ? 'Uploading Media...' : editingId ? 'Update Entry' : 'Save & Upload'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 text-xs uppercase"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Live Data Records List */}
      <div className="space-y-3">
        <h4 className="font-bold text-gray-700 text-xs uppercase">Live {activeTab} Database Entries</h4>
        {loading ? (
          <p className="text-xs text-gray-400">Loading data...</p>
        ) : items.length === 0 ? (
          <p className="text-xs text-gray-400">No records found for {activeTab}.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="pr-4">
                <p className="font-bold text-gray-900 text-sm">{item.title}</p>
                <p className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg hover:bg-amber-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1.5 bg-rose-50 text-rose-600 text-xs font-bold rounded-lg hover:bg-rose-100"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
