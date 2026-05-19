import Image from "next/image";

export default function Home() {
  return (
    <main style={{ padding: 'var(--spacing-96) var(--spacing-24)', maxWidth: 'var(--container-max)', margin: '0 auto' }}>
      <h1 style={{ fontSize: 'var(--text-display-lg)', color: 'var(--color-coklat-batik)' }}>
        Jangkep Rasane, Jangkep Critane
      </h1>
      <p style={{ fontSize: 'var(--text-body-lg)', color: 'var(--color-coklat-batik)', marginTop: 'var(--spacing-16)' }}>
        Website eksplorasi kuliner Jawa Tengah yang immersive dan interaktif.
      </p>
      
      <div style={{ marginTop: 'var(--spacing-48)' }}>
        <button style={{
          backgroundColor: 'var(--color-kuning-kepodang)',
          color: 'var(--color-coklat-batik)',
          fontFamily: 'var(--font-dm-sans)',
          fontWeight: 700,
          fontSize: 'var(--text-body-sm)',
          padding: '14px 28px',
          border: 'none',
          borderRadius: 'var(--radius-buttons)',
          cursor: 'pointer'
        }}>
          Mulai Perjalanan
        </button>
      </div>
    </main>
  );
}
