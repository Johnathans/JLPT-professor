'use client';

import { useState } from 'react';

interface KanjiData {
  kanji: string;
  jlpt: number | null;
  meanings: string[];
  readings: {
    on: string[];
    kun: string[];
  };
  info: {
    grade: number;
    strokeCount: number;
    unicode: string;
  };
}

export default function KanjiApiTest() {
  const [kanji, setKanji] = useState('');
  const [data, setData] = useState<KanjiData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchKanjiData = async () => {
    if (!kanji) return;
    
    setLoading(true);
    setError('');
    setData(null);

    try {
      const response = await fetch(`/api/kanji/${encodeURIComponent(kanji)}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch kanji data');
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Kanji API Test</h1>
      
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={kanji}
          onChange={(e) => setKanji(e.target.value)}
          placeholder="Enter a kanji character"
          className="px-4 py-2 border rounded flex-grow"
          maxLength={1}
        />
        <button
          onClick={fetchKanjiData}
          disabled={loading || !kanji}
          className={`px-6 py-2 rounded text-white ${
            loading || !kanji 
              ? 'bg-gray-400' 
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {loading ? 'Loading...' : 'Search'}
        </button>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {data && (
        <div className="space-y-6">
          <div className="flex items-start gap-6">
            <div className="text-8xl font-bold">{data.kanji}</div>
            <div>
              <div className="text-sm text-gray-600">
                Grade {data.info.grade} • JLPT N{data.jlpt || '?'} • {data.info.strokeCount} strokes
              </div>
              <div className="mt-2 text-lg font-medium">
                {data.meanings.join(', ')}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">On&#39;yomi</h2>
              <div className="p-4 bg-gray-50 rounded">
                {data.readings.on.length > 0 
                  ? data.readings.on.join('、')
                  : 'None'}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Kun&#39;yomi</h2>
              <div className="p-4 bg-gray-50 rounded">
                {data.readings.kun.length > 0 
                  ? data.readings.kun.join('、')
                  : 'None'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
