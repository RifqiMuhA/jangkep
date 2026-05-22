'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './PromoGamesSection.module.css';

const floatingItems = [
  { emoji: '🌶️', className: styles.floaterTopLeft },
  { emoji: '🥥', className: styles.floaterTopRight },
  { emoji: '🥜', className: styles.floaterBottomLeft },
  { emoji: '🌿', className: styles.floaterBottomRight },
  { emoji: '🧅', className: styles.floaterMidLeft },
];

export default function PromoGamesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className={`${styles.quizSection} ${isVisible ? styles.isVisible : ''}`} 
      aria-label="Promosi Mini Games"
    >
      {/* Floating ingredients */}
      {floatingItems.map((item, index) => (
        <span
          key={index}
          className={`${styles.quizFloater} ${item.className}`}
          aria-hidden="true"
        >
          {item.emoji}
        </span>
      ))}

      <div className={styles.quizInner}>
        {/* Left Column: Headline & CTA */}
        <div className={styles.quizContentCol}>
          <div className={styles.quizHeadlineStack}>
            <div className={`${styles.quizLine} ${styles.line1}`}>
              <span className={styles.blockPlain}>Waktune</span>
            </div>
            <div className={`${styles.quizLine} ${styles.line2}`}>
              <span className={`${styles.blockFilled} ${styles.bgKuning}`}>Dolan</span>
              <span className={styles.blockOutline}>!</span>
            </div>
            <div className={`${styles.quizLine} ${styles.line3}`}>
              <span className={styles.blockScript}>— Ayo uji ilmumu soal kuliner Jawa</span>
            </div>
          </div>

          <Link href="/games" className={styles.quizCta}>
            Main Sekarang! &rarr;
          </Link>
        </div>

        {/* Right Column: Si Podo */}
        <div className={styles.quizSipodoCol}>
          <div className={styles.sipodoQuizWrapper}>
            {/* Thought bubble */}
            <div className={styles.sipodoThoughtBubble}>
              <div className={styles.bubbleMain}>
                Ayo, bisa tebak ini masakan apa?
              </div>
              <div className={styles.bubbleDots}>
                <span className={`${styles.dot} ${styles.dot1}`}></span>
                <span className={`${styles.dot} ${styles.dot2}`}></span>
                <span className={`${styles.dot} ${styles.dot3}`}></span>
              </div>
            </div>

            <Image
              src="/sipodo/games.webp"
              alt="Si Podo mengajak bermain tebak masakan"
              width={280}
              height={280}
              className={styles.sipodoQuizImg}
              priority={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
