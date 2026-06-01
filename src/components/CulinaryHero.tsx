'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex flex-col lg:flex-row items-center justify-between gap-12 px-6 md:px-16 py-12 md:py-20 overflow-hidden bg-gradient-to-br from-[#0F0803] via-[#1A0C05] to-[#0A0502] border-b border-[#DAA520]/15 pointer-events-auto">
      
      {/* GLOBAL KEYFRAMES */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-path-entrance {
          0% {
            offset-distance: 0%;
            opacity: 0;
            transform: scale(0.4) rotate(0deg);
          }
          15% {
            opacity: 1;
            transform: scale(1) rotate(45deg);
          }
          85% {
            opacity: 1;
            transform: scale(1) rotate(315deg);
          }
          100% {
            offset-distance: 100%;
            opacity: 0;
            transform: scale(0.3) rotate(360deg);
          }
        }

        @keyframes slide-path-exit {
          0% {
            offset-distance: 0%;
            opacity: 0;
            transform: scale(0.3) rotate(0deg);
          }
          15% {
            opacity: 1;
            transform: scale(1) rotate(45deg);
          }
          85% {
            opacity: 1;
            transform: scale(1) rotate(315deg);
          }
          100% {
            offset-distance: 100%;
            opacity: 0;
            transform: scale(0.4) rotate(360deg);
          }
        }

        @keyframes mascot-float-cook {
          0%, 100% {
            transform: translateY(0) scale(1) rotate(0deg);
          }
          25% {
            transform: translateY(-8px) scale(1.04) rotate(-4deg);
          }
          50% {
            transform: translateY(2px) scale(0.96) rotate(3deg);
          }
          75% {
            transform: translateY(-4px) scale(1.01) rotate(-1deg);
          }
        }

        @keyframes ambient-glow {
          0%, 100% {
            opacity: 0.2;
            transform: scale(0.95) translate(-50%, -50%);
          }
          50% {
            opacity: 0.45;
            transform: scale(1.1) translate(-50%, -50%);
          }
        }

        @keyframes floating-steam {
          0% {
            transform: translate(0, 0) scale(0.5);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          100% {
            transform: translate(var(--steam-x), var(--steam-y)) scale(1.4);
            opacity: 0;
          }
        }
      `}} />

      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-[#DAA520] opacity-[0.08] blur-[110px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] rounded-full bg-[#DAA520] opacity-[0.06] blur-[130px] pointer-events-none" />

      {/* Left Column - Copywriting & Visual Hierarchy (45% Width) */}
      <div className="w-full lg:w-[45%] flex flex-col items-start text-left z-10 space-y-6 md:space-y-8 pointer-events-auto">
        
        {/* Elegant Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_4px_12px_rgba(218,165,32,0.1)]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#DAA520] animate-pulse" />
          <span className="text-xs uppercase tracking-widest font-bold text-[#DAA520] select-none" style={{ color: '#DAA520' }}>
            Peta Kuliner Interaktif
          </span>
        </div>

        {/* Crisp Bold Typography */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight select-none" style={{ color: '#ffffff' }}>
            Eksplorasi Rasa,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DAA520] via-[#FFD700] to-[#DAA520]">
              Menelusuri Tradisi
            </span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed max-w-xl" style={{ color: '#d1d5db' }}>
            Menyajikan khazanah kuliner legendaris Jawa Tengah dalam representasi visual kartografi yang dinamis. 
            Temukan asal-usul sejarah, detail komposisi bahan autentik, serta warisan tradisi budaya yang lestari di setiap cita rasa hidangan.
          </p>
        </div>

        {/* Premium CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
          <button
            onClick={onStart}
            className="group relative flex items-center justify-center gap-3 bg-gradient-to-r from-[#DAA520] to-[#B8860B] hover:from-[#FFD700] hover:to-[#DAA520] text-black font-bold px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(218,165,32,0.25)] hover:shadow-[0_0_30px_rgba(218,165,32,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 pointer-events-auto"
            style={{ color: '#000000', backgroundColor: '#DAA520' }}
          >
            <span>Mulai Petualangan</span>
            <svg 
              className="w-5 h-5 transition-transform duration-300 transform group-hover:translate-x-1 bg-transparent fill-none stroke-current" 
              style={{ background: 'transparent', display: 'inline-block' }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
          
          <button
            className="flex items-center justify-center border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 backdrop-blur-md pointer-events-auto"
            style={{ color: '#ffffff' }}
          >
            Pelajari Resep
          </button>
        </div>
      </div>

      {/* Right Column - Conveyor Belt Cooking Mechanism (55% Width) */}
      <div className="w-full lg:w-[55%] flex items-center justify-center relative h-[400px] md:h-[460px] z-10 p-4">
        
        {/* Premium Translucent Card Canvas (spatial depth layer) */}
        <div className="absolute inset-0 rounded-3xl bg-white/[0.01] border border-white/5 shadow-[inset_0_0_30px_rgba(255,255,255,0.02),0_15px_35px_rgba(0,0,0,0.5)] backdrop-blur-[4px] pointer-events-none z-0" />

        {/* Soft edge fade-in masks */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0F0803] via-[#0F0803]/40 to-transparent pointer-events-none z-20 rounded-l-3xl" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0A0502] via-[#0A0502]/40 to-transparent pointer-events-none z-20 rounded-r-3xl" />

        {/* Ambient Glow behind the mascot cooking station */}
        <div 
          className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full bg-[#DAA520] blur-[80px] pointer-events-none z-0" 
          style={{ animation: reducedMotion ? 'none' : 'ambient-glow 3.5s infinite ease-in-out' }}
        />

        {/* SVG Conveyor Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 500 350" fill="none">
          {/* Entrance Rail path */}
          <path
            d="M -50 150 C 80 150, 100 250, 250 220"
            stroke="url(#gold-gradient-1)"
            strokeWidth="3.5"
            strokeDasharray="8 6"
            className="opacity-60"
          />
          {/* Exit Rail path */}
          <path
            d="M 250 220 C 400 250, 420 150, 550 150"
            stroke="url(#gold-gradient-2)"
            strokeWidth="3.5"
            strokeDasharray="8 6"
            className="opacity-60"
          />

          <defs>
            <linearGradient id="gold-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DAA520" stopOpacity="0" />
              <stop offset="100%" stopColor="#DAA520" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="gold-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DAA520" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#DAA520" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* INGREDIENTS SLIDING STREAM (Left Entrance) */}
        <div className="absolute inset-0 pointer-events-none z-10" style={{ transform: 'scale(0.92)' }}>
          {!reducedMotion && INGREDIENTS.map((item, i) => (
            <div
              key={`ingredient-${i}`}
              className="absolute w-14 h-14"
              style={{
                offsetPath: entrancePath,
                animation: 'slide-path-entrance 8s infinite linear',
                animationDelay: `${i * 2.0}s`,
                willChange: 'transform',
              }}
            >
              {/* Premium Glassmorphism Bubble with Emoji */}
              <div className={`w-full h-full rounded-full flex items-center justify-center text-3xl backdrop-blur-md bg-gradient-to-br ${item.color} border border-white/20 shadow-[0_6px_16px_rgba(0,0,0,0.5),0_0_20px_rgba(218,165,32,0.15)]`}>
                <span className="transform hover:scale-125 transition-transform duration-300 select-none">{item.emoji}</span>
              </div>
            </div>
          ))}
        </div>

        {/* THE MASCOT - PODO COOKING STATION (Center) */}
        <div className="absolute left-[50%] top-[62.8%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center">
          
          {/* Steam/Heat rising particles */}
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

          {/* Styled Chef Mascot Badge using gorgeous CSS styling */}
          <div 
            className="w-24 h-24 md:w-28 md:h-28 rounded-2xl flex flex-col items-center justify-center border-2 border-[#DAA520] shadow-[0_0_35px_rgba(218,165,32,0.4)] relative overflow-hidden backdrop-blur-xl bg-[#130904]/90"
            style={{ 
              animation: reducedMotion ? 'none' : 'mascot-float-cook 3s infinite ease-in-out',
              willChange: 'transform' 
            }}
          >
            {/* Mascot glow inner line */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#DAA520]/25 to-transparent pointer-events-none" />

            {/* Glowing inner fire indicator */}
            <div className="absolute bottom-1 w-12 h-1 bg-[#DAA520] rounded-full blur-[2px] animate-pulse" />

            {/* Mascot Emblem Emoji */}
            <span className="text-4xl md:text-5xl z-10 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)]">👹</span>
            <span className="text-[10px] md:text-xs tracking-wider uppercase font-bold text-[#DAA520] mt-1 select-none z-10" style={{ color: '#DAA520' }}>
              Si Podo
            </span>
          </div>

          {/* Little active tag */}
          <div className="px-2.5 py-0.5 mt-2 rounded bg-[#DAA520]/20 border border-[#DAA520]/45 text-[9px] uppercase tracking-wider font-extrabold text-[#DAA520] animate-pulse select-none" style={{ color: '#DAA520' }}>
            Memasak...
          </div>
        </div>

        {/* FINISHED DISHES SLIDING STREAM (Right Exit) */}
        <div className="absolute inset-0 pointer-events-none z-10" style={{ transform: 'scale(0.92)' }}>
          {!reducedMotion && FINISHED_DISHES.map((item, i) => (
            <div
              key={`dish-${i}`}
              className="absolute w-16 h-16"
              style={{
                offsetPath: exitPath,
                animation: 'slide-path-exit 8s infinite linear',
                animationDelay: `${i * 2.0}s`,
                willChange: 'transform',
              }}
            >
              {/* Premium Glassmorphism Circular Plate */}
              <div className={`w-full h-full rounded-full flex flex-col items-center justify-center backdrop-blur-md bg-gradient-to-br ${item.color} border border-[#DAA520]/40 shadow-[0_8px_24px_rgba(0,0,0,0.6),0_0_25px_rgba(218,165,32,0.2)] relative`}>
                {/* Plate inner border */}
                <div className="absolute inset-1.5 rounded-full border border-white/5 pointer-events-none" />
                
                {/* Food Emoji */}
                <span className="text-3xl z-10 transform hover:scale-125 transition-transform duration-300 drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)] select-none">{item.emoji}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
