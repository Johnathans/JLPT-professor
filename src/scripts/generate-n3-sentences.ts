import { loadKanjiList } from '../utils/loadKanjiList';
import fs from 'fs';
import path from 'path';

// Handle graceful shutdown
let isShuttingDown = false;
process.on('SIGINT', () => {
  console.log('\nReceived shutdown signal. Stopping gracefully...');
  isShuttingDown = true;
});

// Timeout wrapper for fetch
async function fetchWithTimeout(url: string, options: RequestInit, timeout = 30000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function generateSentences(level: string, batchNumber: number): Promise<boolean> {
  if (isShuttingDown) {
    console.log('Shutting down, skipping generation...');
    return false;
  }

  try {
    console.log(`Generating batch ${batchNumber} for ${level}...`);
    
    const response = await fetchWithTimeout(
      'http://localhost:3000/api/generate-sentences',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ level, batchNumber })
      },
      180000 // 3 minute timeout for OpenAI request (increased for N3's more complex sentences)
    );

    if (!response.ok) {
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
        const reset = new Date(parseInt(response.headers.get('X-RateLimit-Reset') || '0'));
        
        console.log(`Rate limited. Waiting ${retryAfter} seconds until ${reset.toLocaleTimeString()}`);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        return generateSentences(level, batchNumber);
      }

      const error = await response.json();
      throw new Error(error.error || `HTTP error ${response.status}`);
    }

    const data = await response.json();
    console.log(`✓ Successfully generated batch ${batchNumber} for ${level}`);
    
    // Log what was generated
    if (data.result) {
      const firstKanji = data.result.split('\n\nKanji: ')[1]?.split('\n')[0];
      console.log(`First kanji in batch: ${firstKanji}`);
      console.log(`Remaining batches: ${data.remainingBatches}`);
    }

    return true;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error(`✗ Request timed out for batch ${batchNumber}. This could be because the OpenAI API is taking too long.`);
      } else {
        console.error(`✗ Error generating batch ${batchNumber} for ${level}:`, error.message);
      }
    } else {
      console.error(`✗ Unknown error generating batch ${batchNumber} for ${level}`);
    }
    return false;
  }
}

async function main() {
  try {
    console.log('Starting N3 sentence generation...\n');
    
    // Check if server is reachable with a short timeout
    try {
      const healthCheck = await fetchWithTimeout('http://localhost:3000/api/health', {}, 5000);
      if (!healthCheck.ok) {
        throw new Error(`Server health check failed with status ${healthCheck.status}`);
      }
      console.log('✓ Server is running and healthy');
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Server health check timed out. Is the server running on port 3000?');
      }
      throw new Error('Could not connect to server. Is it running on port 3000?');
    }

    // Load current progress
    const progressPath = path.join(process.cwd(), 'src', 'data', 'jlpt', 'n3', 'sentences', 'index.ts');
    let currentBatch = 0;

    if (fs.existsSync(progressPath)) {
      try {
        const fileContent = await fs.promises.readFile(progressPath, 'utf-8');
        const match = fileContent.match(/export default ([\s\S]+) as const;/);
        if (match) {
          const data = JSON.parse(match[1]);
          currentBatch = data.batchNumber + 1;
          console.log(`Resuming from batch ${currentBatch}`);
        }
      } catch (error) {
        console.error('Error reading progress:', error);
      }
    }

    // Start generating batches
    let success = true;
    while (success && !isShuttingDown) {
      success = await generateSentences('N3', currentBatch);
      if (success) {
        currentBatch++;
        // Add a small delay between batches to avoid rate limiting
        // Increased delay for N3 since sentences are more complex
        if (!isShuttingDown) {
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      } else {
        console.error(`Failed to generate batch ${currentBatch}. Stopping.`);
        break;
      }
    }

    if (isShuttingDown) {
      console.log('\nGracefully stopped sentence generation.');
      console.log(`Progress: Completed ${currentBatch} batches.`);
    } else if (success) {
      console.log('\nCompleted all N3 sentence generation!');
    }

    process.exit(success ? 0 : 1);
  } catch (error) {
    if (error instanceof Error) {
      console.error('\nFatal error:', error.message);
    } else {
      console.error('\nUnknown fatal error occurred');
    }
    process.exit(1);
  }
}

main();
