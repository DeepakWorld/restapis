'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [keys, setKeys] = useState([]); // ✅ FIX: Initialize keys state
  const [newKey, setNewKey] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkUserAndFetch = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // Load existing keys and initial data
      fetchUserKeys();
      fetchInitialData();
    };

    checkUserAndFetch();
  }, [router]);

  const fetchUserKeys = async () => {
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, key_name, created_at')
      .order('created_at', { ascending: false });

    if (!error) setKeys(data || []);
  };

 const fetchInitialData = async () => {
    // 1. First, check if there are any keys in the database for this user
    const { data: userKeys } = await supabase
      .from('api_keys')
      .select('key_hash')
      .limit(1);

    // 2. If no keys exist, we can't fetch data yet
    if (!userKeys || userKeys.length === 0) {
      setData({ products: [] }); 
      return;
    }

    // 3. Use the NEW key you just generated (if available) or a default
    // For now, let's use the one you just copied to prove it works!
    const activeKey = newKey || "myapi_18b134340d58a3c8f21fb80a9153e8b4db4a8abc2dc22ec6";

    try {
      const res = await fetch('/api/data', { 
        headers: { 'x-api-key': activeKey } 
      });
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error("Fetch failed");
    }
  };
  const generateAndStoreKey = async () => {
    const res = await fetch('/api/keys/create', { method: 'POST' });
    const result = await res.json();
    
    if (result.apiKey) {
      const { error } = await supabase
        .from('api_keys')
        .insert([{ 
          user_id: user.id, 
          key_hash: result.keyHash, 
          key_name: 'Main Key' 
        }]);

      if (!error) {
        setNewKey(result.apiKey);
        fetchUserKeys(); // Refresh the list so it shows up
      }
    }
  };

  const revokeKey = async (keyId) => {
    if (!confirm("Revoke this key?")) return;
    const { error } = await supabase.from('api_keys').delete().eq('id', keyId);
    if (!error) fetchUserKeys();
  };

  if (!user) return <div style={{padding: '50px'}}>Authenticating...</div>;

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Welcome, {user.email}</h1>
      
      <button 
        onClick={generateAndStoreKey}
        style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Generate & Register New API Key
      </button>

      {newKey && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e0f2fe', borderRadius: '5px' }}>
          <strong>Your New Key:</strong> <code>{newKey}</code>
          <p style={{fontSize: '12px'}}>Copy this now! It won't be shown again.</p>
        </div>
      )}

      <h2 style={{marginTop: '40px'}}>Active API Keys</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
            <th>Label</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {keys.map(k => (
            <tr key={k.id}>
              <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{k.key_name}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{new Date(k.created_at).toLocaleDateString()}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                <button onClick={() => revokeKey(k.id)} style={{ color: 'red', cursor: 'pointer', border: 'none', background: 'none' }}>Revoke</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{marginTop: '40px'}}>Secure Product Data</h2>
      {data?.products ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {data.products.map(p => (
              <tr key={p.id}>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{p.name}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>${p.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p>Loading data...</p>}
    </div>
  );
}