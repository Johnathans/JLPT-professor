import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { Stroke } from '@/types/kanji';

const CanvasContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundColor: '#fff',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  width: 'fit-content',
}));

const StyledCanvas = styled('canvas')(({ theme }) => ({
  display: 'block',
  border: '1px solid rgba(0,0,0,0.08)',
  borderRadius: theme.spacing(2),
}));

interface KanjiStrokeAnimationProps {
  strokes: Stroke[];
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
  animationDuration?: number;
  onComplete?: () => void;
}

export default function KanjiStrokeAnimation({
  strokes,
  width = 400,
  height = 400,
  strokeColor = '#7c4dff',
  strokeWidth = 16,
  animationDuration = 1000,
  onComplete,
}: KanjiStrokeAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number>(0);
  const currentStrokeRef = useRef<number>(0);
  const dprRef = useRef<number>(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !strokes.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up high DPI canvas
    dprRef.current = window.devicePixelRatio || 1;
    canvas.width = width * dprRef.current;
    canvas.height = height * dprRef.current;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dprRef.current, dprRef.current);

    // Reset animation state
    startTimeRef.current = 0;
    currentStrokeRef.current = 0;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = (timestamp - startTimeRef.current) / animationDuration;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Set up stroke style
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Enable anti-aliasing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw completed strokes with shadow for depth
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      // Draw all previous strokes
      for (let i = 0; i < currentStrokeRef.current; i++) {
        const stroke = strokes[i];
        if (!stroke.points || stroke.points.length < 2) continue;

        // Use quadratic curves for smoother lines
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

        for (let j = 1; j < stroke.points.length - 1; j++) {
          const xc = (stroke.points[j].x + stroke.points[j + 1].x) / 2;
          const yc = (stroke.points[j].y + stroke.points[j + 1].y) / 2;
          ctx.quadraticCurveTo(stroke.points[j].x, stroke.points[j].y, xc, yc);
        }

        // For the last two points
        if (stroke.points.length > 2) {
          const last = stroke.points[stroke.points.length - 1];
          ctx.quadraticCurveTo(
            stroke.points[stroke.points.length - 2].x,
            stroke.points[stroke.points.length - 2].y,
            last.x,
            last.y
          );
        }

        ctx.stroke();
      }

      // Draw current stroke with animation
      const currentStroke = strokes[currentStrokeRef.current];
      if (currentStroke?.points?.length >= 2) {
        const points = currentStroke.points;
        const pointCount = Math.floor(points.length * progress);

        if (pointCount > 0) {
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);

          // Draw completed segments with quadratic curves
          for (let i = 1; i < Math.min(pointCount, points.length - 1); i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
          }

          // If not at the last point, interpolate to the next point
          if (pointCount < points.length) {
            const lastPoint = points[pointCount - 1];
            const nextPoint = points[pointCount];
            const subProgress = (progress * points.length) % 1;

            const x = lastPoint.x + (nextPoint.x - lastPoint.x) * subProgress;
            const y = lastPoint.y + (nextPoint.y - lastPoint.y) * subProgress;

            // Use quadratic curve for the interpolated segment
            const xc = (lastPoint.x + x) / 2;
            const yc = (lastPoint.y + y) / 2;
            ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, xc, yc);
            ctx.lineTo(x, y);
          }

          ctx.stroke();
        }
      }

      if (progress >= 1) {
        // Move to next stroke
        currentStrokeRef.current++;
        startTimeRef.current = timestamp;

        // Check if animation is complete
        if (currentStrokeRef.current >= strokes.length) {
          onComplete?.();
          return;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [strokes, width, height, strokeColor, strokeWidth, animationDuration, onComplete]);

  return (
    <CanvasContainer>
      <Box sx={{ width, height }} />
      <StyledCanvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
    </CanvasContainer>
  );
}
