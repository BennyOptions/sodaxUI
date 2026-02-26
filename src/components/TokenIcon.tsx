'use client';

import { TOKENS, type TokenSymbol } from '@/config/tokens';

interface TokenIconProps {
  token: TokenSymbol;
  size?: number;
}

export default function TokenIcon({ token, size = 40 }: TokenIconProps) {
  const t = TOKENS[token];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${t.color}22, ${t.color}44)`,
        border: `1.5px solid ${t.color}33`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.45,
        fontWeight: 600,
        color: t.color,
        flexShrink: 0,
      }}
    >
      {t.icon}
    </div>
  );
}
