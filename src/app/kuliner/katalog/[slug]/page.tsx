'use client';

import React, { useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { kulinerData } from '@/data/kulinerData';
import styles from './detail.module.css';

// Helper mapping functions
const getCategoryStyle = (category: string) => {
  return {};
}

const getTasteStyle = (taste: string) => {
  return {};
}

const getCategoryIcon = (cat: string) => {
  const c = cat.toLowerCase();
  if (c.includes('jajanan') || c.includes('ringan')) return '/kuliner/jajanan.webp';
  if (c.includes('minuman')) return '/kuliner/minuman.webp';
  return '/kuliner/makanan_berat.webp'; // Default: Makanan Berat
};

const getTasteIcon = (taste: string) => {
  const t = taste.toLowerCase();
  if (t.includes('pedas')) return '/kuliner/cabai.webp';
  if (t.includes('manis')) return '/kuliner/madu.webp';
  if (t.includes('segar') || t.includes('asam')) return '/kuliner/lemon.webp';
  return '/kuliner/garam.webp'; // Default: Gurih
};

export default function KulinerDetail({ params }: { params: Promise<{ slug: string }> }) {
  // Unpack params using React.use() as required in Next.js 15
  const resolvedParams = use(params);
  const router = useRouter();

  const item = kulinerData.find(d => d.slug === resolvedParams.slug);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const image1Y = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const image2Y = useTransform(scrollYProgress, [0, 1], ['20%', '-40%']);

  if (!item) {
    return (
      <div className={styles.notFound}>
        <h1>Kuliner tidak ditemukan</h1>
        <button onClick={() => router.back()} className={styles.backBtn} style={{ marginTop: '20px' }}>Kembali</button>
      </div>
    );
  }

  // Split history into words for text reveal
  const words = item.history.split(' ');

  // Split title for styling (first word dark, rest orange)
  const nameParts = item.name.split(' ');
  const firstName = nameParts[0];
  const restName = nameParts.slice(1).join(' ');

  return (
    <div className={styles.container} ref={containerRef}>
      {/* 1. THE GRAND HERO - EDITORIAL SPLIT LAYOUT */}
      <section className={styles.heroSection}>
        {/* Background Ornament */}
        <div className={styles.heroOrnament}></div>

        <motion.div
          className={styles.breadcrumb}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link href="/" className={styles.breadcrumbLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </Link>
          <span className={styles.breadcrumbSeparator}>›</span>
          <Link href="/kuliner/katalog" className={styles.breadcrumbLink}>Katalog</Link>
          <span className={styles.breadcrumbSeparator}>›</span>
          <span className={styles.breadcrumbCurrent}>{item.name}</span>
        </motion.div>

        <div className={styles.heroLeft}>

          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {firstName} <span className={styles.titleHighlight}>{restName}</span>
          </motion.h1>

          <motion.div
            className={styles.subtitleWrapper}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className={`${styles.subtitleOrnament} ${styles.mobileOnly}`}>
              <Image
                src="/motif/motif_highlight_kiri.webp"
                alt="Ornament Kiri"
                width={80}
                height={20}
                className={styles.ornamentImg}
                unoptimized
              />
            </span>
            <span>Cita Rasa {item.tasteProfile} Khas {item.origin}</span>
            <span className={styles.subtitleOrnament}>
              <Image
                src="/motif/motif_highlight_kanan.webp"
                alt="Ornament"
                width={80}
                height={20}
                className={styles.ornamentImg}
                unoptimized
              />
            </span>
          </motion.div>
          <motion.div
            className={styles.subtitleSeparator}
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 150 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          ></motion.div>

          <motion.p
            className={styles.shortDesc}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {item.shortDescription}
          </motion.p>

          <motion.div
            className={styles.actionCards}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className={styles.actionCard}>
              <div className={styles.actionCardImgPopup}>
                <Image src={getCategoryIcon(item.category)} alt="Kategori" fill unoptimized className={styles.popupImg} />
              </div>
              <div className={styles.actionCardText}>
                <strong>{item.category}</strong>
              </div>
            </div>

            <div className={styles.actionCard}>
              <div className={styles.actionCardImgPopup}>
                <Image src={getTasteIcon(item.tasteProfile)} alt="Rasa" fill unoptimized className={styles.popupImg} />
              </div>
              <div className={styles.actionCardText}>
                <strong>{item.tasteProfile}</strong>
              </div>
            </div>
          </motion.div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.heroImageFadeMask}>
            <Image
              src={item.galleryImages[0]}
              alt={item.name}
              fill
              className={styles.heroImage}
              priority
            />
            {/* Steam Effect Overlay */}
            <div className={styles.steamWrapper}>
              <div className={styles.steam1}></div>
              <div className={styles.steam2}></div>
              <div className={styles.steam3}></div>
            </div>
          </div>

          {/* Location Card Step Shape with Image */}
          <motion.div
            className={styles.locationContainer}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className={styles.locationTextPart}>
              <div className={styles.locationIcon}>
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"></path></svg>
              </div>
              <div className={styles.locationText}>
                <strong>{item.origin},</strong>
                <span>Jawa Tengah</span>
              </div>
            </div>
            <div className={styles.locationMapPart}>
              <div className={styles.locationMapInner}>
                <img
                  src={item.locationImage || "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=400&q=80"}
                  alt={`Pemandangan ${item.origin}`}
                  className={styles.locationMapImg}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. THE LORE & HISTORY (Editorial Inserts) */}
      <section className={styles.historySection}>
        <div className={styles.historyTextWrapper}>
          {words.map((word, i) => (
            <motion.span
              key={i}
              className={styles.historyWord}
              initial={{ opacity: 0.2, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-10%" }}
              transition={{ duration: 0.4, delay: i * 0.02 }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        <div className={styles.imageGrid}>
          {item.galleryImages[1] && (
            <motion.div className={styles.editorialInsert} style={{ y: image1Y }}>
              <Image src={item.galleryImages[1]} alt={`${item.name} detail 1`} fill className={styles.editorialImage} />
            </motion.div>
          )}
          {item.galleryImages[2] && (
            <motion.div className={styles.editorialInsert2} style={{ y: image2Y }}>
              <Image src={item.galleryImages[2]} alt={`${item.name} detail 2`} fill className={styles.editorialImage} />
            </motion.div>
          )}
        </div>
      </section>

      {/* 3. ANIMATED DECONSTRUCTED INGREDIENTS */}
      <section className={styles.ingredientsSection}>
        <motion.h2
          className={styles.ingredientsTitle}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Bahan-Bahan
        </motion.h2>

        <div className={styles.ingredientsGrid}>
          {item.ingredients.map((ingredient, index) => (
            <motion.div
              key={ingredient}
              className={styles.ingredientItem}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className={styles.ingredientImgWrapper}>
                <Image
                  src={`/kuliner/ingredients/${ingredient}.webp`}
                  alt={ingredient.replace(/-/g, ' ')}
                  fill
                  className={styles.ingredientImage}
                  unoptimized // Required for animated webp to play in Next.js Image
                />
              </div>
              <span className={styles.ingredientName}>{ingredient.replace(/-/g, ' ')}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. HOW TO COOK / CARA MEMASAK */}
      <section className={styles.howToCookSection}>
        <motion.h2
          className={styles.ingredientsTitle}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Cara Memasak
        </motion.h2>

        <div className={styles.cookingStepsContainer}>
          {item.instructions?.map((step, index) => (
            <motion.div
              key={index}
              className={styles.cookingStep}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7 }}
            >
              <div className={styles.stepNumber}>
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className={styles.stepContent}>
                <div className={styles.stepIconWrapper}>
                  <Image
                    src={`/kuliner/methods/${step.action}.webp`}
                    alt={step.action}
                    fill
                    className={styles.stepIcon}
                    unoptimized
                  />
                </div>
                <div className={styles.stepText}>
                  <span className={styles.stepAction}>{step.action}</span>
                  <p className={styles.stepDescription}>{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. NEXT JOURNEY */}
      <section className={styles.nextJourney}>
        <Link href="/kuliner/katalog" className={styles.backBtn}>
          Kembali ke Katalog
        </Link>
      </section>
    </div>
  );
}
