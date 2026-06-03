"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, PanInfo, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { kulinerData, KulinerItem } from '@/data/kulinerData';
import styles from './game2.module.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiZ2l0cmF5YTE0MDAiLCJhIjoiY21wcGl1M2hkMGpmaDJwcXBraXdobGZkdCJ9.J5D7thClJjFmcmnYmTlm3g';

const originToShapeNames: Record<string, string[]> = {
  'Solo': ['Kota Surakarta', 'Surakarta'],
  'Semarang': ['Kota Semarang', 'Semarang'],
  'Magelang': ['Kota Magelang', 'Magelang'],
  'Kudus': ['Kudus'],
  'Blora': ['Blora'],
  'Wonogiri': ['Wonogiri'],
  'Banyumas': ['Banyumas'],
  'Demak': ['Demak'],
  'Banjarnegara': ['Banjarnegara'],
};

function ConfettiEffect() {
  const colors = ['#FFC107', '#FF9800', '#F2C94C', '#F2994A', '#FFFFFF'];
  const pieces = Array.from({ length: 60 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100 - 50,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 0.5,
    size: Math.random() * 8 + 6,
    duration: Math.random() * 2 + 2,
  }));

  return (
    <div className={styles.confettiContainer}>
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className={styles.confettiPiece}
          initial={{ opacity: 1, top: '-10%', left: `calc(50% + ${p.x}vw)`, rotate: 0 }}
          animate={{
            top: '110%',
            rotate: 360 * 3,
            left: `calc(50% + ${p.x + (Math.random() * 20 - 10)}vw)`
          }}
          transition={{ duration: p.duration, delay: p.delay, ease: "linear" }}
          style={{ backgroundColor: p.color, width: p.size, height: p.size * 1.5 }}
        />
      ))}
    </div>
  );
}

function FoodDraggable({ item, handleDragEnd }: { item: KulinerItem, handleDragEnd: (item: KulinerItem, info: PanInfo) => void }) {
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig);
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const halfWidth = event.currentTarget.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  return (
    <div className={styles.foodItemWrapper}>
      <motion.div
        drag
        dragSnapToOrigin={true}
        onDragEnd={(e, info) => handleDragEnd(item, info)}
        whileDrag={{ scale: 1.2, zIndex: 100 }}
        className={styles.foodItem}
        onMouseMove={handleMouseMove}
      >
        <img
          src={item.galleryImages[0]}
          alt={item.name}
          className={styles.foodImage}
          draggable={false}
        />
      </motion.div>
      <div className={styles.foodNamePlate}>{item.name}</div>
    </div>
  );
}

const createMaskFromBoundary = (boundaryFc: GeoJSON.FeatureCollection): GeoJSON.Feature => {
  if (!boundaryFc.features.length) return { type: 'Feature', geometry: { type: 'Polygon', coordinates: [] }, properties: {} };
  const outerRing = [[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]];
  const holes: number[][][] = [];
  for (const feature of boundaryFc.features) {
    const geo = feature.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon;
    if (geo.type === 'Polygon') holes.push([...geo.coordinates[0]].reverse());
    else if (geo.type === 'MultiPolygon') {
      for (const poly of geo.coordinates) holes.push([...poly[0]].reverse());
    }
  }
  return { type: 'Feature', geometry: { type: 'Polygon', coordinates: [outerRing, ...holes] }, properties: {} };
};

