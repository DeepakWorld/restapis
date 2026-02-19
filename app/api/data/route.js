import { hashAPIKey } from '../../../lib/auth'; // Change validateKey to hashAPIKey
import { supabase } from '../../../lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const apiKey = request.headers.get('x-api-key');

  if (!apiKey) {
    return NextResponse.json({ error: 'API key required' }, { status: 401 });
  }

  const hashedKey = hashAPIKey(apiKey);

  // Check Supabase for this hash
  const { data, error } = await supabase
    .from('api_keys')
    .select('user_id')
    .eq('key_hash', hashedKey)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  // If valid, return the data
  return NextResponse.json({
    products: [
      { id: 1, name: 'Premium Subscription', price: 29.99 },
      { id: 2, name: 'API Expansion Pack', price: 49.99 },
      { id: 3, name: 'Developer Support Tier', price: 99.99 }
    ]
  });
}