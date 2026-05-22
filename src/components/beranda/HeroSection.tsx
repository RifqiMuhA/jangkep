'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import styles from './HeroSection.module.css';

const LINE1 = 'Jangkep Rasane,';
const LINE2 = 'Jangkep Critane';

export default function HeroSection() {
  const [revealed, setRevealed] = useState(false);
  const [sipodoVisible, setSipodoVisible] = useState(false);
  const [isAksara, setIsAksara] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const imageLayerRef = useRef<HTMLDivElement>(null);

  // Trigger char reveal after mount
  useEffect(() => {
    const revealTimer = setTimeout(() => setRevealed(true), 300);
    const sipodoTimer = setTimeout(() => setSipodoVisible(true), 1200);
    return () => {
      clearTimeout(revealTimer);
      clearTimeout(sipodoTimer);
    };
  }, []);

  // Mouse parallax tracking with lerp for smoothness
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    mouseTarget.current = { x, y };
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMouseMove);

    function animate() {
      const curr = mouseCurrent.current;
      const targ = mouseTarget.current;
      // Lerp
      curr.x += (targ.x - curr.x) * 0.08;
      curr.y += (targ.y - curr.y) * 0.08;

      if (textLayerRef.current) {
        textLayerRef.current.style.transform =
          `translate(${curr.x * 12}px, ${curr.y * 8}px)`;
      }
      if (imageLayerRef.current) {
        imageLayerRef.current.style.transform =
          `translate(${curr.x * 20}px, calc(-50% + ${curr.y * 14}px))`;
      }

      rafRef.current = requestAnimationFrame(animate);
    }
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  // Build chars for line 1
  let charIndex = 0;
  const line1Chars = LINE1.split('').map((char) => {
    const idx = charIndex++;
    if (char === ' ') {
      return <span key={idx} className={styles.space}>&nbsp;</span>;
    }
    return (
      <span
        key={idx}
        className={`${styles.char} ${revealed ? styles.charVisible : ''}`}
        style={{ animationDelay: `${idx * 0.04}s` }}
      >
        {char}
      </span>
    );
  });

  // Build chars for line 2
  const line2Word1 = 'Jangkep';
  const line2Word2 = ' Critane';
  
  const line2Word1Chars = line2Word1.split('').map((char) => {
    const idx = charIndex++;
    return (
      <span
        key={idx}
        className={`${styles.char} ${styles.charLine2} ${revealed ? styles.charVisible : ''}`}
        style={{ animationDelay: `${idx * 0.04}s` }}
      >
        {char}
      </span>
    );
  });

  const line2Word2Chars = line2Word2.split('').map((char) => {
    const idx = charIndex++;
    if (char === ' ') {
      return <span key={idx} className={styles.space}>&nbsp;</span>;
    }
    return (
      <span
        key={idx}
        className={`${styles.char} ${styles.charLine2} ${revealed ? styles.charVisible : ''}`}
        style={{ animationDelay: `${idx * 0.04}s` }}
      >
        {char}
      </span>
    );
  });

  return (
    <section ref={heroRef} className={styles.hero}>
      {/* Layer 2: Radial gradient vignette */}
      <div className={styles.gradientOverlay} aria-hidden="true" />

      {/* Layer 3: Si Podo center image */}
      <div ref={imageLayerRef} className={styles.sipodoCenter}>
        <Image
          src="/sipodo/dapur jawa.webp"
          alt="Si Podo, maskot Jangkep, sedang memasak di dapur Jawa"
          width={580}
          height={580}
          className={styles.sipodoCenterImg}
          style={{ width: 'auto' }}
          priority
        />
      </div>

      {/* Layer 4: Headline text */}
      <div ref={textLayerRef} className={styles.heroContent}>
        <h1 className={styles.headlineWrapper}>
          <span className={styles.line1}>{line1Chars}</span>
          <span className={styles.line2}>
            <span 
              className={`${styles.wordToggle} ${isAksara ? styles.isJavanese : ''}`}
              onClick={() => setIsAksara(!isAksara)}
              title="Klik untuk lihat Aksara Jawa"
            >
              <span className={styles.wordLatin}>{line2Word1Chars}</span>
              <span className={styles.wordJavanese}>ꦗꦁꦏꦺꦥ꧀</span>
            </span>
            {line2Word2Chars}
          </span>
        </h1>

        {/* Layer 5: CTA button */}
        <a href="#rempah" className={styles.ctaButton}>
          Mulai Perjalanan
          <span className={styles.ctaArrow} aria-hidden="true">→</span>
        </a>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator} aria-hidden="true">
        <span className={styles.scrollLabel}>SCROLL</span>
        <span className={styles.scrollArrow}>↓</span>
      </div>

      {/* Layer 6: Si Podo corner + dialog bubble */}
      <div className={`${styles.sipodoCorner} ${sipodoVisible ? styles.sipodoCornerVisible : ''}`}>
        <div className={styles.dialogBubble}>
          <p className={styles.dialogText}>
            Wis siap njelajah Jawa Tengah?
          </p>
        </div>
        <Image
          src="/sipodo/halo.webp"
          alt="Si Podo menyapa"
          width={80}
          height={80}
          style={{ width: 'auto' }}
          className={styles.sipodoCornerImg}
        />
      </div>
    </section>
  );
}
