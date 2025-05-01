import fetch from 'node-fetch';

async function testTatoeba() {
  const keyword = '大';
  const url = `https://tatoeba.org/eng/api_v0/search?query=${encodeURIComponent(keyword)}&from=jpn&to=eng`;
  
  try {
    console.log('Testing URL:', url);
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'JLPT Professor/1.0'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('Raw response:', text);
    
    const data = JSON.parse(text);
    console.log('Parsed data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testTatoeba();
