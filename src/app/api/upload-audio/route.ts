import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Check if it's an audio file
    if (!file.type.startsWith('audio/')) {
      return NextResponse.json(
        { error: 'File must be an audio file' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueId = uuidv4();
    const extension = path.extname(file.name);
    const filename = `${uniqueId}${extension}`;

    // Save to public/audio directory
    const publicDir = path.join(process.cwd(), 'public');
    const audioDir = path.join(publicDir, 'audio');
    
    // Create audio directory if it doesn't exist
    try {
      await writeFile(path.join(audioDir, filename), buffer);
    } catch (error) {
      // If directory doesn't exist, create it and try again
      await writeFile(path.join(publicDir, 'audio', filename), buffer);
    }

    // Get audio duration (this would require additional audio processing library)
    // For now, we'll return a placeholder duration
    const duration = 0;

    return NextResponse.json({
      url: `/audio/${filename}`,
      duration: duration,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
}
