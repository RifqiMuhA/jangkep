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

  // Lock scroll on mount
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useGSAP(() => {
    // 1. Sync floating animations for background and foreground spices
    const bgSpices = gsap.utils.toArray(`.${styles.spiceItemBg}`);
    const fgSpices = gsap.utils.toArray(`.${styles.spiceItemFg}`);

    bgSpices.forEach((el: any, index) => {
      const anim = {
        y: index % 2 === 0 ? -6 : 6,
        rotation: index % 2 === 0 ? 8 : -8,
        duration: 2 + (index % 3) * 0.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      };
      gsap.to(el, anim);
      if (fgSpices[index]) {
        gsap.to(fgSpices[index] as any, anim);
      }
    });

    // 2. Main Timeline (Loading & Reveal)
    const tl = gsap.timeline({
      onComplete: () => {
        // Outro Transition
        const outroTl = gsap.timeline({
          onComplete: () => {
            if (onComplete) onComplete();
          }
        });

        // Fade out center content smoothly
        outroTl.to([textRef.current, progressBarRef.current], {
          y: -20,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.in'
        }, 0);

        // Slide up the loading screen curtain
        outroTl.to(containerRef.current, {
          yPercent: -100,
          duration: 1.2,
          ease: 'power4.inOut',
          onComplete: () => {
            document.body.style.overflow = '';
          }
        }, 0.3);
      }
    });

    // Intro Fade-in
    tl.from([textRef.current, progressBarRef.current], {
      opacity: 0,
      y: 20,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.2
    }, 0);

    // Simulate Loading Process
    tl.to({}, {
      duration: 3.5, // 3.5s loading time
      ease: 'power1.inOut',
      onUpdate: function() {
        const prog = Math.round(this.progress() * 100);
        setProgress(prog);
        gsap.set(maskRef.current, { width: `${prog}%` });
      }
    }, 0.5);

  }, { scope: containerRef });

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
