'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './katakana-match.module.css';

const KATAKANA_CHARACTERS = {
  basic: [
    { kana: 'ア', romaji: 'a' }, { kana: 'イ', romaji: 'i' }, { kana: 'ウ', romaji: 'u' }, 
    { kana: 'エ', romaji: 'e' }, { kana: 'オ', romaji: 'o' }, { kana: 'カ', romaji: 'ka' }, 
    { kana: 'キ', romaji: 'ki' }, { kana: 'ク', romaji: 'ku' }, { kana: 'ケ', romaji: 'ke' }, 
    { kana: 'コ', romaji: 'ko' }, { kana: 'サ', romaji: 'sa' }, { kana: 'シ', romaji: 'shi' }, 
    { kana: 'ス', romaji: 'su' }, { kana: 'セ', romaji: 'se' }, { kana: 'ソ', romaji: 'so' }, 
    { kana: 'タ', romaji: 'ta' }, { kana: 'チ', romaji: 'chi' }, { kana: 'ツ', romaji: 'tsu' }, 
    { kana: 'テ', romaji: 'te' }, { kana: 'ト', romaji: 'to' }, { kana: 'ナ', romaji: 'na' }, 
    { kana: 'ニ', romaji: 'ni' }, { kana: 'ヌ', romaji: 'nu' }, { kana: 'ネ', romaji: 'ne' }, 
    { kana: 'ノ', romaji: 'no' }, { kana: 'ハ', romaji: 'ha' }, { kana: 'ヒ', romaji: 'hi' }, 
    { kana: 'フ', romaji: 'fu' }, { kana: 'ヘ', romaji: 'he' }, { kana: 'ホ', romaji: 'ho' }, 
    { kana: 'マ', romaji: 'ma' }, { kana: 'ミ', romaji: 'mi' }, { kana: 'ム', romaji: 'mu' }, 
    { kana: 'メ', romaji: 'me' }, { kana: 'モ', romaji: 'mo' }, { kana: 'ヤ', romaji: 'ya' }, 
    { kana: 'ユ', romaji: 'yu' }, { kana: 'ヨ', romaji: 'yo' }, { kana: 'ラ', romaji: 'ra' }, 
    { kana: 'リ', romaji: 'ri' }, { kana: 'ル', romaji: 'ru' }, { kana: 'レ', romaji: 're' }, 
    { kana: 'ロ', romaji: 'ro' }, { kana: 'ワ', romaji: 'wa' }, { kana: 'ヲ', romaji: 'wo' }, 
    { kana: 'ン', romaji: 'n' }
  ],
  dakuten: [
    { kana: 'ガ', romaji: 'ga' }, { kana: 'ギ', romaji: 'gi' }, { kana: 'グ', romaji: 'gu' }, 
    { kana: 'ゲ', romaji: 'ge' }, { kana: 'ゴ', romaji: 'go' }, { kana: 'ザ', romaji: 'za' }, 
    { kana: 'ジ', romaji: 'ji' }, { kana: 'ズ', romaji: 'zu' }, { kana: 'ゼ', romaji: 'ze' }, 
    { kana: 'ゾ', romaji: 'zo' }, { kana: 'ダ', romaji: 'da' }, { kana: 'ヂ', romaji: 'ji' }, 
    { kana: 'ヅ', romaji: 'zu' }, { kana: 'デ', romaji: 'de' }, { kana: 'ド', romaji: 'do' }, 
    { kana: 'バ', romaji: 'ba' }, { kana: 'ビ', romaji: 'bi' }, { kana: 'ブ', romaji: 'bu' }, 
    { kana: 'ベ', romaji: 'be' }, { kana: 'ボ', romaji: 'bo' }, { kana: 'パ', romaji: 'pa' }, 
    { kana: 'ピ', romaji: 'pi' }, { kana: 'プ', romaji: 'pu' }, { kana: 'ペ', romaji: 'pe' }, 
    { kana: 'ポ', romaji: 'po' }
  ],
  combo: [
    { kana: 'キャ', romaji: 'kya' }, { kana: 'キュ', romaji: 'kyu' }, { kana: 'キョ', romaji: 'kyo' },
    { kana: 'シャ', romaji: 'sha' }, { kana: 'シュ', romaji: 'shu' }, { kana: 'ショ', romaji: 'sho' },
    { kana: 'チャ', romaji: 'cha' }, { kana: 'チュ', romaji: 'chu' }, { kana: 'チョ', romaji: 'cho' },
    { kana: 'ニャ', romaji: 'nya' }, { kana: 'ニュ', romaji: 'nyu' }, { kana: 'ニョ', romaji: 'nyo' },
    { kana: 'ヒャ', romaji: 'hya' }, { kana: 'ヒュ', romaji: 'hyu' }, { kana: 'ヒョ', romaji: 'hyo' },
    { kana: 'ミャ', romaji: 'mya' }, { kana: 'ミュ', romaji: 'myu' }, { kana: 'ミョ', romaji: 'myo' },
    { kana: 'リャ', romaji: 'rya' }, { kana: 'リュ', romaji: 'ryu' }, { kana: 'リョ', romaji: 'ryo' },
    { kana: 'ギャ', romaji: 'gya' }, { kana: 'ギュ', romaji: 'gyu' }, { kana: 'ギョ', romaji: 'gyo' },
    { kana: 'ジャ', romaji: 'ja' }, { kana: 'ジュ', romaji: 'ju' }, { kana: 'ジョ', romaji: 'jo' },
    { kana: 'ビャ', romaji: 'bya' }, { kana: 'ビュ', romaji: 'byu' }, { kana: 'ビョ', romaji: 'byo' },
    { kana: 'ピャ', romaji: 'pya' }, { kana: 'ピュ', romaji: 'pyu' }, { kana: 'ピョ', romaji: 'pyo' }
  ]
};

