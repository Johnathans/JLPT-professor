const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

async function extractSentences() {
  const levels = ['n5', 'n4', 'n3', 'n2', 'n1'];
  
  for (const level of levels) {
    try {
      // Read the examples file for current level
      const examplesPath = path.join(process.cwd(), 'src', 'data', 'examples', level, 'examples.json');
      const rawData = await fs.readFile(examplesPath, 'utf-8');
      const data = JSON.parse(rawData);

      const sentences = [];

      // Process each kanji and its examples
      for (const [kanji, examples] of Object.entries(data.examples)) {
        for (const example of examples) {
          sentences.push({
            id: uuidv4(),
            japanese: example.japanese,
            english: example.english,
            level: level.toUpperCase(),
            associatedKanji: [kanji],
            tags: []
          });
        }
      }

      // Create the output directory if it doesn't exist
      const outputDir = path.join(process.cwd(), 'src', 'data', 'sentences');
      await fs.mkdir(outputDir, { recursive: true });

      // Write the processed sentences to a new file
      const outputPath = path.join(outputDir, `${level}-sentences.json`);
      await fs.writeFile(
        outputPath,
        JSON.stringify({ sentences }, null, 2),
        'utf-8'
      );

      console.log(`Successfully extracted ${sentences.length} ${level.toUpperCase()} sentences to ${outputPath}`);
    } catch (error) {
      console.error(`Error extracting ${level.toUpperCase()} sentences:`, error);
    }
  }
}

// Run the extraction
extractSentences();
