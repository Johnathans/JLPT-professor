'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './new-story.module.css';

interface VocabularyItem {
  japanese: string;
  reading: string;
  english: string;
}

interface Section {
  id: number;
  title: string;
  text: string;
  translation: string;
  vocabulary: VocabularyItem[];
  audio?: {
    url: string;
    duration: number;
  };
}

interface StoryForm {
  id: string;
  title: string;
  titleTranslation: string;
  description: string;
  stats: {
    n5_words: number;
    n5_kanji: number;
    estimated_time: number;
  };
  content: Section[];
  mainAudio?: {
    url: string;
    duration: number;
  };
}

export default function NewStoryPage() {
  const router = useRouter();
  const [story, setStory] = useState<StoryForm>({
    id: '',
    title: '',
    titleTranslation: '',
    description: '',
    stats: {
      n5_words: 0,
      n5_kanji: 0,
      estimated_time: 0,
    },
    content: [],
  });

  const [currentSection, setCurrentSection] = useState<Section>({
    id: 0,
    title: '',
    text: '',
    translation: '',
    vocabulary: [],
  });

  const [currentVocab, setCurrentVocab] = useState<VocabularyItem>({
    japanese: '',
    reading: '',
    english: '',
  });

  const [mainAudioFile, setMainAudioFile] = useState<File | null>(null);
  const [sectionAudioFile, setSectionAudioFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleMainAudioUpload = async (file: File) => {
    setMainAudioFile(file);
    setUploadStatus('Uploading main audio...');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload-audio', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        setStory(prev => ({
          ...prev,
          mainAudio: {
            url: data.url,
            duration: data.duration,
          },
        }));
        setUploadStatus('Main audio uploaded successfully');
      } else {
        setUploadStatus('Failed to upload main audio');
      }
    } catch (error) {
      setUploadStatus('Error uploading main audio');
      console.error('Error:', error);
    }
  };

  const handleSectionAudioUpload = async (file: File) => {
    setSectionAudioFile(file);
    setUploadStatus('Uploading section audio...');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload-audio', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        setCurrentSection(prev => ({
          ...prev,
          audio: {
            url: data.url,
            duration: data.duration,
          },
        }));
        setUploadStatus('Section audio uploaded successfully');
      } else {
        setUploadStatus('Failed to upload section audio');
      }
    } catch (error) {
      setUploadStatus('Error uploading section audio');
      console.error('Error:', error);
    }
  };

  const addVocabularyToSection = () => {
    if (currentVocab.japanese && currentVocab.reading && currentVocab.english) {
      setCurrentSection(prev => ({
        ...prev,
        vocabulary: [...prev.vocabulary, { ...currentVocab }],
      }));
      setCurrentVocab({ japanese: '', reading: '', english: '' });
    }
  };

  const addSection = () => {
    if (currentSection.title && currentSection.text && currentSection.translation) {
      setStory(prev => ({
        ...prev,
        content: [...prev.content, { ...currentSection }],
      }));
      setCurrentSection({
        id: currentSection.id + 1,
        title: '',
        text: '',
        translation: '',
        vocabulary: [],
      });
      setSectionAudioFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(story),
      });

      if (response.ok) {
        router.push('/n5-stories');
      } else {
        console.error('Failed to create story');
      }
    } catch (error) {
      console.error('Error creating story:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create New Story</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.basicInfo}>
          <h2>Basic Information</h2>
          
          <div className={styles.field}>
            <label htmlFor="id">Story ID (URL-friendly)</label>
            <input
              type="text"
              id="id"
              value={story.id}
              onChange={e => setStory(prev => ({ ...prev, id: e.target.value }))}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="title">Title (Japanese)</label>
            <input
              type="text"
              id="title"
              value={story.title}
              onChange={e => setStory(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="titleTranslation">Title (English)</label>
            <input
              type="text"
              id="titleTranslation"
              value={story.titleTranslation}
              onChange={e => setStory(prev => ({ ...prev, titleTranslation: e.target.value }))}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={story.description}
              onChange={e => setStory(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="mainAudio">Main Story Audio</label>
            <div className={styles.audioUpload}>
              <input
                type="file"
                id="mainAudio"
                accept="audio/*"
                onChange={e => e.target.files && handleMainAudioUpload(e.target.files[0])}
              />
              {mainAudioFile && (
                <span className={styles.fileName}>{mainAudioFile.name}</span>
              )}
            </div>
          </div>

          <div className={styles.stats}>
            <div className={styles.field}>
              <label htmlFor="n5_words">N5 Words</label>
              <input
                type="number"
                id="n5_words"
                value={story.stats.n5_words}
                onChange={e => setStory(prev => ({
                  ...prev,
                  stats: { ...prev.stats, n5_words: parseInt(e.target.value) }
                }))}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="n5_kanji">N5 Kanji</label>
              <input
                type="number"
                id="n5_kanji"
                value={story.stats.n5_kanji}
                onChange={e => setStory(prev => ({
                  ...prev,
                  stats: { ...prev.stats, n5_kanji: parseInt(e.target.value) }
                }))}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="estimated_time">Est. Time (min)</label>
              <input
                type="number"
                id="estimated_time"
                value={story.stats.estimated_time}
                onChange={e => setStory(prev => ({
                  ...prev,
                  stats: { ...prev.stats, estimated_time: parseInt(e.target.value) }
                }))}
                required
              />
            </div>
          </div>
        </div>

        <div className={styles.sectionEditor}>
          <h2>Add Section</h2>
          
          <div className={styles.field}>
            <label htmlFor="sectionTitle">Section Title</label>
            <input
              type="text"
              id="sectionTitle"
              value={currentSection.title}
              onChange={e => setCurrentSection(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="sectionText">Japanese Text</label>
            <textarea
              id="sectionText"
              value={currentSection.text}
              onChange={e => setCurrentSection(prev => ({ ...prev, text: e.target.value }))}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="sectionTranslation">English Translation</label>
            <textarea
              id="sectionTranslation"
              value={currentSection.translation}
              onChange={e => setCurrentSection(prev => ({ ...prev, translation: e.target.value }))}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="sectionAudio">Section Audio</label>
            <div className={styles.audioUpload}>
              <input
                type="file"
                id="sectionAudio"
                accept="audio/*"
                onChange={e => e.target.files && handleSectionAudioUpload(e.target.files[0])}
              />
              {sectionAudioFile && (
                <span className={styles.fileName}>{sectionAudioFile.name}</span>
              )}
            </div>
          </div>

          <div className={styles.vocabularyEditor}>
            <h3>Add Vocabulary</h3>
            
            <div className={styles.vocabularyFields}>
              <div className={styles.field}>
                <label htmlFor="vocabJapanese">Japanese</label>
                <input
                  type="text"
                  id="vocabJapanese"
                  value={currentVocab.japanese}
                  onChange={e => setCurrentVocab(prev => ({ ...prev, japanese: e.target.value }))}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="vocabReading">Reading</label>
                <input
                  type="text"
                  id="vocabReading"
                  value={currentVocab.reading}
                  onChange={e => setCurrentVocab(prev => ({ ...prev, reading: e.target.value }))}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="vocabEnglish">English</label>
                <input
                  type="text"
                  id="vocabEnglish"
                  value={currentVocab.english}
                  onChange={e => setCurrentVocab(prev => ({ ...prev, english: e.target.value }))}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={addVocabularyToSection}
              className={styles.addButton}
            >
              Add Vocabulary
            </button>

            {currentSection.vocabulary.length > 0 && (
              <div className={styles.vocabularyList}>
                <h4>Section Vocabulary</h4>
                <ul>
                  {currentSection.vocabulary.map((vocab, index) => (
                    <li key={index}>
                      {vocab.japanese} ({vocab.reading}) - {vocab.english}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={addSection}
            className={styles.addButton}
          >
            Add Section
          </button>
        </div>

        {story.content.length > 0 && (
          <div className={styles.sectionsList}>
            <h2>Story Sections</h2>
            {story.content.map((section, index) => (
              <div key={index} className={styles.sectionPreview}>
                <h3>{section.title}</h3>
                <p>{section.text}</p>
                <p>{section.translation}</p>
                <p>Vocabulary: {section.vocabulary.length} items</p>
                {section.audio && (
                  <p className={styles.audioInfo}>
                    Audio: {new URL(section.audio.url).pathname.split('/').pop()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {uploadStatus && (
          <div className={`${styles.uploadStatus} ${uploadStatus.includes('Error') ? styles.error : ''}`}>
            {uploadStatus}
          </div>
        )}

        <button type="submit" className={styles.submitButton}>
          Create Story
        </button>
      </form>
    </div>
  );
}
