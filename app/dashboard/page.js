'use client';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your ACTUAL key
    const apiKey = 'myapi_c18b783c19932ebd35e921b3ec280f95f539ab2bd5f8e70f';
    
    fetch('/api/data', {
      headers: { 'x-api-key': apiKey }
    })
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{padding: '50px', fontFamily: 'sans-serif'}}>Loading Secure Data...</div>;

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <h1 style={{ color: '#111827' }}>Admin Product Dashboard</h1>
      <p style={{ color: '#6b7280' }}>Environment: {data.metadata.environment} | Last Updated: {data.metadata.lastUpdated}</p>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <thead style={{ backgroundColor: '#f3f4f6' }}>
          <tr>
            <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Product</th>
            <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Price</th>
            <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.products.map(product => (
            <tr key={product.id}>
              <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>{product.name}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>${product.price}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', backgroundColor: product.status === 'active' ? '#dcfce7' : '#fef3c7' }}>
                  {product.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
