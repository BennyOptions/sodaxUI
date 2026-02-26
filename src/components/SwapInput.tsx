'use client';

import type { TokenSymbol } from '@/config/tokens';
import TokenSelector from './TokenSelector';

function formatUSD(value: number | null | undefined) {
  if (!value || isNaN(value)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

interface SwapInputProps {
  token: TokenSymbol;
  amount: string;
  onAmountChange: (val: string) => void;
  onTokenChange: (sym: TokenSymbol) => void;
  label: string;
  readOnly?: boolean;
  usdValue?: number | null;
}

export default function SwapInput({
  token,
  amount,
  onAmountChange,
  onTokenChange,
  label,
  readOnly,
  usdValue,
}: SwapInputProps) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(129,199,132,0.08)',
        borderRadius: 16,
        padding: '16px 18px',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'rgba(129,199,132,0.25)';
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,199,132,0.06)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'rgba(129,199,132,0.08)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: '#81c784',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {label}
        </span>
        {usdValue != null && usdValue > 0 && (
          <span style={{ fontSize: 12, color: 'rgba(129,199,132,0.6)' }}>
            {formatUSD(usdValue)}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(e) => {
            const val = e.target.value;
            if (/^[0-9]*\.?[0-9]*$/.test(val)) {
              onAmountChange(val);
            }
          }}
          readOnly={readOnly}
          placeholder="0.00"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: readOnly ? '#a5d6a7' : '#e8f5e9',
            fontSize: 28,
            fontWeight: 300,
            fontFamily: "'DM Mono', monospace",
            letterSpacing: '-0.02em',
            width: 0,
            minWidth: 0,
          }}
        />
        <TokenSelector
          selected={token}
          onSelect={onTokenChange}
        />
      </div>
    </div>
  );
}
