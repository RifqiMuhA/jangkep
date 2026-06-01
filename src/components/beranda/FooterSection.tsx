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
            <div className={styles.brandLogo}>Jangkep</div>
            <div className={styles.brandAksara}>ꦗꦁꦏꦼꦥ꧀</div>
            <p className={styles.brandDesc}>
              Jangkep Rasane, Jangkep Critane —
              platform storytelling kuliner &amp; budaya
              Jawa Tengah.
            </p>
          </div>

          {/* Kolom 2 — Navigasi */}
          <nav className={styles.column} aria-label="Navigasi footer">
            <div className={styles.columnLabel}>NAVIGASI</div>
            <Link href="/" className={styles.footerLink}>Beranda</Link>
            <Link href="/maps" className={styles.footerLink}>Story Maps</Link>
            <Link href="/kuliner" className={styles.footerLink}>Kuliner</Link>
            <Link href="/games" className={styles.footerLink}>Mini Games</Link>
          </nav>

          {/* Kolom 3 — Tentang */}
          <div className={styles.column}>
            <div className={styles.columnLabel}>TENTANG</div>
            <Link href="/tentang" className={styles.footerLink}>Tentang Jangkep</Link>
            <Link href="/sumber-data" className={styles.footerLink}>Sumber Data</Link>
            <Link href="/kredit" className={styles.footerLink}>Kredit</Link>
          </div>

          {/* Kolom 4 — Ikuti Kami */}
          <div className={styles.column}>
            <div className={styles.columnLabel}>IKUTI KAMI</div>
            <div className={styles.socialRow}>
              {/* Instagram */}
              <a
                href="https://instagram.com/jangkep"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label="Instagram Jangkep"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com/@jangkep"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label="TikTok Jangkep"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@jangkep"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label="YouTube Jangkep"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none" />
                </svg>
              </a>
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
