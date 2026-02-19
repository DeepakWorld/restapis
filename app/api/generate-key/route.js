// app/api/generate-key/route.js
import { generateAPIKey } from '../../lib/auth';

export async function POST() {
  const { rawKey, keyHash } = generateAPIKey();

  // NOTE: You would normally save keyHash to your database here!
  
  return new Response(JSON.stringify({ 
    apiKey: rawKey,
    warning: "Save this key! It will not be shown again." 
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}