'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [newKey, setNewKey] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkUserAndFetch = async () => {
      // 1. Check if user is logged in
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // 2. Fetch the product data (using your existing secure API)
      const apiKey = 'myapi_c18b783c19932ebd35e921b3ec280f95f539ab2bd5f8e70f';
      const res = await fetch('/api/data', { headers: { 'x-api-key': apiKey } });
      const json = await res.json();
      setData(json);
    };

    checkUserAndFetch();
  }, [router]);


const revokeKey = async (keyId) => {
  if (!confirm("Are you sure? Any app using this key will stop working immediately.")) return;

  const { error } = await supabase
    .from('api_keys')
    .delete()
    .match({ id: keyId });

  if (error) {
    alert("Error revoking key: " + error.message);
  } else {
    // Refresh the list
    fetchUserKeys();
  }
};

const fetchUserKeys = async () => {
  const { data, error } = await supabase
    .from('api_keys')
    .select('id, key_name, created_at')
    .order('created_at', { ascending: false });

  if (!error) setKeys(data);
};

// Update your existing useEffect to call fetchUserKeys()
  const generateAndStoreKey = async () => {
    try {
      const res = await fetch('/api/keys/create', { method: 'POST' });
      
      // Check if the response is actually okay before parsing JSON
      if (!res.ok) {
        const text = await res.text();
        console.error("Server Error:", text);
        alert(`API Error (${res.status}): Make sure the API route exists and supports POST.`);
        return;
      }

      const result = await res.json();
      
      if (result.apiKey) {
        const { error } = await supabase
          .from('api_keys')
          .insert([{ 
            user_id: user.id, 
            key_hash: result.keyHash, 
            key_name: 'Main Key' 
          }]);

        if (error) {
          alert("Database Error: " + error.message);
        } else {
          setNewKey(result.apiKey);
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Something went wrong. Check the console.");
    }
  };

  if (!data || !user) return <div style={{padding: '50px'}}>Authenticating...</div>;

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
          <p style={{fontSize: '12px', color: '#0369a1'}}>This key hash is now linked to your User ID in the database.</p>
        </div>
      )}

      <h2 style={{marginTop: '40px'}}>Your Active Keys</h2>
<table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
  <thead style={{ backgroundColor: '#f3f4f6' }}>
    <tr>
      <th style={{ padding: '12px', textAlign: 'left' }}>Label</th>
      <th style={{ padding: '12px', textAlign: 'left' }}>Created</th>
      <th style={{ padding: '12px', textAlign: 'right' }}>Action</th>
    </tr>
  </thead>
  <tbody>
    {keys.map(k => (
      <tr key={k.id}>
        <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{k.key_name}</td>
        <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{new Date(k.created_at).toLocaleDateString()}</td>
        <td style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'right' }}>
          <button onClick={() => revokeKey(k.id)} style={{color: 'red', border: 'none', background: 'none', cursor: 'pointer'}}>Revoke</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
}
