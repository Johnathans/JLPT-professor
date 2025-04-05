import { getVoices } from '../lib/elevenlabs';

async function listVoices() {
  try {
    const voices = await getVoices();
    console.log('Available voices:', JSON.stringify(voices, null, 2));
  } catch (error) {
    console.error('Error listing voices:', error);
  }
}

listVoices();
