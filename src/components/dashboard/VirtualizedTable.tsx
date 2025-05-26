'use client';

import React, { memo, forwardRef } from 'react';
import { TableRow, TableCell, Checkbox, Table, TableBody, TableHead, Box } from '@mui/material';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

interface VirtualizedTableProps {
  items: Array<{
    id: string;
    word: string;
    reading?: string;
    meaning: string;
    status: string;
  }>;
  selectedItems: string[];
  onItemSelect: (id: string) => void;
  getStatusColor: (status: string) => string;
}

const ROW_HEIGHT = 56;

const VirtualizedTable = memo(function VirtualizedTable({ 
  items, 
  selectedItems, 
  onItemSelect,
  getStatusColor 
}: VirtualizedTableProps) {
  const Row = memo(function Row({ index, style }: { index: number; style: React.CSSProperties }) {
    const item = items[index];
    const statusColor = getStatusColor(item.status);
    
    const rowStyle = {
      ...style,
      display: 'flex',
      borderBottom: '1px solid #E8F9FD',
      width: '100%',
      cursor: 'pointer',
      backgroundColor: selectedItems.includes(item.id) ? 'rgba(0, 194, 178, 0.08)' : 'transparent'
    };



    return (
      <TableRow
        hover
        role="checkbox"
        aria-checked={selectedItems.includes(item.id)}
        tabIndex={-1}
        selected={selectedItems.includes(item.id)}
        onClick={() => onItemSelect(item.id)}
        style={rowStyle}
        component="div"
      >
        <TableCell
          padding="checkbox"
          sx={{
            width: 64,
            padding: '12px 0',
            pl: 2
          }}
          component="div"
        >
          <Checkbox
            checked={selectedItems.includes(item.id)}
            onClick={(event) => event.stopPropagation()}
            onChange={() => onItemSelect(item.id)}
            sx={{
              color: '#E8F9FD',
              '&.Mui-checked': {
                color: '#00c2b2',
              },
              '&:hover': {
                bgcolor: 'rgba(0, 194, 178, 0.08)'
              }
            }}
          />
        </TableCell>
        <TableCell
          sx={{
            width: '30%',
            border: 'none',
            p: 1,
            pl: 3
          }}
          component="div"
        >
          <Box sx={{ fontSize: '1.15rem', fontWeight: 600 }}>{item.word}</Box>
        </TableCell>
        <TableCell
          sx={{
            width: '50%',
            border: 'none',
            p: 1,
            pl: 1
          }}
          component="div"
        >
          <Box sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
            {item.meaning}
          </Box>
        </TableCell>
        <TableCell
          sx={{
            width: '20%',
            padding: '12px 0',
            border: 'none',
            textAlign: 'center'
          }}
          component="div"
        >
          <span
            style={{
              display: 'inline-block',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 500,
              backgroundColor: 'rgba(89, 206, 143, 0.1)',
              color: statusColor,
              textTransform: 'capitalize'
            }}
          >
            {item.status}
          </span>
        </TableCell>
      </TableRow>
    );
  });

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Box sx={{ height: '100%', bgcolor: 'white', borderRadius: 2, overflow: 'hidden' }}>
        <Table component="div" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <TableHead component="div" sx={{ bgcolor: '#f8f9fa' }}>
            <TableRow component="div" sx={{ display: 'flex' }}>
              <TableCell
                padding="checkbox"
                component="div"
                sx={{
                  width: 64,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Checkbox
                  sx={{
                    color: '#E8F9FD',
                    '&.Mui-checked': {
                      color: '#00c2b2',
                    }
                  }}
                />
              </TableCell>
              <TableCell component="div" sx={{ width: '30%', fontWeight: 600 }}>Word</TableCell>
              <TableCell component="div" sx={{ width: '50%', fontWeight: 600 }}>Meaning</TableCell>
              <TableCell component="div" sx={{ width: '20%', fontWeight: 600, textAlign: 'center' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody component="div" sx={{ flex: 1, overflow: 'hidden' }}>
            <AutoSizer>
              {({ height, width }) => (
                <FixedSizeList
                  height={height}
                  width={width}
                  itemCount={items.length}
                  itemSize={ROW_HEIGHT}
                  overscanCount={5}
                  style={{ overflowX: 'hidden' }}
                >
                  {Row}
                </FixedSizeList>
              )}
            </AutoSizer>
          </TableBody>
        </Table>
      </Box>
    </div>
  );
});

VirtualizedTable.displayName = 'VirtualizedTable';

export default memo(VirtualizedTable);
