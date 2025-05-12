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
// Cache for preloaded audio elements
const audioCache: Record<string, HTMLAudioElement> = {};

// Preload all sound effects when the module is imported
if (typeof window !== 'undefined') {
  Object.values(SoundEffect).forEach(effect => {
    const soundPath = `/audio/ui/${effect}.mp3`;
    audioCache[effect] = new Audio(soundPath);
    // Preload the audio file
    audioCache[effect].load();
  });
}

export function playSound(effect: SoundEffect, volume: number = 1.0): void {
  try {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Get the cached audio element or create a new one if not cached
    let audio = audioCache[effect];
    if (!audio) {
      const soundPath = `/audio/ui/${effect}.mp3`;
      audio = new Audio(soundPath);
      audioCache[effect] = audio;
    }
    
    // Reset the audio to the beginning and set volume
    audio.currentTime = 0;
    audio.volume = volume;
    
    // Play with promise handling
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Sound is playing
        })
        .catch(error => {
          console.error(`Error playing sound ${effect}:`, error);
          // On error, try creating a new audio instance as fallback
          const soundPath = `/audio/ui/${effect}.mp3`;
          const newAudio = new Audio(soundPath);
          newAudio.volume = volume;
          newAudio.play().catch(e => console.error('Fallback audio failed:', e));
        });
    }
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