export default function KatakanaMatchPage() {
  const router = useRouter();
  const [selectedCharacters, setSelectedCharacters] = useState<Set<string>>(new Set());
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleCharacterToggle = (character: string) => {
    const newSelected = new Set(selectedCharacters);
    if (newSelected.has(character)) {
      newSelected.delete(character);
    } else {
      newSelected.add(character);
    }
    setSelectedCharacters(newSelected);
  };

  const handleStartGame = () => {
    if (selectedCharacters.size === 0) {
      alert('Please select at least one character');
      return;
    }
    const characters = Array.from(selectedCharacters);
    router.push(`/resources/katakana-match/play?characters=${characters.join(',')}`);
  };

  const handleSelectGroup = (group: 'basic' | 'dakuten' | 'combo') => {
    const newSelected = new Set(selectedCharacters);
    KATAKANA_CHARACTERS[group].forEach(char => {
      newSelected.add(char.kana);
    });
    setSelectedCharacters(newSelected);
  };

  const handleDeselectGroup = (group: 'basic' | 'dakuten' | 'combo') => {
    const newSelected = new Set(selectedCharacters);
    KATAKANA_CHARACTERS[group].forEach(char => {
      newSelected.delete(char.kana);
    });
    setSelectedCharacters(newSelected);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/resources" className={styles.backLink}>
          <ArrowLeft size={20} />
          Back to Resources
        </Link>
      </div>

      <div className={styles.landingContent}>
        <div className={styles.landingLeft}>
          <h1 className={styles.landingTitle}>Katakana Match</h1>
          <div className={styles.gameDescription}>
            <p>Master katakana with our interactive matching game! Select characters to practice and match them with their romaji readings.</p>
            <ul>
              <li>Practice basic katakana (e.g. ア, カ, サ)</li>
              <li>Learn modified sounds (e.g. ガ, ザ, ダ)</li>
              <li>Master combination characters (e.g. キャ, シャ, チャ)</li>
              <li>Track your progress</li>
            </ul>
          </div>

          <div className={styles.gameSettings}>
            <div className={styles.settingGroup}>
              <button 
                onClick={() => toggleSection('basic')}
                className={styles.sectionToggle}
              >
                Basic Katakana (e.g. ア, カ, サ)
              </button>
              {expandedSection === 'basic' && (
                <div className={styles.characterSection}>
                  <div className={styles.sectionControls}>
                    <button onClick={() => handleSelectGroup('basic')} className={styles.controlButton}>
                      Select All
                    </button>
                    <button onClick={() => handleDeselectGroup('basic')} className={styles.controlButton}>
                      Deselect All
                    </button>
                  </div>
                  <div className={styles.characterGrid}>
                    {KATAKANA_CHARACTERS.basic.map(char => (
                      <button
                        key={char.kana}
                        onClick={() => handleCharacterToggle(char.kana)}
                        className={`${styles.characterButton} ${
                          selectedCharacters.has(char.kana) ? styles.selected : ''
                        }`}
                      >
                        <span className={styles.kana}>{char.kana}</span>
                        <span className={styles.romaji}>{char.romaji}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button 
                onClick={() => toggleSection('dakuten')}
                className={styles.sectionToggle}
              >
                Modified Sounds (e.g. ガ, ザ, ダ)
              </button>
              {expandedSection === 'dakuten' && (
                <div className={styles.characterSection}>
                  <div className={styles.sectionControls}>
                    <button onClick={() => handleSelectGroup('dakuten')} className={styles.controlButton}>
                      Select All
                    </button>
                    <button onClick={() => handleDeselectGroup('dakuten')} className={styles.controlButton}>
                      Deselect All
                    </button>
                  </div>
                  <div className={styles.characterGrid}>
                    {KATAKANA_CHARACTERS.dakuten.map(char => (
                      <button
                        key={char.kana}
                        onClick={() => handleCharacterToggle(char.kana)}
                        className={`${styles.characterButton} ${
                          selectedCharacters.has(char.kana) ? styles.selected : ''
                        }`}
                      >
                        <span className={styles.kana}>{char.kana}</span>
                        <span className={styles.romaji}>{char.romaji}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button 
                onClick={() => toggleSection('combo')}
                className={styles.sectionToggle}
              >
                Combined Characters (e.g. キャ, シャ, チャ)
              </button>
              {expandedSection === 'combo' && (
                <div className={styles.characterSection}>
                  <div className={styles.sectionControls}>
                    <button onClick={() => handleSelectGroup('combo')} className={styles.controlButton}>
                      Select All
                    </button>
                    <button onClick={() => handleDeselectGroup('combo')} className={styles.controlButton}>
                      Deselect All
                    </button>
                  </div>
                  <div className={styles.characterGrid}>
                    {KATAKANA_CHARACTERS.combo.map(char => (
                      <button
                        key={char.kana}
                        onClick={() => handleCharacterToggle(char.kana)}
                        className={`${styles.characterButton} ${
                          selectedCharacters.has(char.kana) ? styles.selected : ''
                        }`}
                      >
                        <span className={styles.kana}>{char.kana}</span>
                        <span className={styles.romaji}>{char.romaji}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.settingGroup}>
                <button 
                  onClick={handleStartGame}
                  className={styles.playButton}
                  disabled={selectedCharacters.size === 0}
                >
                  Start Game ({selectedCharacters.size} characters)
                </button>
              </div>
            </div>

          </div>
        </div>

        <div className={styles.gamePreview}>
          <Image 
            src="/images/katakana-match-preview.png"
            alt="Katakana Match Game Preview"
            fill
            className={styles.screenshot}
            priority
          />
        </div>
      </div>
    </div>
  );
}
