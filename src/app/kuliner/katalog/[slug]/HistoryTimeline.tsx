'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import styles from './HistoryTimeline.module.css';

// Ensure plugins are registered
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function HistoryTimeline({ item }: { item: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentTrackRef = useRef<HTMLDivElement>(null);
  const yearsTrackRef = useRef<HTMLDivElement>(null);
  const passedLineRef = useRef<HTMLDivElement>(null);
  const birdRef = useRef<HTMLDivElement>(null);
  const [birdFrame, setBirdFrame] = useState(1);

  const eraImages = [
    '/kuliner/sejarah/era_kerajaan.webp',
    '/kuliner/sejarah/masa_kolonial.webp',
    '/kuliner/sejarah/pasca_kemerdekaan.webp',
    '/kuliner/sejarah/era_modernisasi.webp',
    '/kuliner/sejarah/masa_kini.webp'
  ];

  // Bird flap animation
  useEffect(() => {
    const interval = setInterval(() => {
      setBirdFrame(prev => (prev === 3 ? 1 : prev + 1));
    }, 120); // 120ms per frame
    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    const contentTrack = contentTrackRef.current;
    const yearsTrack = yearsTrackRef.current;
    const container = containerRef.current;
    const bird = birdRef.current;

    if (!contentTrack || !yearsTrack || !container || !bird) return;

    // Calculate how far to move the tracks
    // contentTrack has 100vw panels. To get to the last panel (index 4), it must move 400vw.
    const numItems = item.historyTimeline.length;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: () => `+=${numItems * window.innerWidth}`,
        pin: true,
        scrub: true, // Changed from 1 to true to remove the 1-second lag on flick scrolls!
        invalidateOnRefresh: true,
      }
    });

    // 1. Content track moves full 400vw
    tl.to(contentTrack, {
      x: () => `-${(numItems - 1) * 100}vw`,
      ease: 'none',
    }, 0);

    // 2. Years track moves 100vw
    tl.to(yearsTrack, {
      x: () => `-${(numItems - 1) * 25}vw`,
      ease: 'none',
    }, 0);

    // 3. Passed line grows by exactly 100vw
    tl.fromTo(passedLineRef.current, 
      { width: '20vw' },
      { width: () => `calc(20vw + ${(numItems - 1) * 25}vw)`, ease: 'none' },
      0
    );
    
    // Bird floating animation
    gsap.to(bird, {
      y: -15,
      duration: 0.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

  }, { scope: containerRef });

  if (!item.historyTimeline) return null;

  return (
    <section className={styles.timelineSection} ref={containerRef}>
      
      {/* TOP TITLE */}
      <div className={styles.timelineHeader}>
        <Image src="/motif/dekor_header_atas.webp" alt="Dekorasi Atas" width={250} height={40} className={styles.dekorAtas} unoptimized />
        <h2 className={styles.title}>Jejak Sejarah</h2>
        <Image src="/motif/dekor_header_bawah.webp" alt="Dekorasi Bawah" width={250} height={40} className={styles.dekorBawah} unoptimized />
      </div>

      <div className={styles.scrollWrapper}>
        {/* TOP TIMELINE BAR */}
        <div className={styles.topBar}>
          {/* Bird Indicator (Fixed in place at 20vw) */}
          <div className={styles.birdIndicator} ref={birdRef}>
            <Image 
              src={`/kuliner/sejarah/terbang_${birdFrame}.webp`} 
              alt="Burung mengepak" 
              width={70} 
              height={70} 
              className={styles.birdImage}
              unoptimized
            />
          </div>
          
          {/* Years Track (Moves left) */}
          <div className={styles.yearsTrack} ref={yearsTrackRef}>
            {/* The lines scroll with the track */}
            <div className={styles.dashedLine} style={{ width: `calc(20vw + ${(item.historyTimeline.length - 1) * 25}vw)` }}></div>
            <div className={styles.passedLine} ref={passedLineRef}></div>
            
            {item.historyTimeline.map((event: any, index: number) => (
              <div className={styles.yearMarker} key={`year-${index}`}>
                <div className={styles.yearDot}></div>
                <span className={styles.yearText}>{event.year}</span>
              </div>
            ))}
            <div className={styles.endPadding}></div>
          </div>
        </div>

        {/* CONTENT PANELS BELOW (Moves left in sync with Years Track) */}
        <div className={styles.contentTrack} ref={contentTrackRef}>
          {item.historyTimeline.map((event: any, index: number) => (
            <div className={styles.panelWrapper} key={`panel-${index}`}>
              
              <div className={styles.eraImageWrapper}>
                <Image 
                  src={eraImages[index] || eraImages[0]} 
                  alt={event.title} 
                  fill 
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={styles.eraImage} 
                />
              </div>
              
              <div className={styles.panelContent}>
                <div className={styles.aksara}>{event.aksara}</div>
                <h3 className={styles.eraTitle}>{event.title}</h3>
                <p className={styles.description}>{event.description}</p>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
