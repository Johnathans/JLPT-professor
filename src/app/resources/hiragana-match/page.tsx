'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './hiragana-match.module.css';

const HIRAGANA_CHARACTERS = {
  basic: [
    { kana: 'あ', romaji: 'a' },
    { kana: 'い', romaji: 'i' },
    { kana: 'う', romaji: 'u' },
    { kana: 'え', romaji: 'e' },
    { kana: 'お', romaji: 'o' },
    { kana: 'か', romaji: 'ka' },
    { kana: 'き', romaji: 'ki' },
    { kana: 'く', romaji: 'ku' },
    { kana: 'け', romaji: 'ke' },
    { kana: 'こ', romaji: 'ko' },
    { kana: 'さ', romaji: 'sa' },
    { kana: 'し', romaji: 'shi' },
    { kana: 'す', romaji: 'su' },
    { kana: 'せ', romaji: 'se' },
    { kana: 'そ', romaji: 'so' },
    { kana: 'た', romaji: 'ta' },
    { kana: 'ち', romaji: 'chi' },
    { kana: 'つ', romaji: 'tsu' },
    { kana: 'て', romaji: 'te' },
    { kana: 'と', romaji: 'to' },
    { kana: 'な', romaji: 'na' },
    { kana: 'に', romaji: 'ni' },
    { kana: 'ぬ', romaji: 'nu' },
    { kana: 'ね', romaji: 'ne' },
    { kana: 'の', romaji: 'no' },
    { kana: 'は', romaji: 'ha' },
    { kana: 'ひ', romaji: 'hi' },
    { kana: 'ふ', romaji: 'fu' },
    { kana: 'へ', romaji: 'he' },
    { kana: 'ほ', romaji: 'ho' },
    { kana: 'ま', romaji: 'ma' },
    { kana: 'み', romaji: 'mi' },
    { kana: 'む', romaji: 'mu' },
    { kana: 'め', romaji: 'me' },
    { kana: 'も', romaji: 'mo' },
    { kana: 'や', romaji: 'ya' },
    { kana: 'ゆ', romaji: 'yu' },
    { kana: 'よ', romaji: 'yo' },
    { kana: 'ら', romaji: 'ra' },
    { kana: 'り', romaji: 'ri' },
    { kana: 'る', romaji: 'ru' },
    { kana: 'れ', romaji: 're' },
    { kana: 'ろ', romaji: 'ro' },
    { kana: 'わ', romaji: 'wa' },
    { kana: 'を', romaji: 'wo' },
    { kana: 'ん', romaji: 'n' }
  ],
  dakuten: [
    { kana: 'が', romaji: 'ga' },
    { kana: 'ぎ', romaji: 'gi' },
    { kana: 'ぐ', romaji: 'gu' },
    { kana: 'げ', romaji: 'ge' },
    { kana: 'ご', romaji: 'go' },
    { kana: 'ざ', romaji: 'za' },
    { kana: 'じ', romaji: 'ji' },
    { kana: 'ず', romaji: 'zu' },
    { kana: 'ぜ', romaji: 'ze' },
    { kana: 'ぞ', romaji: 'zo' },
    { kana: 'だ', romaji: 'da' },
    { kana: 'ぢ', romaji: 'ji' },
    { kana: 'づ', romaji: 'zu' },
    { kana: 'で', romaji: 'de' },
    { kana: 'ど', romaji: 'do' },
    { kana: 'ば', romaji: 'ba' },
    { kana: 'び', romaji: 'bi' },
    { kana: 'ぶ', romaji: 'bu' },
    { kana: 'べ', romaji: 'be' },
    { kana: 'ぼ', romaji: 'bo' },
    { kana: 'ぱ', romaji: 'pa' },
    { kana: 'ぴ', romaji: 'pi' },
    { kana: 'ぷ', romaji: 'pu' },
    { kana: 'ぺ', romaji: 'pe' },
    { kana: 'ぽ', romaji: 'po' }
  ],
  combo: [
    { kana: 'きゃ', romaji: 'kya' },
    { kana: 'きゅ', romaji: 'kyu' },
    { kana: 'きょ', romaji: 'kyo' },
    { kana: 'しゃ', romaji: 'sha' },
    { kana: 'しゅ', romaji: 'shu' },
    { kana: 'しょ', romaji: 'sho' },
    { kana: 'ちゃ', romaji: 'cha' },
    { kana: 'ちゅ', romaji: 'chu' },
    { kana: 'ちょ', romaji: 'cho' },
    { kana: 'にゃ', romaji: 'nya' },
    { kana: 'にゅ', romaji: 'nyu' },
    { kana: 'にょ', romaji: 'nyo' },
    { kana: 'ひゃ', romaji: 'hya' },
    { kana: 'ひゅ', romaji: 'hyu' },
    { kana: 'ひょ', romaji: 'hyo' },
    { kana: 'みゃ', romaji: 'mya' },
    { kana: 'みゅ', romaji: 'myu' },
    { kana: 'みょ', romaji: 'myo' },
    { kana: 'りゃ', romaji: 'rya' },
    { kana: 'りゅ', romaji: 'ryu' },
    { kana: 'りょ', romaji: 'ryo' },
    { kana: 'ぎゃ', romaji: 'gya' },
    { kana: 'ぎゅ', romaji: 'gyu' },
    { kana: 'ぎょ', romaji: 'gyo' },
    { kana: 'じゃ', romaji: 'ja' },
    { kana: 'じゅ', romaji: 'ju' },
    { kana: 'じょ', romaji: 'jo' },
    { kana: 'びゃ', romaji: 'bya' },
    { kana: 'びゅ', romaji: 'byu' },
    { kana: 'びょ', romaji: 'byo' },
    { kana: 'ぴゃ', romaji: 'pya' },
    { kana: 'ぴゅ', romaji: 'pyu' },
    { kana: 'ぴょ', romaji: 'pyo' }
  ]
};

