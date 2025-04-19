import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { generateSpeech } from '@/lib/google-tts';

export async function POST(request: Request) {
  try {
    const { kanji, reading, type } = await request.json();

    // Create the audio directory if it doesn't exist
    const audioDir = path.join(process.cwd(), 'public', 'audio', 'kanji', kanji);
    await fs.mkdir(audioDir, { recursive: true });

    // Generate the audio file path
    const audioFileName = `${kanji}_${type}_${reading}.mp3`;
    const audioPath = path.join(audioDir, audioFileName);
    const publicPath = `/audio/kanji/${kanji}/${audioFileName}`;

    // Generate and save the audio if it doesn't exist
    try {
      await fs.access(audioPath);
    } catch {
      const audioContent = await generateSpeech(reading);
      await fs.writeFile(audioPath, audioContent);
    }

    return NextResponse.json({
      url: publicPath,
      kanji,
      reading,
      type,
    });
  } catch (error) {
    console.error('Error generating kanji audio:', error);
    return NextResponse.json({ error: 'Error generating audio' }, { status: 500 });
  }
}
