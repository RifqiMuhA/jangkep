'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, ImagePlus, RotateCcw, SwitchCamera } from 'lucide-react';
import { toReadyImage, type ReadyImage } from '@/lib/bongkar/image';
import UploadModal from './UploadModal';
import styles from './CameraStage.module.css';

type CameraState = 'starting' | 'live' | 'unavailable';
type Facing = 'environment' | 'user';

interface CameraStageProps {
  /** Foto yang sudah diambil. Kalau ada, layar berubah menjadi konfirmasi (Ulangi / Bongkar). */
  photo: ReadyImage | null;
  onPhoto: (photo: ReadyImage) => void;
  onRetake: () => void;
  onSubmit: () => void;
  /** Buka galeri dapur Jangkep (bongkar tanpa foto dan tanpa AI). */
  onOpenDapur: () => void;
}

function cameraErrorMessage(err: unknown): string {
  const name = err instanceof DOMException ? err.name : '';
  if (name === 'NotAllowedError' || name === 'SecurityError') return 'Izin kamera ditolak. Kamu tetap bisa unggah foto dari galeri.';
  if (name === 'NotFoundError' || name === 'OverconstrainedError') return 'Kamera tidak ditemukan di perangkat ini.';
  if (name === 'NotReadableError') return 'Kamera sedang dipakai aplikasi lain.';
  return 'Kamera belum bisa dibuka.';
}

