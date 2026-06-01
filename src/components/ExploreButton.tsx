'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { NoiseBackground } from '@/components/ui/noise-background';
import styles from './ExploreButton.module.css';

interface ExploreButtonProps {
  href: string;
  text?: string;
  textDesktop?: string;
  textTablet?: string;
  textMobile?: string;
  className?: string;
  hideMotif?: boolean;
}

export const ExploreButton: React.FC<ExploreButtonProps> = ({
  href,
  text,
  textDesktop,
  textTablet,
  textMobile,
  className,
  hideMotif = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={href} style={{ textDecoration: 'none' }} className={className}>
      <div
        style={{
          position: 'relative',
          display: 'inline-flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '60px',
          marginBottom: '80px',
          gap: '24px' // Jarak antara motif dan tombol
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Motif Kiri */}
        {!hideMotif && (
          <div style={{ position: 'relative', width: '80px', height: '130px', flexShrink: 0, opacity: 0.8 }}>
            <Image src="/motif/motif_button_kiri.webp" alt="Motif Kiri" fill style={{ objectFit: 'contain' }} unoptimized />
          </div>
        )}

        {/* Sub-container untuk tombol dan aksara */}
        <div style={{ position: 'relative', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* Aksara Atas (Jelajah) - Digeser agak ke kiri */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ y: 0, x: 0, opacity: 0 }}
                animate={{ y: -45, x: -60, opacity: 1 }}
                exit={{ y: 0, x: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  fontSize: '1.8rem',
                  color: 'var(--color-kuning-kepodang, #EBAC00)',
                  zIndex: 0,
                  letterSpacing: '4px',
                  fontWeight: 'bold',
                  textShadow: '0px 2px 10px rgba(235, 172, 0, 0.4)'
                }}
              >
                ꦗꦼꦭꦗꦃ
              </motion.div>
            )}
          </AnimatePresence>

          {/* Noise Background Container */}
          <div style={{ position: 'relative', zIndex: 10 }}>
            <NoiseBackground
              gradientColors={[
                "rgba(235, 172, 0, 0.9)", // EBAC00
                "rgba(200, 140, 0, 0.8)",
                "rgba(255, 200, 50, 0.9)"
              ]}
              noiseIntensity={0.5}
              speed={0.05} // Kecepatan cahaya di balik batik
            >
              <button
                style={{
                  height: '100%',
                  width: '100%',
                  cursor: 'pointer',
                  borderRadius: '50px',
                  background: 'linear-gradient(to right, #ffffff, #fdf8e8)',
                  padding: '16px 48px',
                  color: '#1a1a1a',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  border: 'none',
                  boxShadow: '0px 2px 0px 0px rgba(255,255,255,1) inset, 0px 0.5px 2px 0px rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Jika menggunakan responsive props */}
                {(textDesktop || textTablet || textMobile) ? (
                  <>
                    <span className={styles.textDesktop}>{textDesktop || text}</span>
                    <span className={styles.textTablet}>{textTablet || textDesktop || text}</span>
                    <span className={styles.textMobile}>{textMobile || textTablet || textDesktop || text}</span>
                  </>
                ) : (
                  <span>{text}</span>
                )}
                <svg
                  width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{
                    transform: isHovered ? 'translateX(6px)' : 'translateX(0)',
                    transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </NoiseBackground>
          </div>

          {/* Aksara Bawah (Kuliner) - Digeser agak ke kanan */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ y: 0, x: 0, opacity: 0 }}
                animate={{ y: 45, x: 60, opacity: 1 }}
                exit={{ y: 0, x: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  fontSize: '1.8rem',
                  color: 'var(--color-kuning-kepodang, #EBAC00)',
                  zIndex: 0,
                  letterSpacing: '4px',
                  fontWeight: 'bold',
                  textShadow: '0px 2px 10px rgba(235, 172, 0, 0.4)'
                }}
              >
                ꦏꦸꦭꦶꦤꦼꦂ
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Motif Kanan */}
        {!hideMotif && (
          <div style={{ position: 'relative', width: '80px', height: '130px', flexShrink: 0, opacity: 0.8 }}>
            <Image src="/motif/motif_button_kanan.webp" alt="Motif Kanan" fill style={{ objectFit: 'contain' }} unoptimized />
          </div>
        )}
      </div>
    </Link>
  );
};
