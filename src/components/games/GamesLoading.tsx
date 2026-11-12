import Image from 'next/image';
import styles from './GamesLoading.module.css';

/**
 * Layar tunggu saat halaman Dolan, salah satu game, atau detail kuliner sedang dimuat.
 * Dipakai oleh file loading.tsx, supaya pengunjung tahu halaman sedang disiapkan.
 */
export default function GamesLoading({
  title = 'Nyiapke dolanan…',
  text = 'Si Podo lagi nata pawon. Sebentar, ya.',
}: {
  title?: string;
  text?: string;
}) {
  return (
    <div className={styles.screen} role="status" aria-live="polite">
      <div className={styles.mascot}>
        <Image src="/kuliner/mascot_kuliner_4.webp" alt="" fill sizes="160px" priority />
      </div>
      <p className={styles.title}>{title}</p>
      <p className={styles.text}>{text}</p>
      <div className={styles.dots} aria-hidden>
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
