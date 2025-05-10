import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { level, sentences } = await request.json();
    
    // Validate input
    if (!level || !sentences || !Array.isArray(sentences)) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    // Save to file
    const filePath = path.join(process.cwd(), 'src', 'data', 'sentences', `${level.toLowerCase()}-sentences.json`);
    await fs.writeFile(
      filePath,
      JSON.stringify({ sentences }, null, 2),
      'utf-8'
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving sentences:', error);
    return NextResponse.json(
      { error: 'Failed to save sentences' },
      { status: 500 }
    );
  }
}
