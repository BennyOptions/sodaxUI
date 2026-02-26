'use client';

import dynamic from 'next/dynamic';

const SodaxSwap = dynamic(() => import('@/components/SodaxSwap'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(165deg, #0a1a0a 0%, #0d1f0d 30%, #0a170a 60%, #091209 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#81c784',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      Loading SODAX...
    </div>
  ),
});

export default function Home() {
  return <SodaxSwap />;
}
