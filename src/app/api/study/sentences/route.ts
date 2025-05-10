import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { SentenceEntry } from '@/types/sentence';

/**
 * API route to fetch sentence data for study mode
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get('level') || 'n5';
  
  try {
    // Validate the level parameter
    const normalizedLevel = level.toLowerCase();
    if (!['n1', 'n2', 'n3', 'n4', 'n5'].includes(normalizedLevel)) {
      return NextResponse.json(
        { error: 'Invalid JLPT level' },
        { status: 400 }
      );
    }
    
    // Read the sentences file directly
    const filePath = path.join(process.cwd(), 'src', 'data', 'sentences', `${normalizedLevel}-sentences.json`);
    console.log(`Reading sentences from: ${filePath}`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`Sentences file not found: ${filePath}`);
      return NextResponse.json([], { status: 404 });
    }
    
    // Read and parse the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    // Extract the sentences array
    const sentences = data.sentences || [];
    
    if (sentences.length === 0) {
      console.log(`No sentences found in file for level ${normalizedLevel}`);
      return NextResponse.json([]);
    }
    
    // Filter sentences that have at least one associated kanji
    const filteredSentences = sentences.filter((sentence: SentenceEntry) => 
      sentence.associatedKanji && sentence.associatedKanji.length > 0
    );
    
    console.log(`Found ${filteredSentences.length} sentences with associated kanji for level ${normalizedLevel}`);
    
    return NextResponse.json(filteredSentences);
  } catch (error) {
    console.error('Error loading sentences:', error);
    return NextResponse.json(
      { error: 'Failed to load sentences data', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
