const API_URL = "https://restapis-xi.vercel.app/api/data";
// This is the Anon Key you provided
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5c2JyY3NnYndldG94bGNjd2NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MTA5NTMsImV4cCI6MjA4NzA4Njk1M30.WC1D9y5kJR15HPFvHq-fZF_xTAX0C4LJCnffroDYy4o"; 
// This is the custom key from your first attempt
const CUSTOM_KEY = "myapi_b5a1b281c6c41a50e88912866899129802ebe7c98a08eff5";

async function testMyApi() {
  console.log("🚀 Testing Hybrid Connection...");
  
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        // We are sending both to cover all bases
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'x-api-key': CUSTOM_KEY, 
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ ACCESS GRANTED");
      // Check if products exists, otherwise show the whole object
      if (data.products) console.table(data.products);
      else console.log("Data received:", data);
    } else {
      console.log("❌ ACCESS DENIED");
      console.log("Status:", response.status);
      console.log("Server said:", data.message || data.error || data);
    }
  } catch (err) {
    console.error("💥 Network Error:", err.message);
  }
}

testMyApi();