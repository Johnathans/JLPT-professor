interface JishoKanjiReading {
  onyomi: string[];
  kunyomi: string[];
}

interface JishoKanjiResponse {
  data: {
    slug: string;
    japanese: {
      reading: string;
    }[];
    jlpt: string[];
    reading?: JishoKanjiReading;
  }[];
}

export async function getKanjiReadings(kanji: string): Promise<{ onyomi: string; kunyomi: string }> {
  try {
    const response = await fetch(`/api/jisho?kanji=${encodeURIComponent(kanji)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch kanji readings');
    }
    const data = await response.json();

    return {
      onyomi: data.onyomi || '',
      kunyomi: data.kunyomi || '',
    };
  } catch (error) {
    console.error('Error fetching kanji readings:', error);
    return { onyomi: '', kunyomi: '' };
  }
}
