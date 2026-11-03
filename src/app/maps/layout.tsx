import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Peta Rasa - Jangkep',
  description: 'Jelajah geografis citarasa Jawa Tengah. Menelusuri sebaran bumbu dan hidangan khas di tiap kabupaten dan kota.',
};

export default function MapsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
