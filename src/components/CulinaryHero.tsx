'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SplitText from './SplitText';
import TextType from './TextType';
import VariableProximity from './VariableProximity';

interface IngredientItem {
  emoji: string;
  name: string;
  color: string;
}

interface FoodItem {
  emoji: string;
  name: string;
  color: string;
}

const INGREDIENTS: IngredientItem[] = [
  { emoji: '🧅', name: 'Bawang Merah', color: 'from-pink-500/25 to-purple-500/25' },
  { emoji: '🧄', name: 'Bawang Putih', color: 'from-slate-200/25 to-slate-400/25' },
  { emoji: '🌶️', name: 'Cabai Rawit', color: 'from-red-500/25 to-orange-500/25' },
  { emoji: '🥩', name: 'Daging Sapi', color: 'from-red-700/25 to-rose-950/25' },
];

const FINISHED_DISHES: FoodItem[] = [
  { emoji: '🥣', name: 'Bakso', color: 'from-amber-500/25 to-yellow-500/25' },
  { emoji: '🍢', name: 'Sate', color: 'from-orange-500/25 to-red-500/25' },
  { emoji: '🍜', name: 'Soto Kudus', color: 'from-yellow-500/25 to-amber-500/25' },
  { emoji: '🍛', name: 'Nasi Gandul', color: 'from-amber-700/25 to-amber-900/25' },
];

