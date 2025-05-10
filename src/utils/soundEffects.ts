'use client';

/**
 * Utility for playing sound effects in the application
 * Uses the sound files located in /public/audio/ui/
 */

/**
 * Available sound effects in the application
 */
export enum SoundEffect {
  CORRECT = 'correct-6033',
  WRONG = 'wronganswer-37702',
  FLIP = 'flip',
  CORRECT_ALTERNATIVE = 'correct'
}

/**
 * Play a sound effect directly using the approach that works in the test component
 * @param effect The sound effect to play
 * @param volume Volume level (0.0 to 1.0)
 */
export function playSound(effect: SoundEffect, volume: number = 1.0): void {
  try {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Use the full path that works in the test component
    const soundPath = `/audio/ui/${effect}.mp3`;
    
    // Create a new audio element each time
    const audio = new Audio(soundPath);
    audio.volume = volume;
    
    // Add event listeners for debugging
    audio.onloadeddata = () => {
      console.log(`Sound ${effect} loaded successfully`);
    };
    
    audio.onerror = (e) => {
      console.error(`Error loading sound ${effect}:`, e);
    };
    
    // Play with promise handling
    audio.play()
      .then(() => {
        console.log(`Sound ${effect} playing`);
      })
      .catch(error => {
        console.error(`Error playing sound ${effect}:`, error);
      });
  } catch (error) {
    console.error('Error in playSound:', error);
  }
}

/**
 * Play the correct answer sound effect
 */
export function playCorrectSound(volume: number = 0.5): void {
  playSound(SoundEffect.CORRECT, volume);
}

/**
 * Play the wrong answer sound effect
 */
export function playWrongSound(volume: number = 0.5): void {
  playSound(SoundEffect.WRONG, volume);
}

/**
 * Play the card flip sound effect
 */
export function playFlipSound(volume: number = 0.3): void {
  playSound(SoundEffect.FLIP, volume);
}
