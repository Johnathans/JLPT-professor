'use client';

import { useState } from 'react';
import JlptLevelBadge from '@/components/JlptLevelBadge';
import StrokeOrderDisplay from '@/components/StrokeOrderDisplay';
import { getJlptLevel } from '@/services/jisho-service';
import { ALL_JLPT_KANJI } from '@/utils/jlpt-utils';
import { n5WordsComplete as N5_WORDS } from '@/data/n5-words-complete';
import { n4WordsComplete as N4_WORDS } from '@/data/n4-words-complete';
import styles from '@/styles/word-detail.module.css';

export default function JlptTestPage() {
  const [inputWord, setInputWord] = useState('');
  const [testWord, setTestWord] = useState('');
  const [apiJlptLevel, setApiJlptLevel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Get KanjiData with level property
  const kanjiWithLevel = ALL_JLPT_KANJI.filter(k => 'level' in k) as any[];
  
  // Sample N5 kanji
  const n5Samples = kanjiWithLevel.filter(k => k.level === 'N5' || k.level === '5').slice(0, 10);
  
  // Sample N4 kanji
  const n4Samples = kanjiWithLevel.filter(k => k.level === 'N4' || k.level === '4').slice(0, 10);
  
  // Sample words
  const wordSamples = [...N5_WORDS.slice(0, 5), ...N4_WORDS.slice(0, 5)];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputWord.trim()) return;
    
    setTestWord(inputWord);
    setLoading(true);
    
    try {
      const level = await getJlptLevel(inputWord);
      setApiJlptLevel(level);
    } catch (error) {
      console.error('Error fetching JLPT level:', error);
      setApiJlptLevel(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSampleClick = (sample: string) => {
    setInputWord(sample);
    setTestWord(sample);
    
    // Auto-submit
    getJlptLevel(sample)
      .then(level => setApiJlptLevel(level))
      .catch(error => {
        console.error('Error fetching JLPT level:', error);
        setApiJlptLevel(null);
      });
  };
  
  return (
    <div className={`${styles.container} ${styles.wordDetailContainer} mx-auto p-4`}>
      <h1 className="text-3xl font-bold text-center mb-8 text-purple-800">JLPT Level Test</h1>
      
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-purple-700">Test a Kanji or Word</h2>
        
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputWord}
              onChange={(e) => setInputWord(e.target.value)}
              placeholder="Enter kanji or word"
              className="flex-1 p-2 border border-gray-300 rounded"
            />
            <button 
              type="submit" 
              className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Check JLPT Level'}
            </button>
          </div>
        </form>
        
        {testWord && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Result for: {testWord}</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">JLPT Level Badge Component:</p>
              <JlptLevelBadge word={testWord} />
            </div>
            
            {apiJlptLevel && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">API Result:</p>
                <div className={`${styles.jlptLevelBadge} ${styles[`jlptLevel${apiJlptLevel.match(/n(\d)/i)?.[0].toUpperCase() || apiJlptLevel.toUpperCase()}`]}`}>
                  {apiJlptLevel.match(/n(\d)/i)?.[0].toUpperCase() || apiJlptLevel.toUpperCase()}
                </div>
              </div>
            )}
            
            {testWord.length === 1 && (
              <div className="mt-4">
                <StrokeOrderDisplay kanji={testWord} />
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-purple-700">Sample N5 Kanji</h2>
          <div className="flex flex-wrap gap-2">
            {n5Samples.map((kanji) => (
              <button
                key={kanji.kanji}
                onClick={() => handleSampleClick(kanji.kanji)}
                className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-2 rounded"
              >
                {kanji.kanji}
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-purple-700">Sample N4 Kanji</h2>
          <div className="flex flex-wrap gap-2">
            {n4Samples.map((kanji) => (
              <button
                key={kanji.kanji}
                onClick={() => handleSampleClick(kanji.kanji)}
                className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-2 rounded"
              >
                {kanji.kanji}
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
          <h2 className="text-xl font-bold mb-4 text-purple-700">Sample Words</h2>
          <div className="flex flex-wrap gap-2">
            {wordSamples.map((word) => (
              <button
                key={word.kanji || word.kana}
                onClick={() => handleSampleClick(word.kanji || word.kana)}
                className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-2 rounded"
              >
                {word.kanji || word.kana}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
