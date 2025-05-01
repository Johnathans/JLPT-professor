import fetch from 'node-fetch';

async function fetchExamples(kanji) {
  const url = `https://tatoeba.org/en/api_v0/search?` +
    `query=${encodeURIComponent(kanji)}&` +
    `from=jpn&` +
    `to=eng&` +
    `trans_filter=limit&` +
    `trans_to=eng&` +
    `sort=random`;

  try {
    console.log(`Fetching from ${url}`);
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'JLPT Professor/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw response:', JSON.stringify(data, null, 2));
    
    const results = (data.results || [])
      .filter(sentence => 
        sentence?.text && 
        sentence?.translations?.[0]?.[0]?.text &&
        sentence.text.includes(kanji) &&
        sentence.text.length < 50 &&
        !sentence.text.includes('〜') &&
        !sentence.text.includes('…')
      )
      .map(sentence => ({
        japanese: sentence.text,
        english: sentence.translations[0][0].text
      }))
      .slice(0, 3);

    console.log(`Found ${results.length} examples for ${kanji}:`, results);
    return results;
  } catch (error) {
    console.error(`Error fetching examples for ${kanji}:`, error);
    return [];
  }
}

// Test with a single kanji
const testKanji = '日';
console.log(`Testing with kanji: ${testKanji}`);
fetchExamples(testKanji).then(examples => {
  console.log('Final examples:', examples);
});
