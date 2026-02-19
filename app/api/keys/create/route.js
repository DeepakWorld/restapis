// app/api/keys/create/route.js
import { generateAPIKey } from '../../../lib/auth';

export async function POST(request) {
  const { rawKey, keyHash } = generateAPIKey();

  return Response.json({ 
    apiKey: rawKey,
    keyHash: keyHash, // <--- ADD THIS LINE
    message: "Copy BOTH the key and the hash now!" 
  });
}