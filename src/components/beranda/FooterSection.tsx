import Link from 'next/link';
import Image from 'next/image';
import styles from './FooterSection.module.css';

interface NavItem {
  href: string;
  title: string;
  subtitle: string;
}

const navItems: NavItem[] = [
  { href: '/', title: 'Beranda', subtitle: 'Halaman utama' },
  { href: '/maps', title: 'Peta Rasa', subtitle: 'Jelajahi peta kuliner' },
  { href: '/kuliner/gudeg', title: 'Resep', subtitle: 'Detail kuliner lengkap' },
  { href: '/games', title: 'Dolan', subtitle: 'Mini games seru' },
];

export default function FooterSection() {
  return (
    <footer className={styles.footer}>
      {/* Batik border-top strip */}
      <div className={styles.borderTop} aria-hidden="true" />

      <div className={styles.container}>
        {/* Navigation grid */}
        <nav className={styles.navGrid} aria-label="Navigasi footer">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navItem}>
              <div className={styles.navTitle}>{item.title}</div>
              <p className={styles.navSubtitle}>{item.subtitle}</p>
            </Link>
          ))}
        </nav>

        {/* Javanese proverb quote */}
        <div className={styles.quoteSection}>
          <p className={styles.quote}>
            Mangan ora mangan sing penting kumpul
          </p>
          <p className={styles.quoteTranslation}>
            — Makan atau tidak makan, yang penting berkumpul
          </p>
        </div>

        {/* Aksara Jawa ornament */}
        <div className={styles.aksaraOrnament} aria-hidden="true">
          ꦗꦁꦏꦼꦥ꧀
        </div>

        {/* Credits */}
        <p className={styles.credits}>
          Sumber data: Kemenparekraf · Pesona Indonesia · © 2025 Jangkep
        </p>
      </div>

      {/* Si Podo small mascot */}
      <Image
        src="/sipodo/halo.webp"
        alt="Si Podo"
        width={60}
        height={60}
        style={{ width: 'auto' }}
        className={styles.sipodoSmall}
      />
    </footer>
  );
}
