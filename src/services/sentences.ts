import { SentenceEntry } from '@/types/sentence';

export async function getSentencesByLevel(level: string): Promise<SentenceEntry[]> {
  try {
    const response = await import(`@/data/sentences/${level.toLowerCase()}-sentences.json`);
    return response.sentences;
  } catch (error) {
    console.error(`Error loading sentences for level ${level}:`, error);
    return [];
  }
}

export async function getAllSentences(): Promise<{ [key: string]: SentenceEntry[] }> {
  const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];
  const allSentences: { [key: string]: SentenceEntry[] } = {};

  for (const level of levels) {
    try {
      allSentences[level] = await getSentencesByLevel(level);
    } catch (error) {
      console.error(`Error loading ${level} sentences:`, error);
      allSentences[level] = [];
    }
  }

  return allSentences;
}

export async function saveSentence(sentence: SentenceEntry, isEdit: boolean = false): Promise<boolean> {
  try {
    // Get current sentences for the level
    const currentSentences = await getSentencesByLevel(sentence.level);
    
    let updatedSentences: SentenceEntry[];
    
    if (isEdit) {
      // Update existing sentence
      updatedSentences = currentSentences.map(s => 
        s.id === sentence.id ? sentence : s
      );
    } else {
      // Add new sentence
      updatedSentences = [...currentSentences, sentence];
    }
    
    // Save back to file
    const response = await fetch('/api/sentences/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        level: sentence.level,
        sentences: updatedSentences,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save sentence');
    }

    return true;
  } catch (error) {
    console.error('Error saving sentence:', error);
    return false;
  }
}
