'use client';

import React, { useState, useEffect } from 'react';
import AccordionModal from '@/components/AccordionModal';
import { BatikButton } from './BatikButton';
import '../maps.css';

interface Chapter {
  id: string;
  title: string;
  javaneseTitle?: string;
  subtitle: string;
  javaneseSubtitle?: string;
  description: string;
  javaneseDescription?: string;
  location: {
    center: [number, number];
    zoom: number;
    pitch: number;
    bearing: number;
  };
  alignment: 'center' | 'left' | 'right';
  label?: string;
}

interface ChapterCardProps {
  chapter: Chapter;
  isActive: boolean;
  isFirst: boolean;
  isLast: boolean;
  peekingFrame: number;
  galleries: any[];
  activeFoodItem: any;
  onFoodChange: (item: any) => void;
  onExploreStart: () => void;
}

export default function ChapterCard({
  chapter,
  isActive,
  isFirst,
  isLast,
  peekingFrame,
  galleries,
  activeFoodItem,
  onFoodChange,
  onExploreStart,
}: ChapterCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (isActive) {
      // Start the timer to swap cards when it becomes active (2 seconds)
      const timer = setTimeout(() => {
        setIsRevealed(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      // Reset when not active
      setIsRevealed(false);
    }
  }, [isActive]);

  const toggleSwap = (e: React.MouseEvent) => {
    // Don't flip if clicking on accordion or buttons
    if ((e.target as HTMLElement).closest('.accordion-modal, button')) {
      return;
    }
    setIsRevealed(prev => !prev);
  };

  const hasJavanese = !!chapter.javaneseTitle;

  // The content parts
  const currentTitle = activeFoodItem ? activeFoodItem.title : chapter.title;
  const currentJavaneseTitle = activeFoodItem ? chapter.javaneseTitle : chapter.javaneseTitle; // Fallback if no specific javanese food name
  const currentSubtitle = activeFoodItem
    ? `${activeFoodItem.title} • ${activeFoodItem.subtitle}`
    : chapter.subtitle;
  const currentJavaneseSubtitle = chapter.javaneseSubtitle;
  const currentDesc = activeFoodItem ? activeFoodItem.description : chapter.description;
  const currentJavaneseDesc = chapter.javaneseDescription;

  let alignClass = 'chapter-center';
  if (chapter.alignment === 'left') alignClass = 'chapter-left';
  if (chapter.alignment === 'right') alignClass = 'chapter-right';

  return (
    <div className={`chapter-content-wrapper ${alignClass}`} style={{ position: 'relative' }}>
      {isFirst && (
        <div className="si-podo-peeking-card">
          <img src={`/kuliner/mascot_ngintip_${peekingFrame}.webp`} alt="Si Podo Ngintip" />
        </div>
      )}

      {/* STACK CONTAINER */}
      <div 
        className="card-stack-container" 
        onClick={toggleSwap}
        style={{
          opacity: isActive ? 1 : 0.4,
          transform: isActive ? 'scale(1)' : 'scale(0.95)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          cursor: 'pointer'
        }}
      >
        {/* CARD 1: JAVANESE (Dark Theme) */}
        {hasJavanese && !isLast && (
          <div className={`web-story-card theme-dark-jawa ${isRevealed ? 'is-revealed' : ''}`}>
            {/* Ornaments */}
            <img src="/motif/dekor_header_bawah.webp" alt="" className="ornament-top-center" />
            <img src="/motif/motif_kiri_buku.webp" alt="" className="ornament-bottom-right" />
            
            <h2 className="story-title javanese-text" style={{ whiteSpace: 'pre-line' }}>
              {currentJavaneseTitle || currentTitle}
            </h2>

            {galleries && galleries.length > 0 && (
              <AccordionModal
                items={galleries}
                onChangeActive={onFoodChange}
              />
            )}

            <h3 className="story-subtitle javanese-text">
              {currentJavaneseSubtitle || currentSubtitle}
            </h3>

            <p className="story-description javanese-text">
              {currentJavaneseDesc || currentDesc}
            </p>
          </div>
        )}

        {/* CARD 2: INDONESIAN (Light Theme) */}
        <div className={`web-story-card ${isLast ? 'epilogue-card' : ''} ${hasJavanese && !isLast ? 'theme-light-indo' : ''} ${hasJavanese && isRevealed ? 'is-revealed' : ''}`}>
          {hasJavanese && !isLast && (
            <>
              {/* Ornaments */}
              <img src="/motif/dekor_header_bawah.webp" alt="" className="ornament-top-center" />
              <img src="/motif/motif_kiri_buku.webp" alt="" className="ornament-bottom-right" />
            </>
          )}

          {isFirst && (
            <>
              <img src="/motif/dekor_header_atas.webp" alt="" className="ornament-bottom-center-dekor" />
            </>
          )}

          {isLast && (
            <img 
              src="/kuliner/podo_mam_kerupuk_1.webp" 
              alt="Si Podo Duduk" 
              className="podo-epilogue-sitting"
            />
          )}

          <h2 className="story-title" style={{ whiteSpace: 'pre-line' }}>
            {chapter.title}
          </h2>

          {galleries && galleries.length > 0 && (
            <AccordionModal
              items={galleries}
              onChangeActive={onFoodChange}
            />
          )}

          <h3 className="story-subtitle">
            {currentSubtitle}
          </h3>

          <p className="story-description">
            {currentDesc}
          </p>

          {isLast && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.6s ease',
                marginTop: '40px'
              }}
            >
              <BatikButton
                javaneseText="ꦩꦸꦭꦻꦌꦏ꧀ꦱ꧀ꦥ꧀ꦭꦺꦴꦫꦱꦶ"
                latinText="Mulai Eksplorasi Peta"
                onClick={onExploreStart}
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
