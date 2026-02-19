$dataCode = @"
import { validateKey } from '../../lib/auth';

export async function GET(request) {
  const apiKey = request.headers.get('x-api-key');
  // This is the hash you just generated!
  const storedHash = "e8264d7ed796b31cb816e6cd2d96e10f648974fc07f8307808e96560fad8bef2"; 

  if (!apiKey) return Response.json({ error: "Unauthorized: No Key" }, { status: 401 });

  const isValid = validateKey(apiKey, storedHash);
  if (!isValid) return Response.json({ error: "Unauthorized: Invalid Key" }, { status: 401 });

  return Response.json({ 
    message: "Access Granted!", 
    data: "This is the protected secret data." 
  });
}
"@
Set-Content -Path "app/api/data/route.js" -Value $dataCode