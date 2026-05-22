'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Jangkep<span className={styles.logoDot}>.</span>
        </Link>

        {/* Mobile hamburger */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`${styles.links} ${menuOpen ? styles.linksOpen : ''}`}>
          <Link href="/" className={styles.link} onClick={() => setMenuOpen(false)}>
            Beranda
          </Link>
          <Link href="/maps" className={styles.link} onClick={() => setMenuOpen(false)}>
            Peta Rasa
          </Link>
          <Link href="/kuliner/gudeg" className={styles.link} onClick={() => setMenuOpen(false)}>
            Resep
          </Link>
          <Link href="/games" className={styles.cta} onClick={() => setMenuOpen(false)}>
            Dolan
          </Link>
        </div>
      </div>
    </nav>
  );
}
