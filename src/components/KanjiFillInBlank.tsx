'use client';

import React, { useState } from 'react';

interface Blank {
  id: string;
  reading: string;
  correctAnswer: string;
}

interface Exercise {
  id: number;
  instruction?: string;
  blanks: Blank[];
  availableKanji: string[];
  layout: (string)[][];
}

interface Props {
  exercise: Exercise;
  onCorrect?: () => void;
  onIncorrect?: () => void;
}

const KanjiFillInBlank: React.FC<Props> = ({ exercise, onCorrect, onIncorrect }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isCorrect, setIsCorrect] = useState<Record<string, boolean>>({});

  const handleKanjiSelect = (kanji: string, blankId: string) => {
    if (selectedAnswers[blankId]) return;

    const blank = exercise.blanks.find(b => b.id === blankId);
    if (!blank) return;

    const correct = kanji === blank.correctAnswer;
    setSelectedAnswers(prev => ({ ...prev, [blankId]: kanji }));
    setIsCorrect(prev => ({ ...prev, [blankId]: correct }));

    if (correct) {
      onCorrect?.();
    } else {
      onIncorrect?.();
    }
  };

  const renderBox = (item: string) => {
    const blank = exercise.blanks.find(b => b.id === item);
    
    if (blank) {
      return (
        <div className="d-inline-flex align-items-center me-3">
          <div 
            className="border"
            style={{ 
              width: '36px',
              height: '36px',
              borderColor: '#dee2e6',
              backgroundColor: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '4px'
            }}
          >
            {selectedAnswers[blank.id] && (
              <span style={{ fontSize: '18px' }}>{selectedAnswers[blank.id]}</span>
            )}
          </div>
          <span style={{ fontSize: '14px', color: '#4a4a4a' }}>
            {blank.reading}
          </span>
        </div>
      );
    }

    return (
      <span className="me-1" style={{ fontSize: '14px' }}>{item}</span>
    );
  };

  return (
    <div className="mt-4">
      {exercise.instruction && (
        <p className="mb-4" style={{ color: '#4a4a4a' }}>{exercise.instruction}</p>
      )}
      
      <div className="mb-4" style={{ backgroundColor: '#fff' }}>
        {exercise.layout.map((row, rowIndex) => (
          <div 
            key={rowIndex} 
            className="d-flex align-items-center" 
            style={{ marginBottom: rowIndex < exercise.layout.length - 1 ? '12px' : '0' }}
          >
            {row.map((item, itemIndex) => (
              <React.Fragment key={itemIndex}>
                {renderBox(item)}
              </React.Fragment>
            ))}
          </div>
        ))}

        <div 
          className="d-flex align-items-center justify-content-start gap-2 mt-4 pt-3" 
          style={{ borderTop: '1px solid #dee2e6' }}
        >
          {exercise.availableKanji.map((kanji, index) => {
            const isUsed = Object.values(selectedAnswers).includes(kanji);
            
            return (
              <button
                key={index}
                onClick={() => {
                  const nextBlankId = exercise.blanks.find(b => !selectedAnswers[b.id])?.id;
                  if (nextBlankId) handleKanjiSelect(kanji, nextBlankId);
                }}
                disabled={isUsed}
                className="btn p-0"
                style={{
                  width: '36px',
                  height: '36px',
                  fontSize: '18px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#fff',
                  border: '1px solid #dee2e6',
                  color: '#1a1a1a',
                  opacity: isUsed ? 0.5 : 1
                }}
              >
                {kanji}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KanjiFillInBlank;