export default function CameraStage({ photo, onPhoto, onRetake, onSubmit, onOpenDapur }: CameraStageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [camera, setCamera] = useState<CameraState>('starting');
  const [cameraError, setCameraError] = useState('');
  const [facing, setFacing] = useState<Facing>('environment');
  const [attempt, setAttempt] = useState(0);
  const [canSwitch, setCanSwitch] = useState(false);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState(0);
  const [fileError, setFileError] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);

  // Datang dari tombol mengambang "Unggah foto" (/bongkar?mulai=unggah): langsung buka modal unggah,
  // lalu bersihkan alamatnya supaya modal tidak terbuka lagi saat halaman dimuat ulang.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('mulai') !== 'unggah') return;
    // Alamat baru dibersihkan setelah modal terbuka; di mode Strict efek ini jalan dua kali dan putaran pertama dibatalkan.
    const frame = window.requestAnimationFrame(() => {
      setUploadOpen(true);
      const url = new URL(window.location.href);
      url.searchParams.delete('mulai');
      window.history.replaceState(window.history.state, '', url.pathname + url.search);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  // Nyalakan kamera; matikan semua track saat layar ditinggalkan atau kamera diganti.
  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError('Browser ini belum bisa memakai kamera di halaman ini.');
        setCamera('unavailable');
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facing }, width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
        if (cancelled) return;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          await video.play().catch(() => undefined);
        }
        setCamera('live');
        const devices = await navigator.mediaDevices.enumerateDevices();
        if (!cancelled) setCanSwitch(devices.filter((d) => d.kind === 'videoinput').length > 1);
      } catch (err) {
        if (cancelled) return;
        setCameraError(cameraErrorMessage(err));
        setCamera('unavailable');
      }
    }

    void start();
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [facing, attempt]);

  async function capture() {
    const video = videoRef.current;
    if (!video || camera !== 'live' || busy) return;
    setBusy(true);
    setFlash((n) => n + 1);
    try {
      onPhoto(await toReadyImage(video));
    } catch (err) {
      setFileError(err instanceof Error ? err.message : 'Gagal mengambil foto.');
    } finally {
      setBusy(false);
    }
  }

  function switchCamera() {
    setCamera('starting');
    setFacing((f) => (f === 'environment' ? 'user' : 'environment'));
  }

  function retryCamera() {
    setCamera('starting');
    setCameraError('');
    setAttempt((n) => n + 1);
  }

  const uploadButton = (
    <button type="button" className={styles.sideButton} onClick={() => setUploadOpen(true)} disabled={busy} aria-label="Unggah foto dari galeri">
      <ImagePlus size={24} strokeWidth={1.9} />
      <span>Unggah</span>
    </button>
  );

  return (
    <div className={styles.stage}>
      {/* Lapisan 1: kamera langsung, atau latar dapur kalau kamera tidak tersedia */}
      <video
        ref={videoRef}
        className={`${styles.video} ${facing === 'user' ? styles.mirrored : ''} ${camera === 'live' ? styles.videoOn : ''}`}
        playsInline
        muted
        autoPlay
      />
      {camera !== 'live' && <div className={styles.kitchenBackdrop} />}
      <div className={styles.shade} />

      {/* Kilatan putih saat memotret */}
      <AnimatePresence>
        {flash > 0 && (
          <motion.div key={flash} className={styles.flash} initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ duration: 0.45 }} />
        )}
      </AnimatePresence>

      <header className={styles.header}>
        <span className={styles.eyebrow}>Bongkar Rempah</span>
        <h1 className={styles.title}>{photo ? 'Wis siap dibongkar?' : 'Potret masakanmu'}</h1>
        <p className={styles.hint}>
          {photo
            ? 'Pastikan masakannya kelihatan jelas.'
            : camera === 'live'
              ? 'Arahkan kamera ke masakan Jawa, lalu jepret.'
              : camera === 'starting'
                ? 'Izinkan akses kamera di browser, atau unggah foto dari galeri.'
                : 'Unggah foto masakan Jawa dari galerimu.'}
        </p>
        {!photo && (
          <button type="button" className={styles.dapurButton} onClick={onOpenDapur}>
            Ora duwe foto? Pilih saka dapur Jangkep
          </button>
        )}
      </header>

      {/* Bingkai bidik ala ornamen emas */}
      {!photo && camera === 'live' && (
        <div className={styles.viewfinder} aria-hidden>
          <span className={styles.cornerTL} />
          <span className={styles.cornerTR} />
          <span className={styles.cornerBL} />
          <span className={styles.cornerBR} />
        </div>
      )}

      {!photo && camera === 'starting' && <p className={styles.status}>Menyalakan kamera…</p>}

      {/* x/y diatur lewat framer supaya tidak menimpa posisi tengah (translate -50%) dari CSS. */}
      {!photo && camera === 'unavailable' && (
        <motion.div className={styles.fallbackCard} initial={{ opacity: 0, x: '-50%', y: 'calc(-50% + 20px)' }} animate={{ opacity: 1, x: '-50%', y: '-50%' }}>
          <div className={styles.fallbackMascot}>
            <Image src="/kuliner/mascot_ngintip_1.webp" alt="" fill sizes="140px" />
          </div>
          <h2>Kamera lagi istirahat</h2>
          <p>{cameraError}</p>
          <button type="button" className={styles.fallbackUpload} onClick={() => setUploadOpen(true)} disabled={busy}>
            <ImagePlus size={20} strokeWidth={2.2} /> Unggah foto masakan
          </button>
          <span className={styles.fallbackHint}>bisa pilih dari galeri atau seret fotonya</span>
          <button type="button" className={styles.linkButton} onClick={retryCamera}>
            Coba nyalakan kamera lagi
          </button>
        </motion.div>
      )}

      {/* Lapisan konfirmasi: foto yang diambil */}
      <AnimatePresence>
        {photo && (
          <motion.div className={styles.review} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className={styles.reviewBlur} style={{ backgroundImage: `url(${photo.previewUrl})` }} />
            <motion.div
              className={styles.reviewFrame}
              initial={{ scale: 1.08, rotate: 0 }}
              animate={{ scale: 1, rotate: -1.5 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.previewUrl} alt="Foto masakan yang akan dibongkar" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {fileError && (
        <p className={styles.error} role="alert">
          {fileError}
        </p>
      )}

      {/* Kontrol bawah */}
      <div className={styles.controls}>
        {photo ? (
          <>
            <button type="button" className={styles.sideButton} onClick={onRetake} aria-label="Ulangi foto">
              <RotateCcw size={22} strokeWidth={2} />
              <span>Ulangi</span>
            </button>
            <motion.button
              type="button"
              className={styles.bongkarButton}
              onClick={onSubmit}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Bongkar!
            </motion.button>
            <span className={styles.sideSpacer} />
          </>
        ) : (
          <>
            {uploadButton}
            <button
              type="button"
              className={styles.shutter}
              onClick={capture}
              disabled={camera !== 'live' || busy}
              aria-label="Ambil foto"
            >
              <span className={styles.shutterInner}>
                <Camera size={26} strokeWidth={2} />
              </span>
            </button>
            {canSwitch && camera === 'live' ? (
              <button type="button" className={styles.sideButton} onClick={switchCamera} aria-label="Ganti kamera depan/belakang">
                <SwitchCamera size={24} strokeWidth={1.9} />
                <span>Balik</span>
              </button>
            ) : (
              <span className={styles.sideSpacer} />
            )}
          </>
        )}
      </div>

      {/* Si Podo mengintip dari pojok (kartu cadangan sudah punya maskotnya sendiri) */}
      {(photo || camera !== 'unavailable') && (
        <motion.div
          className={styles.podo}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 120, damping: 14 }}
          aria-hidden
        >
          <span className={styles.podoBubble}>{photo ? 'Mantep! Pencet Bongkar yo.' : 'Sugeng rawuh! Tak bongkar rempahe.'}</span>
          <div className={styles.podoImage}>
            <Image src="/kuliner/mascot_ngintip_1.webp" alt="" fill sizes="120px" />
          </div>
        </motion.div>
      )}
      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onPhoto={(next) => {
          setFileError('');
          onPhoto(next);
        }}
      />
    </div>
  );
}
