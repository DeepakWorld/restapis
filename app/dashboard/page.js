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

      <h2 style={{marginTop: '40px'}}>Secure Product Data</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead style={{ backgroundColor: '#f3f4f6' }}>
          <tr>
            <th style={{ padding: '12px', textAlign: 'left' }}>Product</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Price</th>
          </tr>
        </thead>
        <tbody>
          {data.products.map(p => (
            <tr key={p.id}>
              <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{p.name}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
