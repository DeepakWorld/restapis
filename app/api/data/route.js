import { validateKey } from '../../lib/auth';

export async function GET(request) {
  const apiKey = request.headers.get('x-api-key');
  const storedHash = "e8264d7ed796b31cb816e6cd2d96e10f648974fc07f8307808e96560fad8bef2"; 

  if (!apiKey) return Response.json({ error: "Missing Key" }, { status: 401 });

  const isValid = validateKey(apiKey, storedHash);
  if (!isValid) return Response.json({ error: "Invalid Key" }, { status: 401 });

  return Response.json({ 
    message: "Access Granted!", 
    status: "Production Ready",
    updatedAt: "02/19/2026 22:16:58"
  });
}
