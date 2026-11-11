'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import styles from './ConfirmCorrectionModal.module.css';

interface ConfirmCorrectionModalProps {
  /** Nama masakan yang akan dipakai. Modal terbuka selama nilainya tidak null. */
  dish: string | null;
  aiDish: string;
  onConfirm: (dish: string) => void;
  onCancel: () => void;
}

/** Konfirmasi sebelum rempah disusun ulang untuk nama masakan hasil koreksi (memakai satu permintaan AI). */
export default function ConfirmCorrectionModal({ dish, aiDish, onConfirm, onCancel }: ConfirmCorrectionModalProps) {
  useEffect(() => {
    if (!dish) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dish, onCancel]);

  return (
    <AnimatePresence>
      {dish && (
        <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancel}>
          <motion.div
            className={styles.card}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-desc"
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.mascot} aria-hidden>
              <Image src="/kuliner/mascot_not_found.webp" alt="" fill sizes="130px" />
            </div>
            <span className={styles.label}>Koreksi masakan</span>
            <h2 id="confirm-title" className={styles.title}>
              Yakin iki <em>{dish}</em>?
            </h2>
            <p id="confirm-desc" className={styles.text}>
              Si Podo bakal mbongkar ulang rempah kanggo <strong>{dish}</strong>, ngganti tebakan sebelumnya (<em>{aiDish}</em>). Langkah ini memakai
              satu permintaan AI lagi.
            </p>
            <div className={styles.actions}>
              <button type="button" className={styles.ghost} onClick={onCancel}>
                Batal
              </button>
              <button type="button" className={styles.primary} onClick={() => onConfirm(dish)} autoFocus>
                <RefreshCw size={17} strokeWidth={2.25} /> Ya, bongkar ulang
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
