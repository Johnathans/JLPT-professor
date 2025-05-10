import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { VocabularyData } from '@/types/vocabulary';

/**
 * API route to fetch vocabulary data for study mode
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get('level') || 'n5';
  
  try {
    const vocabularyData = await loadVocabularyForLevel(level);
    return NextResponse.json(vocabularyData);
  } catch (error) {
    console.error('Error loading vocabulary:', error);
    return NextResponse.json(
      { error: 'Failed to load vocabulary data' },
      { status: 500 }
    );
  }
}

/**
 * Loads vocabulary data from a CSV file for a specific JLPT level
 */
async function loadVocabularyForLevel(level: string): Promise<VocabularyData[]> {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'vocabulary', `${level}-words.csv`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    const lines = fileContents.split('\n').filter(line => line.trim() !== '');
    
    return lines.map((line, index) => {
      const [word, reading, meaning] = line.split(',');
      
      return {
        id: `${level}-${index}`,
        word: word || '',
        reading: reading || '',
        meaning: meaning || '',
        jlptLevel: level,
        partOfSpeech: determinePartOfSpeech(meaning || ''),
        frequencyRank: index + 1,
        tags: [level],
      };
    });
  } catch (error) {
    console.error(`Error loading vocabulary for level ${level}:`, error);
    return [];
  }
}

/**
 * Simple heuristic to determine part of speech based on meaning
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
