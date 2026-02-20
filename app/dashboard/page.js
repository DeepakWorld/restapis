'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [keys, setKeys] = useState([]);
  const [newKey, setNewKey] = useState(null);
  const router = useRouter();

  // 1. Initial Auth Check
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push('/login');
        return;
      }
      setUser(user);
      fetchUserKeys();
    };
    checkUser();
  }, [router]);

  // 2. Fetch Data whenever a new key is generated
  useEffect(() => {
    if (newKey) {
      fetchInitialData();
    }
  }, [newKey]);

  const fetchUserKeys = async () => {
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, key_name, created_at')
      .order('created_at', { ascending: false });

    if (!error) setKeys(data || []);
  };

  const fetchInitialData = async () => {
    // Uses newKey if available, otherwise doesn't attempt fetch
    if (!newKey) return;

    try {
      const res = await fetch('/api/data', { 
        headers: { 'x-api-key': newKey } 
      });
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error("Fetch failed", e);
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
        fetchUserKeys();
      } else {
        alert("Error saving key to database");
      }
    }
  };

  const revokeKey = async (keyId) => {
    if (!confirm("Revoke this key?")) return;
    const { error } = await supabase.from('api_keys').delete().eq('id', keyId);
    if (!error) fetchUserKeys();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (!user) return <div style={{padding: '50px'}}>Authenticating...</div>;

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Welcome, {user.email?.split('@')[0]}</h1>
        <button 
          onClick={handleLogout}
          style={{ padding: '8px 16px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Sign Out
        </button>
      </div>

      <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #eee' }} />

      <button 
        onClick={generateAndStoreKey}
        style={{ padding: '12px 24px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        Generate & Register New API Key
      </button>

      {newKey && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f9ff', border: '1px solid #0070f3', borderRadius: '5px' }}>
          <strong style={{ color: '#0070f3' }}>Success! Your New Key:</strong> 
          <div style={{ backgroundColor: '#fff', padding: '10px', marginTop: '10px', border: '1px solid #ddd', borderRadius: '4px', wordBreak: 'break-all' }}>
            <code>{newKey}</code>
          </div>
          <p style={{fontSize: '13px', color: '#666', marginTop: '10px'}}>⚠️ Copy this now! You won't be able to see it again.</p>
        </div>
      )}

      <h2 style={{marginTop: '40px'}}>Your Active Keys</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
            <th style={{ padding: '10px' }}>Label</th>
            <th style={{ padding: '10px' }}>Created</th>
            <th style={{ padding: '10px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {keys.length > 0 ? keys.map(k => (
            <tr key={k.id}>
              <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{k.key_name}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{new Date(k.created_at).toLocaleDateString()}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                <button onClick={() => revokeKey(k.id)} style={{ color: '#ff4444', cursor: 'pointer', border: 'none', background: 'none', textDecoration: 'underline' }}>Revoke</button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No active keys found.</td></tr>
          )}
        </tbody>
      </table>

      <h2 style={{marginTop: '40px'}}>Secure Product Data Preview</h2>
      <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
        {data?.products ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {data.products.map(p => (
                <tr key={p.id}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{p.name}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'right', fontWeight: 'bold' }}>${p.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: '#888' }}>{newKey ? 'Fetching data...' : 'Generate a key above to preview API data.'}</p>
        )}
      </div>
    </div>
  );
}