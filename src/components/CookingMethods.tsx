'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CookingMethods.module.css';

interface InstructionStep {
  action: string;
  description: string;
}

interface CookingMethodsProps {
  instructions: InstructionStep[];
}

export default function CookingMethods({ instructions }: CookingMethodsProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!instructions || instructions.length === 0) return null;

  const currentStep = instructions[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < instructions.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // Convert step action to lowercase to match image filenames securely
  const actionKey = currentStep.action.toLowerCase();

  return (
    <section className={styles.container}>
      {/* Hanging Header */}
      <motion.div 
        className={styles.hangingHeaderContainer}
        initial={{ y: "-100%", opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ 
          type: "spring", 
          damping: 10, 
          stiffness: 100, 
          duration: 1.5,
          delay: 0.2 
        }}
      >
        <div className={styles.hangingHeaderWrapper}>
          <Image 
            src="/kuliner/methods/background_header.webp"
            alt="Papan Gantung Header"
            fill
            className={styles.hangingHeaderImage}
            unoptimized
          />
          <h2 className={styles.hangingHeaderText}>Cara Memasak</h2>
        </div>
      </motion.div>

      {/* Background Illustration */}
      <div className={styles.backgroundWrapper}>
        <Image 
          src="/kuliner/methods/background_methods.webp" 
          alt="Dapur Tradisional Jawa" 
          fill 
          sizes="100vw"
          className={styles.backgroundImage}
          priority
          unoptimized
        />
        {/* Gradient transition to dark brown at the bottom of the image */}
        <div className={styles.backgroundFade}></div>
      </div>

      {/* Mascot Layer */}
      <div className={styles.mascotWrapper}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ width: '100%', height: '100%', position: 'relative' }}
          >
            <Image 
              src={`/kuliner/methods/${actionKey}_mascot.webp`}
              alt={`Si Podo - ${currentStep.action}`}
              fill
              sizes="100vw"
              className={styles.mascotImage}
              unoptimized
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Interactive Board Layer */}
      <div className={styles.boardContainer}>
        {/* Desktop Left Navigation Button */}
        <button 
          className={`${styles.navButton} ${styles.desktopNav}`}
          onClick={handlePrev} 
          disabled={currentStepIndex === 0}
          aria-label="Langkah Sebelumnya"
        >
          <Image src="/kuliner/methods/tombol_kiri.webp" alt="Kiri" fill sizes="80px" unoptimized />
        </button>

        {/* Board Content */}
        <div className={styles.boardImageWrapper}>
          {/* We use standard image for desktop to preserve perfect aspect ratio */}
          <Image 
            src="/kuliner/methods/background_papan.webp" 
            alt="Papan Instruksi" 
            fill 
            sizes="(max-width: 1024px) 95vw, 700px"
            className={styles.boardBackground} 
            unoptimized 
          />
          
          <div className={styles.boardContent}>
            
            <div className={styles.textContent}>
              <div className={styles.headerRow}>
                <div className={styles.stepIndicator}>
                  {currentStepIndex + 1}
                </div>
                <h3 className={styles.stepTitle}>{currentStep.action}</h3>
              </div>
              <div className={styles.divider}></div>
              <p className={styles.stepDescription}>{currentStep.description}</p>
            </div>

            <div className={styles.iconWrapper}>
              <Image 
                src={`/kuliner/methods/${actionKey}.webp`}
                alt={currentStep.action}
                fill
                sizes="160px"
                className={styles.actionIcon}
                unoptimized
              />
            </div>
            
          </div>
        </div>

        {/* Desktop Right Navigation Button */}
        <button 
          className={`${styles.navButton} ${styles.desktopNav}`}
          onClick={handleNext} 
          disabled={currentStepIndex === instructions.length - 1}
          aria-label="Langkah Selanjutnya"
        >
          <Image src="/kuliner/methods/tombol_kanan.webp" alt="Kanan" fill sizes="80px" unoptimized />
        </button>
      </div>

      {/* Navigation Controls (Buttons + Dots) */}
      <div className={styles.navigationControls}>
        {/* Mobile Left Navigation Button */}
        <button 
          className={`${styles.navButton} ${styles.mobileNav}`}
          onClick={handlePrev} 
          disabled={currentStepIndex === 0}
          aria-label="Langkah Sebelumnya"
        >
          <Image src="/kuliner/methods/tombol_kiri.webp" alt="Kiri" fill sizes="50px" unoptimized />
        </button>

        <div className={styles.paginationDots}>
          {instructions.map((_, index) => (
            <div 
              key={index} 
              className={`${styles.dot} ${index === currentStepIndex ? styles.dotActive : ''}`}
              onClick={() => setCurrentStepIndex(index)}
              style={{ cursor: 'pointer' }}
            ></div>
          ))}
        </div>

        {/* Mobile Right Navigation Button */}
        <button 
          className={`${styles.navButton} ${styles.mobileNav}`}
          onClick={handleNext} 
          disabled={currentStepIndex === instructions.length - 1}
          aria-label="Langkah Selanjutnya"
        >
          <Image src="/kuliner/methods/tombol_kanan.webp" alt="Kanan" fill sizes="50px" unoptimized />
        </button>
      </div>
    </section>
  );
}
