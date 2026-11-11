'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './CookingStage.module.css';

/** Tahap memasak Si Podo selama menunggu AI. Tahap terakhir bertahan sampai jawaban datang. */
const STEPS = [
  { image: '/kuliner/methods/haluskan_mascot.webp', label: 'Ngulek', line: 'Si Podo lagi ngulek bumbu…' },
  { image: '/kuliner/methods/tumis_mascot.webp', label: 'Numis', line: 'Numis bumbu nganti arum…' },
  { image: '/kuliner/methods/rebus_mascot.webp', label: 'Nggodhog', line: 'Nggodhog kuah, ngicipi rasane…' },
  { image: '/kuliner/methods/sajikan_mascot.webp', label: 'Nyajekke', line: 'Meh rampung, ditata ing tampah…' },
];
const STEP_MS = 3200;

interface CookingStageProps {
  photoUrl: string;
}

export default function CookingStage({ photoUrl }: CookingStageProps) {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const timer = setInterval(() => setElapsedMs(Date.now() - startedAt), 200);
    return () => clearInterval(timer);
  }, []);

  const step = Math.min(STEPS.length - 1, Math.floor(elapsedMs / STEP_MS));
  const current = STEPS[step];
  const seconds = Math.floor(elapsedMs / 1000);

  return (
    <div className={styles.stage} aria-live="polite" aria-busy="true">
      <div className={styles.backdrop} />
      <div className={styles.vignette} />

      <div className={`${styles.lamp} ${styles.lampLeft}`} aria-hidden>
        <Image src="/kuliner/methods/lampu.webp" alt="" fill sizes="80px" />
      </div>
      <div className={`${styles.lamp} ${styles.lampRight}`} aria-hidden>
        <Image src="/kuliner/methods/lampu.webp" alt="" fill sizes="80px" />
      </div>

      {/* Foto pengguna ditempel seperti polaroid */}
      <motion.figure
        className={styles.polaroid}
        initial={{ opacity: 0, x: -60, rotate: -20 }}
        animate={{ opacity: 1, x: 0, rotate: -6 }}
        transition={{ type: 'spring', stiffness: 140, damping: 16 }}
      >
        <span className={styles.tape} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoUrl} alt="Foto masakan yang sedang dibongkar" />
        <figcaption>Masakanmu</figcaption>
      </motion.figure>

      <div className={styles.center}>
        <AnimatePresence mode="wait">
          <motion.p
            key={current.line}
            className={styles.bubble}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {current.line}
          </motion.p>
        </AnimatePresence>

        <div className={styles.mascotWrap}>
          <div className={styles.glow} />
          <div className={styles.steam} aria-hidden>
            <span />
            <span />
            <span />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={current.image}
              className={styles.mascot}
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            >
              <div className={styles.mascotBob}>
                <Image src={current.image} alt={`Si Podo sedang ${current.label.toLowerCase()}`} fill sizes="(max-width: 640px) 70vw, 420px" priority />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <ol className={styles.steps}>
          {STEPS.map((s, i) => (
            <li key={s.label} className={`${styles.step} ${i < step ? styles.stepDone : ''} ${i === step ? styles.stepActive : ''}`}>
              <span className={styles.stepDot} />
              <span className={styles.stepLabel}>{s.label}</span>
            </li>
          ))}
        </ol>
        <p className={styles.timer}>
          {seconds} detik · biasanya 5–15 detik
        </p>
      </div>
    </div>
  );
}
