/**
 * Daftar kata yang tidak boleh dipakai sebagai nama panggilan di leaderboard
 * (kata kasar, cabul, dan SARA, dalam Bahasa Indonesia, Jawa, dan Inggris).
 * Silakan tambah atau hapus. Tulis dalam huruf kecil; normalisasi (angka mirip huruf,
 * huruf berulang, spasi) dilakukan otomatis di nickname.ts.
 *
 * - CONTAINS: diblokir walaupun menempel di kata lain ("xxanjingxx"). Pakai untuk kata yang cukup panjang dan khas.
 * - WHOLE_WORD: hanya diblokir sebagai kata utuh, karena bisa muncul di kata wajar
 *   (misalnya "asu" di "asuransi", "tai" di "taiwan").
 */
export const BLOCKED_CONTAINS: string[] = [
  // Bahasa Indonesia
  'anjing', 'anjir', 'bangsat', 'bajingan', 'brengsek', 'keparat', 'kampret', 'kontol', 'memek', 'ngentot',
  'entot', 'pepek', 'jembut', 'titit', 'pantat', 'pelacur', 'lonte', 'jablay', 'sundal', 'bencong',
  'goblok', 'tolol', 'idiot', 'kafir', 'pukimak', 'kimak', 'ngewe', 'bokep', 'mesum', 'bugil', 'telanjang',
  // Bahasa Jawa
  'jancok', 'jancuk', 'dancok', 'diancuk', 'matamu', 'cangkemmu', 'raimu', 'gathel', 'bajindul',
  // English
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'pussy', 'cunt', 'whore', 'slut', 'nigger', 'nigga', 'faggot',
  'retard', 'porn', 'hitler',
];

export const BLOCKED_WHOLE_WORDS: string[] = [
  // Bahasa Indonesia / Jawa
  'asu', 'tai', 'taik', 'bego', 'babi', 'monyet', 'setan', 'iblis', 'cina', 'pki', 'banci', 'homo', 'lesbi',
  'jembud', 'peler', 'kntl', 'mmk', 'ajg', 'anj', 'bgst', 'bgsd', 'jnck', 'coli', 'perek',
  // English
  'ass', 'dick', 'cock', 'sex', 'cum', 'fag', 'rape', 'rapist', 'nazi', 'kkk', 'wtf', 'stfu',
];
