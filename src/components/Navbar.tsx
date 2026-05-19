import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 'var(--spacing-16) var(--spacing-48)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'var(--color-putih-santan)',
      borderBottom: '1px solid var(--color-krem-tua)'
    }}>
      <div style={{
        fontFamily: 'var(--font-playfair)',
        fontSize: 'var(--text-heading)',
        fontWeight: 700,
        color: 'var(--color-coklat-batik)'
      }}>
        <Link href="/">Jangkep.</Link>
      </div>
      
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-32)',
        alignItems: 'center',
        fontFamily: 'var(--font-dm-sans)',
        fontSize: 'var(--text-body)',
        fontWeight: 500,
        color: 'var(--color-coklat-batik)'
      }}>
        <Link href="/">Beranda</Link>
        <Link href="/maps">Peta Rasa</Link>
        <Link href="/kuliner/gudeg">Resep</Link>
        
        {/* Tombol Dolan (Games) dengan gaya CTA Kuning Kepodang */}
        <Link href="/games" style={{
          backgroundColor: 'var(--color-kuning-kepodang)',
          color: 'var(--color-coklat-batik)',
          fontWeight: 700,
          padding: '12px 28px',
          borderRadius: 'var(--radius-buttons)',
          boxShadow: 'var(--shadow-card)',
          textDecoration: 'none',
          display: 'inline-block'
        }}>
          Dolan
        </Link>
      </div>
    </nav>
  );
}
