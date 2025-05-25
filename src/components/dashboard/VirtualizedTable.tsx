'use client';

import React, { memo } from 'react';
import { TableRow, TableCell, Checkbox, Table, TableBody, Box } from '@mui/material';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

interface VirtualizedTableProps {
  items: Array<{
    id: string;
    primary: string;
    secondary?: string;
    meanings: string[];
    status: string;
  }>;
  selectedItems: { [key: string]: boolean };
  onItemSelect: (id: string, checked: boolean) => void;
  getStatusColor: (status: string) => { bg: string; text: string };
}

const ROW_HEIGHT = 56;

const VirtualizedTable = memo(({ 
  items, 
  selectedItems, 
  onItemSelect,
  getStatusColor 
}: VirtualizedTableProps) => {
  const Row = memo(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = items[index];
    const statusColor = getStatusColor(item.status);

    return (
      <TableRow
        hover
        role="checkbox"
        aria-checked={selectedItems[item.id] || false}
        tabIndex={-1}
        selected={selectedItems[item.id] || false}
        onClick={() => onItemSelect(item.id, !selectedItems[item.id])}
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #E8F9FD',
          width: '100%',
          cursor: 'pointer',
          backgroundColor: selectedItems[item.id] ? 'rgba(89, 206, 143, 0.08)' : 'transparent'
        }}
        component="div"
      >
        <TableCell
          padding="checkbox"
          sx={{
            width: 50,
            border: 'none',
            p: 0,
            pl: 1
          }}
          component="div"
        >
          <Checkbox
            checked={selectedItems[item.id] || false}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => onItemSelect(item.id, event.target.checked)}
            sx={{
              color: '#E8F9FD',
              '&.Mui-checked': {
                color: '#59CE8F',
              },
              '&:hover': {
                bgcolor: 'rgba(89, 206, 143, 0.08)'
              }
            }}
          />
        </TableCell>
        <TableCell
          sx={{
            flex: '0 0 200px',
            border: 'none',
            p: 1
          }}
          component="div"
        >
          <Box sx={{ fontSize: '1.15rem', fontWeight: 600 }}>{item.primary}</Box>
        </TableCell>
        <TableCell
          sx={{
            flex: 1,
            border: 'none',
            p: 1
          }}
          component="div"
        >
          <Box sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
            {item.meanings.join(', ')}
          </Box>
        </TableCell>
        <TableCell
          sx={{
            flex: '0 0 120px',
            border: 'none',
            p: 1
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
              backgroundColor: statusColor.bg,
              color: statusColor.text,
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
    <div style={{ flex: 1, overflow: 'hidden', height: '100%' }}>
      <AutoSizer>
        {({ height, width }) => (
          <Table component="div">
            <TableBody component="div">
              <FixedSizeList
                height={height}
                width={width}
                itemCount={items.length}
                itemSize={ROW_HEIGHT}
                overscanCount={5}
              >
                {Row}
              </FixedSizeList>
            </TableBody>
          </Table>
        )}
      </AutoSizer>
    </div>
  );
});

VirtualizedTable.displayName = 'VirtualizedTable';

export default VirtualizedTable;
