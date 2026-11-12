import { kulinerData } from '@/data/kulinerData';
import KulinerDetail from './KulinerDetail';

/**
 * Halaman detail kuliner. Semua slug dibuat statis saat build, supaya halaman bisa di-prefetch
 * dari Katalog dan langsung terbuka saat kartunya diklik.
 */
export function generateStaticParams() {
  return kulinerData.map((item) => ({ slug: item.slug }));
}

export default async function KulinerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <KulinerDetail slug={slug} />;
}
