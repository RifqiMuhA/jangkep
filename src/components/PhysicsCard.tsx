'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import styles from '@/app/kuliner/katalog/katalog.module.css';
import { KulinerItem } from '@/data/kulinerData';

interface PhysicsCardProps {
  item: KulinerItem;
  containerRef: React.RefObject<HTMLDivElement | null>;
  initialPosition: { x: number; y: number; rotation: number };
}

export const PhysicsCard: React.FC<PhysicsCardProps> = ({ item, containerRef, initialPosition }) => {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    // Prevent routing if the user was just dragging the card
    if (isDragging) {
      e.preventDefault();
      return;
    }
    router.push(`/kuliner/katalog/${item.slug}`);
  };

  return (
    <motion.div
      drag
      dragConstraints={containerRef}
      dragElastic={0.2}
      dragTransition={{ bounceStiffness: 400, bounceDamping: 25 }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(e, info) => {
        // Only consider it a drag if moved significantly
        if (Math.abs(info.offset.x) > 5 || Math.abs(info.offset.y) > 5) {
          setTimeout(() => setIsDragging(false), 100);
        } else {
          setIsDragging(false);
        }
      }}
      onClick={handleClick}
      initial={{ 
        x: initialPosition.x, 
        y: initialPosition.y, 
        rotate: initialPosition.rotation,
        scale: 0 
      }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1, zIndex: 100, rotate: 0 }}
      whileTap={{ scale: 0.95, zIndex: 100 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={styles.physicsCard}
      style={{
        zIndex: Math.floor(Math.random() * 50) + 10,
      }}
    >
      <div className={styles.physicsImageWrapper}>
        <Image 
          src={item.galleryImages[0]} 
          alt={item.name} 
          fill 
          sizes="180px"
          className={styles.physicsImage} 
          unoptimized={true}
          draggable={false}
        />
      </div>
      <h3 className={styles.physicsTitle}>{item.name}</h3>
      <span className={styles.physicsTag}>{item.origin}</span>
    </motion.div>
  );
};
