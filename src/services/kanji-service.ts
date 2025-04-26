/**
 * Kanji Service - Provides stroke order images and kanji data
 * 
 * This service uses KanjiVG to fetch kanji stroke order SVGs.
 * KanjiVG is a project that provides SVG files for kanji characters.
 * https://github.com/KanjiVG/kanjivg
 */

import type { KanjiDetails, Stroke, Point } from '@/types/kanji';

class KanjiService {
  private readonly baseUrl = 'https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji';

  getKanjiVgUrl(character: string): string {
    const code = character.charCodeAt(0).toString(16).padStart(5, '0');
    return `${this.baseUrl}/${code}.svg`;
  }

  async getKanjiData(character: string): Promise<KanjiDetails> {
    try {
      const strokes = await this.getStrokeData(character);
      return {
        character,
        strokes,
        meaning: '', // We'll add these later from a dictionary API
        reading: '',
      };
    } catch (error) {
      console.error(`Error getting kanji data for ${character}:`, error);
      throw error;
    }
  }

  private async getStrokeData(character: string): Promise<Stroke[]> {
    try {
      const svgUrl = this.getKanjiVgUrl(character);
      console.log('Fetching SVG from:', svgUrl);
      
      const response = await fetch(svgUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch SVG for kanji ${character}`);
      }

      const svgContent = await response.text();
      console.log('SVG content:', svgContent.substring(0, 200)); // Log first 200 chars
      return this.parseStrokeData(svgContent);
    } catch (error) {
      console.error(`Error getting stroke data for ${character}:`, error);
      throw error;
    }
  }

  private parseStrokeData(svgContent: string): Stroke[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const paths = doc.querySelectorAll('path[d]');
    console.log('Found paths:', paths.length);
    
    const viewBox = doc.querySelector('svg')?.getAttribute('viewBox')?.split(' ').map(Number) || [0, 0, 109, 109];
    const [, , width, height] = viewBox;

    return Array.from(paths).map(path => {
      const d = path.getAttribute('d') || '';
      const points = this.parseSVGPath(d, width, height);
      return { points };
    });
  }

  private parseSVGPath(d: string, width: number, height: number): Point[] {
    const commands = d.match(/[A-Za-z][^A-Za-z]*/g) || [];
    const points: Point[] = [];
    let currentX = 0;
    let currentY = 0;

    commands.forEach(cmd => {
      const type = cmd[0];
      const coords = cmd.slice(1).trim().split(/[\s,]+/).map(Number);

      switch (type) {
        case 'M':
        case 'm':
          currentX = type === 'm' ? currentX + coords[0] : coords[0];
          currentY = type === 'm' ? currentY + coords[1] : coords[1];
          points.push({
            x: (currentX / width) * 400,
            y: (currentY / height) * 400,
            pressure: 1,
            timestamp: Date.now(),
          });
          break;

        case 'L':
        case 'l':
          for (let i = 0; i < coords.length; i += 2) {
            currentX = type === 'l' ? currentX + coords[i] : coords[i];
            currentY = type === 'l' ? currentY + coords[i + 1] : coords[i + 1];
            points.push({
              x: (currentX / width) * 400,
              y: (currentY / height) * 400,
              pressure: 1,
              timestamp: Date.now(),
            });
          }
          break;

        case 'C':
        case 'c':
          for (let i = 0; i < coords.length; i += 6) {
            const x1 = type === 'c' ? currentX + coords[i] : coords[i];
            const y1 = type === 'c' ? currentY + coords[i + 1] : coords[i + 1];
            const x2 = type === 'c' ? currentX + coords[i + 2] : coords[i + 2];
            const y2 = type === 'c' ? currentY + coords[i + 3] : coords[i + 3];
            currentX = type === 'c' ? currentX + coords[i + 4] : coords[i + 4];
            currentY = type === 'c' ? currentY + coords[i + 5] : coords[i + 5];

            // Add control points and end point
            points.push(
              {
                x: (x1 / width) * 400,
                y: (y1 / height) * 400,
                pressure: 1,
                timestamp: Date.now(),
              },
              {
                x: (x2 / width) * 400,
                y: (y2 / height) * 400,
                pressure: 1,
                timestamp: Date.now(),
              },
              {
                x: (currentX / width) * 400,
                y: (currentY / height) * 400,
                pressure: 1,
                timestamp: Date.now(),
              }
            );
          }
          break;
      }
    });

    return points;
  }
}

export const kanjiService = new KanjiService();
