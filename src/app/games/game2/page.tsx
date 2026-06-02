"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './game2.module.css';

export default function Game2Page() {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.mascotWrapper}>
          <Image 
            src="/games/game2/mascot_not_found.webp" 
            alt="Mascot Not Found" 
            width={300} 
            height={300} 
            className={styles.mascot}
            unoptimized
          />
        </div>

        <div className={styles.textContainer}>
          <h1 className={styles.title}>Waduh!</h1>
          <p className={styles.indonesia}>
            Ngapunten nggih, game "Dari Kota Mana?" belum dapat dimainkan karena isih didandani kalih kuli-kuli Jangkep!
          </p>
          
          <Link href="/games" className={styles.btnKembali}>
            <Image
              src="/games/game2/button_selesai.webp"
              alt="Kembali ke Menu Banner"
              width={240}
              height={60}
              className={styles.btnImage}
              unoptimized
            />
            <span className={styles.btnText}>Kembali ke Menu</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
