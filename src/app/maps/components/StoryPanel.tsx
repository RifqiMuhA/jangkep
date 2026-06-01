'use client';

import { X, ArrowRight, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import type { Food } from '../data/foods';

interface StoryPanelProps {
  food: Food | null;
  onClose: () => void;
  onFoodSelect: (foodId: string) => void;
  allFoods: Food[];
}

/* Flavor badge class mapping */
const flavorClass: Record<string, string> = {
  Manis: 'manis',
  Gurih: 'gurih',
  Pedas: 'pedas',
  Segar: 'segar',
  Legit: 'legit',
};

/* Flavor emoji (removed as per design) */
const flavorEmoji: Record<string, string> = {
  Manis: '',
  Gurih: '',
  Pedas: '',
  Segar: '',
  Legit: '',
};

export function StoryPanel({ food, onClose, onFoodSelect, allFoods }: StoryPanelProps) {
  if (!food) return null;

  const relatedFoods = food.relatedFoods
    ? allFoods.filter((f) => food.relatedFoods?.includes(f.id))
    : [];

  return (
    <motion.div
      className="story-panel"
      initial={{ x: 420, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 420, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Close Button */}
      <button className="story-panel-close" onClick={onClose}>
        <X size={16} />
      </button>

      {/* Hero Image */}
      <div className="story-panel-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={food.image} alt={food.name} />
        <div className="story-panel-hero-overlay" />
        <div className="story-panel-city">
          <MapPin size={10} />
          {food.city}
        </div>
      </div>

      {/* Content */}
      <div style={{
        padding: '24px',
        overflowY: 'auto',
        height: 'calc(100% - 240px - 80px)',
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--color-krem-tua) transparent',
      }}>
        {/* Food Name */}
        <h2 style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: '32px',
          fontWeight: 700,
          color: '#3B1F0C',
          lineHeight: 1.25,
          margin: '0 0 16px 0',
        }}>
          {food.name}
        </h2>

        {/* Flavor Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
          {food.flavors.map((flavor) => (
            <span key={flavor} className={`flavor-badge ${flavorClass[flavor] || 'gurih'}`}>
              {flavor}
            </span>
          ))}
        </div>

        {/* Decorative divider */}
        <div style={{
          width: '40px',
          height: '3px',
          borderRadius: '2px',
          background: 'linear-gradient(90deg, var(--color-kuning-kepodang), var(--color-emas-keris))',
          marginBottom: '20px',
        }} />

        {/* Story */}
        <p style={{
          fontFamily: 'var(--font-dm-sans)',
          fontSize: '15px',
          color: '#4A3A31',
          lineHeight: 1.8,
          letterSpacing: '0',
          margin: 0,
        }}>
          {food.story}
        </p>


      </div>

      {/* CTA Button */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px 24px',
        height: '80px',
        background: 'rgba(248, 243, 230, 0.95)',
        backdropFilter: 'blur(8px)',
        borderTop: '1px solid rgba(210, 195, 170, 0.5)',
      }}>
        <button className="story-panel-cta">
          Lihat Resep Lengkap
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}
