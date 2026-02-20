'use client';
import { useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      // Sign out from Supabase (clears session and cookies)
      await supabase.auth.signOut();
      // Redirect back to login
      router.push('/login');
    };
    handleLogout();
  }, [router]);

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>Signing out...</h2>
      <p>Please wait a moment.</p>
    </div>
  );
}