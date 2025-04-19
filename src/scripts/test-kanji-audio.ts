const testKanjiAudio = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/test-kanji-audio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        kanji: '日',
        reading: 'nichi',
        type: 'onyomi'
      })
    });

    const result = await response.json();
    console.log('Audio generated:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};

testKanjiAudio();
