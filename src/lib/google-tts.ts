import { TextToSpeechClient, protos } from '@google-cloud/text-to-speech';
import fs from 'fs';
import path from 'path';

let client: TextToSpeechClient | null = null;

function getClient() {
  if (client) return client;

  try {
    // Read credentials directly from .env.local
    const envFile = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
    
    // Extract everything between the first { and last }
    const match = envFile.match(/GOOGLE_CLOUD_CREDENTIALS=['"]?({[\s\S]*?})['"]?/);
    
    if (!match || !match[1]) {
      throw new Error('GOOGLE_CLOUD_CREDENTIALS not found or invalid in .env.local');
    }

    const credentialsStr = match[1];
    // Removed credentials logging for security
    
    const credentials = JSON.parse(credentialsStr);
    
    client = new TextToSpeechClient({ credentials });
    return client;
  } catch (error) {
    console.error('Error initializing Google Cloud Text-to-Speech:', error);
    throw error;
  }
}

export async function generateSpeech(text: string) {
  const ttsClient = getClient();
  
  const request = {
    input: { text },
    voice: { 
      languageCode: 'ja-JP',
      name: 'ja-JP-Neural2-B' // Male voice
    },
    audioConfig: { 
      audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3,
      speakingRate: 1.0, 
      pitch: 0.0 // Natural pitch
    },
  };

  try {
    const response = await ttsClient.synthesizeSpeech(request);
    if (!response[0].audioContent) {
      throw new Error('No audio content received');
    }
    return Buffer.from(response[0].audioContent as Uint8Array);
  } catch (error) {
    console.error('Error generating speech:', error);
    throw error;
  }
}
