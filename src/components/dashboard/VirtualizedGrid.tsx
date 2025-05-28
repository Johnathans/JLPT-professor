'use client';

import React, { memo } from 'react';
import { FixedSizeGrid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const ItemCard = styled(Paper)(() => ({
  margin: '8px',
  padding: '16px',
  borderBottom: '4px solid #e0e0e0',
  borderRadius: '4px',
  backgroundColor: '#fff',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  '&:hover': {
    borderBottom: '4px solid #bdbdbd',
    transform: 'translateY(-1px)',
    backgroundColor: 'rgba(0, 0, 0, 0.02)'
  }
}));

interface VirtualizedGridProps {
  items: Array<{
    id: string;
    character: string;
    reading?: string;
    meaning: string;
    type: 'kanji' | 'vocabulary';
  }>;
  onItemClick: (item: {
    id: string;
    character: string;
    reading?: string;
    meaning: string;
    type: 'kanji' | 'vocabulary';
  }) => void;
}

const COLUMN_WIDTH = 320; // Increased to account for margins
const ROW_HEIGHT = 180;

const VirtualizedGrid = memo(function VirtualizedGrid({ items, onItemClick }: VirtualizedGridProps) {
  if (!items.length) return null;

  const Cell = memo(({ columnIndex, rowIndex, style, data }: { columnIndex: number; rowIndex: number; style: React.CSSProperties; data: { items: VirtualizedGridProps['items']; columnCount: number; onItemClick: VirtualizedGridProps['onItemClick'] } }) => {
    const itemIndex = rowIndex * data.columnCount + columnIndex;
    const item = data.items[itemIndex];

    if (!item) return null;

    return (
      <Box style={style}>
        <ItemCard 
          elevation={0}
          onClick={() => data.onItemClick(item)}
        >
          <Typography 
            variant="h4" 
            component="div" 
            sx={{ 
              fontFamily: item.type === 'kanji' ? '"Noto Sans JP", sans-serif' : 'inherit',
              fontSize: item.type === 'kanji' ? '2.5rem' : '1.75rem',
              mb: 1
            }}
          >
            {item.character}
          </Typography>
          {item.reading && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ mb: 0.5 }}
            >
              {item.reading}
            </Typography>
          )}
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {item.meaning}
          </Typography>
        </ItemCard>
      </Box>
    )
  });

  return (
    <Box sx={{ width: '100%', height: '100%', p: 2 }}>
      <AutoSizer>
        {({ width, height }: { width: number; height: number }) => {
          const columnCount = Math.floor((width - 32) / COLUMN_WIDTH);
          const rowCount = Math.ceil(items.length / columnCount);

          return (
            <FixedSizeGrid
              columnCount={columnCount}
              columnWidth={COLUMN_WIDTH}
              height={height}
              rowCount={rowCount}
              rowHeight={ROW_HEIGHT}
              width={width}
              style={{ overflowX: 'hidden' }}
              itemData={{ items, columnCount, onItemClick }}
            >
              {Cell}
            </FixedSizeGrid>
          );
        }}
      </AutoSizer>
    </Box>
  );
});

VirtualizedGrid.displayName = 'VirtualizedGrid';

export default VirtualizedGrid;
