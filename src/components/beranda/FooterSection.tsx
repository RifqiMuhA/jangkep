import Link from 'next/link';
import styles from './FooterSection.module.css';

export default function FooterSection() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* ── ROW 1: 4-column grid ── */}
        <div className={styles.topGrid}>
          {/* Kolom 1 — Brand Identity */}
          <div className={styles.brand}>
            <div className={styles.brandLogo}>Jangkep<span className={styles.brandDot}>.</span></div>
            <div className={styles.brandSubtitle}>rasa yang jangkep, jiwa yang utuh.</div>
            <div className={styles.brandDivider}></div>
            <p className={styles.brandDesc}>
              Menjelajahi rempah, resep, dan cerita kuliner Jawa yang diwariskan turun temurun. Dari dapur, untuk dunia.
            </p>
            {/* Ornamen Pawon */}
            <div className={styles.brandOrnament}>
              <img src="/ornaments/pawon-lineart.png" alt="" className={styles.ornamentImage} />
            </div>
          </div>

          {/* Kolom 2 — Navigasi */}
          <nav className={styles.column} aria-label="Navigasi footer">
            <div className={styles.columnLabel}>
              <span className={styles.columnIcon}>✦</span> MENJELAJAH
            </div>
            <Link href="/" className={styles.footerLink}>Beranda</Link>
            <Link href="/rasa" className={styles.footerLink}>Ensiklopedia</Link>
            <Link href="/kuliner" className={styles.footerLink}>Resep</Link>
            <Link href="/maps" className={styles.footerLink}>Peta Rasa</Link>
            <Link href="/games" className={styles.footerLink}>Dolan</Link>
          </nav>

          {/* Kolom 3 — Hubungi Kami */}
          <div className={styles.column}>
            <div className={styles.columnLabel}>
              <span className={styles.columnIcon}>✦</span> HUBUNGI KAMI
            </div>
            
            <div className={styles.contactItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 7 10 7 10-7" />
              </svg>
              <span>hello@jangkep.rasa</span>
            </div>
            
            <div className={styles.contactItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Yogyakarta, Indonesia</span>
            </div>
            
            <div className={styles.contactItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Senin - Jumat<br />09.00 - 17.00 WIB</span>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className={styles.divider} aria-hidden="true" />

        {/* ── ROW 2: Quote Center ── */}
        <div className={styles.quoteCenter}>
          <div className={styles.quoteAksara} aria-hidden="true">
            <span className={styles.quoteFlourish}>✦</span>
            <span>ꦱꦼꦩꦔꦠ꧀ꦗꦮ꧈ꦲꦗꦶꦥ꧀ꦫꦱ꧉</span>
            <span className={styles.quoteFlourish}>✦</span>
          </div>
          <p className={styles.quote}>
            &ldquo;Mangan ora mangan sing penting kumpul.&rdquo;
          </p>
          <p className={styles.quoteTranslation}>
            Makan atau tidak makan, yang penting bersama.
          </p>
        </div>

        {/* ── Bottom Bar ── */}
        <div className={styles.bottomBar}>
          <span className={styles.copyright}>
            © 2026 Jangkep. Dibuat dengan rasa, untuk Jawa Tengah.
          </span>
        </div>
      </div>
    </footer>
  );
}
