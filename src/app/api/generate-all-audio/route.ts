import { NextResponse } from 'next/server';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getSentencesByLevel, saveSentence } from '@/services/sentences';
import { SentenceEntry } from '@/types/sentence';

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
  }
} catch (error) {
  console.error('Error initializing TextToSpeechClient:', error);
}

export async function GET() {
  try {
    if (!client) {
      return NextResponse.json({ 
        error: 'TextToSpeechClient not initialized',
        success: false
      }, { status: 500 });
    }

    // Get all N5 sentences
    const sentences = await getSentencesByLevel('N5');
    console.log(`Found ${sentences.length} N5 sentences`);
    
    const results = {
      total: sentences.length,
      processed: 0,
      success: 0,
      failed: 0,
      skipped: 0,
      details: [] as any[]
    };

    // Ensure the audio directory exists
    const publicDir = path.join(process.cwd(), 'public');
    const audioDir = path.join(publicDir, 'audio');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    // Process each sentence
    for (const sentence of sentences) {
      results.processed++;
      
      // Skip if already has audio
      if (sentence.audioUrl) {
        results.skipped++;
        results.details.push({
          id: sentence.id,
          japanese: sentence.japanese,
          status: 'skipped',
          reason: 'Already has audio'
        });
        continue;
      }

      try {
        // Generate a unique filename
        const fileName = `${uuidv4()}.mp3`;
        const filePath = path.join(audioDir, fileName);
        
        // Configure the request
        const request_config = {
          input: { text: sentence.japanese },
          voice: {
            languageCode: 'ja-JP',
            name: 'ja-JP-Neural2-B',
          },
          audioConfig: { audioEncoding: 'MP3' },
        };
        
        // Call the TTS API
        const [response] = await client.synthesizeSpeech(request_config as any);
        
        // Write the audio content to a file
        fs.writeFileSync(filePath, response.audioContent as Buffer);
        
        // Update the sentence with the audio URL
        const audioUrl = `/audio/${fileName}`;
        const updatedSentence: SentenceEntry = {
          ...sentence,
          audioUrl
        };
        
        // Save the updated sentence
        await saveSentence(updatedSentence, true);
        
        results.success++;
        results.details.push({
          id: sentence.id,
          japanese: sentence.japanese,
          status: 'success',
          audioUrl
        });
      } catch (error) {
        console.error(`Error generating audio for sentence ${sentence.id}:`, error);
        results.failed++;
        results.details.push({
          id: sentence.id,
          japanese: sentence.japanese,
          status: 'failed',
          error: error instanceof Error ? error.message : String(error)
        });
      }
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return NextResponse.json({
      success: true,
      results
    });
  } catch (error) {
    console.error('Error generating audio for all sentences:', error);
    return NextResponse.json({ 
      error: 'Failed to generate audio for all sentences',
      details: error instanceof Error ? error.message : String(error),
      success: false
    }, { status: 500 });
  }
}
