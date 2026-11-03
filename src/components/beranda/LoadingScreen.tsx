'use client';

import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import styles from './LoadingScreen.module.css';

interface LoadingScreenProps {
  onComplete?: () => void;
}

const SPICES = [
  '/rempah/rempah-2.webp',
  '/rempah/rempah-4.webp',
  '/rempah/rempah-7.webp',
  '/rempah/rempah-12.webp',
  '/rempah/rempah-15.webp',
  '/rempah/rempah-17.webp',
  '/rempah/rempah-19.webp',
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(true);

  // Kunci scroll saat loading aktif dan beri pengaman fallback
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Safety fallback: pastikan layar pasti terbuka maksimal dalam 3.5s jika ada kendala jaringan/script
    const safetyTimer = setTimeout(() => {
      document.body.style.overflow = '';
      setIsMounted(false);
      if (onComplete) onComplete();
    }, 3500);

    return () => {
      clearTimeout(safetyTimer);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  useGSAP(() => {
    const progressTracker = { value: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        // Outro Transition
        const outroTl = gsap.timeline({
          onComplete: () => {
            document.body.style.overflow = '';
            setIsMounted(false);
            if (onComplete) onComplete();
          }
        });

        // Fade out center content smoothly
        outroTl.to([textRef.current, progressBarRef.current], {
          y: -20,
          opacity: 0,
          duration: 0.35,
          ease: 'power3.in'
        }, 0);

        // Slide up the loading screen curtain (tetap 1.2s sesuai preferensi)
        outroTl.to(containerRef.current, {
          yPercent: -100,
          duration: 1.2,
          ease: 'power4.inOut',
          onComplete: () => {
            document.body.style.overflow = '';
          }
        }, 0.15);
      }
    });

    // Intro Fade-in cepat
    tl.from([textRef.current, progressBarRef.current], {
      opacity: 0,
      y: 15,
      duration: 0.35,
      ease: 'power3.out',
      stagger: 0.08
    }, 0);

    // Animasi Progress Bar 0 -> 100% (durasi 1.2s: cepat, lincah, dan anti-macet)
    tl.to(progressTracker, {
      value: 100,
      duration: 1.2,
      ease: 'power1.inOut',
      onUpdate: () => {
        const prog = Math.round(progressTracker.value);
        setProgress(prog);
        if (maskRef.current) {
          gsap.set(maskRef.current, { width: `${prog}%` });
        }
      }
    }, 0.1);

  }, { scope: containerRef });

  if (!isMounted) return null;

  return (
    <div ref={containerRef} className={styles.overlay}>
      <div className={styles.centerWrapper}>
        
        {/* Mascot & Progress Bar Container */}
        <div ref={progressBarRef} className={styles.barWithMascot}>
          
          {/* Peeking Mascot */}
          <div className={styles.mascotPeekingContainer}>
            <img src="/kuliner/mascot_ngintip_1.webp" alt="" className={`${styles.mascotImg} ${styles.mascot1}`} />
            <img src="/kuliner/mascot_ngintip_2.webp" alt="" className={`${styles.mascotImg} ${styles.mascot2}`} />
            <img src="/kuliner/mascot_ngintip_3.webp" alt="" className={`${styles.mascotImg} ${styles.mascot3}`} />
          </div>

          {/* Spice Progress Bar */}
          <div className={styles.progressBarWrapper}>
            
            {/* Guide Line */}
            <div className={styles.trackLine}></div>

            {/* Background Spices (Faded / Grayscale) */}
            <div className={styles.spicesRowBg}>
              {SPICES.map((src, idx) => (
                <div key={`bg-${idx}`} className={styles.spiceItemBg}>
                  <img src={src} alt="" />
                </div>
              ))}
            </div>

            {/* Foreground Spices (Revealed by Mask) */}
            <div ref={maskRef} className={styles.maskContainer}>
              <div className={styles.spicesRowFg}>
                {SPICES.map((src, idx) => (
                  <div key={`fg-${idx}`} className={styles.spiceItemFg}>
                    <img src={src} alt="" />
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>

        {/* Typography */}
        <div ref={textRef} className={styles.textContainer}>
          <span className={styles.label}>Meracik Rasa</span>
          <span className={styles.percentage}>{progress}%</span>
        </div>

      </div>
    </div>
  );
}
