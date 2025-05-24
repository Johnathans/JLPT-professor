'use client';

import React from 'react';
import styles from '@/styles/review-list-item.module.css';

interface ReviewListItemProps {
  id: string;
  primary: string;
  secondary: string;
  isSelected: boolean;
  onToggle: (id: string) => void;
  primaryStyle?: React.CSSProperties;
}

const ReviewListItem: React.FC<ReviewListItemProps> = React.memo(({ 
  id, 
  primary, 
  secondary, 
  isSelected, 
  onToggle,
  primaryStyle 
}) => (
  <div 
    onClick={() => onToggle(id)}
    className={styles.reviewListItem}
    style={{
      backgroundColor: isSelected ? 'rgba(89, 206, 143, 0.15)' : 'transparent'
    }}
  >
    <input
      type="checkbox"
      checked={isSelected}
      readOnly
      className={styles.checkbox}
    />
    <div style={{ flex: 1 }}>
      <div style={{ ...(primaryStyle || {}), marginBottom: 4 }}>{primary}</div>
      <div style={{ color: '#666', fontSize: '0.875em' }}>{secondary}</div>
    </div>
  </div>
));

ReviewListItem.displayName = 'ReviewListItem';

export default ReviewListItem;
