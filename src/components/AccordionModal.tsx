'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import React, { useState } from 'react';

export interface GalleryItem {
  id: string | number;
  url: string;
  title: string;
  subtitle: string;
  description: string;
}

export default function AccordionModal({ 
  items,
  onChangeActive 
}: { 
  items: GalleryItem[];
  onChangeActive?: (item: GalleryItem) => void;
}) {
  const [activeIndex, setActiveIndex] = React.useState(Math.floor(items.length / 2));

  const onChangeActiveRef = React.useRef(onChangeActive);
  React.useEffect(() => {
    onChangeActiveRef.current = onChangeActive;
  }, [onChangeActive]);

  React.useEffect(() => {
    if (items && items[activeIndex]) {
      onChangeActiveRef.current?.(items[activeIndex]);
    }
  }, [activeIndex, items]);

  if (!items || items.length === 0) return null;

  return (
    <div style={{ display: 'flex', gap: '4px', height: '120px', width: '100%', margin: '16px 0', pointerEvents: 'auto', alignItems: 'stretch' }}>
      {items.map((item, index) => {
        const isActive = activeIndex === index;

        return (
          <motion.div
            key={item.id}
            style={{
              position: 'relative',
              height: '100%',
              overflow: 'hidden',
              borderRadius: '12px',
              cursor: 'pointer',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            onMouseEnter={() => setActiveIndex(index)}
            animate={{
              flex: isActive ? "1 1 0%" : "0 0 24px",
            }}
            initial={false}
            transition={{
              duration: 0.4,
              ease: [0.25, 1, 0.5, 1], // Smooth snap
            }}
          >
            <Image
              src={item.url}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 300px, 400px"
              style={{
                objectFit: 'cover',
                opacity: isActive ? 1 : 0.6,
                transition: 'opacity 0.3s ease-in-out'
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseOut={(e) => {
                 if (!isActive) e.currentTarget.style.opacity = '0.6';
              }}
              priority={index === 0}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
