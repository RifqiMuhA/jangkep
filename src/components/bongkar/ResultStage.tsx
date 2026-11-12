'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, animate, motion } from 'framer-motion';
import { ArrowRight, Camera, Check, ChefHat, PencilLine, Sprout, X } from 'lucide-react';
import type { BongkarResponse, Confidence, ExtraSpice, MatchedSpice } from '@/lib/bongkar/schema';
import ConfirmCorrectionModal from './ConfirmCorrectionModal';
import CookingSteps from './CookingSteps';
import ExtraSpiceModal from './ExtraSpiceModal';
import SpiceModal from './SpiceModal';
import { extraSpiceImage, titleCase } from '@/lib/bongkar/categories';
import styles from './ResultStage.module.css';

type SuccessResponse = Extract<BongkarResponse, { ok: true }>;

const CONFIDENCE: Record<Confidence, { label: string; className: string }> = {
  tinggi: { label: 'Yakin', className: styles.badgeTinggi },
  sedang: { label: 'Agak ragu', className: styles.badgeSedang },
  rendah: { label: 'Belum yakin', className: styles.badgeRendah },
};

/** Waktu (detik) animasi rempah terbang dari foto ke tampah. */
const FLY_START = 0.55;
const FLY_STAGGER = 0.14;
const FLY_DURATION = 1.15;

/**
 * Tata letak rempah di atas tampah (persen ukuran tampah).
 * Sedikit rempah: satu baris di tengah. Banyak: dibagi rata ke samping dan bergantian
 * di busur atas dan bawah elips tampah, supaya tidak menumpuk di ujung elips yang pipih.
 */
function tampahLayout(count: number): { positions: { left: number; top: number }[]; size: number } {
  if (count === 0) return { positions: [], size: 0 };
  if (count <= 3) {
    return { size: 17, positions: Array.from({ length: count }, (_, i) => ({ left: 50 + (i - (count - 1) / 2) * 24, top: 46 })) };
  }
  const size = count <= 6 ? 15 : count <= 9 ? 13 : 11.5;
  const span = 36 * 0.85;
  const step = (2 * span) / (count - 1);
  return {
    size,
    positions: Array.from({ length: count }, (_, i) => {
      const left = 50 - span + i * step;
      const dx = (left - 50) / 36;
      const sign = i % 2 === 0 ? -1 : 1;
      return { left, top: 47 + sign * 13 * Math.sqrt(Math.max(0, 1 - dx * dx)) };
    }),
  };
}

/** Satu isi tampah: rempah dari koleksi Jangkep (bisa dibuka detailnya) atau bumbu lain di luar koleksi. */
interface TampahEntry {
  key: string;
  name: string;
  image: string;
  spice: MatchedSpice | null;
  extra: ExtraSpice | null;
}

interface ResultStageProps {
  data: SuccessResponse;
  photoUrl: string;
  /** Tebakan awal AI kalau hasil ini sudah dikoreksi pengguna. */
  correctedFrom: string | null;
  /** Susun ulang rempah untuk nama masakan hasil koreksi. Mengembalikan pesan error, atau null kalau berhasil. */
  onRecorrect: (dish: string) => Promise<string | null>;
  onRestart: () => void;
}

