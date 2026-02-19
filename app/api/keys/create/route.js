import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { generateAPIKey } from '../../../lib/auth';

export async function POST(request) {
  // 1. Generate the raw key and the hash on the server
  const { rawKey, keyHash } = generateAPIKey();

  // 2. We need the user ID. For now, let's get it from the session 
  // or a header if you're passing it. For this test, let's just use the hash.
  
  return NextResponse.json({ 
    apiKey: rawKey, 
    keyHash: keyHash 
  });
}