'use client';

import dynamic from 'next/dynamic';

const StoryMapsClient = dynamic(() => import('./StoryMapsClient'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-coklat-batik)',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: '32px',
          fontWeight: 700,
          color: 'var(--color-krem-mori)',
        }}
      >
        Jangkep
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-kuning-kepodang)',
              animation: `loadDot 0.8s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes loadDot {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-10px); }
        }
      `}</style>
    </div>
  ),
});

export default function MapsPage() {
  return <StoryMapsClient />;
}
