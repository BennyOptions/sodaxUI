'use client';

import { useState } from 'react';

interface SwapArrowProps {
  onClick: () => void;
}

export default function SwapArrow({ onClick }: SwapArrowProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        margin: '-8px 0',
        zIndex: 10,
        position: 'relative',
      }}
    >
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: hovered
            ? 'rgba(102,187,106,0.15)'
            : 'rgba(129,199,132,0.08)',
          border: '1px solid rgba(129,199,132,0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.25s ease',
          transform: hovered ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M9 4V14M9 14L5 10M9 14L13 10"
            stroke="#66bb6a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
