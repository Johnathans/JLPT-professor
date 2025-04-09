'use client';

import { useState, useEffect, useRef } from 'react';
import { getKanjiVgUrl } from '@/services/kanji-service';
import JlptLevelBadge from './JlptLevelBadge';
import styles from '@/styles/word-detail.module.css';

interface StrokeOrderDisplayProps {
  kanji: string;
}

export default function StrokeOrderDisplay({ kanji }: StrokeOrderDisplayProps) {
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchSvg() {
      try {
        setLoading(true);
        setError('');
        
        // Only proceed if we have a kanji character
        if (!kanji || kanji.length === 0) {
          setError('No kanji provided');
          setLoading(false);
          return;
        }
        
        // Get the SVG URL
        const url = await getKanjiVgUrl(kanji);
        
        if (!url) {
          setError('No stroke order data available for this kanji');
          setLoading(false);
          return;
        }

        // Fetch the SVG content
        const response = await fetch(url);
        
        if (!response.ok) {
          // If we get a 404, the kanji might not be in the KanjiVG database
          setError('No stroke order data available for this kanji');
          setLoading(false);
          return;
        }

        const svgText = await response.text();
        setSvgContent(svgText);
        setLoading(false);
        
        // Apply animations after SVG is loaded
        setTimeout(() => {
          if (svgContainerRef.current) {
            applyStrokeOrderAnimation(svgContainerRef.current);
          }
        }, 100);
      } catch (err) {
        console.error('Error fetching stroke order:', err);
        setError('Error loading stroke order data');
        setLoading(false);
      }
    }

    fetchSvg();
  }, [kanji]);

  // Function to apply animations to the SVG paths
  function applyStrokeOrderAnimation(container: HTMLDivElement) {
    const svg = container.querySelector('svg');
    if (!svg) return;

    // Find all paths in the SVG
    const paths = svg.querySelectorAll('path');
    const totalPaths = paths.length;
    
    if (totalPaths === 0) return;

    // Set SVG attributes for better display
    svg.setAttribute('width', '200');
    svg.setAttribute('height', '200');
    svg.setAttribute('viewBox', '0 0 109 109');
    svg.setAttribute('style', 'background-color: transparent;');

    // Apply animation to each path
    paths.forEach((path, index) => {
      try {
        // Get the length of the path
        const length = path.getTotalLength();
        
        // Set initial styles
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
        path.style.animation = 'none';
        path.style.stroke = '#7c4dff'; // Use primary color
        path.style.strokeWidth = '3';
        path.style.fill = 'none';
        
        // Create the animation
        const delay = index * 0.5; // Half-second delay between strokes
        path.style.animation = `strokeAnimation 1s ease-in-out forwards ${delay}s`;
      } catch (e) {
        console.error('Error animating path:', e);
      }
    });

    // Add the animation keyframes if they don't exist
    if (!document.getElementById('stroke-animation-style')) {
      const style = document.createElement('style');
      style.id = 'stroke-animation-style';
      style.textContent = `
        @keyframes strokeAnimation {
          to {
            stroke-dashoffset: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  if (loading) {
    return (
      <div className={styles.strokeOrderLoading}>
        <div className={styles.strokeOrderLoadingSpinner}></div>
        <p>Loading stroke order...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.strokeOrderError}>
        <p>{error}</p>
        {/* Fallback display - just show the kanji character */}
        <div className={styles.fallbackKanji}>
          {kanji}
        </div>
      </div>
    );
  }

  if (!svgContent) {
    return <div>Loading stroke order...</div>;
  }

  return (
    <div className={styles.strokeOrderContainer}>
      <div className={styles.strokeOrderHeader}>
        <h3 className={styles.strokeOrderTitle}>Stroke Order</h3>
        <JlptLevelBadge word={kanji} />
      </div>
      <div 
        ref={svgContainerRef}
        className={styles.strokeOrderSvg}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
}
