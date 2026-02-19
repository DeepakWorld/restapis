import { NextResponse } from 'next/server';
import { generateAPIKey } from '../../../../lib/auth';

export async function POST() {
  try {
    const { rawKey, keyHash } = generateAPIKey();
    
    // Return both the raw key (for the user to see once) 
    // and the hash (to be stored in the database)
    return NextResponse.json({ 
      apiKey: rawKey, 
      keyHash: keyHash 
    });
  } catch (error) {
    console.error('Key generation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
