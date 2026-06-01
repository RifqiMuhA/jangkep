"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './games.module.css';
import { Clock, Camera, MapPin, Star, MousePointer2, Move, RefreshCcw, Eye, X } from 'lucide-react';

const GAMES_DATA = [
  {
    id: 'game1',
    title: 'Racik Masakan Jawa',
    tag: 'Drag & Drop',
    desc: 'Bantu Si Podo meracik bumbu dan bahan yang tepat ke dalam wajan masakan.',
    mascot: '/games/mascot_racik.webp',
    headerImage: '/games/card/card_header_dragdrop.webp',
    rules: [
      { text: 'Pilih bahan yang tepat sesuai resep masakan.', icon: <MousePointer2 size={18} strokeWidth={2.5} /> },
      { text: 'Tarik (drag) bahan tersebut dan lepaskan ke dalam wajan.', icon: <Move size={18} strokeWidth={2.5} /> },
      { text: 'Bahan yang salah akan mental dan membal kembali.', icon: <RefreshCcw size={18} strokeWidth={2.5} /> },
      { text: 'Lengkapi resep secepat mungkin untuk mendapatkan skor tinggi!', icon: <Clock size={18} strokeWidth={2.5} /> }
    ]
  },
  {
    id: 'game2',
    title: 'Dari Kota Mana?',
    tag: 'Peta Buta',
    desc: 'Tarik hidangan kuliner ke kabupaten atau kota asalnya yang benar di peta.',
    mascot: '/games/mascot_kotamana.webp',
    headerImage: '/games/card/card_header_petabuta.webp',
    rules: [
      { text: 'Kamu punya waktu 60 detik.', icon: <Clock size={18} strokeWidth={2.5} /> },
      { text: 'Tarik foto makanan ke atas peta Jawa Tengah.', icon: <Camera size={18} strokeWidth={2.5} /> },
      { text: 'Cocokkan dengan kabupaten/kota tempat makanan itu berasal.', icon: <MapPin size={18} strokeWidth={2.5} /> },
      { text: 'Jawaban benar akan membuat peta menyala!', icon: <Star size={18} strokeWidth={2.5} /> }
    ]
  },
  {
    id: 'game3',
    title: 'Kenali Masakanmu',
    tag: 'Kuis Visual',
    desc: 'Tebak nama masakan dari gambar buram yang perlahan-lahan menjadi jelas.',
    mascot: '/games/mascot_kenali.webp',
    headerImage: '/games/card/card_header_kuisvisual.webp',
    rules: [
      { text: 'Akan muncul sebuah foto masakan Jawa Tengah.', icon: <Camera size={18} strokeWidth={2.5} /> },
      { text: 'Foto sangat buram di awal dan perlahan menjadi jelas.', icon: <Eye size={18} strokeWidth={2.5} /> },
      { text: 'Kamu punya waktu 15 detik per soal untuk menjawab.', icon: <Clock size={18} strokeWidth={2.5} /> },
      { text: 'Tebak secepat mungkin dari 4 pilihan yang tersedia!', icon: <Star size={18} strokeWidth={2.5} /> }
    ]
  }
];

export default function GamesPage() {
  return (
    <main style={{
      padding: 'var(--spacing-96) var(--spacing-24)',
      minHeight: '100vh',
      backgroundColor: 'var(--color-coklat-batik)',
      color: 'var(--color-krem-mori)'
    }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        <h1 style={{ fontSize: 'var(--text-display-lg)' }}>
          Mini Games (Dolan)
        </h1>
        <p style={{ fontSize: 'var(--text-body-lg)', marginTop: 'var(--spacing-16)' }}>
          Bermain dan belajar kuliner Jawa Tengah bersama Si Podo.
        </p>
      </div>
    </main>
  );
}
