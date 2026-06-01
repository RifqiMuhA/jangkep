'use client';

import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";
import { useEffect, useRef } from "react";

// Helper component for gradient layers
function GradientLayer({
  springX,
  springY,
  gradientColor,
  opacity,
  multiplier,
}: {
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  gradientColor: string;
  opacity: number;
  multiplier: number;
}) {
  const x = useTransform(springX, (val) => val * multiplier);
  const y = useTransform(springY, (val) => val * multiplier);
  const background = useMotionTemplate`radial-gradient(circle at ${x}px ${y}px, ${gradientColor} 0%, transparent 50%)`;

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        background,
      }}
    />
  );
}

interface NoiseBackgroundProps {
  children?: React.ReactNode;
  gradientColors?: string[];
  noiseIntensity?: number;
  speed?: number;
  animating?: boolean;
}

export const NoiseBackground = ({
  children,
  gradientColors = [
    "rgba(235, 172, 0, 0.8)",
    "rgba(200, 150, 0, 0.8)",
    "rgba(255, 200, 50, 0.8)",
  ],
  noiseIntensity = 0.4,
  speed = 0.1,
  animating = true,
}: NoiseBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Use spring animation for smooth movement
  const springX = useSpring(x, { stiffness: 100, damping: 30 });
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  // Transform for top gradient strip
  const topGradientX = useTransform(springX, (val) => val * 0.1 - 50);

  const velocityRef = useRef({ x: 0, y: 0 });
  const lastDirectionChangeRef = useRef(0);

  // Initialize position to center
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    x.set(centerX);
    y.set(centerY);
  }, [x, y]);

  // Generate random velocity
  const generateRandomVelocityRef = useRef(() => {
    const angle = Math.random() * Math.PI * 2;
    const magnitude = speed * (0.5 + Math.random() * 0.5); // Random speed between 0.5x and 1x
    return {
      x: Math.cos(angle) * magnitude,
      y: Math.sin(angle) * magnitude,
    };
  });

  // Update generateRandomVelocity when speed changes
  useEffect(() => {
    generateRandomVelocityRef.current = () => {
      const angle = Math.random() * Math.PI * 2;
      const magnitude = speed * (0.5 + Math.random() * 0.5);
      return {
        x: Math.cos(angle) * magnitude,
        y: Math.sin(angle) * magnitude,
      };
    };
    velocityRef.current = generateRandomVelocityRef.current();
  }, [speed]);

  // Animate using framer-motion's useAnimationFrame
  useAnimationFrame((time) => {
    if (!animating || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const maxX = rect.width;
    const maxY = rect.height;

    // Change direction randomly every 30-60 seconds (sangat stabil)
    if (time - lastDirectionChangeRef.current > 30000 + Math.random() * 30000) {
      velocityRef.current = generateRandomVelocityRef.current();
      lastDirectionChangeRef.current = time;
    }

    const deltaTime = 16;
    const currentX = x.get();
    const currentY = y.get();

    let newX = currentX + velocityRef.current.x * deltaTime;
    let newY = currentY + velocityRef.current.y * deltaTime;

    const padding = 20;

    if (
      newX < padding ||
      newX > maxX - padding ||
      newY < padding ||
      newY > maxY - padding
    ) {
      const angle = Math.random() * Math.PI * 2;
      const magnitude = speed * (0.5 + Math.random() * 0.5);
      velocityRef.current = {
        x: Math.cos(angle) * magnitude,
        y: Math.sin(angle) * magnitude,
      };
      lastDirectionChangeRef.current = time;
      newX = Math.max(padding, Math.min(maxX - padding, newX));
      newY = Math.max(padding, Math.min(maxY - padding, newY));
    }

    x.set(newX);
    y.set(newY);
  });

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '50px',
        padding: '4px', // Dibuat sangat sempit agar membingkai pas di tepi
        backgroundColor: 'rgba(255,255,255,0.05)',
        boxShadow: '0px 0.5px 1px 0px rgba(0,0,0,0.5) inset, 0px 1px 0px 0px rgba(255,255,255,0.1)',
        display: 'inline-block',
      }}
    >
      {/* Moving gradient layers */}
      <GradientLayer
        springX={springX}
        springY={springY}
        gradientColor={gradientColors[0]}
        opacity={0.7}
        multiplier={1}
      />
      <GradientLayer
        springX={springX}
        springY={springY}
        gradientColor={gradientColors[1]}
        opacity={0.5}
        multiplier={0.7}
      />
      <GradientLayer
        springX={springX}
        springY={springY}
        gradientColor={gradientColors[2] || gradientColors[0]}
        opacity={0.4}
        multiplier={1.2}
      />

      {/* Top gradient strip */}
      <motion.div
        style={{
          position: 'absolute',
          left: 0, right: 0, top: 0, height: '4px',
          borderRadius: '50px 50px 0 0',
          opacity: 0.8,
          filter: 'blur(2px)',
          background: `linear-gradient(to right, ${gradientColors.join(", ")})`,
          x: animating ? topGradientX : 0,
        }}
      />

      {/* Infinite Scrolling Noise Pattern - BATIK PARANG */}
      <motion.div
        animate={{ x: [0, -150], y: [0, -150] }} // Animasi Translate lebih smooth daripada backgroundPosition
        transition={{ repeat: Infinity, duration: 20, ease: 'linear' }} // Kecepatan ideal (terlihat jalan tapi pelan)
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: 'calc(100% + 150px)', // Ekstra lebar untuk di-scroll
          height: 'calc(100% + 150px)', // Ekstra tinggi untuk di-scroll
          pointerEvents: 'none',
          backgroundImage: 'url(/batik/batik_parang.webp)',
          backgroundSize: '150px',
          opacity: noiseIntensity,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10 }}>{children}</div>
    </div>
  );
};
