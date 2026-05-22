'use client';

import { useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { featuredKuliner, type FlavorType } from '@/data/kuliner';
import styles from './FeaturedKulinerSection.module.css';

/** Map a FlavorType to its CSS module class */
const FLAVOR_CLASS: Record<FlavorType, string> = {
  Pedas: styles.tagPedas,
  Manis: styles.tagManis,
  Gurih: styles.tagGurih,
  Segar: styles.tagSegar,
  Legit: styles.tagLegit,
};

function KulinerCard({
  item,
  isLarge,
}: {
  item: (typeof featuredKuliner)[number];
  isLarge: boolean;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const el = cardRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left; // mouse x within card
      const y = e.clientY - rect.top; // mouse y within card
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Max ±5 degrees
      const rotateY = ((x - centerX) / centerX) * 5;
      const rotateX = ((centerY - y) / centerY) * 5;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = '';
  }, []);

  const cardClasses = [
    styles.card,
    isLarge ? styles.cardLarge : styles.cardSmall,
  ].join(' ');

  return (
    <Link
      ref={cardRef}
      href={`/kuliner/${item.slug}`}
      className={cardClasses}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background image */}
      <div className={styles.cardImage}>
        <Image
          src={item.image}
          alt={item.nama}
          fill
          sizes={isLarge ? '(max-width: 768px) 100vw, 55vw' : '(max-width: 768px) 100vw, 45vw'}
          priority={isLarge}
        />
      </div>

      {/* Gradient overlay */}
      <div className={styles.cardOverlay} />

      {/* Text content */}
      <div className={styles.cardContent}>
        <h3 className={`${styles.cardName} ${isLarge ? styles.cardNameLarge : ''}`}>
          {item.nama}
        </h3>
        <p className={styles.cardCity}>{item.kota}</p>
        <p className={styles.cardDescription}>{item.deskripsiSingkat}</p>

        <div className={styles.tags}>
          {item.flavors.map((flavor) => (
            <span key={flavor} className={`${styles.tag} ${FLAVOR_CLASS[flavor]}`}>
              {flavor}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedKulinerSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Kuliner Unggulan Jawa Tengah</h2>

      <div className={styles.grid}>
        {featuredKuliner.map((item, index) => (
          <KulinerCard key={item.id} item={item} isLarge={index === 0} />
        ))}
      </div>
    </section>
  );
}
