const API_URL = "https://restapis-xi.vercel.app/api/data";
// PASTE YOUR NEW KEY HERE:
const MY_KEY = "myapi_eeef48a92ca1af1f28439c9bbe24d0c5428bacb61e343dbb";

async function testMyApi() {
  console.log("🚀 Testing with the BRAND NEW key...");
  
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'x-api-key': MY_KEY,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ ACCESS GRANTED!");
      console.table(data.products);
    } else {
      console.log("❌ ACCESS DENIED");
      console.log("Status:", response.status);
      console.log("Server Message:", data.error);
    }
  } catch (err) {
    console.error("💥 Network Error:", err.message);
  }
}

testMyApi();