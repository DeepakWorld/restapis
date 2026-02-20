import { hashAPIKey } from '../../../lib/auth';
import { supabase } from '../../../lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const apiKey = request.headers.get('x-api-key');
  const hashedKey = hashAPIKey(apiKey);
  
  console.log("Incoming Raw Key:", apiKey?.substring(0, 10)); 
  console.log("Generated Hash for lookup:", hashedKey);

  const { data, error } = await supabase
    .from('api_keys')
    .select('user_id')
    .eq('key_hash', hashedKey)
    .single();
    
  if (error) console.error("Supabase Error:", error.message);
   if (error || !data) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  return NextResponse.json({
    products: [
      { id: 1, name: 'Premium Subscription', price: 29.99 },
      { id: 2, name: 'API Expansion Pack', price: 49.99 }
    ]
  });
}