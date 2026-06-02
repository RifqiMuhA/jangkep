'use client';

import { Pause, Play, X } from 'lucide-react';
import { motion } from 'motion/react';

interface AutoJourneyProgressProps {
  currentIndex: number;
  total: number;
  isPaused: boolean;
  onPauseToggle: () => void;
  onStop: () => void;
}

export function AutoJourneyProgress({
  currentIndex,
  total,
  isPaused,
  onPauseToggle,
  onStop,
}: AutoJourneyProgressProps) {
  return (
    <>
      {/* Subtle dark overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 25,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(59, 31, 12, 0.15) 100%)',
      }} />

      {/* Progress Bar */}
      <motion.div
        className="auto-journey-bar"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
      >
        {/* Pause/Resume */}
        <button
          onClick={onPauseToggle}
          style={{
            width: '28px',
            height: '28px',
            background: 'transparent',
            border: 'none',
            color: 'var(--color-kuning-kepodang)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {isPaused ? <Play size={18} fill="currentColor" /> : <Pause size={18} fill="currentColor" />}
        </button>

        {/* Progress Dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'center' }}>
          {Array.from({ length: total }).map((_, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                width: index === currentIndex ? '10px' : '6px',
                height: index === currentIndex ? '10px' : '6px',
                borderRadius: '50%',
                backgroundColor: index <= currentIndex
                  ? 'var(--color-kuning-kepodang)'
                  : 'var(--color-krem-tua)',
                transition: 'all 0.3s ease',
                boxShadow: index === currentIndex ? '0 0 8px rgba(245, 196, 0, 0.6)' : 'none',
              }}
            >
              {index === currentIndex && (
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: '-3px',
                    borderRadius: '50%',
                    border: '1.5px solid var(--color-kuning-kepodang)',
                  }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Stop */}
        <button
          onClick={onStop}
          style={{
            width: '28px',
            height: '28px',
            background: 'transparent',
            border: 'none',
            color: 'var(--color-coklat-batik)',
            opacity: 0.5,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <X size={18} />
        </button>
      </motion.div>
    </>
  );
}
