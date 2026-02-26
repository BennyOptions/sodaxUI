'use client';

import { useState } from 'react';

interface Quote {
  outputAmount: string;
  rate: string;
  priceImpact: string;
  solverFee: string;
  networkFee: string;
  estimatedTime: string;
  route: string;
}

interface QuoteDetailsProps {
  quote: Quote | null;
  expanded: boolean;
  setExpanded: (val: boolean) => void;
}

export default function QuoteDetails({ quote, expanded, setExpanded }: QuoteDetailsProps) {
  if (!quote) return null;

  return (
    <div style={{ marginTop: 8 }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '10px 0',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#a5d6a7',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
        }}
      >
        <span>
          1 {quote.route.split(' → ')[0]} ≈ {parseFloat(quote.rate).toFixed(6)}{' '}
          {quote.route.split(' → ').pop()}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          style={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          <path
            d="M3.5 5.25L7 8.75L10.5 5.25"
            stroke="#81c784"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {expanded && (
        <div
          style={{
            background: 'rgba(255,255,255,0.02)',
            borderRadius: 12,
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            animation: 'fadeSlideIn 0.2s ease',
          }}
        >
          {([
            ['Route', quote.route],
            ['Price Impact', `${quote.priceImpact}%`],
            ['Solver Fee', `${quote.solverFee}%`],
            ['Network Fee', quote.networkFee],
            ['Est. Time', quote.estimatedTime],
          ] as [string, string][]).map(([label, value]) => (
            <div
              key={label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 12,
              }}
            >
              <span style={{ color: 'rgba(129,199,132,0.6)' }}>{label}</span>
              <span
                style={{
                  color: '#a5d6a7',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 12,
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
