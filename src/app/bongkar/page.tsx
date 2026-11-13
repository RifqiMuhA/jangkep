import type { Metadata } from 'next';
import { buildDapurDishes } from '@/lib/bongkar/dapur';
import BongkarClient from './BongkarClient';

export const metadata: Metadata = {
  title: 'Bongkar Rempah',
  description:
    'Potret masakan Jawa, lalu biarkan Si Podo menebak hidangannya dan membongkar rempah-rempah di baliknya. Hasil berupa perkiraan AI yang bersifat edukatif.',
};

export default function BongkarPage() {
  return <BongkarClient dapur={buildDapurDishes()} />;
}
