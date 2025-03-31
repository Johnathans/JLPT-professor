const fs = require('fs');

// Read the broken file
const brokenData = fs.readFileSync('./src/data/n3-kanji-new.json.broken', 'utf8');

// Extract kanji entries
const kanjiEntries = [];
const regex = /\s*{\s*"id":\s*(\d+),\s*"kanji":\s*"([^"]+)",\s*"onyomi":\s*(\[[^\]]*\]),\s*"onyomi_katakana":\s*(\[[^\]]*\]),\s*"kunyomi":\s*(\[[^\]]*\]),\s*"kunyomi_hiragana":\s*(\[[^\]]*\]),\s*"meaning":\s*(\[[^\]]*\])\s*}/g;

let match;
while ((match = regex.exec(brokenData)) !== null) {
  const id = parseInt(match[1], 10);
  const kanji = match[2];
  const onyomi = JSON.parse(match[3]);
  const onyomi_katakana = JSON.parse(match[4]);
  const kunyomi = JSON.parse(match[5]);
  const kunyomi_hiragana = JSON.parse(match[6]);
  const meaning = JSON.parse(match[7]);
  
  // Skip duplicates
  if (!kanjiEntries.some(entry => entry.kanji === kanji)) {
    kanjiEntries.push({
      id,
      kanji,
      onyomi,
      onyomi_katakana,
      kunyomi,
      kunyomi_hiragana,
      meaning
    });
  }
}

// Sort by ID
kanjiEntries.sort((a, b) => a.id - b.id);

// Read the current file
const currentData = JSON.parse(fs.readFileSync('./src/data/n3-kanji-new.json', 'utf8'));
const existingKanji = currentData.n3_kanji.map(k => k.kanji);

// Add new kanji (avoiding duplicates)
for (const entry of kanjiEntries) {
  if (!existingKanji.includes(entry.kanji)) {
    currentData.n3_kanji.push({
      id: currentData.n3_kanji.length + 1,
      kanji: entry.kanji,
      onyomi: entry.onyomi,
      onyomi_katakana: entry.onyomi_katakana,
      kunyomi: entry.kunyomi,
      kunyomi_hiragana: entry.kunyomi_hiragana,
      meaning: entry.meaning
    });
  }
}

// Write the updated file
fs.writeFileSync('./src/data/n3-kanji-new.json', JSON.stringify(currentData, null, 2), 'utf8');

console.log(`Added ${currentData.n3_kanji.length - existingKanji.length} new kanji entries.`);
console.log(`Total kanji entries: ${currentData.n3_kanji.length}`);
