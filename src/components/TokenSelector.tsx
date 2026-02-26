'use client';

import { useState } from 'react';
import { TOKENS, type TokenSymbol } from '@/config/tokens';
import TokenIcon from './TokenIcon';

interface TokenSelectorProps {
  selected: TokenSymbol;
  onSelect: (sym: TokenSymbol) => void;
  disabled?: boolean;
}

export default function TokenSelector({ selected, onSelect, disabled }: TokenSelectorProps) {
  const [open, setOpen] = useState(false);
  const other: TokenSymbol = selected === 'SOL' ? 'ETH' : 'SOL';
  const t = TOKENS[selected];

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          cursor: disabled ? 'default' : 'pointer',
          color: '#e8f5e9',
          fontSize: 15,
          fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
          transition: 'all 0.2s ease',
          minWidth: 130,
        }}
      >
        <TokenIcon token={selected} size={28} />
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{t.symbol}</div>
          <div style={{ fontSize: 11, color: '#81c784', fontWeight: 400 }}>
            {t.chainName}
          </div>
        </div>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{
            marginLeft: 'auto',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="#81c784"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#1a2e1a',
            border: '1px solid rgba(129,199,132,0.15)',
            borderRadius: 12,
            zIndex: 50,
            overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
            animation: 'fadeSlideIn 0.15s ease',
          }}
        >
          {([selected, other] as TokenSymbol[]).map((sym) => {
            const tk = TOKENS[sym];
            return (
              <button
                key={sym}
                onClick={() => {
                  onSelect(sym);
                  setOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 12px',
                  width: '100%',
                  background:
                    sym === selected
                      ? 'rgba(129,199,132,0.08)'
                      : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#e8f5e9',
                  fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = 'rgba(129,199,132,0.12)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    sym === selected
                      ? 'rgba(129,199,132,0.08)'
                      : 'transparent')
                }
              >
                <TokenIcon token={sym} size={24} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600 }}>{tk.symbol}</div>
                  <div style={{ fontSize: 11, color: '#81c784' }}>
                    {tk.chainName}
                  </div>
                </div>
                {sym === selected && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    style={{ marginLeft: 'auto' }}
                  >
                    <path
                      d="M3 7L6 10L11 4"
                      stroke="#66bb6a"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
