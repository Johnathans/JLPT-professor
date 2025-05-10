import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the N5 sentences file directly
    const filePath = path.join(process.cwd(), 'src', 'data', 'sentences', 'n5-sentences.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    return NextResponse.json({
      fileExists: true,
      fileContent: data,
      sentences: data.sentences || [],
      sentencesCount: data.sentences ? data.sentences.length : 0
    });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    return NextResponse.json({
      error: 'Failed to read sentences file',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
