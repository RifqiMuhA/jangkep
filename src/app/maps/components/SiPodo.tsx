'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SiPodoProps {
  // props removed as we render the legend internally
  isWalking?: boolean;
  message?: string;
  style?: React.CSSProperties;
}

// Komponen Isi Legend
const LegendContent = ({ isJawa }: { isJawa: boolean }) => (
  <div style={{ textAlign: 'left', fontFamily: isJawa ? '"Noto Sans Javanese", sans-serif' : 'var(--font-inter)' }}>
    <div style={{ fontWeight: 800, fontSize: isJawa ? '15px' : '13px', marginBottom: '12px', letterSpacing: '1.5px', color: '#3B1F0C', borderBottom: '1px solid rgba(59, 31, 12, 0.1)', paddingBottom: '8px' }}>
      {isJawa ? 'ꦏꦠꦿꦔꦤ꧀' : 'KETERANGAN'}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
      <svg viewBox="0 0 24 24" width="18" height="18" style={{ transform: 'rotate(45deg)', flexShrink: 0 }}>
        <ellipse cx="12" cy="7" rx="3.5" ry="5.5" fill="#3B1F0C" stroke="#B8860B" strokeWidth="1.5" />
        <ellipse cx="12" cy="17" rx="3.5" ry="5.5" fill="#3B1F0C" stroke="#B8860B" strokeWidth="1.5" />
        <ellipse cx="7" cy="12" rx="5.5" ry="3.5" fill="#3B1F0C" stroke="#B8860B" strokeWidth="1.5" />
        <ellipse cx="17" cy="12" rx="5.5" ry="3.5" fill="#3B1F0C" stroke="#B8860B" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="2.5" fill="#F5C400" stroke="#3B1F0C" strokeWidth="0.8" />
      </svg>
      <span style={{ fontSize: isJawa ? '15px' : '13px', fontWeight: 600, color: '#3B1F0C' }}>
        {isJawa ? 'ꦥꦶꦤ꧀ꦏꦸꦭꦶꦤꦼꦂ' : 'Pin Kuliner'}
      </span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-kuning-kepodang), var(--color-emas-keris))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#3B1F0C', fontWeight: 'bold', flexShrink: 0 }}>3</div>
      <span style={{ fontSize: isJawa ? '15px' : '13px', fontWeight: 600, color: '#3B1F0C' }}>
        {isJawa ? 'ꦩꦸꦭ꧀ꦠꦶꦏꦸꦭꦶꦤꦼꦂ' : 'Multi Kuliner'}
      </span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#F5C400', boxShadow: '0 0 8px rgba(245, 196, 0, 0.8)', flexShrink: 0 }} />
      <span style={{ fontSize: isJawa ? '15px' : '13px', fontWeight: 600, color: '#3B1F0C' }}>
        {isJawa ? 'ꦄꦏ꧀ꦠꦶꦥ꦳꧀' : 'Aktif'}
      </span>
    </div>
  </div>
);

export function SiPodo({ isWalking = false, style }: SiPodoProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Default: Jawa (Batik), Hover: Indo (Polos)
  const isJawa = !isHovered;

  return (
    <motion.div
      className="si-podo-container"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300, duration: 0.4 }}
      style={{
        position: 'absolute',
        bottom: '32px',
        left: '32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        zIndex: 100,
        pointerEvents: 'auto',
        cursor: 'pointer',
        ...style
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dialog Bubble (Legend) */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        style={{
          background: isJawa ? '#FFFFFF' : 'var(--color-putih-santan, #F8F5E9)',
          border: '1px solid #B8860B',
          padding: '16px 20px',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          width: '210px',
          height: '150px',
          position: 'relative',
          marginBottom: '20px',
          transition: 'all 0.4s ease',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isJawa ? 'jawa' : 'indo'}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <LegendContent isJawa={isJawa} />
          </motion.div>
        </AnimatePresence>
        
        {/* Thought bubble dots (Tail) - Posisi diarahkan tepat ke kepala Si Podo */}
        <div style={{ position: 'absolute', bottom: '-16px', left: '50%', transform: 'translateX(-50%)', width: '12px', height: '12px', borderRadius: '50%', background: isJawa ? '#FFFFFF' : 'var(--color-putih-santan, #F8F5E9)', border: '1px solid #B8860B', transition: 'all 0.4s ease' }} />
        <div style={{ position: 'absolute', bottom: '-28px', left: '46%', transform: 'translateX(-50%)', width: '8px', height: '8px', borderRadius: '50%', background: isJawa ? '#FFFFFF' : 'var(--color-putih-santan, #F8F5E9)', border: '1px solid #B8860B', transition: 'all 0.4s ease' }} />
      </motion.div>

      {/* Wrapper untuk Maskot */}
      <div style={{ position: 'relative' }}>
        {/* Si Podo Bird Image - STATIS, tanpa bergerak */}
        <div style={{ width: '140px', height: '140px', flexShrink: 0, position: 'relative', zIndex: 5 }}>
          <img src="/sipodo/jelajah.webp" alt="Si Podo Mascot" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
      </div>
    </motion.div>
  );
}
