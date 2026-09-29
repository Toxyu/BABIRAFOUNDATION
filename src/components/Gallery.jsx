import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setItems(data || []);
    setLoading(false);
  };

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
          MEDIA & MOMENTS
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-emerald-950 mt-3">
          Babira Ndeda Foundation Gallery
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto mt-2 text-sm sm:text-base">
          Explore stories, photos, and video updates from our ongoing community programs in Vihiga County.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-emerald-50/50 rounded-3xl border border-dashed border-emerald-200">
          <p className="text-gray-500 font-medium">No media uploaded to the gallery yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer border border-gray-100"
            >
              {/* Media Preview Container */}
              <div className="relative h-64 w-full bg-emerald-950 overflow-hidden">
                {item.media_type === 'video' ? (
                  <video
                    src={item.media_url}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    muted
                    loop
                    autoPlay
                    playsInline
                  />
                ) : (
                  <img
                    src={item.media_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                )}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                  {item.media_type}
                </div>
              </div>

              {/* Title and Story Teaser */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2 leading-relaxed">
                  {item.story}
                </p>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-emerald-800 font-semibold">
                  <span>View Story & Media →</span>
                  <span className="text-gray-400 font-normal">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Story Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl animate-fade-in">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg"
            >
              ✕
            </button>

            <div className="rounded-2xl overflow-hidden bg-black max-h-80 mb-5 flex items-center justify-center">
              {selectedItem.media_type === 'video' ? (
                <video src={selectedItem.media_url} controls autoPlay className="w-full max-h-80 object-contain" />
              ) : (
                <img src={selectedItem.media_url} alt={selectedItem.title} className="w-full max-h-80 object-contain" />
              )}
            </div>

            <h3 className="text-2xl font-black text-gray-900">{selectedItem.title}</h3>
            <p className="text-xs text-emerald-700 font-semibold uppercase mt-1 mb-4">
              {selectedItem.media_type} • Published {new Date(selectedItem.created_at).toLocaleDateString()}
            </p>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
              {selectedItem.story}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
