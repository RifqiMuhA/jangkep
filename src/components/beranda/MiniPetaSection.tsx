'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { kotaData, type KotaData } from '@/data/peta';
import styles from './MiniPetaSection.module.css';

const PROVINCE_PATH =
  'M 50,200 C 80,150 120,120 180,100 C 250,80 320,70 400,90 C 460,100 520,120 580,150 C 620,170 650,200 660,240 C 650,290 620,330 570,350 C 520,360 460,350 400,340 C 340,330 280,310 220,290 C 160,270 100,250 70,230 Z';

export default function MiniPetaSection() {
  const [activeCity, setActiveCity] = useState<KotaData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const handleDotEnter = useCallback(
    (city: KotaData) => {
      if (!svgRef.current) return;

      const svgRect = svgRef.current.getBoundingClientRect();
      const viewBoxWidth = 700;
      const viewBoxHeight = 400;

      // Convert SVG viewBox coords to pixel coords relative to the container
      const xPx = (city.cx / viewBoxWidth) * svgRect.width;
      const yPx = (city.cy / viewBoxHeight) * svgRect.height;

      setTooltipPos({ x: xPx, y: yPx - 12 });
      setActiveCity(city);
    },
    [],
  );

  const handleDotLeave = useCallback(() => {
    setActiveCity(null);
  }, []);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Jelajahi Rasa Jawa Tengah</h2>
      <p className={styles.subtitle}>
        Hover peta untuk melihat makanan khas setiap kota
      </p>

      <div className={styles.mapContainer}>
        <svg
          ref={svgRef}
          className={styles.mapSvg}
          viewBox="0 0 700 400"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Peta sederhana Jawa Tengah"
        >
          {/* Province outline */}
          <path d={PROVINCE_PATH} className={styles.provincePath} />

          {/* City dots */}
          {kotaData.map((city) => (
            <g
              key={city.id}
              onMouseEnter={() => handleDotEnter(city)}
              onMouseLeave={handleDotLeave}
              onFocus={() => handleDotEnter(city)}
              onBlur={handleDotLeave}
              tabIndex={0}
              role="button"
              aria-label={`${city.nama} — ${city.makananKhas}`}
            >
              {/* Invisible larger hit area */}
              <circle
                cx={city.cx}
                cy={city.cy}
                r={22}
                className={styles.cityHitArea}
              />
              {/* Visible dot */}
              <circle
                cx={city.cx}
                cy={city.cy}
                r={10}
                className={styles.cityDot}
              />
            </g>
          ))}
        </svg>

        {/* Tooltip */}
        <div
          className={`${styles.tooltip} ${
            activeCity ? styles.tooltipVisible : styles.tooltipHidden
          }`}
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: 'translate(-50%, -100%)',
          }}
          aria-hidden={!activeCity}
        >
          {activeCity && (
            <>
              <Image
                className={styles.tooltipImage}
                src={activeCity.image}
                alt={activeCity.makananKhas}
                width={40}
                height={40}
              />
              <span className={styles.tooltipName}>{activeCity.nama}</span>
              <span className={styles.tooltipFood}>{activeCity.makananKhas}</span>
            </>
          )}
        </div>
      </div>

      <div className={styles.ctaRow}>
        <Link href="/maps" className={styles.ghostButton}>
          Jelajahi Peta Lengkap
        </Link>
      </div>
    </section>
  );
}
