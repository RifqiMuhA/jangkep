'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const INGREDIENTS = [
  'bawang-merah.webp', 'bawang-putih.webp', 'cabai-rawit.webp', 'daging-ayam.webp', 
  'daun-pisang.webp', 'gula-jawa.webp', 'kelapa-parut.webp', 'santan.webp', 'kemiri.webp', 
  'tahu.webp', 'udang.webp', 'tomat.webp', 'telur.webp', 'serai.webp', 'singkong.webp'
];

const FOODS = [
  'bakso_1.webp', 'sate_1.webp', 'lumpia_1.webp', 'mendoan_1.webp', 'nasiliwet_1.webp', 
  'serabi_1.webp', 'sotokudus_1.webp', 'tengkleng_1.webp', 'dawet_1.webp', 'lemper_1.webp'
];

export default function CookingPipeline() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden pointer-events-none mt-10">
      
      {/* Flow Line Background (The Conveyor Belt) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40">
        <div className="h-[1px] w-[80vw] bg-gradient-to-r from-transparent via-[#DAA520] to-transparent"></div>
        <div className="absolute w-[80vw] flex justify-between px-10">
            {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#DAA520] animate-pulse"></div>
            ))}
        </div>
      </div>

      {/* INGREDIENTS INPUT (Left to Center) */}
      <div className="absolute inset-0 flex items-center justify-center">
        {INGREDIENTS.map((item, i) => {
          const delay = i * 0.45; // Evenly spaced
          const yWave = Math.sin(i) * 30; // Deterministic wave pattern
          
          return (
            <motion.div
              key={`ing-${i}`}
              className="absolute w-12 h-12 md:w-16 md:h-16 drop-shadow-lg"
              initial={{ x: '-45vw', y: yWave, scale: 0, opacity: 0 }}
              animate={{ 
                x: ['-45vw', '-25vw', '0vw'],
                y: [yWave, yWave * 0.5, 0],
                scale: [0.3, 0.8, 0],
                opacity: [0, 1, 0],
                rotate: [0, 90, 180]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: delay,
                ease: "linear"
              }}
            >
              <Image src={`/kuliner/ingredients/${item}`} alt="Ingredient" width={80} height={80} className="object-contain w-full h-full" />
            </motion.div>
          );
        })}
      </div>

      {/* MASCOT PROCESSING (Center) */}
      <div className="relative z-10 w-32 h-32 md:w-48 md:h-48 drop-shadow-2xl flex items-center justify-center">
        <motion.div
          animate={{ 
            y: [-5, 5, -5],
            scale: [1, 1.05, 1],
            rotate: [-2, 2, -2]
          }}
          transition={{
            duration: 0.3, // Fast cooking!
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-full h-full relative"
        >
           {/* Glowing Orb/Fire effect */}
           <motion.div 
             animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.4, 0.7, 0.4] }}
             transition={{ duration: 0.8, repeat: Infinity }}
             className="absolute inset-0 bg-[#DAA520] rounded-full blur-2xl"
           ></motion.div>
           
           <Image 
             src="/kuliner/mascot_kuliner_7.webp" 
             alt="Si Podo Cooking" 
             width={300}
             height={300}
             className="object-contain relative z-10 w-full h-full"
           />
        </motion.div>
      </div>

      {/* FOOD OUTPUT (Center to Right) */}
      <div className="absolute inset-0 flex items-center justify-center">
        {FOODS.map((item, i) => {
          const delay = i * 0.65; // Slightly slower output
          const yWave = Math.cos(i) * 20; // Deterministic wave pattern
          
          return (
            <motion.div
              key={`food-${i}`}
              className="absolute w-20 h-20 md:w-28 md:h-28 drop-shadow-2xl"
              initial={{ x: '0vw', y: 0, scale: 0, opacity: 0 }}
              animate={{ 
                x: ['0vw', '25vw', '45vw'],
                y: [0, yWave * 0.5, yWave],
                scale: [0, 1.1, 0.6],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                delay: delay,
                ease: "easeOut"
              }}
            >
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#DAA520]/60 shadow-[0_0_20px_rgba(218,165,32,0.4)] relative flex items-center justify-center bg-black/60">
                <Image src={`/kuliner/gallery/${item}`} alt="Food" width={150} height={150} className="object-cover w-full h-full scale-110" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
