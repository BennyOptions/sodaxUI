'use client';

import { SWAP_STATES, type SwapState } from '@/config/tokens';

interface StatusBannerProps {
  state: SwapState;
}

const configs: Record<string, {
  bg: string;
  border: string;
  text: string;
  color: string;
  spinner: boolean;
}> = {
  [SWAP_STATES.CONNECTING]: {
    bg: 'rgba(129,199,132,0.06)',
    border: 'rgba(129,199,132,0.15)',
    text: 'Connecting wallet...',
    color: '#81c784',
    spinner: true,
  },
  [SWAP_STATES.CONFIRMING]: {
    bg: 'rgba(129,199,132,0.06)',
    border: 'rgba(129,199,132,0.15)',
    text: 'Confirm in your wallet',
    color: '#81c784',
    spinner: true,
  },
  [SWAP_STATES.SWAPPING]: {
    bg: 'rgba(129,199,132,0.06)',
    border: 'rgba(129,199,132,0.15)',
    text: 'Executing swap via SODAX Solver...',
    color: '#66bb6a',
    spinner: true,
  },
  [SWAP_STATES.SUCCESS]: {
    bg: 'rgba(102,187,106,0.08)',
    border: 'rgba(102,187,106,0.2)',
    text: 'Swap completed!',
    color: '#66bb6a',
    spinner: false,
  },
  [SWAP_STATES.ERROR]: {
    bg: 'rgba(239,83,80,0.06)',
    border: 'rgba(239,83,80,0.15)',
    text: 'Swap failed. Try again.',
    color: '#ef5350',
    spinner: false,
  },
};

export default function StatusBanner({ state }: StatusBannerProps) {
  if (
    state === SWAP_STATES.IDLE ||
    state === SWAP_STATES.QUOTING ||
    state === SWAP_STATES.QUOTED
  )
    return null;

  const c = configs[state];
  if (!c) return null;

  return (
    <div
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 12,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        animation: 'fadeSlideIn 0.25s ease',
      }}
    >
      {c.spinner && (
        <div
          style={{
            width: 16,
            height: 16,
            border: `2px solid ${c.color}33`,
            borderTopColor: c.color,
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            flexShrink: 0,
          }}
        />
      )}
      {state === SWAP_STATES.SUCCESS && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 8L7 11L12 5"
            stroke="#66bb6a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <span
        style={{
          color: c.color,
          fontSize: 13,
          fontWeight: 500,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {c.text}
      </span>
    </div>
  );
}