export default function CulinaryHero({ onStart }: { onStart?: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [cookingSteam, setCookingSteam] = useState<{ id: number; emoji: string; x: number; y: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    const steamInterval = setInterval(() => {
      if (mediaQuery.matches) return;
      const steamEmotes = ['🔥', '💨', '✨', '🍲', '🍳'];
      const randomEmote = steamEmotes[Math.floor(Math.random() * steamEmotes.length)];
      const randomX = (Math.random() - 0.5) * 60;
      const randomY = -20 - Math.random() * 40;

      setCookingSteam((prev) => [
        ...prev.slice(-8),
        { id: Date.now() + Math.random(), emoji: randomEmote, x: randomX, y: randomY },
      ]);
    }, 900);

    return () => {
      mediaQuery.removeEventListener('change', handler);
      clearInterval(steamInterval);
    };
  }, []);

  if (!mounted) return null;

  const entrancePath = "path('M -50 150 C 80 150, 100 250, 250 220')";
  const exitPath = "path('M 250 220 C 400 250, 420 150, 550 150')";

  return (
    <section className="relative w-full flex flex-col items-center justify-start overflow-hidden bg-[#F2EAD3] text-[#3B1F0C] pointer-events-auto min-h-screen pt-20">
      
      {/* GLOBAL KEYFRAMES */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-path-entrance {
          0% { offset-distance: 0%; opacity: 0; transform: scale(0.4) rotate(0deg); }
          15% { opacity: 1; transform: scale(1) rotate(45deg); }
          85% { opacity: 1; transform: scale(1) rotate(315deg); }
          100% { offset-distance: 100%; opacity: 0; transform: scale(0.3) rotate(360deg); }
        }
        @keyframes slide-path-exit {
          0% { offset-distance: 0%; opacity: 0; transform: scale(0.3) rotate(0deg); }
          15% { opacity: 1; transform: scale(1) rotate(45deg); }
          85% { opacity: 1; transform: scale(1) rotate(315deg); }
          100% { offset-distance: 100%; opacity: 0; transform: scale(0.4) rotate(360deg); }
        }
        @keyframes mascot-float-cook {
          0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
          25% { transform: translateY(-8px) scale(1.04) rotate(-4deg); }
          50% { transform: translateY(2px) scale(0.96) rotate(3deg); }
          75% { transform: translateY(-4px) scale(1.01) rotate(-1deg); }
        }
        @keyframes floating-steam {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: translate(var(--steam-x), var(--steam-y)) scale(1.4); opacity: 0; }
        }
        @keyframes wayang-play {
          0% { transform: rotate(-3deg) translateY(0px); }
          25% { transform: rotate(4deg) translateY(-8px); }
          50% { transform: rotate(-2deg) translateY(3px); }
          75% { transform: rotate(6deg) translateY(-5px); }
          100% { transform: rotate(-3deg) translateY(0px); }
        }
      `}} />

      {/* BACKGROUND TEXTURES & IMAGES */}
      {/* Light noise/batik pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.15] z-0 bg-[url('/batik/pattern_background.webp')] bg-cover bg-center mix-blend-multiply" />
      
      {/* Gradient fade to seamlessly blend bottom section */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#F2EAD3] to-transparent pointer-events-none z-10" />

      {/* Wayang Decoration (Left side, moving like playing wayang) */}
      <div className="absolute left-[-20px] md:left-8 top-1/4 opacity-80 pointer-events-none z-10" style={{ transformOrigin: 'bottom center', animation: 'wayang-play 8s infinite ease-in-out' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/motif/wayang_2.webp" alt="Wayang" className="w-[180px] md:w-[280px] lg:w-[350px] object-contain drop-shadow-2xl opacity-75" />
      </div>

      {/* Compass Decoration (Top Right) */}
      <div className="absolute right-4 md:right-12 top-12 md:top-20 opacity-90 pointer-events-none z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/bg mapz/kompas.webp" alt="Kompas" className="w-[120px] md:w-[180px] object-contain drop-shadow-xl opacity-80" />
      </div>

      {/* TOP SECTION: Hero Copywriting */}
      <div ref={containerRef} className="relative z-20 flex flex-col items-center justify-center text-center px-6 pt-16 md:pt-24 pb-8 w-full max-w-5xl mx-auto">
        
        {/* Javanese Script Top (Jelajahi Rasa Jawa Tengah) */}
        <TextType 
          text="ꦗꦼꦭꦗꦲꦶ ꦫꦱ ꦗꦮ ꦠꦼꦔꦃ"
          typingSpeed={80}
          showCursor={false}
          loop={false}
          className="font-['Noto_Sans_Javanese'] text-3xl md:text-5xl text-[#B8860B] mb-2 opacity-80 font-bold"
        />

        {/* Main Title with SplitText and VariableProximity */}
        <div className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-[#3B1F0C] my-4 font-playfair drop-shadow-sm flex flex-col items-center gap-2">
          <SplitText
            text="Jelajahi Rasa Jawa Tengah,"
            className="block mb-2"
            delay={30}
            duration={1.2}
            ease="power3.out"
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
          />
          <VariableProximity
            label="Dari Cerita Jadi Peta Hidup"
            className="block text-[#DAA520] drop-shadow-md cursor-default"
            fromFontVariationSettings="'wght' 400, 'opsz' 9"
            toFontVariationSettings="'wght' 900, 'opsz' 40"
            containerRef={containerRef}
            radius={120}
            falloff="gaussian"
          />
        </div>

        {/* Javanese Script Bottom (Dari Cerita Jadi Peta Hidup) */}
        <TextType 
          text="ꦢꦫꦶ ꦕꦼꦫꦶꦠ ꦗꦢꦶ ꦥꦼꦠ ꦲꦶꦢꦸꦥ꧀"
          typingSpeed={80}
          initialDelay={1500}
          showCursor={false}
          loop={false}
          className="font-['Noto_Sans_Javanese'] text-2xl md:text-4xl text-[#B8860B] mt-2 mb-8 opacity-80 font-bold"
        />

        {/* Subtitle Description */}
        <div className="max-w-3xl mx-auto px-4 md:px-0">
          <SplitText
            text="Lebih dari sekadar peta geografis, ini adalah jendela menuju kekayaan rasa Nusantara. Temukan kisah bersejarah di balik legitnya hidangan pesisir hingga gurihnya kuliner pedalaman dalam satu penjelajahan yang menggugah selera."
            className="text-sm md:text-lg lg:text-xl font-dm-sans text-[#4A3A31] leading-relaxed"
            delay={10}
            duration={0.8}
            ease="power2.out"
            splitType="words"
            from={{ opacity: 0, y: 15 }}
            to={{ opacity: 1, y: 0 }}
          />
        </div>

      </div>

      {/* BOTTOM SECTION: Si Podo Cooking Conveyor */}
      <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center h-[350px] md:h-[400px] z-20 mt-8 mb-16">
        
        {/* Ambient Glow behind the mascot cooking station */}
        <div className="absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full bg-[#DAA520] blur-[100px] opacity-40 pointer-events-none z-0" />

        {/* SVG Conveyor Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 500 350" fill="none">
          <path
            d="M -50 150 C 80 150, 100 250, 250 220"
            stroke="url(#gold-gradient-1)"
            strokeWidth="3.5"
            strokeDasharray="8 6"
            className="opacity-70"
          />
          <path
            d="M 250 220 C 400 250, 420 150, 550 150"
            stroke="url(#gold-gradient-2)"
            strokeWidth="3.5"
            strokeDasharray="8 6"
            className="opacity-70"
          />
          <defs>
            <linearGradient id="gold-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8C6A48" stopOpacity="0" />
              <stop offset="100%" stopColor="#8C6A48" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="gold-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8C6A48" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8C6A48" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* INGREDIENTS SLIDING STREAM */}
        <div className="absolute inset-0 pointer-events-none z-10" style={{ transform: 'scale(0.92)' }}>
          {!reducedMotion && INGREDIENTS.map((item, i) => (
            <div
              key={`ingredient-${i}`}
              className="absolute w-12 h-12 md:w-14 md:h-14"
              style={{
                offsetPath: entrancePath,
                animation: 'slide-path-entrance 8s infinite linear',
                animationDelay: `${i * 2.0}s`,
                willChange: 'transform',
              }}
            >
              <div className={`w-full h-full rounded-full flex items-center justify-center text-2xl md:text-3xl backdrop-blur-md bg-[#F5F2EB]/80 border border-[#8C6A48]/30 shadow-md`}>
                <span className="transform hover:scale-125 transition-transform duration-300 select-none">{item.emoji}</span>
              </div>
            </div>
          ))}
        </div>

        {/* THE MASCOT - PODO COOKING STATION */}
        <div className="absolute left-[50%] top-[62.8%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center">
          
          <AnimatePresence>
            {!reducedMotion && cookingSteam.map((steam) => (
              <span
                key={steam.id}
                className="absolute text-2xl pointer-events-none font-bold text-[#DAA520]"
                style={{
                  '--steam-x': `${steam.x}px`,
                  '--steam-y': `${steam.y}px`,
                  animation: 'floating-steam 1.3s forwards ease-out',
                  willChange: 'transform',
                } as React.CSSProperties}
              >
                {steam.emoji}
              </span>
            ))}
          </AnimatePresence>

          <div 
            className="w-24 h-24 md:w-28 md:h-28 rounded-2xl flex flex-col items-center justify-center border-2 border-[#DAA520] shadow-[0_10px_30px_rgba(218,165,32,0.3)] relative overflow-hidden backdrop-blur-xl bg-[#F5F2EB]/90"
            style={{ 
              animation: reducedMotion ? 'none' : 'mascot-float-cook 3s infinite ease-in-out',
              willChange: 'transform' 
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#DAA520]/15 to-transparent pointer-events-none" />
            <div className="absolute bottom-1 w-12 h-1 bg-[#DAA520] rounded-full blur-[2px] animate-pulse" />
            <span className="text-4xl md:text-5xl z-10 filter drop-shadow-md">👹</span>
            <span className="text-[10px] md:text-xs tracking-wider uppercase font-bold text-[#8C6A48] mt-1 select-none z-10">
              Si Podo
            </span>
          </div>

          <div className="px-3 py-1 mt-3 rounded-full bg-[#F5F2EB] border border-[#DAA520] text-[10px] uppercase tracking-wider font-extrabold text-[#DAA520] animate-pulse shadow-sm select-none">
            Memasak...
          </div>
        </div>

        {/* FINISHED DISHES SLIDING STREAM */}
        <div className="absolute inset-0 pointer-events-none z-10" style={{ transform: 'scale(0.92)' }}>
          {!reducedMotion && FINISHED_DISHES.map((item, i) => (
            <div
              key={`dish-${i}`}
              className="absolute w-14 h-14 md:w-16 md:h-16"
              style={{
                offsetPath: exitPath,
                animation: 'slide-path-exit 8s infinite linear',
                animationDelay: `${i * 2.0}s`,
                willChange: 'transform',
              }}
            >
              <div className={`w-full h-full rounded-full flex flex-col items-center justify-center backdrop-blur-md bg-[#F5F2EB]/90 border border-[#DAA520]/60 shadow-lg relative`}>
                <div className="absolute inset-1.5 rounded-full border border-[#8C6A48]/10 pointer-events-none" />
                <span className="text-3xl z-10 transform hover:scale-125 transition-transform duration-300 drop-shadow-md select-none">{item.emoji}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
