import { MAX_IMAGE_BYTES } from './upload';

/** Sisi terpanjang gambar setelah dikompres di klien. */
const MAX_SIDE_PX = 1024;
const JPEG_QUALITY = 0.85;

export interface ReadyImage {
  blob: Blob;
  /** URL lokal (blob:) untuk pratinjau. Pemanggil wajib mencabutnya (URL.revokeObjectURL) saat tidak dipakai. */
  previewUrl: string;
}

/**
 * Perkecil gambar (dari file unggahan atau bingkai video kamera) dan ubah ke JPEG sebelum dikirim,
 * supaya hemat kuota dan lebih cepat. Hanya untuk dipakai di browser.
 */
export async function toReadyImage(source: Blob | HTMLVideoElement): Promise<ReadyImage> {
  let drawable: CanvasImageSource;
  let width: number;
  let height: number;
  let bitmap: ImageBitmap | null = null;

  // Cek lewat properti, bukan instanceof, supaya tetap benar untuk objek dari jendela/iframe lain.
  if ('videoWidth' in source) {
    drawable = source;
    width = source.videoWidth;
    height = source.videoHeight;
  } else {
    bitmap = await createImageBitmap(source);
    drawable = bitmap;
    width = bitmap.width;
    height = bitmap.height;
  }

  try {
    if (!width || !height) throw new Error('Gambar kosong. Coba sekali lagi.');
    const scale = Math.min(1, MAX_SIDE_PX / Math.max(width, height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas tidak tersedia.');
    // Latar putih supaya PNG/WebP transparan tidak menjadi hitam saat dijadikan JPEG.
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(drawable, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Gagal mengolah gambar.'))), 'image/jpeg', JPEG_QUALITY),
    );
    if (blob.size > MAX_IMAGE_BYTES) throw new Error('Foto masih lebih dari 4 MB setelah dikompres.');
    return { blob, previewUrl: URL.createObjectURL(blob) };
  } finally {
    bitmap?.close();
  }
}
