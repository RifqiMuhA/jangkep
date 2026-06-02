'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { rempahData, type Rempah } from '@/data/rempah';
import styles from './RempahSection.module.css';

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  rempah: Rempah | null;
}

const TARGET_REMPAH = ['Kluwek', 'Kemiri', 'Daun Salam', 'Serai', 'Lengkuas', 'Kencur', 'Ketumbar', 'Gula Merah', 'Jahe', 'Kunyit', 'Pala', 'Asam Jawa'];
const canvasRempahData = rempahData.filter(r => 
  TARGET_REMPAH.some(t => r.nama.toLowerCase().includes(t.toLowerCase()))
).slice(0, 12); // Pastikan 12

// Pre-computed positions layaknya collage (Lebih rapat dan besar)
const SCATTER_POSITIONS = [
  { left: 25, top: 30, scale: 1.3, rot: -15 },
  { left: 45, top: 25, scale: 1.0, rot: 10 },
  { left: 60, top: 28, scale: 1.4, rot: -8 },
  { left: 75, top: 22, scale: 1.1, rot: 20 },
  
  { left: 20, top: 55, scale: 1.4, rot: 15 },
  { left: 35, top: 60, scale: 1.1, rot: -10 },
  { left: 50, top: 52, scale: 1.5, rot: 25 },
  
  { left: 65, top: 65, scale: 1.0, rot: -5 },
  { left: 80, top: 55, scale: 1.3, rot: -18 },
  
  { left: 30, top: 78, scale: 1.2, rot: 12 },
  { left: 55, top: 75, scale: 1.4, rot: -22 },
  { left: 70, top: 80, scale: 1.1, rot: 8 },
];

