'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, RotateCcw, Soup } from 'lucide-react';
import CameraStage from '@/components/bongkar/CameraStage';
import CookingStage from '@/components/bongkar/CookingStage';
import DapurPicker from '@/components/bongkar/DapurPicker';
import ResultStage from '@/components/bongkar/ResultStage';
import type { DapurDish } from '@/lib/bongkar/dapur';
import type { ReadyImage } from '@/lib/bongkar/image';
import { bongkarResponseSchema, type BongkarResponse } from '@/lib/bongkar/schema';
import { DISH_FIELD, IMAGE_FIELD } from '@/lib/bongkar/upload';
import styles from './bongkar.module.css';

type SuccessResponse = Extract<BongkarResponse, { ok: true }>;
type Stage = 'camera' | 'cooking' | 'result' | 'error';

/** Layar memasak minimal tampil selama ini, supaya animasinya tidak sekadar berkedip. */
const MIN_COOKING_MS = 2200;

const DAPUR_SUBTITLE = 'Ora duwe foto? Pilih masakan, Si Podo langsung mbongkar rempahe saka resep tim Jangkep.';
const DAPUR_SUBTITLE_ERROR = 'Si Podo lagi kesel. Pilih masakane dhewe, rempahe tak bongkar saka resep tim Jangkep.';

export default function BongkarClient({ dapur }: { dapur: DapurDish[] }) {
  const [stage, setStage] = useState<Stage>('camera');
  const [dapurOpen, setDapurOpen] = useState(false);
  /** Foto masakan dari galeri dapur Jangkep, dipakai kalau pengguna belum punya foto sendiri. */
  const [dapurPhotoUrl, setDapurPhotoUrl] = useState<string | null>(null);
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
      if (!parsed.success) return { error: 'Si Podo lagi istirahat sebentar. Coba lagi nanti, atau pilih masakan dari dapur Jangkep.' };
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

  /** Bongkar dari galeri dapur Jangkep: hasilnya sudah jadi, jadi tidak memanggil AI. Foto sendiri (kalau ada) tetap dipakai. */
  async function pickDapur(dish: DapurDish) {
    setDapurOpen(false);
    setDapurPhotoUrl(photoRef.current ? null : dish.image);
    setStage('cooking');
    setError('');
    await new Promise((resolve) => setTimeout(resolve, MIN_COOKING_MS));
    setData({ ok: true, result: dish.result, meta: { latencyMs: 0, model: 'dapur-jangkep', attempts: 0 } });
    setCorrectedFrom(null);
    setStage('result');
  }

  function restart() {
    replacePhoto(null);
    setDapurPhotoUrl(null);
    setData(null);
    setCorrectedFrom(null);
    setError('');
    setStage('camera');
  }

  const shownPhotoUrl = photo?.previewUrl ?? dapurPhotoUrl;

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
            <CameraStage photo={photo} onPhoto={replacePhoto} onRetake={() => replacePhoto(null)} onSubmit={submit} onOpenDapur={() => setDapurOpen(true)} />
          )}

          {stage === 'cooking' && shownPhotoUrl && <CookingStage photoUrl={shownPhotoUrl} />}

          {stage === 'result' && data && shownPhotoUrl && (
            <ResultStage data={data} photoUrl={shownPhotoUrl} correctedFrom={correctedFrom} onRecorrect={recorrect} onRestart={restart} />
          )}

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
                  <button type="button" className={styles.ghostButton} onClick={() => setDapurOpen(true)}>
                    <Soup size={18} strokeWidth={2.25} /> Pilih dari dapur Jangkep
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

      <DapurPicker
        open={dapurOpen}
        dishes={dapur}
        subtitle={stage === 'error' ? DAPUR_SUBTITLE_ERROR : DAPUR_SUBTITLE}
        onClose={() => setDapurOpen(false)}
        onPick={pickDapur}
      />

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
