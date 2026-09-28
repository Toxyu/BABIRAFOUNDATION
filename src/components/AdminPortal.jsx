import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminPortal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('stories'); 
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (isOpen) fetchTabData();
  }, [isOpen, activeTab]);

  const fetchTabData = async () => {
    setLoading(true);
    let table = activeTab === 'stories' ? 'blog_posts' : activeTab;
    const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
    if (!error) setItems(data || []);
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    let table = activeTab === 'stories' ? 'blog_posts' : activeTab;

    const payload = activeTab === 'stories' 
      ? { title, body: content, media_url: mediaUrl, video_url: videoUrl, published: true }
      : { title, content, active: true };

    if (editingId) {
      await supabase.from(table).update(payload).eq('id', editingId);
    } else {
      await supabase.from(table).insert([payload]);
    }

    resetForm();
    fetchTabData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    let table = activeTab === 'stories' ? 'blog_posts' : activeTab;
    await supabase.from(table).delete().eq('id', id);
    fetchTabData();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setTitle(item.title || '');
    setContent(item.body || item.content || item.description || '');
    setMediaUrl(item.media_url || item.image_url || '');
    setVideoUrl(item.video_url || '');
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setMediaUrl('');
    setVideoUrl('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-6 px-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-emerald-900 text-white font-semibold rounded-2xl shadow-lg hover:bg-emerald-800 transition-all duration-300"
      >
        <span className="flex items-center space-x-2">
          <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{isOpen ? 'Close Admin CMS Portal' : 'Open Admin CMS Portal'}</span>
        </span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          ▼
        </span>
      </button>

      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1600px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex space-x-2 border-b pb-3 overflow-x-auto">
            {['stories', 'announcements', 'campaigns', 'ads'].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); resetForm(); }}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 capitalize ${
                  activeTab === tab ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <form onSubmit={handleSave} className="space-y-4 bg-gray-50 p-5 rounded-2xl border border-gray-100">
            <h3 className="font-semibold text-lg text-gray-800 capitalize">
              {editingId ? `Edit ${activeTab.slice(0, -1)}` : `Add New ${activeTab.slice(0, -1)}`}
            </h3>

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            />

            <textarea
              placeholder="Description or Body Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="4"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="url"
                placeholder="Photo / Image URL"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <input
                type="url"
                placeholder="Video URL (MP4 or Direct Link)"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 shadow-md transition-all duration-200"
              >
                {editingId ? 'Update Item' : 'Save & Publish'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-700 capitalize">Live {activeTab} Data</h4>
            {loading ? (
              <p className="text-gray-400">Loading data...</p>
            ) : items.length === 0 ? (
              <p className="text-gray-400 text-sm">No records found for this section.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <p className="font-semibold text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1.5 bg-amber-50 text-amber-600 text-xs font-semibold rounded-lg hover:bg-amber-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1.5 bg-rose-50 text-rose-600 text-xs font-semibold rounded-lg hover:bg-rose-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
