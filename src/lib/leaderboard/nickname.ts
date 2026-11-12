import { BLOCKED_CONTAINS, BLOCKED_WHOLE_WORDS } from './blocked-words';
import { NICKNAME_MAX, NICKNAME_MIN } from './constants';

export { NICKNAME_MAX, NICKNAME_MIN };

/** Huruf (termasuk aksara lain), angka, spasi, titik, garis bawah, tanda hubung, dan apostrof. */
const ALLOWED = /^[\p{L}\p{N} ._'-]+$/u;

/** Angka dan simbol yang sering dipakai menggantikan huruf. */
const LOOKALIKES: Record<string, string> = {
  '0': 'o', '1': 'i', '!': 'i', '|': 'i', '3': 'e', '4': 'a', '@': 'a', '5': 's', $: 's', '7': 't', '8': 'b', '9': 'g', '6': 'g',
};

/** Rapikan nama: pangkas spasi di ujung dan gabungkan spasi beruntun. */
export function tidyNickname(raw: string): string {
  return raw.normalize('NFC').replace(/\s+/g, ' ').trim();
}

/** Huruf kecil, tanpa aksen, angka mirip huruf diganti, sisanya hanya huruf dan spasi. */
function normalizeForFilter(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[0-9!|@$]/g, (ch) => LOOKALIKES[ch] ?? ch)
    .replace(/[^a-z]+/g, ' ')
    .trim();
}

/** "anjiiing" -> "anjing". Kata di daftar juga diperlakukan sama supaya tetap cocok. */
function collapseRepeats(text: string): string {
  return text.replace(/(.)\1+/g, '$1');
}

const CONTAINS = [...new Set(BLOCKED_CONTAINS.flatMap((w) => [w, collapseRepeats(w)]))];
const WHOLE = new Set(BLOCKED_WHOLE_WORDS.flatMap((w) => [w, collapseRepeats(w)]));

/** True kalau nama mengandung kata yang tidak pantas. */
export function containsBlockedWord(nickname: string): boolean {
  const spaced = normalizeForFilter(nickname);
  if (!spaced) return false;
  const tokens = spaced.split(' ');
  const joined = tokens.join('');
  const variants = [joined, collapseRepeats(joined)];

  if (variants.some((v) => CONTAINS.some((word) => v.includes(word)))) return true;
  return tokens.some((token) => WHOLE.has(token) || WHOLE.has(collapseRepeats(token)));
}

export type NicknameCheck = { ok: true; nickname: string } | { ok: false; message: string };

/** Validasi lengkap nama panggilan. Pesan penolakan ramah dan tidak menyebut kata yang terdeteksi. */
export function checkNickname(raw: unknown): NicknameCheck {
  if (typeof raw !== 'string') return { ok: false, message: 'Isi nama panggilan dulu, ya.' };
  const nickname = tidyNickname(raw);
  if (nickname.length < NICKNAME_MIN) return { ok: false, message: `Nama panggilan minimal ${NICKNAME_MIN} karakter.` };
  if (nickname.length > NICKNAME_MAX) return { ok: false, message: `Nama panggilan maksimal ${NICKNAME_MAX} karakter.` };
  if (!ALLOWED.test(nickname)) {
    return { ok: false, message: 'Pakai huruf, angka, spasi, titik, atau tanda hubung saja, ya.' };
  }
  if (!/[\p{L}\p{N}]/u.test(nickname)) return { ok: false, message: 'Nama panggilan harus berisi huruf atau angka.' };
  if (containsBlockedWord(nickname)) {
    return { ok: false, message: 'Nama panggilan ini belum bisa dipakai. Coba nama lain yang lebih sopan, ya.' };
  }
  return { ok: true, nickname };
}
