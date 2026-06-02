"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import styles from "./PakarInteractiveImage.module.css";
import tooltipStyles from "./AnimatedTooltip.module.css";

// Coordinate definitions for the 5 people in the image (left to right)
const HOVER_ZONES = [
  { left: "15%", width: "13%", top: "18%", height: "77%" },  // Person 1 (Mbah Joyo)
  { left: "30%", width: "12%", top: "15%", height: "80%" },  // Person 2 (Raden Bima)
  { left: "44%", width: "13%", top: "10%", height: "85%" },  // Person 3 (Ki Darmo)
  { left: "58%", width: "12%", top: "20%", height: "75%" },  // Person 4 (Sekar Ayu)
  { left: "71%", width: "14%", top: "20%", height: "75%" },  // Person 5 (Nyi Roro)
];

export default function PakarInteractiveImage({
  items,
}: {
  items: {
    id: number;
    name: string;
    designation: string;
    image: string;
  }[];
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const springConfig = { stiffness: 150, damping: 15 };
  const x = useMotionValue(0);
  
  // Rotate the tooltip based on mouse x position
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );
  
  // Translate the tooltip based on mouse x position
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    // We use the event's native target to calculate relative offset
    const target = event.currentTarget;
    const halfWidth = target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  return (
    <div className={styles.imageContainer}>
      {/* Background Decorations */}
      <Image src="/motif/motif_kiri_buku.webp" alt="" width={400} height={400} className={`${styles.pakarDeco} ${styles.pakarDecoLeft}`} unoptimized />
      <Image src="/motif/motif_kanan_buku.webp" alt="" width={400} height={400} className={`${styles.pakarDeco} ${styles.pakarDecoRight}`} unoptimized />
      <Image src="/motif/wayang_2.webp" alt="" width={300} height={400} className={`${styles.pakarWayang} ${styles.pakarWayangLeft}`} unoptimized />
      <Image src="/motif/wayang_2.webp" alt="" width={300} height={400} className={`${styles.pakarWayang} ${styles.pakarWayangRight}`} unoptimized />

      {/* Main Image Wrapper */}
      <div className={styles.mainWrapper}>
        <Image
          src="/avatars/pakar.webp"
          alt="Para Pakar Kuliner Jawa Tengah"
          width={1600}
          height={500}
          className={styles.pakarImage}
          unoptimized
        />

        {/* Interactive Hover Zones */}
        {items.map((item, index) => {
          const zone = HOVER_ZONES[index] || { left: "0%", width: "0%", top: "15%", height: "80%" };
          return (
            <div
              key={item.id}
              className={styles.hoverZone}
              style={{
                left: zone.left,
                width: zone.width,
                top: zone.top,
                height: zone.height,
              }}
              onMouseEnter={() => setHoveredIndex(item.id)}
              onMouseLeave={() => setHoveredIndex(null)}
              onMouseMove={handleMouseMove}
            >
              <AnimatePresence mode="popLayout">
                {hoveredIndex === item.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.6 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                      },
                    }}
                    exit={{ opacity: 0, y: 20, scale: 0.6 }}
                    style={{
                      translateX: translateX,
                      rotate: rotate,
                      x: "-50%", // Centers the absolute element
                    }}
                    className={styles.tooltipPositioner}
                  >
                    <div className={tooltipStyles.tooltipContainer} style={{ position: 'relative', whiteSpace: 'nowrap' }}>
                      <div className={tooltipStyles.tooltipName}>{item.name}</div>
                      <div className={tooltipStyles.tooltipDesignation}>
                        {item.designation}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
