'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import type { Food } from '../data/foods';
import { kulinerData } from '../../../data/kulinerData';

interface StoryPanelProps {
  food: Food | null;
  onClose: () => void;
  onFoodSelect: (foodId: string) => void;
  allFoods: Food[];
}

/* Taste profile badge colors */
const flavorBadges: Record<string, { bg: string; text: string; border: string }> = {
  Manis: { bg: 'rgba(211, 84, 0, 0.08)', text: '#D35400', border: 'rgba(211, 84, 0, 0.3)' },
  Gurih: { bg: 'rgba(39, 174, 96, 0.08)', text: '#27AE60', border: 'rgba(39, 174, 96, 0.3)' },
  Pedas: { bg: 'rgba(192, 41, 43, 0.08)', text: '#C0392B', border: 'rgba(192, 41, 43, 0.3)' },
  Segar: { bg: 'rgba(41, 128, 185, 0.08)', text: '#2980B9', border: 'rgba(41, 128, 185, 0.3)' },
  Legit: { bg: 'rgba(142, 68, 173, 0.08)', text: '#8E44AD', border: 'rgba(142, 68, 173, 0.3)' },
};

export function StoryPanel({ food, onClose, onFoodSelect, allFoods }: StoryPanelProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!food) return null;

  // 1. Fetch detailed history from our master data bank
  const kulinerItem = kulinerData.find(k => k.slug === food.id);
  const historyParagraphs = kulinerItem && kulinerItem.historyTimeline
    ? kulinerItem.historyTimeline.slice(0, 3).map(h => h.description)
    : [food.story];

  // 2. Fetch related foods from the same city
  let relatedFoods = allFoods
    .filter(f => f.city === food.city && f.id !== food.id)
    .slice(0, 3);

  return (
    <motion.div
      className="story-panel"
      initial={{ 
        x: isMobile ? 0 : 390, 
        y: isMobile ? 600 : 0, 
        opacity: 0 
      }}
      animate={{ 
        x: 0, 
        y: 0, 
        opacity: 1 
      }}
      exit={{ 
        x: isMobile ? 0 : 390, 
        y: isMobile ? 600 : 0, 
        opacity: 0 
      }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        right: 0,
        top: isMobile ? 'auto' : '65px',
        bottom: 0,
        zIndex: 45,
        width: isMobile ? '100%' : '390px',
        height: isMobile ? '70vh' : 'calc(100vh - 65px)',
        borderRadius: isMobile ? '24px 24px 0 0' : '0',
        backgroundColor: '#F2EAD3',
        backgroundImage: 'linear-gradient(rgba(242, 234, 211, 0.95), rgba(242, 234, 211, 0.95)), url("/batik/pattern_background.webp")',
        backgroundSize: 'cover',
        backgroundBlendMode: 'overlay',
        borderLeft: isMobile ? 'none' : '2px solid rgba(210, 195, 170, 0.5)',
        borderTop: isMobile ? '2px solid rgba(210, 195, 170, 0.5)' : 'none',
        boxShadow: isMobile ? '0 -10px 30px rgba(0, 0, 0, 0.2)' : '-10px 0 30px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        pointerEvents: 'auto' // Re-enable pointer events so it can be scrolled and clicked
      }}
    >
      {/* Close Button */}
      <button className="story-panel-close" onClick={onClose}>
        <X size={18} />
      </button>

      {/* Hero Image (Full Width) */}
      <div className="story-panel-hero" style={{ height: isMobile ? '200px' : '280px', flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={food.image} alt={food.name} />
        <div className="story-panel-hero-overlay" />
        <div className="story-panel-city">
          <MapPin size={14} style={{ color: 'var(--color-emas-keris)' }} />
          {food.city}
        </div>
      </div>

      {/* Content Container (Scrollable) */}
      <div 
        data-lenis-prevent="true"
        style={{
          padding: '24px 28px 110px 28px', // Bottom padding to prevent overlap with docked CTA
          overflowY: 'auto',
          flex: 1,
          minHeight: 0,
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(59, 31, 12, 0.2) transparent',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        
        {/* Food Name Header */}
        <div>
          <h2 style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: '30px',
            fontWeight: 800,
            color: '#3B1F0C',
            lineHeight: 1.2,
            margin: '0 0 6px 0',
          }}>
            {food.name}
          </h2>
          {kulinerItem?.historyTimeline?.[0]?.aksara && (
            <div style={{
              fontFamily: '"Noto Sans Javanese", sans-serif',
              fontSize: '18px',
              color: 'var(--color-emas-keris)',
              opacity: 0.85,
              marginTop: '4px'
            }}>
              {kulinerItem.historyTimeline[0].aksara}
            </div>
          )}
        </div>

        {/* Narrative (2-3 paragraphs from master timeline data) in DM Sans */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {historyParagraphs.map((para, idx) => (
            <p
              key={idx}
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '14px',
                color: '#4A3A31',
                lineHeight: 1.65,
                margin: 0,
                textAlign: 'justify'
              }}
            >
              {para}
            </p>
          ))}
        </div>

        {/* Flavor Badge */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '12px', fontWeight: 600, color: 'rgba(59, 31, 12, 0.6)' }}>
            Profil Rasa:
          </span>
          {food.flavors.map((flavor) => {
            const styleTheme = flavorBadges[flavor] || flavorBadges.Gurih;
            return (
              <span
                key={flavor}
                style={{
                  height: '28px',
                  padding: '0 14px',
                  borderRadius: '99px',
                  backgroundColor: styleTheme.bg,
                  color: styleTheme.text,
                  border: `1.5px solid ${styleTheme.border}`,
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {flavor}
              </span>
            );
          })}
        </div>

        {/* Nama Kota Asal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(59, 31, 12, 0.04)', border: '1px solid rgba(59, 31, 12, 0.08)' }}>
          <MapPin size={16} style={{ color: 'var(--color-emas-keris)', flexShrink: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', color: 'rgba(59, 31, 12, 0.5)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Daerah Asal</span>
            <span style={{ fontFamily: 'var(--font-playfair)', fontSize: '15px', color: '#3B1F0C', fontWeight: 700 }}>{food.city}, Jawa Tengah</span>
          </div>
        </div>

        {/* Related Foods (Other foods from the same city) */}
        {relatedFoods.length > 0 && (
          <div>
            <h4 style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              color: 'rgba(59, 31, 12, 0.5)',
              marginBottom: '12px'
            }}>
              Kuliner Khas {food.city} Lainnya
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {relatedFoods.map(rf => (
                <div key={rf.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    padding: '10px', 
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.5)',
                    border: '1.5px solid rgba(184, 134, 11, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => onFoodSelect(rf.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.border = '1.5px solid var(--color-emas-keris)';
                    e.currentTarget.style.background = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.border = '1.5px solid rgba(184, 134, 11, 0.1)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                  }}
                >
                  <img src={rf.image} alt={rf.name} style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '14px', fontWeight: 700, color: '#3B1F0C' }}>{rf.name}</div>
                    <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', color: 'rgba(59, 31, 12, 0.6)' }}>{rf.category} • {rf.flavors.join(', ')}</div>
                  </div>
                  <ArrowRight size={14} style={{ color: 'var(--color-emas-keris)' }} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* CTA Button (Border Emas Keris) */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px 24px',
        height: '84px',
        background: 'rgba(242, 234, 211, 0.95)',
        backdropFilter: 'blur(8px)',
        borderTop: '1.5px solid rgba(59, 31, 12, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5
      }}>
        <Link href={`/kuliner/katalog/${food.id}`} style={{ textDecoration: 'none', width: '100%' }}>
          <button
            className="story-panel-cta-btn"
            style={{
              width: '100%',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              background: 'transparent',
              border: '2px solid var(--color-emas-keris)',
              color: '#3B1F0C',
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              borderRadius: '99px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-emas-keris)';
              e.currentTarget.style.color = '#3B1F0C';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#3B1F0C';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Lihat Resep Lengkap
            <ArrowRight size={16} />
          </button>
        </Link>
      </div>
    </motion.div>
  );
}
