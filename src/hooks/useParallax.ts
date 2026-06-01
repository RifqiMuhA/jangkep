'use client';

import { useState, useEffect, useCallback } from 'react';

interface ParallaxValues {
  x: number;
  y: number;
}

export function useParallax(intensity: number = 10): ParallaxValues {
  const [values, setValues] = useState<ParallaxValues>({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const x = ((e.clientX - centerX) / centerX) * intensity;
      const y = ((e.clientY - centerY) / centerY) * intensity;
      setValues({ x, y });
    },
    [intensity]
  );

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return values;
}
