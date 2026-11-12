import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Klien Supabase khusus server (route handler). Memakai secret key (sb_secret_...),
 * yang melewati Row Level Security, jadi tidak boleh sampai ke browser.
 * `import 'server-only'` membuat build gagal kalau file ini diimpor dari komponen klien.
 */

/** Batas waktu tiap panggilan ke Supabase supaya halaman tidak menggantung. */
export const SUPABASE_TIMEOUT_MS = 6_000;

let cached: SupabaseClient | null = null;

export class SupabaseConfigError extends Error {}

export function getSupabaseServer(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !key) throw new SupabaseConfigError('SUPABASE_URL atau SUPABASE_SECRET_KEY belum diisi.');

  cached = createClient(url, key, {
    // Server tidak memakai sesi login pengguna.
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return cached;
}

/** AbortSignal yang otomatis batal setelah SUPABASE_TIMEOUT_MS; dipasang lewat .abortSignal() pada query. */
export function supabaseTimeoutSignal(): AbortSignal {
  return AbortSignal.timeout(SUPABASE_TIMEOUT_MS);
}
