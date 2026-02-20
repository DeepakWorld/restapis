'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Toggle state
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (isRegistering) {
      // REGISTER LOGIC
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // This ensures they go back to the login page after clicking the email link
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ type: 'success', text: 'Check your email for the confirmation link!' });
      }
    } else {
      // LOGIN LOGIC
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        router.push('/dashboard');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', border: '1px solid #eee', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        {isRegistering ? 'Create Account' : 'Login'}
      </h2>
      
      <form onSubmit={handleAuth}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Email Address</label>
          <input 
            type="email" 
            placeholder="name@company.com" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} 
            required 
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} 
            required 
          />
        </div>

        <button 
          type="submit" 
          style={{ width: '100%', padding: '12px', backgroundColor: isRegistering ? '#2563eb' : '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {isRegistering ? 'Sign Up' : 'Login'}
        </button>
      </form>

      {message.text && (
        <p style={{ 
          marginTop: '15px', 
          padding: '10px', 
          borderRadius: '4px', 
          backgroundColor: message.type === 'error' ? '#fef2f2' : '#f0fdf4',
          color: message.type === 'error' ? '#dc2626' : '#16a34a',
          fontSize: '14px',
          textAlign: 'center'
        }}>
          {message.text}
        </p>
      )}

      <hr style={{ margin: '25px 0', border: '0', borderTop: '1px solid #eee' }} />

      <p style={{ textAlign: 'center', fontSize: '14px' }}>
        {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button 
          onClick={() => {
            setIsRegistering(!isRegistering);
            setMessage({ type: '', text: '' });
          }}
          style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline', padding: '0' }}
        >
          {isRegistering ? 'Login here' : 'Register here'}
        </button>
      </p>
    </div>
  );
}