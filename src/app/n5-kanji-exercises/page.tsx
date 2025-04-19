'use client';

import React, { useState } from 'react';
import KanjiFillInBlank from '@/components/KanjiFillInBlank';
import exercises from '@/data/n5-kanji-exercises.json';

export default function N5KanjiExercisesPage() {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [score, setScore] = useState(0);

  const handleCorrect = () => {
    setScore(prev => prev + 1);
  };

  const handleNext = () => {
    if (currentExerciseIndex < exercises.fillInTheBlank.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="card border-0">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div style={{ color: '#4a4a4a', fontSize: '0.9rem' }}>
                  Exercise {currentExerciseIndex + 1} of {exercises.fillInTheBlank.length}
                </div>
                <div style={{ color: '#1a1a1a', fontSize: '0.9rem', fontWeight: 600 }}>
                  Score: {score}
                </div>
              </div>

              <KanjiFillInBlank
                exercise={exercises.fillInTheBlank[currentExerciseIndex]}
                onCorrect={handleCorrect}
              />

              <div className="d-flex justify-content-end mt-4">
                <button
                  onClick={handleNext}
                  className="btn btn-primary px-4"
                  disabled={currentExerciseIndex === exercises.fillInTheBlank.length - 1}
                  style={{
                    backgroundColor: '#7c4dff',
                    borderColor: '#7c4dff'
                  }}
                >
                  Next Exercise
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
