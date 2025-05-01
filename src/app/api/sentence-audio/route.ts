import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { generateSpeech } from '@/lib/google-tts';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Create a hash of the text to use as the filename
    const hash = crypto.createHash('md5').update(text).digest('hex');
    
    // Create the audio directory if it doesn't exist
    const audioDir = path.join(process.cwd(), 'public', 'audio', 'sentences');
    await fs.mkdir(audioDir, { recursive: true });

    // Generate the audio file path
    const audioFileName = `${hash}.mp3`;
    const audioPath = path.join(audioDir, audioFileName);
    const publicPath = `/audio/sentences/${audioFileName}`;

    // Generate and save the audio if it doesn't exist
    try {
      await fs.access(audioPath);
    } catch {
      const audioContent = await generateSpeech(text);
      await fs.writeFile(audioPath, audioContent);
    }

    return NextResponse.json({
      url: publicPath,
      text
    });
  } catch (error) {
    console.error('Error generating sentence audio:', error);
    return NextResponse.json({ error: 'Error generating audio' }, { status: 500 });
  }
}
