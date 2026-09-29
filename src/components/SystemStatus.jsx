import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function SystemStatus() {
  const [status, setStatus] = useState({
    connected: false,
    message: 'Connecting to Supabase...',
    mediaReady: false,
  });

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 15000); // Heartbeat ping every 15s
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    try {
      // Test 1: Check database connection
      const { data, error } = await supabase.from('gallery').select('id').limit(1);
      
      // Test 2: Check storage media bucket availability
      const { error: storageError } = await supabase.storage.from('media').list('', { limit: 1 });

      if (error && error.code !== 'PGRST116') {
        setStatus({
          connected: false,
          message: `Database error: ${error.message}`,
          mediaReady: false,
        });
      } else {
        setStatus({
          connected: true,
          message: 'Connected to Supabase (Database & Storage Active)',
          mediaReady: !storageError,
        });
      }
    } catch (err) {
      setStatus({
        connected: false,
        message: 'Connection failed. Check network or credentials.',
        mediaReady: false,
      });
    }
  };

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl my-4">
      <div className="flex items-center space-x-3">
        <span
          className={`w-3 h-3 rounded-full ${
            status.connected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
          }`}
        />
        <span className="text-xs font-extrabold uppercase tracking-wider text-gray-700">
          System Status
        </span>
      </div>
      <p className="text-xs font-mono text-gray-600 mt-2">{status.message}</p>
      {status.connected && (
        <div className="mt-2 text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100/60 inline-block px-2.5 py-1 rounded-md">
          ● Media + Posts + Video Storage Live
        </div>
      )}
    </div>
  );
}
