'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import type { DapurDish } from '@/lib/bongkar/dapur';
import styles from './DapurPicker.module.css';

interface DapurPickerProps {
  open: boolean;
  dishes: DapurDish[];
  /** Kalimat pembuka; saat AI gangguan berisi ajakan memilih dari dapur Jangkep. */
  subtitle: string;
  onClose: () => void;
  onPick: (dish: DapurDish) => void;
}

/** Galeri masakan Ensiklopedia. Memilih salah satu langsung membongkar rempahnya dari data tim, tanpa AI. */
export default function DapurPicker({ open, dishes, subtitle, onClose, onPick }: DapurPickerProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? dishes.filter((dish) => dish.name.toLowerCase().includes(q)) : dishes;
  }, [dishes, query]);

  return (
    <AnimatePresence onExitComplete={() => setQuery('')}>
      {open && (
        <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            className={styles.card}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dapur-title"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className={styles.close} onClick={onClose} aria-label="Tutup">
              <X size={24} strokeWidth={2} />
            </button>

            <div className={styles.mascot} aria-hidden>
              <Image src="/kuliner/mascot_ngintip_1.webp" alt="" fill sizes="120px" />
            </div>
            <h2 id="dapur-title" className={styles.title}>
              Dapur Jangkep
            </h2>
            <p className={styles.subtitle}>{subtitle}</p>

            <label className={styles.search}>
              <Search size={18} strokeWidth={2} aria-hidden />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari masakan…" aria-label="Cari masakan" />
            </label>

            <div className={styles.grid} data-lenis-prevent>
              {shown.map((dish) => (
                <button key={dish.slug} type="button" className={styles.item} onClick={() => onPick(dish)}>
                  <span className={styles.thumb}>
                    <Image src={dish.image} alt="" fill sizes="(max-width: 640px) 45vw, 180px" />
                  </span>
                  <span className={styles.name}>{dish.name}</span>
                </button>
              ))}
              {shown.length === 0 && <p className={styles.empty}>Masakan itu belum ada di dapur Jangkep.</p>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
