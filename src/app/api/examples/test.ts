// Test script for Tatoeba API
async function testTatoeba() {
  const keyword = '人';
  const url = `https://tatoeba.org/api/v2/search/sentences?query=${encodeURIComponent(keyword)}&from=jpn&to=eng`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

testTatoeba();
