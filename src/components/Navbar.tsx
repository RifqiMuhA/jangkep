'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  // Sembunyikan navbar di halaman katalog kuliner dan detail kuliner
  if (pathname?.startsWith('/kuliner/katalog')) {
    return null;
  }

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 'var(--spacing-16) var(--spacing-48)',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 50,
      backgroundColor: 'transparent',
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
