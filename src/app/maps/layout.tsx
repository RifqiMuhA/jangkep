import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Peta Rasa — Jangkep',
  description: 'Peta interaktif kuliner Jawa Tengah. Jelajahi makanan khas per kota/kabupaten.',
};

export default function MapsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
