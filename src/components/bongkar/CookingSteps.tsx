'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { Cooking, DishLink } from '@/lib/bongkar/schema';
import styles from './CookingSteps.module.css';

interface CookingStepsProps {
  cooking: Cooking;
  dishLink?: DishLink;
}

/**
 * Langkah memasak versi ringkas untuk Bongkar Rempah, memakai aset yang sama dengan
 * bagian "Cara Memasak" di halaman Ensiklopedia (public/kuliner/methods/).
 */
export default function CookingSteps({ cooking, dishLink }: CookingStepsProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const steps = cooking.steps;
  const step = steps[Math.min(index, steps.length - 1)];
  const fromJangkep = cooking.source === 'jangkep';

  function go(next: number) {
    if (next < 0 || next >= steps.length) return;
    setDirection(next > index ? 1 : -1);
    setIndex(next);
  }

  return (
    <div
      className={styles.wrap}
      tabIndex={0}
      aria-roledescription="langkah memasak"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(index + 1);
        if (e.key === 'ArrowLeft') go(index - 1);
      }}
    >
      <div className={styles.mascot}>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className={styles.mascotInner}
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Image src={`/kuliner/methods/${step.action}_mascot.webp`} alt={`Si Podo sedang ${step.action}`} fill sizes="280px" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={styles.boardRow}>
        <button type="button" className={styles.navButton} onClick={() => go(index - 1)} disabled={index === 0} aria-label="Langkah sebelumnya">
          <Image src="/kuliner/methods/tombol_kiri.webp" alt="" fill sizes="56px" />
        </button>

        <div className={styles.board}>
          <Image src="/kuliner/methods/background_papan.webp" alt="" fill sizes="(max-width: 768px) 90vw, 640px" className={styles.boardImage} />
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              className={styles.boardContent}
              custom={direction}
              initial={{ opacity: 0, x: direction * 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -30 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              aria-live="polite"
            >
              <div className={styles.text}>
                <div className={styles.headerRow}>
                  <span className={styles.stepNumber}>{index + 1}</span>
                  <h3 className={styles.stepTitle}>{step.action}</h3>
                </div>
                <span className={styles.divider} />
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
              <span className={styles.icon}>
                <Image src={`/kuliner/methods/${step.action}.webp`} alt="" fill sizes="96px" />
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          type="button"
          className={styles.navButton}
          onClick={() => go(index + 1)}
          disabled={index === steps.length - 1}
          aria-label="Langkah berikutnya"
        >
          <Image src="/kuliner/methods/tombol_kanan.webp" alt="" fill sizes="56px" />
        </button>
      </div>

      <div className={styles.footer}>
        {!fromJangkep && (
          <span className={styles.sourceAi}>
            <Sparkles size={13} strokeWidth={2.25} /> Perkiraan AI
          </span>
        )}
        <div className={styles.dots}>
          {steps.map((s, i) => (
            <button
              type="button"
              key={i}
              className={i === index ? `${styles.dot} ${styles.dotActive}` : styles.dot}
              onClick={() => go(i)}
              aria-label={`Langkah ${i + 1}: ${s.action}`}
              aria-current={i === index ? 'step' : undefined}
            />
          ))}
        </div>
        {fromJangkep && dishLink && (
          <Link href={`/kuliner/katalog/${dishLink.slug}`} className={styles.fullRecipe}>
            Resep lengkap di Ensiklopedia <ArrowRight size={14} strokeWidth={2.25} />
          </Link>
        )}
      </div>
    </div>
  );
}
