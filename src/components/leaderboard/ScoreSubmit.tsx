'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { findLeaderboardGame, type LeaderboardGameId } from '@/lib/leaderboard/games';
import { NICKNAME_MAX } from '@/lib/leaderboard/constants';
import { submitResponseSchema } from '@/lib/leaderboard/schema';
import styles from './ScoreSubmit.module.css';

const NAME_KEY = 'jangkep-nama-panggilan';
const bestKey = (game: string) => `jangkep-skor-terbaik:${game}`;

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Penyimpanan diblokir (mode privat dsb.): fitur tetap jalan tanpa mengingat.
  }
}

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'rejected'; message: string }
  | { kind: 'failed'; message: string }
  | { kind: 'sent'; rank: number | null };

interface ScoreSubmitProps {
  game: LeaderboardGameId;
  score: number;
}

/**
 * Kartu skor di layar hasil game: menampilkan skor dan rekor pribadi, lalu mengirim skor ke Papan Juara
 * setelah pemain mengisi nama panggilan. Kalau pengiriman gagal, game tetap normal dan pemain bisa mencoba lagi.
 * Skor dikunci saat kartu muncul, supaya tidak berubah kalau ada timer game yang masih berjalan.
 */
export default function ScoreSubmit({ game, score: liveScore }: ScoreSubmitProps) {
  const [score] = useState(() => Math.max(0, Math.round(liveScore)));
  const [previousBest] = useState(() => {
    const stored = Number(readStorage(bestKey(game)));
    return Number.isFinite(stored) && stored > 0 ? stored : 0;
  });
  const [nickname, setNickname] = useState(() => readStorage(NAME_KEY) ?? '');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const isNewRecord = score > previousBest;
  const gameInfo = findLeaderboardGame(game);

  // Simpan rekor pribadi di perangkat ini.
  useEffect(() => {
    if (isNewRecord) writeStorage(bestKey(game), String(score));
  }, [game, score, isNewRecord]);

  async function submit(event?: React.FormEvent) {
    event?.preventDefault();
    if (status.kind === 'sending') return;
    setStatus({ kind: 'sending' });

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12_000);
    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game, nickname, score }),
        signal: controller.signal,
      });
      const parsed = submitResponseSchema.safeParse(await response.json().catch(() => null));
      if (!parsed.success) {
        setStatus({ kind: 'failed', message: 'Papan skor memberi jawaban yang tidak dikenali. Coba kirim lagi, ya.' });
      } else if (!parsed.data.ok) {
        const { code, message } = parsed.data.error;
        setStatus(code === 'NICKNAME_REJECTED' ? { kind: 'rejected', message } : { kind: 'failed', message });
      } else {
        writeStorage(NAME_KEY, parsed.data.nickname);
        setNickname(parsed.data.nickname);
        setStatus({ kind: 'sent', rank: parsed.data.rank });
      }
    } catch {
      setStatus({
        kind: 'failed',
        message: controller.signal.aborted
          ? 'Papan skor lambat merespons. Skormu belum terkirim, coba kirim lagi.'
          : 'Tidak bisa terhubung. Periksa koneksi lalu coba kirim lagi.',
      });
    } finally {
      window.clearTimeout(timeout);
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.scoreRow}>
        <span className={styles.scoreLabel}>Skor kamu</span>
        <span className={styles.scoreValue}>{score.toLocaleString('id-ID')}</span>
        {isNewRecord && previousBest > 0 ? (
          <span className={styles.recordBadge}>Rekor anyar!</span>
        ) : previousBest > 0 ? (
          <span className={styles.bestText}>Rekor pribadimu: {previousBest.toLocaleString('id-ID')}</span>
        ) : null}
      </div>

      {score === 0 ? (
        <p className={styles.note}>Skor 0 belum bisa masuk Papan Juara. Ayo main lagi!</p>
      ) : status.kind === 'sent' ? (
        <div className={styles.sent} role="status">
          <p className={styles.sentTitle}>
            {status.rank ? `Kamu peringkat ${status.rank} di Papan Juara!` : 'Skormu sudah tersimpan.'}
          </p>
          {!status.rank && <p className={styles.note}>Belum masuk 10 besar {gameInfo?.title}. Terus berlatih, ya!</p>}
          <Link href={`/games?papan=${game}#papan-juara`} className={styles.boardLink}>
            Lihat Papan Juara
          </Link>
        </div>
      ) : (
        <form className={styles.form} onSubmit={submit} noValidate>
          <div className={styles.inputRow}>
            <input
              id={`nama-${game}`}
              className={status.kind === 'rejected' ? `${styles.input} ${styles.inputError}` : styles.input}
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                if (status.kind === 'rejected') setStatus({ kind: 'idle' });
              }}
              placeholder="Nama panggilan"
              aria-label="Nama panggilan untuk Papan Juara"
              maxLength={NICKNAME_MAX}
              autoComplete="nickname"
              aria-invalid={status.kind === 'rejected'}
              aria-describedby={`nama-${game}-hint`}
              // readOnly (bukan disabled) supaya fokus tetap di kotak isian dan Enter bisa dipakai lagi.
              readOnly={status.kind === 'sending'}
            />
            <button type="submit" className={styles.submit} disabled={status.kind === 'sending' || nickname.trim().length < 2}>
              {status.kind === 'sending' ? 'Mengirim…' : status.kind === 'failed' ? 'Kirim lagi' : 'Kirim'}
            </button>
          </div>
          {status.kind === 'rejected' || status.kind === 'failed' ? (
            <p id={`nama-${game}-hint`} className={styles.error} role="alert">
              {status.message}
            </p>
          ) : (
            <p id={`nama-${game}-hint`} className={styles.hint}>
              Tampil untuk umum, jangan pakai data pribadi.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
