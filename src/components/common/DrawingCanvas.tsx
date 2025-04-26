'use client';

import { useRef, useEffect, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import Undo from '@mui/icons-material/Undo';
import Delete from '@mui/icons-material/Delete';
import type { Stroke, Point } from '@/types/kanji';

const CanvasContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundColor: '#fff',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  width: 'fit-content',
}));

const StyledCanvas = styled('canvas')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  border: '1px solid rgba(0,0,0,0.08)',
  borderRadius: theme.spacing(2),
  touchAction: 'none',
  backgroundColor: 'transparent',
  zIndex: 2,
}));

const GuideCanvas = styled('canvas')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  pointerEvents: 'none',
  borderRadius: theme.spacing(2),
  backgroundColor: '#fff',
  zIndex: 1,
  opacity: 0.3,
}));

const ToolbarBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  display: 'flex',
  gap: theme.spacing(1),
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  padding: theme.spacing(0.5),
  borderRadius: theme.spacing(1),
  zIndex: 3,
}));

const STROKE_TOLERANCE = 40;
const MAGNETIC_FORCE = 0.98; // Almost perfect snapping
const MIN_POINT_DISTANCE = 1; // Allow closer points for smoother lines
const DOT_THRESHOLD = 30;
const COMPLETION_THRESHOLD = 0.85;
const GUIDE_POINTS_PER_SEGMENT = 50; // More interpolation points for smoother guidance

interface DrawingCanvasProps {
  width?: number;
  height?: number;
  strokes?: Stroke[];
  onStrokeComplete?: (strokes: Point[][]) => void;
}

