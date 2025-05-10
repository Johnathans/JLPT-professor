const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

interface ExampleSentence {
  japanese: string;
  english: string;
}

interface KanjiExamples {
  [kanji: string]: ExampleSentence[];
}

interface ExamplesFile {
  examples: KanjiExamples;
}

interface SentenceEntry {
  id: string;
  japanese: string;
  english: string;
  level: string;
  associatedKanji: string[];
  tags: string[];
}

async function extractN5Sentences(): Promise<void> {
  try {
    // Read the N5 examples file
    const examplesPath = path.join(process.cwd(), 'src', 'data', 'examples', 'n5', 'examples.json');
    const rawData = await fs.readFile(examplesPath, 'utf-8');
    const data: ExamplesFile = JSON.parse(rawData);

    const sentences: SentenceEntry[] = [];

    // Process each kanji and its examples
    for (const [kanji, examples] of Object.entries(data.examples)) {
      for (const example of examples) {
        sentences.push({
          id: uuidv4(),
          japanese: example.japanese,
          english: example.english,
          level: 'N5',
          associatedKanji: [kanji],
          tags: []
        });
      }
    }

    // Create the output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'src', 'data', 'sentences');
    await fs.mkdir(outputDir, { recursive: true });

    // Write the processed sentences to a new file
    const outputPath = path.join(outputDir, 'n5-sentences.json');
    await fs.writeFile(
      outputPath,
      JSON.stringify({ sentences }, null, 2),
      'utf-8'
    );

    console.log(`Successfully extracted ${sentences.length} N5 sentences to ${outputPath}`);
  } catch (error) {
    console.error('Error extracting sentences:', error);
  }
}

// Run the extraction
extractN5Sentences();
