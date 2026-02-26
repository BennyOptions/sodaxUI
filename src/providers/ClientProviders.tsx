'use client';

import { ReactNode, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Providers = dynamic(() => import('./Providers'), { ssr: false });

export default function ClientProviders({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(165deg, #0a1a0a 0%, #0d1f0d 30%, #0a170a 60%, #091209 100%)',
        }}
      />
    );
  }

  return <Providers>{children}</Providers>;
}
