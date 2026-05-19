export default function GamesPage() {
  return (
    <main style={{ 
      padding: 'var(--spacing-96) var(--spacing-24)', 
      minHeight: '100vh', 
      backgroundColor: 'var(--color-coklat-batik)', 
      color: 'var(--color-krem-mori)' 
    }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        <h1 style={{ fontSize: 'var(--text-display-lg)' }}>
          Mini Games (Dolan)
        </h1>
        <p style={{ fontSize: 'var(--text-body-lg)', marginTop: 'var(--spacing-16)' }}>
          Bermain dan belajar kuliner Jawa Tengah bersama Si Podo.
        </p>
      </div>
    </main>
  );
}