export default function DrawingCanvas({
  width = 400,
  height = 400,
  strokes = [],
  onStrokeComplete,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const guideCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [drawnStrokes, setDrawnStrokes] = useState<Point[][]>([]);
  const currentGuideStrokeRef = useRef<number>(0);
  const dprRef = useRef<number>(1);

  // Initialize canvases
  useEffect(() => {
    const canvas = canvasRef.current;
    const guideCanvas = guideCanvasRef.current;
    if (!canvas || !guideCanvas) return;

    // Get device pixel ratio
    dprRef.current = window.devicePixelRatio || 1;

    // Set up drawing canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = width * dprRef.current;
    canvas.height = height * dprRef.current;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dprRef.current, dprRef.current);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#7c4dff';
    ctx.lineWidth = 16;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Set up guide canvas
    const guideCtx = guideCanvas.getContext('2d');
    if (!guideCtx) return;
    
    guideCanvas.width = width * dprRef.current;
    guideCanvas.height = height * dprRef.current;
    guideCanvas.style.width = `${width}px`;
    guideCanvas.style.height = `${height}px`;
    guideCtx.scale(dprRef.current, dprRef.current);
    guideCtx.lineCap = 'round';
    guideCtx.lineJoin = 'round';
    guideCtx.lineWidth = 20;
    guideCtx.imageSmoothingEnabled = true;
    guideCtx.imageSmoothingQuality = 'high';
    drawGuideStrokes();
  }, [width, height, strokes]);

  const drawGuideStrokes = () => {
    const guideCtx = guideCanvasRef.current?.getContext('2d');
    if (!guideCtx) return;

    guideCtx.clearRect(0, 0, width * dprRef.current, height * dprRef.current);
    guideCtx.lineCap = 'round';
    guideCtx.lineJoin = 'round';
    guideCtx.lineWidth = 20;

    strokes.forEach((stroke, index) => {
      if (index === currentGuideStrokeRef.current) {
        guideCtx.strokeStyle = 'rgba(124, 77, 255, 0.4)'; // Current stroke
      } else if (index < currentGuideStrokeRef.current) {
        guideCtx.strokeStyle = 'rgba(0, 191, 165, 0.3)'; // Completed strokes
      } else {
        guideCtx.strokeStyle = 'rgba(200, 200, 200, 0.2)'; // Future strokes
      }

      guideCtx.beginPath();
      stroke.points.forEach((point, i) => {
        if (i === 0) {
          guideCtx.moveTo(point.x, point.y);
        } else if (i < stroke.points.length - 1) {
          const xc = (point.x + stroke.points[i + 1].x) / 2;
          const yc = (point.y + stroke.points[i + 1].y) / 2;
          guideCtx.quadraticCurveTo(point.x, point.y, xc, yc);
        } else {
          guideCtx.lineTo(point.x, point.y);
        }
      });
      guideCtx.stroke();

      // Draw start point indicator for current stroke
      if (index === currentGuideStrokeRef.current) {
        const startPoint = stroke.points[0];
        guideCtx.fillStyle = 'rgba(124, 77, 255, 0.6)';
        guideCtx.beginPath();
        guideCtx.arc(startPoint.x, startPoint.y, 10, 0, Math.PI * 2);
        guideCtx.fill();
      }
    });
  };

  const interpolateGuidePoints = (points: Point[]): Point[] => {
    const interpolated: Point[] = [];
    
    for (let i = 0; i < points.length - 1; i++) {
      const start = points[i];
      const end = points[i + 1];
      
      // Add more points between each guide point pair
      for (let j = 0; j <= GUIDE_POINTS_PER_SEGMENT; j++) {
        const t = j / GUIDE_POINTS_PER_SEGMENT;
        interpolated.push({
          x: start.x + (end.x - start.x) * t,
          y: start.y + (end.y - start.y) * t,
          pressure: 1,
          timestamp: Date.now()
        });
      }
    }
    
    return interpolated;
  };

  const magnetizePoint = (point: Point, strokePoints: Point[], lastDrawnIndex: number): [Point, number] => {
    // Find the closest interpolated guide point ahead of our last position
    const interpolatedPoints = interpolateGuidePoints(strokePoints);
    let closestIndex = lastDrawnIndex;
    let minDistance = Infinity;
    
    // Look ahead from the last position to find the next best point
    const searchStart = Math.floor(lastDrawnIndex / GUIDE_POINTS_PER_SEGMENT) * GUIDE_POINTS_PER_SEGMENT;
    const searchEnd = Math.min(interpolatedPoints.length, searchStart + GUIDE_POINTS_PER_SEGMENT * 2);
    
    for (let i = searchStart; i < searchEnd; i++) {
      const guidePoint = interpolatedPoints[i];
      const dx = point.x - guidePoint.x;
      const dy = point.y - guidePoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    // Always move forward along the path
    const targetIndex = Math.max(closestIndex, lastDrawnIndex + 1);
    const targetPoint = interpolatedPoints[Math.min(targetIndex, interpolatedPoints.length - 1)];

    return [targetPoint, targetIndex];
  };

  const findClosestGuideIndex = (point: Point, strokePoints: Point[]): number => {
    let closestIndex = 0;
    let minDistance = Infinity;

    strokePoints.forEach((guidePoint, index) => {
      const dx = point.x - guidePoint.x;
      const dy = point.y - guidePoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  };

  const isPointNearStroke = (point: Point, strokePoints: Point[]): boolean => {
    for (let i = 1; i < strokePoints.length; i++) {
      const start = strokePoints[i - 1];
      const end = strokePoints[i];
      
      // Calculate distance from point to line segment
      const A = point.x - start.x;
      const B = point.y - start.y;
      const C = end.x - start.x;
      const D = end.y - start.y;

      const dot = A * C + B * D;
      const lenSq = C * C + D * D;
      let param = -1;

      if (lenSq !== 0) {
        param = dot / lenSq;
      }

      let xx, yy;

      if (param < 0) {
        xx = start.x;
        yy = start.y;
      } else if (param > 1) {
        xx = end.x;
        yy = end.y;
      } else {
        xx = start.x + param * C;
        yy = start.y + param * D;
      }

      const dx = point.x - xx;
      const dy = point.y - yy;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= STROKE_TOLERANCE) {
        return true;
      }
    }

    return false;
  };

  const findClosestPointOnStroke = (point: Point, strokePoints: Point[]): Point => {
    let closestPoint = point;
    let minDistance = Infinity;

    for (let i = 1; i < strokePoints.length; i++) {
      const start = strokePoints[i - 1];
      const end = strokePoints[i];
      
      // Calculate closest point on line segment
      const A = point.x - start.x;
      const B = point.y - start.y;
      const C = end.x - start.x;
      const D = end.y - start.y;

      const dot = A * C + B * D;
      const lenSq = C * C + D * D;
      let param = -1;

      if (lenSq !== 0) {
        param = dot / lenSq;
      }

      let x, y;

      if (param < 0) {
        x = start.x;
        y = start.y;
      } else if (param > 1) {
        x = end.x;
        y = end.y;
      } else {
        x = start.x + param * C;
        y = start.y + param * D;
      }

      const dx = point.x - x;
      const dy = point.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = { x, y, pressure: point.pressure, timestamp: point.timestamp };
      }
    }

    return closestPoint;
  };

  const isPointTooClose = (point: Point, prevPoint: Point): boolean => {
    const dx = point.x - prevPoint.x;
    const dy = point.y - prevPoint.y;
    return Math.sqrt(dx * dx + dy * dy) < MIN_POINT_DISTANCE;
  };

  const getCanvasPoint = (e: MouseEvent | Touch): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, pressure: 1, timestamp: Date.now() };

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width / dprRef.current);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height / dprRef.current);
    const pressure = (e instanceof Touch && e.force) ? e.force : 1;

    return { x, y, pressure, timestamp: Date.now() };
  };

  const isStrokeDot = (strokePoints: Point[]): boolean => {
    if (strokePoints.length < 2) return false;
    const first = strokePoints[0];
    const last = strokePoints[strokePoints.length - 1];
    const dx = last.x - first.x;
    const dy = last.y - first.y;
    return Math.sqrt(dx * dx + dy * dy) < DOT_THRESHOLD;
  };

  const drawDot = (ctx: CanvasRenderingContext2D, point: Point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, ctx.lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const isPointBehindPrevious = (point: Point, prevPoint: Point, strokePoints: Point[]): boolean => {
    // Find the general direction of the stroke
    const firstPoint = strokePoints[0];
    const lastPoint = strokePoints[strokePoints.length - 1];
    const strokeDx = lastPoint.x - firstPoint.x;
    const strokeDy = lastPoint.y - firstPoint.y;
    
    // Calculate the dot product to determine if we're moving backwards
    const movementDx = point.x - prevPoint.x;
    const movementDy = point.y - prevPoint.y;
    
    const dotProduct = (strokeDx * movementDx + strokeDy * movementDy);
    return dotProduct < 0;
  };

  const isStrokeComplete = (drawnPoints: Point[], guidePoints: Point[]): boolean => {
    if (drawnPoints.length < 2) return false;

    // Check if we've reached close to the end point
    const lastDrawnPoint = drawnPoints[drawnPoints.length - 1];
    const lastGuidePoint = guidePoints[guidePoints.length - 1];
    
    const dx = lastDrawnPoint.x - lastGuidePoint.x;
    const dy = lastDrawnPoint.y - lastGuidePoint.y;
    const distanceToEnd = Math.sqrt(dx * dx + dy * dy);

    return distanceToEnd < STROKE_TOLERANCE;
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (currentGuideStrokeRef.current >= strokes.length) return;
    
    const rawPoint = getCanvasPoint(e.nativeEvent instanceof MouseEvent ? e.nativeEvent : e.nativeEvent.touches[0]);
    const currentStrokeGuide = strokes[currentGuideStrokeRef.current];
    
    // Only allow starting near the start point of the current guide stroke
    const startPoint = currentStrokeGuide.points[0];
    const dx = rawPoint.x - startPoint.x;
    const dy = rawPoint.y - startPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance <= STROKE_TOLERANCE) {
      setIsDrawing(true);
      // Start exactly at the guide's start point for better alignment
      setCurrentStroke([startPoint]);
      
      // If this is a dot stroke, draw it immediately
      if (isStrokeDot(currentStrokeGuide.points)) {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
          drawDot(ctx, startPoint);
          endDrawing();
        }
      } else {
        // Draw the starting point for regular strokes
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
          ctx.beginPath();
          ctx.arc(startPoint.x, startPoint.y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();

    const rawPoint = getCanvasPoint(e.nativeEvent instanceof MouseEvent ? e.nativeEvent : e.nativeEvent.touches[0]);
    const currentStrokeGuide = strokes[currentGuideStrokeRef.current];
    
    // Handle dot strokes
    if (isStrokeDot(currentStrokeGuide.points)) {
      const startPoint = currentStrokeGuide.points[0];
      const dx = rawPoint.x - startPoint.x;
      const dy = rawPoint.y - startPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= STROKE_TOLERANCE) {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
          drawDot(ctx, startPoint);
          setCurrentStroke([startPoint]);
          endDrawing();
        }
      }
      return;
    }

    setCurrentStroke(prev => {
      const lastDrawnIndex = prev.length > 0 
        ? findClosestGuideIndex(prev[prev.length - 1], interpolateGuidePoints(currentStrokeGuide.points))
        : 0;

      const [magnetizedPoint, newGuideIndex] = magnetizePoint(rawPoint, currentStrokeGuide.points, lastDrawnIndex);

      // Only allow forward movement
      if (newGuideIndex <= lastDrawnIndex) {
        return prev;
      }

      const newStroke = [...prev, magnetizedPoint];
      
      // Draw the new segment with a continuous line
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx && prev.length > 0) {
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Draw a single line segment
        ctx.moveTo(prev[prev.length - 1].x, prev[prev.length - 1].y);
        ctx.lineTo(magnetizedPoint.x, magnetizedPoint.y);
        ctx.stroke();
      }

      // Check completion against original guide points
      if (isStrokeComplete(newStroke, currentStrokeGuide.points)) {
        requestAnimationFrame(() => endDrawing());
      }
      
      return newStroke;
    });
  };

  const endDrawing = () => {
    if (!isDrawing) return;
    
    const currentDrawnStroke = currentStroke;
    const currentStrokeGuide = strokes[currentGuideStrokeRef.current];

    // Only complete if we've covered enough of the guide points
    if (isStrokeComplete(currentDrawnStroke, currentStrokeGuide.points)) {
      setIsDrawing(false);
      const newStrokes = [...drawnStrokes, currentDrawnStroke];
      setDrawnStrokes(newStrokes);
      
      // Move to next stroke
      currentGuideStrokeRef.current++;
      drawGuideStrokes();
      
      // Notify parent of completion if all strokes are drawn
      if (currentGuideStrokeRef.current === strokes.length) {
        onStrokeComplete?.(newStrokes);
      }
    }

    setCurrentStroke([]);
  };

  const handleUndo = () => {
    if (currentGuideStrokeRef.current > 0) {
      currentGuideStrokeRef.current--;
      setDrawnStrokes(prev => {
        const newStrokes = prev.slice(0, -1);
        
        // Clear and redraw
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, width * dprRef.current, height * dprRef.current);
          newStrokes.forEach(stroke => {
            ctx.beginPath();
            stroke.forEach((point, i) => {
              if (i === 0) {
                ctx.moveTo(point.x, point.y);
              } else {
                ctx.lineTo(point.x, point.y);
              }
            });
            ctx.stroke();
          });
        }
        
        return newStrokes;
      });
      
      drawGuideStrokes();
    }
  };

  const handleClear = () => {
    currentGuideStrokeRef.current = 0;
    setDrawnStrokes([]);
    setCurrentStroke([]);
    
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, width * dprRef.current, height * dprRef.current);
    }
    
    drawGuideStrokes();
  };

  return (
    <CanvasContainer>
      <Box sx={{ width, height }} />
      <GuideCanvas ref={guideCanvasRef} />
      <StyledCanvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
      />
      <ToolbarBox>
        <IconButton
          onClick={handleUndo}
          disabled={drawnStrokes.length === 0}
          size="small"
          sx={{ color: '#7c4dff' }}
        >
          <Undo />
        </IconButton>
        <IconButton
          onClick={handleClear}
          disabled={drawnStrokes.length === 0}
          size="small"
          sx={{ color: '#7c4dff' }}
        >
          <Delete />
        </IconButton>
      </ToolbarBox>
    </CanvasContainer>
  );
}
