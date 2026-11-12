'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Crown, RotateCcw, Trophy } from 'lucide-react';
import { LEADERBOARD_GAMES, type LeaderboardGameId } from '@/lib/leaderboard/games';
import { leaderboardResponseSchema, type LeaderboardEntry } from '@/lib/leaderboard/schema';
import styles from './Leaderboard.module.css';

type LoadState =
  | { key: string; status: 'ready'; entries: LeaderboardEntry[] }
  | { key: string; status: 'error'; message: string };

const SKELETON_ROWS = 5;

/** Game awal dari alamat (?papan=...), misalnya saat datang dari layar hasil game. */
function readGameFromUrl(): LeaderboardGameId | null {
  const value = new URLSearchParams(window.location.search).get('papan');
  return LEADERBOARD_GAMES.find((game) => game.id === value)?.id ?? null;
}
const subscribeNothing = () => () => {};

/** Papan Juara: 10 skor teratas tiap game, satu skor terbaik per nama panggilan. */
export default function Leaderboard() {
  const urlGame = useSyncExternalStore(subscribeNothing, readGameFromUrl, () => null);
  const [chosenGame, setChosenGame] = useState<LeaderboardGameId | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState<LoadState | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const game = chosenGame ?? urlGame ?? LEADERBOARD_GAMES[0].id;
  const gameInfo = LEADERBOARD_GAMES.find((g) => g.id === game)!;
  const requestKey = `${game}:${attempt}`;
  const current = loaded?.key === requestKey ? loaded : null;

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false; // komponen ditutup atau game berganti: abaikan hasilnya
    let timedOut = false;
    const timeout = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 10_000);

    fetch(`/api/scores?game=${encodeURIComponent(game)}`, { signal: controller.signal, cache: 'no-store' })
      .then(async (response) => {
        const parsed = leaderboardResponseSchema.safeParse(await response.json().catch(() => null));
        if (!parsed.success) throw new Error('Papan skor memberi jawaban yang tidak dikenali.');
        if (!parsed.data.ok) throw new Error(parsed.data.error.message);
        if (!cancelled) setLoaded({ key: requestKey, status: 'ready', entries: parsed.data.entries });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = timedOut
          ? 'Papan skor lambat merespons. Coba lagi, ya.'
          : err instanceof TypeError
            ? 'Tidak bisa terhubung ke papan skor. Periksa koneksi lalu coba lagi.'
            : err instanceof Error && err.message
              ? err.message
              : 'Papan skor belum bisa dimuat. Coba lagi, ya.';
        setLoaded({ key: requestKey, status: 'error', message });
      })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [game, requestKey]);

  // Di layar sempit tab bisa tersembunyi di luar layar: geser baris tab supaya tab aktif terlihat.
  useEffect(() => {
    const row = tabsRef.current;
    const active = row?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!row || !active) return;
    const left = active.offsetLeft - (row.clientWidth - active.offsetWidth) / 2;
    row.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }, [game]);

  // Datang lewat tautan "#papan-juara": gulir ke sini setelah halaman siap (scroll halus mengembalikan ke atas saat pindah halaman).
  useEffect(() => {
    if (window.location.hash !== '#papan-juara') return;
    const timer = window.setTimeout(() => document.getElementById('papan-juara')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 400);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section id="papan-juara" className={styles.board} aria-labelledby="papan-juara-title">
      <div className={styles.header}>
        <span className={styles.eyebrow}>
          <Trophy size={14} strokeWidth={2.5} /> Papan Juara
        </span>
        <h2 id="papan-juara-title" className={styles.title}>
          Sopo Sing Paling Pinter?
        </h2>
        <span className={styles.ornament} aria-hidden>
          <Image src="/motif/dekor_header_bawah.webp" alt="" width={200} height={38} />
        </span>
        <p className={styles.subtitle}>10 skor tertinggi tiap permainan. Satu nama, satu skor terbaik.</p>
      </div>

      <div ref={tabsRef} className={styles.tabs} role="tablist" aria-label="Pilih permainan">
        {LEADERBOARD_GAMES.map((g) => (
          <button
            key={g.id}
            type="button"
            role="tab"
            aria-selected={g.id === game}
            className={g.id === game ? `${styles.tab} ${styles.tabActive}` : styles.tab}
            onClick={() => setChosenGame(g.id)}
          >
            {g.id === game && <motion.span layoutId="papan-juara-tab" className={styles.tabPill} transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
            <span className={styles.tabLabel}>{g.title}</span>
          </button>
        ))}
      </div>

      <div className={styles.panel} role="tabpanel" aria-live="polite" aria-busy={!current}>
        <AnimatePresence mode="wait" initial={false}>
          {!current && (
            <motion.ol key="loading" className={styles.list} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-label="Memuat papan skor">
              {Array.from({ length: SKELETON_ROWS }, (_, i) => (
                <li key={i} className={`${styles.row} ${styles.skeletonRow}`}>
                  <span className={`${styles.skeleton} ${styles.skeletonRank}`} />
                  <span className={`${styles.skeleton} ${styles.skeletonName}`} style={{ width: `${60 - i * 6}%` }} />
                  <span className={`${styles.skeleton} ${styles.skeletonScore}`} />
                </li>
              ))}
            </motion.ol>
          )}

          {current?.status === 'error' && (
            <motion.div key="error" className={styles.message} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert">
              <div className={styles.messageMascot}>
                <Image src="/kuliner/mascot_not_found.webp" alt="" fill sizes="110px" />
              </div>
              <p className={styles.messageTitle}>Papan juarane lagi ngaso</p>
              <p className={styles.messageText}>{current.message}</p>
              <button type="button" className={styles.retryButton} onClick={() => setAttempt((n) => n + 1)}>
                <RotateCcw size={16} strokeWidth={2.5} /> Coba lagi
              </button>
            </motion.div>
          )}

          {current?.status === 'ready' && current.entries.length === 0 && (
            <motion.div key="empty" className={styles.message} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className={styles.messageMascot}>
                <Image src="/kuliner/mascot_ngintip_3.webp" alt="" fill sizes="110px" />
              </div>
              <p className={styles.messageTitle}>Durung ana juarane!</p>
              <p className={styles.messageText}>Belum ada skor di permainan ini. Ayo main dan jadilah juara pertama!</p>
              <Link href={gameInfo.href} className={styles.playButton}>
                Main {gameInfo.title}
              </Link>
            </motion.div>
          )}

          {current?.status === 'ready' && current.entries.length > 0 && (
            <motion.ol key={`list-${game}`} className={styles.list} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {current.entries.map((entry, i) => (
                <motion.li
                  key={`${entry.rank}-${entry.nickname}`}
                  className={`${styles.row} ${entry.rank <= 3 ? styles[`podium${entry.rank}`] : ''}`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <span className={styles.rank} aria-label={`Peringkat ${entry.rank}`}>
                    {entry.rank === 1 ? <Crown size={18} strokeWidth={2.5} aria-hidden /> : entry.rank}
                  </span>
                  <span className={styles.name}>
                    {entry.nickname}
                    {entry.isSample && <span className={styles.sampleTag}>contoh</span>}
                  </span>
                  <span className={styles.score}>{entry.score.toLocaleString('id-ID')}</span>
                </motion.li>
              ))}
            </motion.ol>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
