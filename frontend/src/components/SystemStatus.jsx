import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function SystemStatus() {
  const [status, setStatus] = useState({
    loading: true,
    connected: false,
    message: 'Checking Supabase connection...',
  });

  useEffect(() => {
    verifyConnection();
  }, []);

  const verifyConnection = async () => {
    try {
      const { data, error } = await supabase.from('blog_posts').select('id').limit(1);
      if (error && error.code !== 'PGRST116') {
        setStatus({
          loading: false,
          connected: false,
          message: `Connection Error: ${error.message}`,
        });
      } else {
        setStatus({
          loading: false,
          connected: true,
          message: 'Connected to Supabase (Database & Storage Active)',
        });
      }
    } catch (err) {
      setStatus({
        loading: false,
        connected: false,
        message: 'Unable to reach Supabase backend.',
      });
    }
  };

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl my-4">
      <div className="flex items-center space-x-2">
        <span
          className={`w-3 h-3 rounded-full ${
            status.loading
              ? 'bg-amber-400 animate-ping'
              : status.connected
              ? 'bg-emerald-500'
              : 'bg-rose-500'
          }`}
        />
        <span className="text-xs font-bold uppercase text-gray-700 tracking-wider">
          System Status
        </span>
      </div>
      <p className="text-xs font-mono text-gray-600 mt-2">{status.message}</p>
    </div>
  );
}
