// Google Cloud Text-to-Speech API wrapper
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { openDB } from 'idb';

let ttsClient: TextToSpeechClient | null = null;

export const initTTS = () => {
  if (!ttsClient) {
    ttsClient = new TextToSpeechClient();
  }
  return ttsClient;
};

export const synthesizeSpeech = async (
  text: string,
  languageCode: string = 'ja-JP',
  voiceName: string = 'ja-JP-Neural2-B'
) => {
  try {
    const client = initTTS();
    const request = {
      input: { text },
      voice: { languageCode, name: voiceName },
      audioConfig: { audioEncoding: 'MP3' as const },
    };

    const response = await client.synthesizeSpeech(request);
    const audioContent = response[0].audioContent;
    if (!audioContent || !(audioContent instanceof Uint8Array)) {
      throw new Error('No audio content received');
    }

    // Convert to base64 for web audio
    const audioBase64 = Buffer.from(audioContent.buffer).toString('base64');
    return `data:audio/mp3;base64,${audioBase64}`;
  } catch (error) {
    console.error('Error synthesizing speech:', error);
    throw error;
  }
};

// Cache audio files in IndexedDB for offline use
export const cacheAudio = async (key: string, audioData: string) => {
  try {
    const db = await openDB('jlpt-audio-cache', 1, {
      upgrade(db) {
        db.createObjectStore('audio');
      },
    });
    await db.put('audio', audioData, key);
  } catch (error) {
    console.error('Error caching audio:', error);
  }
};

export const getAudioFromCache = async (key: string) => {
  try {
    const db = await openDB('jlpt-audio-cache', 1);
    return await db.get('audio', key);
  } catch (error) {
    console.error('Error getting audio from cache:', error);
    return null;
  }
};