export default function ResultStage({ data, photoUrl, correctedFrom, onRecorrect, onRestart }: ResultStageProps) {
  const { result } = data;
  const [correcting, setCorrecting] = useState(false);
  const [draftDish, setDraftDish] = useState('');
  const [confirmDish, setConfirmDish] = useState<string | null>(null);
  const [recooking, setRecooking] = useState<string | null>(null);
  const [recorrectError, setRecorrectError] = useState('');
  const [selected, setSelected] = useState<MatchedSpice | null>(null);
  const [selectedExtra, setSelectedExtra] = useState<ExtraSpice | null>(null);
  /** Tab panel kanan: rempah di tampah atau langkah memasak. */
  const [view, setView] = useState<'rempah' | 'masak'>('rempah');

  const photoRef = useRef<HTMLDivElement>(null);
  const flyerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const puffRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const shownDish = result.dish;
  const dishLink = result.dishLink;
  const entries: TampahEntry[] = [
    ...result.matched.map((spice) => ({ key: spice.id, name: spice.nama, image: spice.asset, spice, extra: null })),
    ...result.unmatched.map((extra) => ({ key: `lain-${extra.name}`, name: titleCase(extra.name), image: extraSpiceImage(extra.name), spice: null, extra })),
  ];
  const notRecognized = entries.length === 0;
  const cooking = result.cooking && result.cooking.steps.length > 0 ? result.cooking : undefined;
  const showCooking = view === 'masak' && !!cooking;
  const tampah = tampahLayout(entries.length);
  const landedAt = FLY_START + Math.max(0, entries.length - 1) * FLY_STAGGER + FLY_DURATION;

  // Rempah "dibongkar" dari foto: terbang melengkung dari polaroid lalu mendarat di tampah.
  useEffect(() => {
    const photo = photoRef.current?.getBoundingClientRect();
    if (!photo) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const originX = photo.left + photo.width / 2;
    const originY = photo.top + photo.height / 2;

    const controls = flyerRefs.current.flatMap((el, i) => {
      if (!el) return [];
      const delay = FLY_START + i * FLY_STAGGER;
      if (reduceMotion) return [animate(el, { opacity: [0, 1] }, { duration: 0.4, delay: i * 0.05 })];

      const target = el.getBoundingClientRect();
      const dx = originX - (target.left + target.width / 2);
      const dy = originY - (target.top + target.height / 2);
      const spin = (i % 2 === 0 ? -1 : 1) * (260 + (i % 3) * 60);
      const flight = animate(
        el,
        {
          x: [dx, dx * 0.45, 0],
          y: [dy, dy * 0.45 - 140, 0],
          rotate: [spin, spin * 0.25, 0],
          scale: [0.15, 1.18, 1],
          opacity: [0, 1, 1],
        },
        { duration: FLY_DURATION, delay, times: [0, 0.55, 1], ease: [0.22, 1, 0.36, 1] },
      );
      const puff = puffRefs.current[i];
      const landing = puff
        ? [animate(puff, { scale: [0.3, 2], opacity: [0.75, 0] }, { duration: 0.7, delay: delay + FLY_DURATION * 0.9, ease: 'easeOut' })]
        : [];
      return [flight, ...landing];
    });

    return () => controls.forEach((c) => c.stop());
  }, [result.matched, result.unmatched]);

  // Langkah 1: nama baru diketik, lalu minta konfirmasi lewat modal.
  function saveCorrection(event: React.FormEvent) {
    event.preventDefault();
    const value = draftDish.trim().replace(/\s+/g, ' ');
    if (!value) return;
    if (value.toLowerCase() === result.dish.toLowerCase()) {
      setCorrecting(false);
      return;
    }
    setConfirmDish(value);
  }

  // Langkah 2: setelah yakin, rempah disusun ulang dan terbang lagi ke tampah.
  async function confirmCorrection(dish: string) {
    setConfirmDish(null);
    setRecorrectError('');
    // Animasi racik ulang tampil di tampah, jadi kembali ke tab Rempah.
    setView('rempah');
    setRecooking(dish);
    const error = await onRecorrect(dish);
    setRecooking(null);
    if (error) setRecorrectError(error);
    else setCorrecting(false);
  }

  return (
    <div className={styles.stage} data-lenis-prevent>
      {/* Lapisan latar dibungkus supaya ornamen yang keluar tepi tidak menambah area scroll */}
      <div className={styles.backdrop} aria-hidden>
        <div className={styles.texture} />
        <div className={styles.spotlight} />
        <div className={styles.ornamentLeft}>
          <Image src="/motif/motif_bunga_1.webp" alt="" fill sizes="300px" />
        </div>
        <div className={styles.ornamentRight}>
          <Image src="/motif/motif_bunga_1.webp" alt="" fill sizes="300px" />
        </div>
        <div className={styles.dust}>
          {Array.from({ length: 14 }, (_, i) => (
            <span key={i} style={{ '--i': i } as React.CSSProperties} />
          ))}
        </div>
      </div>

      <div className={styles.layout}>
        {/* Panel kiri: foto dan tebakan */}
        <motion.aside
          className={styles.dishPanel}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        >
          <div className={styles.photo} ref={photoRef}>
            <span className={styles.tape} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoUrl} alt="Foto masakan yang kamu kirim" />
          </div>

          <div className={styles.dishInfo}>
            <span className={styles.label}>Tebakan Si Podo</span>
            <h1 className={styles.dishName}>{shownDish}</h1>
            {correctedFrom && <p className={styles.correctedNote}>Dikoreksi · tebakan awal AI: {correctedFrom}</p>}

            <div className={styles.metaRow}>
              <span className={`${styles.badge} ${CONFIDENCE[result.confidence].className}`}>{CONFIDENCE[result.confidence].label}</span>
              {result.masakanJawa !== undefined && (
                <span className={`${styles.originBadge} ${result.masakanJawa ? styles.originJawa : ''}`}>
                  {result.masakanJawa ? 'Masakan Jawa' : 'Bukan masakan Jawa'}
                </span>
              )}
              {/* Sebaris dengan label keyakinan supaya panel kiri tidak terlalu tinggi */}
              {!correcting && (
                <button
                  type="button"
                  className={styles.correctButton}
                  title="Bukan masakan ini? Koreksi namanya"
                  aria-label="Bukan masakan ini? Koreksi namanya"
                  onClick={() => {
                    setDraftDish(shownDish === 'Tidak dikenali' ? '' : shownDish);
                    setCorrecting(true);
                  }}
                >
                  <PencilLine size={14} strokeWidth={2.25} /> Koreksi
                </button>
              )}
            </div>

            {result.notes && <p className={styles.notes}>{result.notes}</p>}

            {correcting && (
              <form className={styles.correctForm} onSubmit={saveCorrection}>
                <label className={styles.srOnly} htmlFor="koreksi-masakan">
                  Nama masakan yang benar
                </label>
                <input
                  id="koreksi-masakan"
                  value={draftDish}
                  onChange={(e) => setDraftDish(e.target.value)}
                  placeholder="Nama masakan yang benar"
                  maxLength={80}
                  autoFocus
                />
                <button type="submit" aria-label="Simpan koreksi" disabled={!!recooking}>
                  <Check size={18} strokeWidth={2.5} />
                </button>
                <button type="button" aria-label="Batal" onClick={() => setCorrecting(false)}>
                  <X size={18} strokeWidth={2.5} />
                </button>
              </form>
            )}

            {recorrectError && (
              <p className={styles.recorrectError} role="alert">
                {recorrectError}
              </p>
            )}

            {dishLink && (
              <Link href={`/kuliner/katalog/${dishLink.slug}`} className={styles.dishLink}>
                {dishLink.image && (
                  <span className={styles.dishLinkThumb}>
                    <Image src={dishLink.image} alt="" fill sizes="56px" />
                  </span>
                )}
                <span className={styles.dishLinkText}>
                  <small>Ada di Ensiklopedia</small>
                  Baca kisah {dishLink.name}
                </span>
                <ArrowRight size={18} strokeWidth={2.25} />
              </Link>
            )}

            <button type="button" className={`${styles.restartButton} ${styles.restartDesktop}`} onClick={onRestart}>
              <Camera size={18} strokeWidth={2.25} /> Bongkar masakan lain
            </button>
          </div>
        </motion.aside>

        {/* Panel kanan: tampah */}
        <section className={styles.tampahPanel}>
          <motion.div className={styles.heading} initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2>{showCooking ? 'Cara Masaknya' : notRecognized ? 'Tampahe Isih Kosong' : 'Rempah yang Terbongkar'}</h2>
            <div className={styles.headingOrnament}>
              <Image src="/motif/dekor_header_bawah.webp" alt="" width={220} height={42} />
            </div>
            {notRecognized && !showCooking && <p>Si Podo belum menemukan rempah dari foto ini.</p>}
          </motion.div>

          {cooking && (
            <motion.div
              className={styles.tabs}
              role="tablist"
              aria-label="Isi hasil bongkar"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {(
                [
                  { id: 'rempah', label: 'Rempah', icon: <Sprout size={15} strokeWidth={2.25} /> },
                  { id: 'masak', label: 'Cara Masak', icon: <ChefHat size={15} strokeWidth={2.25} /> },
                ] as const
              ).map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  role="tab"
                  aria-selected={view === tab.id}
                  className={view === tab.id ? `${styles.tab} ${styles.tabActive}` : styles.tab}
                  onClick={() => setView(tab.id)}
                >
                  {view === tab.id && <motion.span layoutId="bongkar-tab" className={styles.tabPill} transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                  <span className={styles.tabLabel}>
                    {tab.icon} {tab.label}
                  </span>
                </button>
              ))}
            </motion.div>
          )}

          {showCooking && cooking && (
            <motion.div className={styles.cookingView} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <CookingSteps key={result.dish} cooking={cooking} dishLink={dishLink} />
            </motion.div>
          )}

          {/* Tampah tetap terpasang saat tab Cara Masak dibuka, supaya animasi rempah tidak diulang. */}
          <div className={showCooking ? styles.viewHidden : styles.view}>

          <motion.div
            className={styles.tampahStage}
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 110, damping: 16, delay: 0.15 }}
          >
            <Image src="/kuliner/tampah.webp" alt="" fill sizes="(max-width: 900px) 100vw, 60vw" className={styles.tampahImage} priority />

            <AnimatePresence>
              {recooking && (
                <motion.div className={styles.recooking} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-live="polite">
                  <div className={styles.recookingPodo}>
                    <Image src="/kuliner/podo_masak_1.webp" alt="" fill sizes="140px" />
                  </div>
                  <p>Si Podo ngracik ulang rempah {recooking}…</p>
                </motion.div>
              )}
            </AnimatePresence>

            {notRecognized ? (
              <motion.div className={styles.emptyTampah} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, type: 'spring' }}>
                <div className={styles.emptyMascot}>
                  <Image src="/kuliner/mascot_not_found.webp" alt="" fill sizes="160px" />
                </div>
              </motion.div>
            ) : (
              entries.map((entry, i) => {
                const itemStyle = {
                  left: `${tampah.positions[i].left}%`,
                  top: `${tampah.positions[i].top}%`,
                  width: `calc(${tampah.size}% * var(--tampah-scale, 1))`,
                };
                const inner = (
                  <>
                    <span className={styles.puff} ref={(el) => { puffRefs.current[i] = el; }} />
                    <span className={styles.flyer} ref={(el) => { flyerRefs.current[i] = el; }}>
                      <span className={styles.float} style={{ animationDelay: `${landedAt + (i % 4) * 0.3}s` }}>
                        <span className={styles.itemImage}>
                          <Image src={entry.image} alt="" fill sizes="(max-width: 768px) 90px, 160px" />
                        </span>
                        <span className={styles.itemLabel}>
                          {entry.name}
                          {!entry.spice && <small>belum di koleksi Jangkep</small>}
                        </span>
                      </span>
                    </span>
                  </>
                );
                const { spice, extra } = entry;
                return (
                  <button
                    type="button"
                    key={entry.key}
                    className={spice ? styles.tampahItem : `${styles.tampahItem} ${styles.tampahItemExtra}`}
                    style={itemStyle}
                    onClick={() => (spice ? setSelected(spice) : setSelectedExtra(extra))}
                    aria-label={spice ? `Lihat cerita ${entry.name}` : `Lihat peran ${entry.name}, belum ada di koleksi Jangkep`}
                  >
                    {inner}
                  </button>
                );
              })
            )}
          </motion.div>

          {/* Daftar rempah sebagai chip, muncul setelah semua rempah mendarat */}
          <div className={styles.chips}>
            {result.matched.map((spice, i) => (
              <motion.button
                type="button"
                key={spice.id}
                className={styles.chip}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: landedAt - 0.4 + i * 0.05 }}
                whileHover={{ y: -3 }}
                onClick={() => setSelected(spice)}
              >
                <span className={styles.chipImage}>
                  <Image src={spice.asset} alt="" fill sizes="32px" />
                </span>
                {spice.nama}
              </motion.button>
            ))}
            {result.unmatched.map((extra, i) => (
              <motion.button
                type="button"
                key={extra.name}
                className={styles.chipMuted}
                title="Belum ada di koleksi rempah Jangkep"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: landedAt - 0.2 + i * 0.05 }}
                whileHover={{ y: -3 }}
                onClick={() => setSelectedExtra(extra)}
              >
                <span className={styles.chipImage}>
                  <Image src={extraSpiceImage(extra.name)} alt="" fill sizes="32px" />
                </span>
                {titleCase(extra.name)}
              </motion.button>
            ))}
          </div>
          </div>

          {notRecognized && !showCooking && (
            <p className={styles.emptyHint}>Coba foto masakan Jawa yang lebih jelas dan terang, atau koreksi nama masakannya.</p>
          )}
          {/* Di ponsel tombol ini pindah ke bawah supaya tampah langsung terlihat */}
          <button type="button" className={`${styles.restartButton} ${styles.restartMobile}`} onClick={onRestart}>
            <Camera size={18} strokeWidth={2.25} /> Bongkar masakan lain
          </button>
          <p className={styles.disclaimer}>Hasil bersifat perkiraan AI dan edukatif.</p>
        </section>
      </div>

      <SpiceModal spice={selected} onClose={() => setSelected(null)} />
      <ExtraSpiceModal spice={selectedExtra} dish={result.dish} onClose={() => setSelectedExtra(null)} />
      <ConfirmCorrectionModal dish={confirmDish} aiDish={result.dish} onConfirm={confirmCorrection} onCancel={() => setConfirmDish(null)} />
    </div>
  );
}
