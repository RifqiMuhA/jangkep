'use client';

import { motion } from 'motion/react';

interface SiPodoProps {
  message: string;
  isWalking?: boolean;
}

export function SiPodo({ message, isWalking = false }: SiPodoProps) {
  return (
    <motion.div
      className="si-podo-container"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300, duration: 0.4 }}
    >
      {/* Si Podo Bird */}
      <motion.div
        animate={isWalking ? { y: [0, -6, 0] } : { y: [0, -3, 0] }}
        transition={{ duration: isWalking ? 0.5 : 1.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: '80px', height: '80px', flexShrink: 0 }}
      >
        <svg width="80" height="80" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Body */}
          <ellipse cx="48" cy="58" rx="22" ry="24" fill="#F5C400" stroke="#3B1F0C" strokeWidth="2"/>
          {/* Head */}
          <circle cx="48" cy="32" r="16" fill="#F5C400" stroke="#3B1F0C" strokeWidth="2"/>
          {/* Blangkon */}
          <path d="M 32 28 Q 32 18 48 18 Q 64 18 64 28 L 60 32 L 36 32 Z" fill="#3B1F0C"/>
          {/* Blangkon detail */}
          <circle cx="56" cy="24" r="2.5" fill="#B8860B"/>
          {/* Eyes */}
          <circle cx="42" cy="32" r="3" fill="#3B1F0C"/>
          <circle cx="54" cy="32" r="3" fill="#3B1F0C"/>
          <circle cx="43" cy="31" r="1.5" fill="white"/>
          <circle cx="55" cy="31" r="1.5" fill="white"/>
          {/* Beak */}
          <path d="M 48 36 L 44 40 L 52 40 Z" fill="#B8860B" stroke="#3B1F0C" strokeWidth="1"/>
          {/* Wings */}
          <ellipse cx="30" cy="56" rx="7" ry="14" fill="#F5C400" stroke="#3B1F0C" strokeWidth="2"/>
          <ellipse cx="66" cy="56" rx="7" ry="14" fill="#F5C400" stroke="#3B1F0C" strokeWidth="2"/>
          {/* Batik Kawung on belly */}
          <ellipse cx="48" cy="72" rx="16" ry="8" fill="#3B1F0C" opacity="0.7"/>
          <circle cx="42" cy="70" r="1.5" fill="#B8860B" opacity="0.6"/>
          <circle cx="48" cy="72" r="1.5" fill="#B8860B" opacity="0.6"/>
          <circle cx="54" cy="70" r="1.5" fill="#B8860B" opacity="0.6"/>
          {/* Feet */}
          <line x1="42" y1="82" x2="38" y2="88" stroke="#B8860B" strokeWidth="2" strokeLinecap="round"/>
          <line x1="42" y1="82" x2="46" y2="88" stroke="#B8860B" strokeWidth="2" strokeLinecap="round"/>
          <line x1="54" y1="82" x2="50" y2="88" stroke="#B8860B" strokeWidth="2" strokeLinecap="round"/>
          <line x1="54" y1="82" x2="58" y2="88" stroke="#B8860B" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </motion.div>

      {/* Dialog Bubble */}
      <motion.div
        className="si-podo-bubble"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <p style={{
          fontFamily: 'var(--font-dm-sans)',
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--color-coklat-batik)',
          lineHeight: 1.5,
          margin: 0,
        }}>
          {message}
        </p>
      </motion.div>
    </motion.div>
  );
}
