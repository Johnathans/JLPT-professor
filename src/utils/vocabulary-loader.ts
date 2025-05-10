import fs from 'fs';
import path from 'path';
import { VocabularyData } from '@/types/vocabulary';

/**
 * Loads vocabulary data from CSV files for all JLPT levels
 */
export async function loadAllVocabulary(): Promise<VocabularyData[]> {
  const levels = ['n1', 'n2', 'n3', 'n4', 'n5'];
  let allVocabulary: VocabularyData[] = [];

  for (const level of levels) {
    const levelVocabulary = await loadVocabularyForLevel(level);
    allVocabulary = [...allVocabulary, ...levelVocabulary];
  }

  return allVocabulary;
}

/**
 * Loads vocabulary data from a CSV file for a specific JLPT level
 */
export async function loadVocabularyForLevel(level: string): Promise<VocabularyData[]> {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'vocabulary', `${level}-words.csv`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    const lines = fileContents.split('\n').filter(line => line.trim() !== '');
    
    return lines.map((line, index) => {
      const [word, reading, meaning] = line.split(',');
      
      return {
        id: `${level}-${index}`, // Generate a unique ID
        word: word || '',
        reading: reading || '',
        meaning: meaning || '',
        jlptLevel: level,
        partOfSpeech: determinePartOfSpeech(meaning || ''),
        frequencyRank: index + 1, // Use index as a simple frequency rank
        tags: generateTags(meaning || '', level),
      };
    });
  } catch (error) {
    console.error(`Error loading vocabulary for level ${level}:`, error);
    return [];
  }
}

/**
 * Simple heuristic to determine part of speech based on meaning
 * This is a basic implementation and could be improved
 */
function determinePartOfSpeech(meaning: string): string {
  const lowerMeaning = meaning.toLowerCase();
  
  if (lowerMeaning.startsWith('to ')) {
    return 'verb';
  } else if (lowerMeaning.includes('adjective') || lowerMeaning.endsWith('ful') || lowerMeaning.endsWith('ous')) {
    return 'adjective';
  } else if (lowerMeaning.endsWith('ly')) {
    return 'adverb';
  } else if (lowerMeaning.includes('particle') || lowerMeaning.includes('suffix') || lowerMeaning.includes('prefix')) {
    return 'particle';
  } else if (lowerMeaning.includes('expression') || lowerMeaning.includes('greeting')) {
    return 'expression';
  } else if (lowerMeaning.includes('counter') || lowerMeaning.includes('number')) {
    return 'counter';
  } else if (lowerMeaning.includes('pronoun')) {
    return 'pronoun';
  } else {
    return 'noun';
  }
}

/**
 * Generate tags based on meaning and level
 */
function generateTags(meaning: string, level: string): string[] {
  const tags: string[] = [level];
  const lowerMeaning = meaning.toLowerCase();
  
  // Add category tags based on meaning
  if (lowerMeaning.includes('food') || lowerMeaning.includes('eat') || lowerMeaning.includes('drink')) {
    tags.push('food');
  }
  
  if (lowerMeaning.includes('time') || lowerMeaning.includes('day') || lowerMeaning.includes('week') || 
      lowerMeaning.includes('month') || lowerMeaning.includes('year')) {
    tags.push('time');
  }
  
  if (lowerMeaning.includes('place') || lowerMeaning.includes('location') || 
      lowerMeaning.includes('direction') || lowerMeaning.includes('position')) {
    tags.push('location');
  }
  
  if (lowerMeaning.includes('person') || lowerMeaning.includes('people')) {
    tags.push('people');
  }
  
  // Add common tag for basic vocabulary
  if (level === 'n5') {
    tags.push('basic');
  }
  
  return tags;
}
