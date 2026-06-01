'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './PromoGamesSection.module.css';

const singlePhilo = {
  jawa: 'Mangan ora mangan sing penting kumpul.',
  indo: 'Kebersamaan lebih utama daripada kemewahan.'
};

export default function PromoGamesSection() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const [isTranslated, setIsTranslated] = useState(false);

  useEffect(() => {
    let ctx: any;

    const init = async () => {
      const gsap = (await import('gsap')).default;
      const ScrollTrigger = (await import('gsap/ScrollTrigger')).default;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.fromTo(
          '.heroAnim',
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%'
            }
          }
        );

        gsap.fromTo(
          '.sipodoAnim',
          { x: 50, opacity: 0, scale: 0.9 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'back.out(1.2)',
            delay: 0.3,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%'
            }
          }
        );

        gsap.fromTo(
          '.quoteAnim',
          { scale: 0.8, opacity: 0, rotation: -5 },
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 1.5,
            ease: 'elastic.out(1, 0.5)',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 50%'
            }
          }
        );
      }, sectionRef);
    };

    init();

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.bgWrapper}>
        <Image
          src="/sipodo/bg-games-1.png"
          alt="Pawon background"
          fill
          className={styles.bgImage}
          priority
          unoptimized
        />
      </div>

      <div className={styles.content}>
        <div className={styles.heroArea}>
          <div className={styles.heroText}>
            <h1 className={`${styles.headline} heroAnim`}>
              Ora mung mangan.<br />
              <span className={styles.hlHighlight}>Nanging uga dolanan.</span>
            </h1>
            <p className={`${styles.subheadline} heroAnim`}>
              Jelajahi kuliner Jawa Tengah lewat permainan interaktif penuh rasa dan cerita.
            </p>
            <div className="heroAnim">
              <button className={styles.ctaBtn} onClick={() => router.push('/games')}>
                Main Bareng Si Podo &rarr;
              </button>
            </div>
          </div>

          <div className={`${styles.heroImageWrap} sipodoAnim`}>
            <Image
              src="/sipodo/games-1.webp"
              alt="Si Podo"
              width={850}
              height={935}
              className={styles.sipodoImg}
              priority
              unoptimized
            />

            <div
              className={`${styles.speechBubble} ${isTranslated ? styles.translated : ''} quoteAnim`}
              onClick={() => setIsTranslated(!isTranslated)}
            >
              {isTranslated ? (
                <span className={styles.textIndo}>{singlePhilo.indo}</span>
              ) : (
                <span className={styles.textJawa}>{singlePhilo.jawa}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}