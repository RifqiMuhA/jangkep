'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ImagePlus, X } from 'lucide-react';
import { toReadyImage, type ReadyImage } from '@/lib/bongkar/image';
import { ALLOWED_IMAGE_TYPES } from '@/lib/bongkar/upload';
import styles from './UploadModal.module.css';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onPhoto: (photo: ReadyImage) => void;
}

/** Modal unggah foto: klik untuk memilih dari galeri, atau seret foto ke area bergaris. */
export default function UploadModal({ open, onClose, onPhoto }: UploadModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  // Penghitung masuk/keluar: dragleave juga terpicu saat kursor melewati elemen anak,
  // jadi sorotan baru dimatikan ketika kursor benar-benar keluar dari area (hitungan kembali 0).
  const dragDepth = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !busy && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, busy, onClose]);

  function resetDrag() {
    dragDepth.current = 0;
    setDragging(false);
  }

  async function handleFile(file: File | undefined) {
    setError('');
    if (!file) return;
    if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
      setError('Format tidak didukung. Gunakan foto JPEG, PNG, atau WebP.');
      return;
    }
    setBusy(true);
    try {
      onPhoto(await toReadyImage(file));
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Foto tidak bisa dibaca.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence onExitComplete={() => { resetDrag(); setError(''); }}>
      {open && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !busy && onClose()}
          // Mencegah browser membuka file yang terlepas di luar area unggah.
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => e.preventDefault()}
        >
          <motion.div
            className={styles.card}
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-modal-title"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            <button type="button" className={styles.close} onClick={onClose} disabled={busy} aria-label="Tutup">
              <X size={24} strokeWidth={2} />
            </button>

            <div className={styles.mascot} aria-hidden>
              <Image src="/kuliner/mascot_ngintip_1.webp" alt="" fill sizes="130px" />
            </div>
            <h2 id="upload-modal-title" className={styles.title}>
              Unggah Foto Masakan
            </h2>
            <p className={styles.subtitle}>Pilih foto masakan Jawa yang jelas dan terang.</p>

            <button
              type="button"
              className={`${styles.dropzone} ${dragging ? styles.dragging : ''}`}
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              onDragEnter={(e) => {
                e.preventDefault();
                dragDepth.current += 1;
                setDragging(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                dragDepth.current = Math.max(0, dragDepth.current - 1);
                if (dragDepth.current === 0) setDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                resetDrag();
                void handleFile(e.dataTransfer.files?.[0]);
              }}
            >
              <span className={styles.iconCircle}>
                <ImagePlus size={30} strokeWidth={1.8} />
              </span>
              <strong>{busy ? 'Menyiapkan foto…' : dragging ? 'Lepaskan di sini' : 'Seret foto ke sini'}</strong>
              <span className={styles.or}>atau</span>
              <span className={styles.pickButton}>Pilih dari galeri</span>
              <span className={styles.formats}>JPEG, PNG, atau WebP · maksimal 4 MB</span>
            </button>

            <input
              ref={inputRef}
              type="file"
              accept={ALLOWED_IMAGE_TYPES.join(',')}
              className={styles.hiddenInput}
              onChange={(e) => {
                void handleFile(e.target.files?.[0]);
                e.target.value = '';
              }}
            />

            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
