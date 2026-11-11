'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { extraSpiceImage, titleCase } from '@/lib/bongkar/categories';
import type { ExtraSpice } from '@/lib/bongkar/schema';
import styles from './SpiceModal.module.css';

interface ExtraSpiceModalProps {
  spice: ExtraSpice | null;
  dish: string;
  onClose: () => void;
}

/**
 * Detail bumbu yang belum ada di koleksi Jangkep. Bentuknya sama dengan SpiceModal,
 * tetapi isinya keterangan singkat dari AI, jadi diberi label perkiraan.
 */
export default function ExtraSpiceModal({ spice, dish, onClose }: ExtraSpiceModalProps) {
  useEffect(() => {
    if (!spice) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [spice, onClose]);

  return (
    <AnimatePresence>
      {spice && (
        <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            className={styles.content}
            role="dialog"
            aria-modal="true"
            aria-labelledby="extra-spice-modal-title"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            <button type="button" className={styles.close} onClick={onClose} aria-label="Tutup">
              <X size={28} strokeWidth={2} />
            </button>
            <div className={styles.left}>
              <motion.div
                className={styles.imageWrap}
                initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.1 }}
              >
                <Image src={extraSpiceImage(spice.name)} alt={titleCase(spice.name)} fill sizes="(max-width: 768px) 70vw, 40vw" style={{ objectFit: 'contain' }} />
              </motion.div>
            </div>
            <div className={styles.right}>
              <span className={styles.aiBadge}>
                <Sparkles size={13} strokeWidth={2.25} /> Perkiraan AI
              </span>
              <h2 id="extra-spice-modal-title" className={styles.title}>
                {titleCase(spice.name)}
              </h2>
              <span className={styles.jawa}>Belum ada di koleksi Jangkep</span>

              <div className={styles.sectionTitle}>
                <span>PERANNYA DI {dish.toUpperCase()}</span>
                <span className={styles.line} />
              </div>
              <p className={styles.text}>{spice.peran || 'Si Podo belum punya keterangan untuk bumbu ini.'}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
