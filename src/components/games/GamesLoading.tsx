import Image from 'next/image';
import styles from './GamesLoading.module.css';

/**
 * Layar tunggu saat halaman Dolan atau salah satu game sedang dimuat.
 * Dipakai oleh file loading.tsx di src/app/games, supaya pemain tahu game sedang disiapkan.
 */
export default function GamesLoading() {
  return (
    <div className={styles.screen} role="status" aria-live="polite">
      <div className={styles.mascot}>
        <Image src="/kuliner/mascot_kuliner_4.webp" alt="" fill sizes="160px" priority />
      </div>
      <p className={styles.title}>Nyiapke dolanan…</p>
      <p className={styles.text}>Si Podo lagi nata pawon. Sebentar, ya.</p>
      <div className={styles.dots} aria-hidden>
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