export default function Game2Page() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const [gameState, setGameState] = useState<'playing' | 'result'>('playing');
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameItems, setGameItems] = useState<KulinerItem[]>([]);
  const [foundItems, setFoundItems] = useState<string[]>([]);
  
  const [showTimeAdd, setShowTimeAdd] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Mascot Reaction State
  const [mascotState, setMascotState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [chatMessage, setChatMessage] = useState<{ title: string, desc: string } | null>(null);

  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    const shuffled = [...kulinerData].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4); // Pick 4 items
    setGameItems(selected);
    setFoundItems([]);
    setTimeLeft(60);
    setGameState('playing');
    setShowConfetti(false);
    setMascotState('idle');
    setChatMessage(null);

    // Reset map highlights
    if (mapRef.current && mapRef.current.isStyleLoaded()) {
      mapRef.current.removeFeatureState({ source: 'jateng' });
      mapRef.current.flyTo({ center: [110.1, -7.3], zoom: 7.5 });
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Bounds around Central Java
    const bounds: mapboxgl.LngLatBoundsLike = [
      [108.0, -8.8], // Southwest coordinates
      [112.0, -5.5]  // Northeast coordinates
    ];

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/gitraya1400/cmppjivb8001h01qw6gqc68be',
      center: [110.1, -7.3], // Adjusted center
      zoom: 7.5,
      minZoom: 6,
      maxZoom: 12,
      maxBounds: bounds,
      interactive: true,
      dragRotate: false,
    });
    mapRef.current = map;

    map.on('load', async () => {
      try {
        const [resFull, resMerged] = await Promise.all([
          fetch('/geo/jateng_full.json'),
          fetch('/geo/jateng_merged.json')
        ]);
        const dataFull = await resFull.json();
        const dataMerged = await resMerged.json();
        
        map.addSource('jateng', {
          type: 'geojson',
          data: dataFull,
          promoteId: 'shapeName'
        });

        // 0. Dim Layer for World (everything except Central Java) using merged boundary to prevent rendering bugs
        const mask = createMaskFromBoundary(dataMerged);
        map.addSource('world-dim-source', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [mask]
          }
        });

        map.addLayer({
          id: 'world-dim-layer',
          type: 'fill',
          source: 'world-dim-source',
          paint: {
            'fill-color': '#000000',
            'fill-opacity': 0.6
          }
        });

        // 1. Subtle Fill for Central Java
        map.addLayer({
          id: 'jateng-base-fill',
          type: 'fill',
          source: 'jateng',
          paint: {
            'fill-color': '#F5C400',
            'fill-opacity': 0.05
          }
        });

        // 2. Interactive Fills (Correct/Wrong Drop)
        map.addLayer({
          id: 'jateng-fills',
          type: 'fill',
          source: 'jateng',
          paint: {
            'fill-color': [
              'case',
              ['boolean', ['feature-state', 'error'], false],
              '#e74c3c', // Red error
              '#FFC107'  // Kuning Kepodang success
            ],
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'highlight'], false],
              0.8,
              ['boolean', ['feature-state', 'error'], false],
              0.8,
              0
            ]
          }
        });

        // 3. Outer Glow
        map.addLayer({
          id: 'jateng-glow-outer',
          type: 'line',
          source: 'jateng',
          paint: {
            'line-color': '#D4AF37',
            'line-width': 12,
            'line-opacity': 0.15,
            'line-blur': 6
          }
        });

        // 4. Inner Glow
        map.addLayer({
          id: 'jateng-glow-inner',
          type: 'line',
          source: 'jateng',
          paint: {
            'line-color': '#B8860B',
            'line-width': 4,
            'line-opacity': 0.25,
            'line-blur': 2
          }
        });

        // 5. Solid Line Border
        map.addLayer({
          id: 'jateng-borders',
          type: 'line',
          source: 'jateng',
          paint: {
            'line-color': '#D4AF37',
            'line-width': 1.5,
            'line-opacity': 0.8
          }
        });
      } catch (err) {
        console.error("Error loading map boundaries:", err);
      }
    });

    return () => map.remove();
  }, []);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;
    if (timeLeft <= 0) {
      setGameState('result');
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  const handleEndGame = () => {
    setGameState('result');
  };

  const handleDragEnd = (item: KulinerItem, info: PanInfo) => {
    if (!mapRef.current || !mapContainerRef.current) return;
    
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = info.point.x - rect.left;
    const y = info.point.y - rect.top;

    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      const features = mapRef.current.queryRenderedFeatures([x, y], { layers: ['jateng-fills'] });
      if (features.length > 0) {
        const feature = features[0];
        const shapeName = feature.properties?.shapeName;
        const validShapes = originToShapeNames[item.origin] || [item.origin];
        
        if (validShapes.includes(shapeName)) {
          // Correct Drop
          setFoundItems(prev => [...prev, item.slug]);
          
          // Map highlight
          mapRef.current.setFeatureState(
            { source: 'jateng', id: shapeName },
            { highlight: true }
          );

          // Mascot Reaction
          setMascotState('correct');
          setChatMessage({
            title: "Tepat Sekali!",
            desc: item.shortDescription
          });

          // Add time
          setTimeLeft(prev => prev + 5);
          setShowTimeAdd(true);
          
          setTimeout(() => {
            setShowTimeAdd(false);
            setMascotState('idle');
            setChatMessage(null);
          }, 3000);

          // Check Win Condition
          if (foundItems.length + 1 === gameItems.length) {
            setShowConfetti(true);
            setTimeout(() => {
              setGameState('result');
            }, 3000);
          }
        } else {
          // Wrong Drop
          setMascotState('wrong');
          setChatMessage({
            title: "Waduh, Salah!",
            desc: `Itu bukan asalnya. Coba cari ${item.origin} di peta!`
          });

          mapRef.current.setFeatureState(
            { source: 'jateng', id: shapeName },
            { error: true }
          );

          setTimeout(() => {
             if (mapRef.current) {
                mapRef.current.setFeatureState({ source: 'jateng', id: shapeName }, { error: false });
             }
             setMascotState('idle');
             setChatMessage(null);
          }, 1500);
        }
      }
    }
  };

  const getMascotImage = () => {
    if (mascotState === 'correct') return '/games/mascot_kuliner_3.webp'; // Cheering
    if (mascotState === 'wrong') return '/games/mascot_kuliner_2.webp';   // Shocked
    return '/games/mascot_kotamana.webp'; // Idle
  };

  return (
    <main className={styles.pageBackground}>
      {showConfetti && <ConfettiEffect />}
      
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.progressWrapper}>
          <span className={styles.progressText}>Ditemukan: {foundItems.length} / {gameItems.length}</span>
        </div>
        
        <div className={styles.headerControls}>
          <div className={`${styles.timer} ${timeLeft <= 10 ? styles.timerWarning : ''}`}>
            <Clock size={20} strokeWidth={2.5} />
            {timeLeft}s
            <AnimatePresence>
              {showTimeAdd && (
                <motion.div
                  initial={{ opacity: 0, x: -30, y: 0, scale: 0.5 }}
                  animate={{ opacity: 1, x: -40, y: 0, scale: 1.5 }}
                  exit={{ opacity: 0, y: -20, scale: 0.8 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={styles.timeAddedText}
                >
                  +5
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button className={styles.btnSelesaiWrapper} onClick={handleEndGame}>
            <Image 
              src="/games/game1/button_selesai.webp" 
              alt="Selesaikan Game" 
              width={200}
              height={50}
              className={styles.btnSelesaiBg} 
              unoptimized
            />
            <span className={styles.btnSelesaiText}>Selesai</span>
          </button>
        </div>
      </div>

      {/* GAME AREA (Left-Right Layout) */}
      <div className={styles.gameArea}>
        
        {/* LEFT PANEL: FOOD TRAY */}
        <div className={styles.leftPanel}>
          <h2 className={styles.panelTitle}>Daftar Makanan</h2>
          {gameItems.map(item => (
            !foundItems.includes(item.slug) && (
              <FoodDraggable
                key={item.slug}
                item={item}
                handleDragEnd={handleDragEnd}
              />
            )
          ))}
        </div>

        {/* RIGHT PANEL: MAPBOX & MASCOT */}
        <div className={styles.rightPanel}>
          <div className={styles.mapWrapper}>
            <div ref={mapContainerRef} className={styles.mapContainer} />
            <div className={styles.instructionOverlay}>Tarik makanan ke kota asalnya!</div>
          </div>

          <div className={styles.mascotArea}>
            <AnimatePresence mode="wait">
              {chatMessage && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, scale: 0.5, x: 20, y: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, x: 20, y: 20 }}
                  className={styles.chatBubble}
                >
                  <div className={`${styles.chatTitle} ${mascotState === 'wrong' ? styles.error : ''}`}>
                    {mascotState === 'correct' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                    {chatMessage.title}
                  </div>
                  <div className={styles.chatDesc}>{chatMessage.desc}</div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.img
                key={mascotState}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                src={getMascotImage()}
                alt="Si Podo Reaction"
                className={styles.podoMascot}
              />
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* RESULT MODAL */}
      <div className={`${styles.resultOverlay} ${gameState === 'result' ? styles.active : ''}`}>
        <div className={styles.resultCard}>
          <Image src="/games/mascot_kotamana.webp" alt="Si Podo" width={150} height={150} className={styles.mascotReaction} unoptimized />
          <h2 className={styles.feedbackTitle}>
            {foundItems.length === gameItems.length ? 'Peta Menyala!' : 'Waktune Habis!'}
          </h2>
          <div className={styles.subText} style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
            {foundItems.length === gameItems.length
              ? 'Luar biasa! Kamu hafal peta kuliner Jawa Tengah.'
              : `Kamu berhasil menemukan ${foundItems.length} dari ${gameItems.length} masakan.`}
          </div>

          <p className={styles.subText}>
            {foundItems.length === gameItems.length
              ? 'Terus pertahankan wawasanmu tentang kekayaan kuliner nusantara.'
              : 'Ayo coba lagi, tingkatkan wawasanmu tentang kuliner Jawa Tengah!'}
          </p>

          <div className={styles.actionRow}>
            <Link href="/games" className={styles.finishButton}>
              Kembali ke Lobi
            </Link>
            <button className={styles.nextButton} onClick={startGame}>
              Main Lagi
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
