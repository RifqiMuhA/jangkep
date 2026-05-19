export default async function KulinerDetail({ params }: { params: Promise<{ nama: string }> }) {
  const { nama } = await params;
  
  return (
    <main style={{ padding: 'var(--spacing-96) var(--spacing-24)', maxWidth: 'var(--container-max)', margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--spacing-16)', color: 'var(--color-krem-tua)', fontSize: 'var(--text-caption)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Detail Kuliner
      </div>
      <h1 style={{ fontSize: 'var(--text-display-lg)', color: 'var(--color-coklat-batik)', textTransform: 'capitalize' }}>
        {nama.replace(/-/g, ' ')}
      </h1>
      <p style={{ fontSize: 'var(--text-body-lg)', color: 'var(--color-coklat-batik)', marginTop: 'var(--spacing-16)' }}>
        Halaman detail resep, sejarah, dan cara memasak.
      </p>
    </main>
  );
}
