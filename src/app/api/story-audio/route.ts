import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { generateSpeech } from '@/lib/google-tts';

export async function POST(request: Request) {
  try {
    const { text, storyId, paragraphId } = await request.json();

    // Create the audio directory if it doesn't exist
    const audioDir = path.join(process.cwd(), 'public', 'audio', 'stories', storyId);
    await fs.mkdir(audioDir, { recursive: true });

    // Generate the audio file path
    const audioFileName = `paragraph_${paragraphId}.mp3`;
    const audioPath = path.join(audioDir, audioFileName);
    const publicPath = `/audio/stories/${storyId}/${audioFileName}`;

    // Generate and save the audio if it doesn't exist
    try {
      await fs.access(audioPath);
    } catch {
      const audioContent = await generateSpeech(text);
      await fs.writeFile(audioPath, audioContent);
    }

    return NextResponse.json({
      url: publicPath,
      storyId,
      paragraphId,
    });
  } catch (error) {
    console.error('Error generating story audio:', error);
    return NextResponse.json({ error: 'Error generating audio' }, { status: 500 });
  }
}