export default function RempahSection() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const rempahRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, rempah: null });
  const tooltipTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let gsapInst: any;
    let ScrollTriggerInst: any;

    const init = async () => {
      const [gsapMod, stMod] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      gsapInst = gsapMod.default;
      ScrollTriggerInst = stMod.default;
      gsapInst.registerPlugin(ScrollTriggerInst);

      ScrollTriggerInst.create({
        trigger: sectionRef.current,
        start: 'top 80%', 
        onEnter: () => triggerRempahFall(gsapInst),
        onEnterBack: () => triggerRempahFall(gsapInst)
      });
    };

    init();

    return () => {
      if (ScrollTriggerInst) ScrollTriggerInst.getAll().forEach((t: any) => t.kill());
    };
  }, []);

  const triggerRempahFall = (gsap: any) => {
    // Kill semua animasi lama dulu
    rempahRefs.current.forEach((el) => {
      if (el) gsap.killTweensOf(el);
    });
    gsap.killTweensOf('.ambientText');
    gsap.killTweensOf('.jelajahBtn');

    // Reset posisi semua rempah ke state awal
    rempahRefs.current.forEach((el, i) => {
      if (!el) return;
      const pos = SCATTER_POSITIONS[i % SCATTER_POSITIONS.length];
      gsap.set(el, {
        left: `${pos.left}%`,
        top: `${pos.top}%`,
        y: -window.innerHeight * 1.3,
        xPercent: -50,
        yPercent: -50,
        rotation: pos.rot - 60,
        scale: pos.scale * 0.85,
        autoAlpha: 0,
      });
    });

    // Reset button dan teks
    gsap.set('.jelajahBtn', { autoAlpha: 0, y: 24 });
    gsap.set('.ambientText', { opacity: 0, y: 20 });

    // Tampilkan teks hero
    gsap.to('.ambientText', {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'power3.out'
    });

    // Animasi jatuh
    rempahRefs.current.forEach((el, i) => {
      if (!el) return;
      const pos = SCATTER_POSITIONS[i % SCATTER_POSITIONS.length];
      
      gsap.to(el, {
        y: 0,
        xPercent: -50,
        yPercent: -50,
        rotation: pos.rot,
        scale: pos.scale,
        autoAlpha: 1,
        duration: 1.1 + (i % 3) * 0.1,
        delay: i * 0.055,
        ease: 'power4.out',
      });
    });

    // Setelah forEach animasi jatuh selesai, buat floating timeline
    const lastDelay = (rempahRefs.current.length - 1) * 0.055 + 1.3;

    setTimeout(() => {
      rempahRefs.current.forEach((el, i) => {
        if (!el) return;
        const pos = SCATTER_POSITIONS[i % SCATTER_POSITIONS.length];
        const floatDir = i % 2 === 0 ? 1 : -1;

        gsap.to(el, {
          y: `+=${10 + (i % 3) * 5}`,
          rotation: pos.rot + (floatDir * 3),
          xPercent: -50,
          yPercent: -50,
          duration: 2.5 + (i % 4) * 0.7,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      });
    }, lastDelay * 1000);

    const lastItemLandingTime = ((rempahRefs.current.length - 1) * 0.055 + 1.3) * 1000;

    setTimeout(() => {
      gsap.to('.jelajahBtn', { 
        autoAlpha: 1, 
        y: 0, 
        duration: 0.7, 
        ease: 'power3.out' 
      });
    }, lastItemLandingTime + 200);
  };

  // ─── Drag Logic Sederhana ───
  const activeDragIdx = useRef<number | null>(null);
  
  const handlePointerDown = (e: React.PointerEvent, index: number) => {
    e.stopPropagation();
    activeDragIdx.current = index;
    const el = rempahRefs.current[index];
    if (el) el.style.zIndex = '100';
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (activeDragIdx.current === null) return;
    const el = rempahRefs.current[activeDragIdx.current];
    if (el && canvasRef.current) {
      const wRect = canvasRef.current.getBoundingClientRect();
      const nx = e.clientX - wRect.left;
      const ny = e.clientY - wRect.top;
      
      const pctX = (nx / wRect.width) * 100;
      const pctY = (ny / wRect.height) * 100;
      
      el.style.left = `${pctX}%`;
      el.style.top = `${pctY}%`;
    }
  };

  const handlePointerUp = (e: React.PointerEvent, index: number, rempah: Rempah) => {
    e.stopPropagation();
    activeDragIdx.current = null;
    
    const el = rempahRefs.current[index];
    if (el) {
      el.style.zIndex = '15';
      const rect = el.getBoundingClientRect();
      if (canvasRef.current) {
        const cRect = canvasRef.current.getBoundingClientRect();
        setTooltip({
          visible: true,
          x: Math.min(Math.max(rect.left - cRect.left + rect.width / 2 - 110, 10), cRect.width - 230),
          y: Math.max(rect.top - cRect.top - 120, 10),
          rempah,
        });

        if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
        tooltipTimerRef.current = setTimeout(() => {
          setTooltip(p => ({ ...p, visible: false }));
        }, 2500);
      }
    }
  };

  return (
    <section className={styles.section} id="rempah" ref={sectionRef}>
      
      <div className={styles.clipWrapper}>
        
        {/* ============================
            CANVAS MODE (GSAP Scatter)
            ============================ */}
        <div className={styles.canvasMode}>
          <div className={styles.canvasHeader}>
            <div className={`${styles.ambientText} ambientText`}>
              "Dari rempah-rempah inilah semua dimulai."
            </div>
          </div>

          <div className={styles.canvasWrapper} ref={canvasRef} onPointerMove={handlePointerMove}>
            {canvasRempahData.map((r, i) => {
              const pos = SCATTER_POSITIONS[i % SCATTER_POSITIONS.length];
              return (
                <div
                  key={r.id}
                  ref={(el) => { rempahRefs.current[i] = el; }}
                  className={styles.rempahItem}
                  style={{
                    width: r.width,
                    height: r.height,
                    // Tetapkan posisi % agar responsive
                    left: `${pos.left}%`,
                    top: `${pos.top}%`,
                  }}
                  onPointerDown={(e) => handlePointerDown(e, i)}
                  onPointerUp={(e) => handlePointerUp(e, i, r)}
                >
                  <Image
                    src={r.asset}
                    alt={r.nama}
                    width={r.width}
                    height={r.height}
                    unoptimized
                    priority={i < 8}
                  />
                </div>
              );
            })}

            {tooltip.visible && tooltip.rempah && (
              <div
                className={styles.rempahTooltip}
                style={{ left: tooltip.x, top: tooltip.y }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <div className={styles.tooltipRempahName}>{tooltip.rempah.nama}</div>
                <div className={styles.tooltipRole}>{tooltip.rempah.peran}</div>
                <div className={styles.tooltipDivider} />
                <div className={styles.tooltipFoods}>{tooltip.rempah.makanan}</div>
              </div>
            )}
          </div>

          <div className={styles.canvasFooter}>
            <button 
              className={`${styles.glassBtn} jelajahBtn`} 
              onClick={() => router.push('/rasa')}
            >
              Jelajah Rasa &#10022;
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
