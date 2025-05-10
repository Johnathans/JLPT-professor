'use client';

import React, { useState } from 'react';
import styles from '@/styles/goal-modal.module.css';
import { X, Minus, Plus } from 'react-feather';

interface GoalSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goals: DailyGoals) => void;
  initialGoals: DailyGoals;
}

export interface DailyGoals {
  vocabulary: number;
  kanji: number;
  grammar: number;
  listening: number;
  reading: number;
}

export default function GoalSettingModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialGoals 
}: GoalSettingModalProps) {
  const [goals, setGoals] = useState<DailyGoals>(initialGoals);
  
  if (!isOpen) return null;
  
  const handleChange = (category: keyof DailyGoals, value: number) => {
    // Ensure value is between 0 and 50
    const newValue = Math.max(0, Math.min(50, value));
    setGoals(prev => ({
      ...prev,
      [category]: newValue
    }));
  };
  
  const handleIncrement = (category: keyof DailyGoals) => {
    handleChange(category, goals[category] + 1);
  };
  
  const handleDecrement = (category: keyof DailyGoals) => {
    handleChange(category, goals[category] - 1);
  };
  
  const handleSave = () => {
    onSave(goals);
    onClose();
  };
  
  const handlePreset = (preset: 'beginner' | 'intermediate' | 'advanced') => {
    const presets = {
      beginner: { vocabulary: 5, kanji: 3, grammar: 2, listening: 2, reading: 3 },
      intermediate: { vocabulary: 10, kanji: 5, grammar: 5, listening: 5, reading: 5 },
      advanced: { vocabulary: 15, kanji: 10, grammar: 10, listening: 10, reading: 10 }
    };
    
    setGoals(presets[preset]);
  };
  
  const totalItems = goals.vocabulary + goals.kanji + goals.grammar;
  
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Set Your Daily Goals</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <p className={styles.modalDescription}>
            Set how many items you want to study each day. We recommend 20 total items for consistent progress.
          </p>
          
          <div className={styles.presetButtons}>
            <button 
              className={styles.presetButton} 
              onClick={() => handlePreset('beginner')}
            >
              Beginner (10)
            </button>
            <button 
              className={styles.presetButton} 
              onClick={() => handlePreset('intermediate')}
            >
              Intermediate (20)
            </button>
            <button 
              className={styles.presetButton} 
              onClick={() => handlePreset('advanced')}
            >
              Advanced (40)
            </button>
          </div>
          
          <div className={styles.goalCategory}>
            <div className={styles.categoryLabel}>Vocabulary</div>
            <div className={styles.counterControl}>
              <button 
                className={styles.counterButton} 
                onClick={() => handleDecrement('vocabulary')}
                disabled={goals.vocabulary <= 0}
                aria-label="Decrease vocabulary"
              >
                <Minus size={16} />
              </button>
              <input 
                type="number" 
                className={styles.counterInput}
                value={goals.vocabulary}
                onChange={(e) => handleChange('vocabulary', parseInt(e.target.value) || 0)}
                min="0"
                max="50"
              />
              <button 
                className={styles.counterButton} 
                onClick={() => handleIncrement('vocabulary')}
                disabled={goals.vocabulary >= 50}
                aria-label="Increase vocabulary"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          <div className={styles.goalCategory}>
            <div className={styles.categoryLabel}>Kanji</div>
            <div className={styles.counterControl}>
              <button 
                className={styles.counterButton} 
                onClick={() => handleDecrement('kanji')}
                disabled={goals.kanji <= 0}
                aria-label="Decrease kanji"
              >
                <Minus size={16} />
              </button>
              <input 
                type="number" 
                className={styles.counterInput}
                value={goals.kanji}
                onChange={(e) => handleChange('kanji', parseInt(e.target.value) || 0)}
                min="0"
                max="50"
              />
              <button 
                className={styles.counterButton} 
                onClick={() => handleIncrement('kanji')}
                disabled={goals.kanji >= 50}
                aria-label="Increase kanji"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          <div className={styles.goalCategory}>
            <div className={styles.categoryLabel}>Grammar</div>
            <div className={styles.counterControl}>
              <button 
                className={styles.counterButton} 
                onClick={() => handleDecrement('grammar')}
                disabled={goals.grammar <= 0}
                aria-label="Decrease grammar"
              >
                <Minus size={16} />
              </button>
              <input 
                type="number" 
                className={styles.counterInput}
                value={goals.grammar}
                onChange={(e) => handleChange('grammar', parseInt(e.target.value) || 0)}
                min="0"
                max="50"
              />
              <button 
                className={styles.counterButton} 
                onClick={() => handleIncrement('grammar')}
                disabled={goals.grammar >= 50}
                aria-label="Increase grammar"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          <div className={styles.goalCategory}>
            <div className={styles.categoryLabel}>Listening</div>
            <div className={styles.counterControl}>
              <button 
                className={styles.counterButton} 
                onClick={() => handleDecrement('listening')}
                disabled={goals.listening <= 0}
                aria-label="Decrease listening"
              >
                <Minus size={16} />
              </button>
              <input 
                type="number" 
                className={styles.counterInput}
                value={goals.listening}
                onChange={(e) => handleChange('listening', parseInt(e.target.value) || 0)}
                min="0"
                max="50"
              />
              <button 
                className={styles.counterButton} 
                onClick={() => handleIncrement('listening')}
                disabled={goals.listening >= 50}
                aria-label="Increase listening"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          <div className={styles.goalCategory}>
            <div className={styles.categoryLabel}>Reading</div>
            <div className={styles.counterControl}>
              <button 
                className={styles.counterButton} 
                onClick={() => handleDecrement('reading')}
                disabled={goals.reading <= 0}
                aria-label="Decrease reading"
              >
                <Minus size={16} />
              </button>
              <input 
                type="number" 
                className={styles.counterInput}
                value={goals.reading}
                onChange={(e) => handleChange('reading', parseInt(e.target.value) || 0)}
                min="0"
                max="50"
              />
              <button 
                className={styles.counterButton} 
                onClick={() => handleIncrement('reading')}
                disabled={goals.reading >= 50}
                aria-label="Increase reading"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          <div className={styles.totalItems}>
            <div className={styles.totalLabel}>Total Daily Items:</div>
            <div className={styles.totalValue}>{totalItems}</div>
          </div>
          
          <div className={styles.estimatedTime}>
            Estimated study time: {Math.round(totalItems * 2.5)} minutes per day
          </div>
        </div>
        
        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.saveButton} onClick={handleSave}>
            Save Goals
          </button>
        </div>
      </div>
    </div>
  );
}
