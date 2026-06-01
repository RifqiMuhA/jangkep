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

  const [mode, setMode] = useState<'canvas' | 'encyclopedia'>('canvas');
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, rempah: null });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const tooltipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedRef = useRef(false);

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
        start: 'top top', 
        end: '+=5000', // Freeze
        pin: true,
        pinSpacing: true,
        onEnter: () => {
          document.body.style.overflow = 'hidden'; 
          
          gsapInst.to('.ambientText', {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out'
          });
          
          if (!hasStartedRef.current) {
            hasStartedRef.current = true;
            triggerRempahFall(gsapInst);
          }
        },
      });
    };

    init();

    return () => {
      document.body.style.overflow = '';
      if (ScrollTriggerInst) ScrollTriggerInst.getAll().forEach((t: any) => t.kill());
    };
  }, []);

  const triggerRempahFall = (gsap: any) => {
    // Animasi jatuh yang sangat smooth dengan GSAP (MENGHINDARI JITTER MATTER.JS)
    rempahRefs.current.forEach((el, i) => {
      if (!el) return;
      const pos = SCATTER_POSITIONS[i % SCATTER_POSITIONS.length];
      
      // Fall from above screen
      gsap.fromTo(el, 
        { 
          y: -1500, // Mulai jauh di atas
          xPercent: -50,
          yPercent: -50,
          rotation: pos.rot - 90, 
          scale: pos.scale * 0.8,
          autoAlpha: 1 // Tampilkan saat animasi mulai
        },
        { 
          y: 0, 
          xPercent: -50,
          yPercent: -50,
          rotation: pos.rot,
          scale: pos.scale,
          autoAlpha: 1,
          duration: 2.2, 
          delay: i * 0.1, // Stagger masuk
          ease: 'bounce.out', // Efek jatuh dan memantul alami
          onComplete: () => {
            // Tambahkan animasi melayang idle pelan setelah jatuh
            gsap.to(el, {
              y: '-=15',
              xPercent: -50,
              yPercent: -50,
              rotation: pos.rot + (Math.random() > 0.5 ? 4 : -4),
              duration: 3 + Math.random() * 2,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1
            });
          }
        }
      );
    });
  };

  const unlockAndGoNext = async () => {
    document.body.style.overflow = '';
    const ScrollTrigger = (await import('gsap/ScrollTrigger')).default;
    ScrollTrigger.getAll().forEach((t: any) => {
      if (t.vars.trigger === sectionRef.current) t.kill();
    });
    const nextSection = sectionRef.current?.nextElementSibling;
    if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
  };

  const unlockAndGoPrev = async () => {
    document.body.style.overflow = '';
    const ScrollTrigger = (await import('gsap/ScrollTrigger')).default;
    ScrollTrigger.getAll().forEach((t: any) => {
      if (t.vars.trigger === sectionRef.current) t.kill();
    });
    const prevSection = sectionRef.current?.previousElementSibling;
    if (prevSection) prevSection.scrollIntoView({ behavior: 'smooth' });
  };

  const switchToEncyclopedia = () => {
    setTooltip(p => ({ ...p, visible: false }));
    setMode('encyclopedia');
  };

  // ─── Drag Logic Sederhana ───
  const activeDragIdx = useRef<number | null>(null);
  
  const handlePointerDown = (e: React.PointerEvent, index: number) => {
    if (mode !== 'canvas') return;
    e.stopPropagation();
    activeDragIdx.current = index;
    const el = rempahRefs.current[index];
    if (el) el.style.zIndex = '100';
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (activeDragIdx.current === null || mode !== 'canvas') return;
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
        <div 
          className={styles.canvasMode} 
          style={{ display: mode === 'canvas' ? 'flex' : 'none' }}
        >
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
                    transform: `translate(-50%, -50%) scale(${pos.scale}) rotate(${pos.rot}deg)`,
                    opacity: 0, // Sembunyikan awalnya sebelum jatuh
                    visibility: 'hidden',
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
            <button className={styles.glassBtn} onClick={unlockAndGoPrev}>
              &uarr; Kembali
            </button>
            <button className={styles.glassBtn} onClick={switchToEncyclopedia}>
              Jelajah &#10022;
            </button>
          </div>
        </div>

        {/* ============================
            ENCYCLOPEDIA MODE
            ============================ */}
        <div 
          className={styles.encyclopediaMode}
          style={{ display: mode === 'encyclopedia' ? 'block' : 'none' }}
        >
          <div className={styles.encyclopediaInner}>
            
            <div className={styles.encyclopediaHeader}>
              <button className={styles.glassBtn} onClick={() => setMode('canvas')}>
                &larr; Tutup Ensiklopedia
              </button>
              <div className={styles.encyclopediaTitleGroup}>
                <div className={styles.label}>Ensiklopedi</div>
                <h2 className={styles.encyclopediaTitle}>Rempah Jawa</h2>
              </div>
            </div>

            <div className={styles.encyclopediaGrid}>
              <div className={styles.encyclopediaCol}>
                {rempahData.slice(0, 10).map((r) => (
                  <AccordionRow key={r.id} rempah={r} isExpanded={expandedId === r.id} onToggle={() => setExpandedId(expandedId === r.id ? null : r.id)} />
                ))}
              </div>
              <div className={styles.encyclopediaSeparator} />
              <div className={styles.encyclopediaCol}>
                {rempahData.slice(10, 20).map((r) => (
                  <AccordionRow key={r.id} rempah={r} isExpanded={expandedId === r.id} onToggle={() => setExpandedId(expandedId === r.id ? null : r.id)} />
                ))}
              </div>
            </div>

            <div className={styles.encyclopediaFooter}>
              <p className={styles.pullQuote}>&ldquo;Saka rempah-rempah iki kabeh diwiwiti.&rdquo;</p>
              <button className={styles.glassBtn} onClick={unlockAndGoNext}>
                Lanjutkan Perjalanan &darr;
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

// ─── Accordion Row ───
function AccordionRow({ rempah, isExpanded, onToggle }: { rempah: Rempah; isExpanded: boolean; onToggle: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded]);

  return (
    <div className={styles.accordionRow}>
      <button className={styles.accordionHeader} onClick={onToggle}>
        <div className={styles.accordionIcon}>
          <Image src={rempah.asset} alt="" width={32} height={32} style={{ objectFit: 'contain' }} unoptimized />
        </div>
        <div className={styles.accordionTitleGroup}>
          <span className={styles.accordionName}>{rempah.nama}</span>
          <span className={styles.accordionJawa}>{rempah.namaJawa}</span>
        </div>
        <div className={styles.accordionDashedLine} />
        <span className={`${styles.accordionChevron} ${isExpanded ? styles.chevronOpen : ''}`}>
          &#8964;
        </span>
      </button>

      <div className={styles.accordionContentWrapper} style={{ height: `${height}px` }}>
        <div ref={contentRef} className={styles.accordionContent}>
          <p className={styles.accordionRole}>{rempah.peran}</p>
          <div className={styles.accordionTags}>
            {rempah.makanan.split(',').map((tag, i) => (
              <span key={i} className={styles.foodTag}>{tag.trim()}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
