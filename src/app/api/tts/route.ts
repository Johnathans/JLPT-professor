import { NextResponse } from 'next/server';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Initialize the client with credentials from environment variable
let client: TextToSpeechClient | null = null;
try {
  // Get credentials from environment variable
  const credentials = process.env.GOOGLE_CLOUD_CREDENTIALS;
  
  if (!credentials) {
    console.error('GOOGLE_CLOUD_CREDENTIALS environment variable is not set');
  } else {
    // Parse the credentials JSON string
    const parsedCredentials = JSON.parse(credentials);
    
    // Initialize the client with the credentials
    client = new TextToSpeechClient({
      credentials: parsedCredentials
    });
    
    console.log('TextToSpeechClient initialized successfully with credentials from environment');
  }
} catch (error) {
  console.error('Error initializing TextToSpeechClient:', error);
}

export async function POST(request: Request) {
  try {
    console.log('TTS API request received');
    
    // Check if client was initialized
    if (!client) {
      console.error('TextToSpeechClient not initialized');
      return NextResponse.json({ error: 'TextToSpeechClient not initialized' }, { status: 500 });
    }
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { text, languageCode = 'ja-JP', voiceName = 'ja-JP-Neural2-B' } = body;

    if (!text) {
      console.error('Text is required but not provided');
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Configure the request
    const request_config = {
      input: { text },
      voice: {
        languageCode,
        name: voiceName,
      },
      audioConfig: { audioEncoding: 'MP3' },
    };
    
    console.log('TTS request config:', request_config);

    // Generate a unique filename
    const fileName = `${uuidv4()}.mp3`;
    const publicDir = path.join(process.cwd(), 'public');
    const audioDir = path.join(publicDir, 'audio');
    const filePath = path.join(audioDir, fileName);
    
    console.log('File paths:', { publicDir, audioDir, filePath });
    
    // Ensure the directory exists
    if (!fs.existsSync(audioDir)) {
      console.log('Creating audio directory');
      fs.mkdirSync(audioDir, { recursive: true });
    } else {
      console.log('Audio directory already exists');
    }

    // Call the TTS API
    console.log('Calling synthesizeSpeech...');
    const [response] = await client.synthesizeSpeech(request_config as any);
    console.log('synthesizeSpeech response received');
    
    // Write the audio content to a file
    console.log('Writing audio content to file...');
    fs.writeFileSync(filePath, response.audioContent as Buffer);
    console.log('Audio file written successfully');

    // Return the URL to the audio file
    const audioUrl = `/audio/${fileName}`;
    console.log('Audio URL:', audioUrl);
    return NextResponse.json({ 
      audioUrl,
      success: true 
    });
  } catch (error) {
    console.error('TTS API error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    console.error('Error details:', { message: errorMessage, stack: errorStack });
    
    return NextResponse.json({ 
      error: 'Failed to generate audio',
      details: errorMessage,
      stack: errorStack
    }, { status: 500 });
  }
}
