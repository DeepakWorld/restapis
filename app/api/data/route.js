import { validateKey } from '../../lib/auth';

export async function GET(request) {
  const apiKey = request.headers.get('x-api-key');
  const storedHash = "e8264d7ed796b31cb816e6cd2d96e10f648974fc07f8307808e96560fad8bef2"; 

  if (!apiKey || !validateKey(apiKey, storedHash)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // This is your "Database" of information
  const secureData = {
    metadata: {
      count: 3,
      lastUpdated: "02/19/2026 22:22:46",
      environment: "production"
    },
    products: [
      { id: 1, name: "Premium Subscription", price: 49.99, status: "active" },
      { id: 2, name: "API Expansion Pack", price: 25.00, status: "available" },
      { id: 3, name: "Developer Support Tier", price: 150.00, status: "limited" }
    ]
  };

  return Response.json(secureData);
}
