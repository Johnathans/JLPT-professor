const fs = require('fs');

// Read the N3 kanji data
const n3Data = JSON.parse(fs.readFileSync('./src/data/n3-kanji-new.json', 'utf8'));
const n3Kanji = n3Data.n3_kanji;

// Check for duplicates by kanji character
const kanjiMap = new Map();
const duplicates = [];

n3Kanji.forEach((entry, index) => {
  if (kanjiMap.has(entry.kanji)) {
    duplicates.push({
      kanji: entry.kanji,
      firstIndex: kanjiMap.get(entry.kanji),
      secondIndex: index
    });
  } else {
    kanjiMap.set(entry.kanji, index);
  }
});

// Print results
if (duplicates.length === 0) {
  console.log('No duplicates found in the N3 kanji data.');
} else {
  console.log(`Found ${duplicates.length} duplicate kanji entries:`);
  duplicates.forEach(dup => {
    console.log(`Kanji: ${dup.kanji}`);
    console.log(`  First occurrence: index ${dup.firstIndex}, id ${n3Kanji[dup.firstIndex].id}`);
    console.log(`  Second occurrence: index ${dup.secondIndex}, id ${n3Kanji[dup.secondIndex].id}`);
  });
  
  // Remove duplicates and update IDs
  console.log('\nRemoving duplicates and updating IDs...');
  
  const uniqueKanji = [];
  const seen = new Set();
  
  n3Kanji.forEach(entry => {
    if (!seen.has(entry.kanji)) {
      seen.add(entry.kanji);
      uniqueKanji.push(entry);
    }
  });
  
  // Update IDs
  uniqueKanji.forEach((entry, index) => {
    entry.id = index + 1;
  });
  
  // Save the updated data
  n3Data.n3_kanji = uniqueKanji;
  fs.writeFileSync('./src/data/n3-kanji-new.json', JSON.stringify(n3Data, null, 2), 'utf8');
  
  console.log(`Removed ${n3Kanji.length - uniqueKanji.length} duplicates.`);
  console.log(`Updated N3 kanji count: ${uniqueKanji.length}`);
}

// Check for duplicates in N4 kanji
const n4Data = JSON.parse(fs.readFileSync('./src/data/n4-kanji-new.json', 'utf8'));
const n4Kanji = n4Data.n4_kanji;

console.log('\nChecking for duplicates in N4 kanji...');
const n4KanjiMap = new Map();
const n4Duplicates = [];

n4Kanji.forEach((entry, index) => {
  if (n4KanjiMap.has(entry.kanji)) {
    n4Duplicates.push({
      kanji: entry.kanji,
      firstIndex: n4KanjiMap.get(entry.kanji),
      secondIndex: index
    });
  } else {
    n4KanjiMap.set(entry.kanji, index);
  }
});

if (n4Duplicates.length === 0) {
  console.log('No duplicates found in the N4 kanji data.');
} else {
  console.log(`Found ${n4Duplicates.length} duplicate kanji entries in N4:`);
  n4Duplicates.forEach(dup => {
    console.log(`Kanji: ${dup.kanji}`);
    console.log(`  First occurrence: index ${dup.firstIndex}, id ${n4Kanji[dup.firstIndex].id}`);
    console.log(`  Second occurrence: index ${dup.secondIndex}, id ${n4Kanji[dup.secondIndex].id}`);
  });
}

// Check for duplicates in N5 kanji
const n5Data = JSON.parse(fs.readFileSync('./src/data/n5-kanji-new.json', 'utf8'));
const n5Kanji = n5Data.n5_kanji;

console.log('\nChecking for duplicates in N5 kanji...');
const n5KanjiMap = new Map();
const n5Duplicates = [];

n5Kanji.forEach((entry, index) => {
  if (n5KanjiMap.has(entry.kanji)) {
    n5Duplicates.push({
      kanji: entry.kanji,
      firstIndex: n5KanjiMap.get(entry.kanji),
      secondIndex: index
    });
  } else {
    n5KanjiMap.set(entry.kanji, index);
  }
});

if (n5Duplicates.length === 0) {
  console.log('No duplicates found in the N5 kanji data.');
} else {
  console.log(`Found ${n5Duplicates.length} duplicate kanji entries in N5:`);
  n5Duplicates.forEach(dup => {
    console.log(`Kanji: ${dup.kanji}`);
    console.log(`  First occurrence: index ${dup.firstIndex}, id ${n5Kanji[dup.firstIndex].id}`);
    console.log(`  Second occurrence: index ${dup.secondIndex}, id ${n5Kanji[dup.secondIndex].id}`);
  });
}

// Also check for overlaps between N3, N4, and N5 kanji
console.log('\nChecking for overlaps between JLPT levels...');

const n4KanjiSet = new Set(n4Kanji.map(k => k.kanji));
const n5KanjiSet = new Set(n5Kanji.map(k => k.kanji));

const n3n4Overlaps = n3Kanji.filter(k => n4KanjiSet.has(k.kanji));
const n3n5Overlaps = n3Kanji.filter(k => n5KanjiSet.has(k.kanji));
const n4n5Overlaps = n4Kanji.filter(k => n5KanjiSet.has(k.kanji));

if (n3n4Overlaps.length > 0) {
  console.log(`Found ${n3n4Overlaps.length} kanji that appear in both N3 and N4 lists:`);
  n3n4Overlaps.forEach(k => console.log(`  ${k.kanji} (${k.meaning.join(', ')})`));
} else {
  console.log('No overlaps found between N3 and N4 kanji.');
}

if (n3n5Overlaps.length > 0) {
  console.log(`Found ${n3n5Overlaps.length} kanji that appear in both N3 and N5 lists:`);
  n3n5Overlaps.forEach(k => console.log(`  ${k.kanji} (${k.meaning.join(', ')})`));
} else {
  console.log('No overlaps found between N3 and N5 kanji.');
}

if (n4n5Overlaps.length > 0) {
  console.log(`Found ${n4n5Overlaps.length} kanji that appear in both N4 and N5 lists:`);
  n4n5Overlaps.forEach(k => console.log(`  ${k.kanji} (${k.meaning.join(', ')})`));
} else {
  console.log('No overlaps found between N4 and N5 kanji.');
}

// Calculate total unique kanji across all levels
console.log('\nCalculating total unique kanji across all levels...');

const allKanji = new Set();
n3Kanji.forEach(k => allKanji.add(k.kanji));
n4Kanji.forEach(k => allKanji.add(k.kanji));
n5Kanji.forEach(k => allKanji.add(k.kanji));

console.log(`Total N3 kanji: ${n3Kanji.length}`);
console.log(`Total N4 kanji: ${n4Kanji.length}`);
console.log(`Total N5 kanji: ${n5Kanji.length}`);
console.log(`Total unique kanji across all levels: ${allKanji.size}`);

// Calculate the sum of individual levels
const sumOfLevels = n3Kanji.length + n4Kanji.length + n5Kanji.length;
console.log(`Sum of individual levels: ${sumOfLevels}`);
console.log(`Overlapping kanji count: ${sumOfLevels - allKanji.size}`);
