'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import styles from './SipodoIntroSection.module.css';

/* ─── Slide Data ─── */
const slides = [
  {
    id: 'kepodang',
    num: '01',
    img: '/sipodo/kepodang.png',
    title: 'Burung Kepodang',
    desc: 'Maskot resmi Provinsi Jawa Tengah. Si Podo hadir sebagai wajah otentik daerah — bukan karakter generik, tapi representasi budaya yang hidup.',
  },
  {
    id: 'blankon',
    num: '02',
    img: '/sipodo/blankon.png',
    title: 'Blangkon',
    desc: 'Penutup kepala tradisional Jawa yang dipakai bangga. Simbol kearifan lokal sebagai mahkota identitas, bukan sekadar aksesori.',
  },
  {
    id: 'kawung',
    num: '03',
    img: '/sipodo/short.png',
    title: 'Batik Kawung',
    desc: 'Motif batik tertua di Jawa, simbol kesempurnaan dan keharmonisan alam semesta. Warisan yang hidup dalam tiap jahitan.',
  },
  {
    id: 'sayap',
    num: '04',
    img: '/sipodo/tangan.png',
    title: 'Sayap Terbuka',
    desc: 'Pose menyambut dan mengundang. Si Podo bukan dekorasi — ia teman perjalanan kulinermu yang selalu siap terbang bersama.',
  },
  {
    id: 'lengkap',
    num: '05',
    img: '/sipodo/full.png',
    title: 'Si Podo Lengkap',
    desc: 'Kepodang + Blangkon + Kawung + Sayap Terbuka = Jangkep. Lengkap Rasanya, Lengkap Ceritanya.',
  },
];

export default function SipodoIntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const touchStartX = useRef(0);

  /* ── Scroll Reveal ── */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* ── Navigation helpers ── */
  const goTo = useCallback((idx: number) => {
    setActiveIdx((idx + slides.length) % slides.length);
  }, []);

  const prev = useCallback(() => goTo(activeIdx - 1), [activeIdx, goTo]);
  const next = useCallback(() => goTo(activeIdx + 1), [activeIdx, goTo]);

  /* ── Keyboard ── */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    },
    [prev, next],
  );

  /* ── Touch / Swipe ── */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const diff = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? next() : prev();
      }
    },
    [next, prev],
  );

  /* ── Slide position helper ── */
  const getSlideStyle = (idx: number) => {
    let offset = idx - activeIdx;
    // Wrap around for circular feel
    if (offset > 2) offset -= slides.length;
    if (offset < -2) offset += slides.length;

    const absOffset = Math.abs(offset);
    const scale = offset === 0 ? 1 : absOffset === 1 ? 0.75 : 0.55;
    const opacity = offset === 0 ? 1 : absOffset === 1 ? 0.7 : 0.4;
    const blur = absOffset >= 2 ? 'blur(1.5px)' : 'none';
    const translateX = offset * 260;
    const zIndex = 10 - absOffset;

    return {
      transform: `translateX(${translateX}px) scale(${scale})`,
      opacity,
      filter: blur,
      zIndex,
      pointerEvents: (offset === 0 ? 'auto' : 'none') as React.CSSProperties['pointerEvents'],
    };
  };

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.isVisible : ''}`}
      id="filosofi"
    >
      {/* ── Section Header ── */}
      <div className={styles.header}>
        <h2 className={`${styles.headline} ${styles.revealItem} ${styles.revealDelay0}`}>
          Di Balik Si Podo,
          <br />
          Ada <em className={styles.headlineAccent}>Filosofi.</em>
        </h2>
        <p className={`${styles.desc} ${styles.revealItem} ${styles.revealDelay1}`}>
          Setiap detail Si Podo bukan kebetulan. Dari paruh hingga celana,
          semuanya mengandung cerita Jawa Tengah yang sudah berabad-abad.
        </p>
      </div>

      {/* ── Carousel ── */}
      <div
        className={`${styles.carouselRegion} ${styles.revealItem} ${styles.revealDelay2}`}
        role="region"
        aria-label="Filosofi Logo Si Podo"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Arrow Left */}
        <button
          className={`${styles.arrowBtn} ${styles.arrowLeft}`}
          onClick={prev}
          aria-label="Slide sebelumnya"
        >
          ‹
        </button>

        {/* Slides */}
        <div className={styles.carouselTrack}>
          {slides.map((slide, idx) => {
            const isActive = idx === activeIdx;
            return (
              <div
                key={slide.id}
                className={`${styles.slide} ${isActive ? styles.slideActive : ''}`}
                style={getSlideStyle(idx)}
                aria-hidden={!isActive}
              >
                <Image
                    src={slide.img}
                    alt={slide.title}
                    width={500}
                    height={600}
                    className={styles.slideImg}
                  />
                <div className={`${styles.slideText} ${isActive ? styles.slideTextVisible : ''}`}>
                  <span className={styles.slideNum}>{slide.num}</span>
                  <h3 className={styles.slideTitle}>{slide.title}</h3>
                  <p className={styles.slideDesc}>{slide.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Arrow Right */}
        <button
          className={`${styles.arrowBtn} ${styles.arrowRight}`}
          onClick={next}
          aria-label="Slide berikutnya"
        >
          ›
        </button>
      </div>

      {/* ── Dot Indicator ── */}
      <div className={`${styles.dots} ${styles.revealItem} ${styles.revealDelay3}`}>
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            className={`${styles.dot} ${idx === activeIdx ? styles.dotActive : ''}`}
            onClick={() => goTo(idx)}
            aria-label={`Ke slide ${slide.title}`}
            aria-current={idx === activeIdx ? 'true' : undefined}
          />
        ))}
      </div>
    </section>
  );
}