export default function HiraganaMatchPage() {
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

    // Map selected characters to their groups
    const groupMap: { [key: string]: boolean } = {
      // Basic groups
      'a': false, 'ka': false, 'sa': false, 'ta': false,
      'na': false, 'ha': false, 'ma': false, 'ya': false,
      'ra': false, 'wa': false,
      // Dakuten groups
      'ga': false, 'za': false, 'da': false, 'ba': false, 'pa': false,
      // Combo groups
      'kya': false, 'sha': false, 'cha': false, 'nya': false,
      'hya': false, 'mya': false, 'rya': false, 'gya': false,
      'ja': false, 'bya': false, 'pya': false
    };

    // Check which groups are selected based on characters
    selectedCharacters.forEach(char => {
      // Basic groups
      if ('あいうえお'.includes(char)) groupMap['a'] = true;
      if ('かきくけこ'.includes(char)) groupMap['ka'] = true;
      if ('さしすせそ'.includes(char)) groupMap['sa'] = true;
      if ('たちつてと'.includes(char)) groupMap['ta'] = true;
      if ('なにぬねの'.includes(char)) groupMap['na'] = true;
      if ('はひふへほ'.includes(char)) groupMap['ha'] = true;
      if ('まみむめも'.includes(char)) groupMap['ma'] = true;
      if ('やゆよ'.includes(char)) groupMap['ya'] = true;
      if ('らりるれろ'.includes(char)) groupMap['ra'] = true;
      if ('わをん'.includes(char)) groupMap['wa'] = true;

      // Dakuten groups
      if ('がぎぐげご'.includes(char)) groupMap['ga'] = true;
      if ('ざじずぜぞ'.includes(char)) groupMap['za'] = true;
      if ('だぢづでど'.includes(char)) groupMap['da'] = true;
      if ('ばびぶべぼ'.includes(char)) groupMap['ba'] = true;
      if ('ぱぴぷぺぽ'.includes(char)) groupMap['pa'] = true;

      // Combo groups
      if ('きゃきゅきょ'.includes(char)) groupMap['kya'] = true;
      if ('しゃしゅしょ'.includes(char)) groupMap['sha'] = true;
      if ('ちゃちゅちょ'.includes(char)) groupMap['cha'] = true;
      if ('にゃにゅにょ'.includes(char)) groupMap['nya'] = true;
      if ('ひゃひゅひょ'.includes(char)) groupMap['hya'] = true;
      if ('みゃみゅみょ'.includes(char)) groupMap['mya'] = true;
      if ('りゃりゅりょ'.includes(char)) groupMap['rya'] = true;
      if ('ぎゃぎゅぎょ'.includes(char)) groupMap['gya'] = true;
      if ('じゃじゅじょ'.includes(char)) groupMap['ja'] = true;
      if ('びゃびゅびょ'.includes(char)) groupMap['bya'] = true;
      if ('ぴゃぴゅぴょ'.includes(char)) groupMap['pya'] = true;
    });

    // Get selected groups
    const selectedGroups = Object.entries(groupMap)
      .filter(([_, selected]) => selected)
      .map(([group, _]) => group);

    router.push(`/resources/hiragana-match/play?groups=${selectedGroups.join(',')}&count=${selectedCharacters.size}`);
  };

  const handleSelectGroup = (group: 'basic' | 'dakuten' | 'combo') => {
    const newSelected = new Set(selectedCharacters);
    HIRAGANA_CHARACTERS[group].forEach(char => {
      newSelected.add(char.kana);
    });
    setSelectedCharacters(newSelected);
  };

  const handleDeselectGroup = (group: 'basic' | 'dakuten' | 'combo') => {
    const newSelected = new Set(selectedCharacters);
    HIRAGANA_CHARACTERS[group].forEach(char => {
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
          <h1 className={styles.landingTitle}>Hiragana Match</h1>
          
          <div className={styles.gameDescription}>
            <p>Master hiragana with our interactive matching game! Select characters to practice and match them with their romaji readings.</p>
            <ul>
              <li>Practice basic hiragana (e.g. あ, か, さ)</li>
              <li>Learn modified sounds (e.g. が, ざ, だ)</li>
              <li>Master combination characters (e.g. きゃ, しゃ, ちゃ)</li>
              <li>Track your progress</li>
            </ul>
          </div>

          <div className={styles.gameSettings}>
            <div className={styles.settingGroup}>
              <button 
                onClick={() => toggleSection('basic')}
                className={styles.sectionToggle}
              >
                Basic Hiragana (e.g. あ, か, さ)
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
                    {HIRAGANA_CHARACTERS.basic.map(char => (
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
                Modified Sounds (e.g. が, ざ, だ)
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
                    {HIRAGANA_CHARACTERS.dakuten.map(char => (
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
                Combined Characters (e.g. きゃ, しゃ, ちゃ)
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
                    {HIRAGANA_CHARACTERS.combo.map(char => (
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
            </div>

            <button 
              onClick={handleStartGame}
              className={styles.playButton}
              disabled={selectedCharacters.size === 0}
            >
              Start Game ({selectedCharacters.size} characters)
            </button>
          </div>
        </div>

        <div className={styles.gamePreview}>
          <Image 
            src="/hiragana-match-game.png"
            alt="Hiragana Match Game Screenshot"
            width={800}
            height={600}
            className={styles.screenshot}
            priority
          />
        </div>
      </div>
    </div>
  );
}
