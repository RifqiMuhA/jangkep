'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, RotateCcw } from 'lucide-react';
import CameraStage from '@/components/bongkar/CameraStage';
import CookingStage from '@/components/bongkar/CookingStage';
import ResultStage from '@/components/bongkar/ResultStage';
import type { ReadyImage } from '@/lib/bongkar/image';
import { bongkarResponseSchema, type BongkarResponse } from '@/lib/bongkar/schema';
import { DISH_FIELD, IMAGE_FIELD } from '@/lib/bongkar/upload';
import styles from './bongkar.module.css';

type SuccessResponse = Extract<BongkarResponse, { ok: true }>;
type Stage = 'camera' | 'cooking' | 'result' | 'error';

/** Layar memasak minimal tampil selama ini, supaya animasinya tidak sekadar berkedip. */
const MIN_COOKING_MS = 2200;

export default function BongkarClient() {
  const [stage, setStage] = useState<Stage>('camera');
  const [photo, setPhoto] = useState<ReadyImage | null>(null);
  const [data, setData] = useState<SuccessResponse | null>(null);
  const [error, setError] = useState('');
  /** Tebakan awal AI, diisi setelah pengguna mengoreksi nama masakan. */
  const [correctedFrom, setCorrectedFrom] = useState<string | null>(null);
  const photoRef = useRef<ReadyImage | null>(null);

  // Cabut URL pratinjau terakhir saat halaman ditinggalkan.
  useEffect(() => () => {
    if (photoRef.current) URL.revokeObjectURL(photoRef.current.previewUrl);
  }, []);

  function replacePhoto(next: ReadyImage | null) {
    if (photoRef.current && photoRef.current !== next) URL.revokeObjectURL(photoRef.current.previewUrl);
    photoRef.current = next;
    setPhoto(next);
  }

  /** Kirim foto ke /api/bongkar; dengan `dish`, AI hanya menyusun ulang rempah untuk nama itu. */
  async function requestBongkar(current: ReadyImage, dish?: string): Promise<{ data: SuccessResponse } | { error: string }> {
    try {
      const form = new FormData();
      form.append(IMAGE_FIELD, current.blob, 'foto.jpg');
      if (dish) form.append(DISH_FIELD, dish);
      const response = await fetch('/api/bongkar', { method: 'POST', body: form });
      const parsed = bongkarResponseSchema.safeParse(await response.json().catch(() => null));
      if (!parsed.success) return { error: 'Server memberi jawaban yang tidak dikenali. Coba lagi.' };
      if (!parsed.data.ok) return { error: parsed.data.error.message };
      return { data: parsed.data };
    } catch {
      return { error: 'Tidak bisa terhubung ke server. Periksa koneksi lalu coba lagi.' };
    }
  }

  async function recorrect(dish: string): Promise<string | null> {
    const current = photoRef.current;
    const previous = data;
    if (!current || !previous) return 'Foto tidak ditemukan. Coba foto ulang.';
    const outcome = await requestBongkar(current, dish);
    if ('error' in outcome) return outcome.error;
    setCorrectedFrom((from) => from ?? previous.result.dish);
    setData(outcome.data);
    return null;
  }

  async function submit() {
    const current = photoRef.current;
    if (!current) return;
    setStage('cooking');
    setError('');
    const startedAt = Date.now();

    const outcome = await requestBongkar(current);
    let nextStage: Stage = 'error';
    if ('error' in outcome) setError(outcome.error);
    else {
      setData(outcome.data);
      setCorrectedFrom(null);
      nextStage = 'result';
    }

    const wait = MIN_COOKING_MS - (Date.now() - startedAt);
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    setStage(nextStage);
  }

  function restart() {
    replacePhoto(null);
    setData(null);
    setCorrectedFrom(null);
    setError('');
    setStage('camera');
  }

  return (
    <main className={styles.page}>
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          className={styles.stageWrap}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          {stage === 'camera' && (
            <CameraStage photo={photo} onPhoto={replacePhoto} onRetake={() => replacePhoto(null)} onSubmit={submit} />
          )}

          {stage === 'cooking' && photo && <CookingStage photoUrl={photo.previewUrl} />}

          {stage === 'result' && data && photo && <ResultStage data={data} photoUrl={photo.previewUrl} correctedFrom={correctedFrom} onRecorrect={recorrect} onRestart={restart} />}

          {stage === 'error' && (
            <div className={styles.errorStage} role="alert">
              <div className={styles.errorCard}>
                <div className={styles.errorMascot}>
                  <Image src="/kuliner/mascot_not_found.webp" alt="" fill sizes="160px" />
                </div>
                <h1>Waduh, Masakane Durung Kebongkar</h1>
                <p>{error}</p>
                <div className={styles.errorActions}>
                  <button type="button" className={styles.primaryButton} onClick={submit} disabled={!photo}>
                    <RotateCcw size={18} strokeWidth={2.25} /> Coba lagi
                  </button>
                  <button type="button" className={styles.ghostButton} onClick={restart}>
                    <Camera size={18} strokeWidth={2.25} /> Foto ulang
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Sapuan kain batik setiap kali layar berganti */}
      <AnimatePresence>
        <motion.div
          key={`wipe-${stage}`}
          className={styles.wipe}
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)', 'inset(0 0 0 100%)'] }}
          transition={{ duration: 0.9, times: [0, 0.45, 1], ease: 'easeInOut' }}
          aria-hidden
        />
      </AnimatePresence>
    </main>
  );
}
