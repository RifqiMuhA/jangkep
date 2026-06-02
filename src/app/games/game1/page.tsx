"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, PanInfo, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { ingredients, Recipe, Ingredient } from './data';
import { kulinerData } from '@/data/kulinerData';
import styles from './game1.module.css';

type GameState = 'intro' | 'playing' | 'result';

function IngredientDraggable({ ingredient, handleDrag, handleDragEnd }: { ingredient: Ingredient, handleDrag: any, handleDragEnd: any }) {
  const [isHovered, setIsHovered] = useState(false);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig);
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const halfWidth = event.currentTarget.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  return (
    <motion.div
      drag
      dragSnapToOrigin={true}
      onDrag={handleDrag}
      onDragEnd={(e, info) => handleDragEnd(ingredient, info)}
      whileDrag={{ scale: 1.2, zIndex: 100 }}
      className={styles.ingredientItem}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <AnimatePresence mode="popLayout">
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.6 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { type: "spring", stiffness: 260, damping: 10 }
            }}
            exit={{ opacity: 0, y: 20, scale: 0.6 }}
            style={{
              translateX,
              rotate,
              x: "-50%"
            }}
            className={styles.tooltipContainer}
          >
            <div className={styles.tooltipName}>{ingredient.name}</div>
          </motion.div>
        )}
      </AnimatePresence>
      <Image
        src={ingredient.image}
        alt={ingredient.name}
        width={60}
        height={60}
        className={styles.ingredientImage}
        unoptimized
        draggable={false}
      />
    </motion.div>
  );
}

function ConfettiEffect() {
  const colors = ['#FFD700', '#FF6347', '#4CAF50', '#00BCD4', '#E91E63'];
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

export default function Game1Page() {
  const [gameState, setGameState] = useState<GameState>('playing');
  const [gameRecipes, setGameRecipes] = useState<Recipe[]>([]);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);

  const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([]);
  const [foundIngredients, setFoundIngredients] = useState<string[]>([]);

  const [timeLeft, setTimeLeft] = useState(60);
  const [isWajanActive, setIsWajanActive] = useState(false);
  const [wajanStatus, setWajanStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [splashes, setSplashes] = useState<{ id: number, x: number, y: number }[]>([]);

  const wajanRef = useRef<HTMLDivElement>(null);

  const [chatMessage, setChatMessage] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showTimeAdd, setShowTimeAdd] = useState(false);

  // Audio refs could be added here later

  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    // Generate 5 random recipes from kulinerData
    const shuffled = [...kulinerData].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    const newRecipes: Recipe[] = selected.map(k => ({
      id: k.slug,
      name: k.name,
      description: k.shortDescription,
      correctIngredients: k.ingredients.map(ing => ing.name)
    }));
    
    setGameRecipes(newRecipes);
    setGameState('playing');
    setTimeLeft(60);
    setCurrentRecipeIndex(0);
    loadRecipe(0, newRecipes);
  };

  const handleEndGame = () => {
    setGameState('result');
  };

  const loadRecipe = (index: number, recipesArr = gameRecipes) => {
    if (index >= recipesArr.length) {
      setGameState('result');
      return;
    }

    const recipe = recipesArr[index];
    setCurrentRecipe(recipe);
    setFoundIngredients([]);

    // Generate distractors
    const correctIds = recipe.correctIngredients;
    const correctIngObjs = ingredients.filter(ing => correctIds.includes(ing.id));

    const distractorsNeeded = 8 - correctIngObjs.length;
    
    const distractorObjs = ingredients
      .filter(ing => !correctIds.includes(ing.id))
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.max(0, distractorsNeeded)); // Ensure exactly 8 total slots

    // Combine and shuffle
    const mixed = [...correctIngObjs, ...distractorObjs].sort(() => 0.5 - Math.random());
    setAvailableIngredients(mixed);
  };

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

  const handleDragEnd = (ingredient: Ingredient, info: PanInfo) => {
    if (!wajanRef.current || !currentRecipe) return;

    const wajanRect = wajanRef.current.getBoundingClientRect();
    const { point } = info;

    // Check if the drop point is inside the wajan bounding box
    const isInside = (
      point.x >= wajanRect.left &&
      point.x <= wajanRect.right &&
      point.y >= wajanRect.top &&
      point.y <= wajanRect.bottom
    );

    if (isInside) {
      if (currentRecipe.correctIngredients.includes(ingredient.id) && !foundIngredients.includes(ingredient.id)) {
        // Correct ingredient!
        handleCorrectDrop(ingredient, point);
      } else {
        // Wrong ingredient!
        setWajanStatus('wrong');
        setTimeout(() => setWajanStatus('idle'), 400);
      }
    }

    setIsWajanActive(false);
  };

  const handleDrag = (event: any, info: PanInfo) => {
    if (!wajanRef.current) return;
    const wajanRect = wajanRef.current.getBoundingClientRect();
    const { point } = info;
    const isInside = (
      point.x >= wajanRect.left &&
      point.x <= wajanRect.right &&
      point.y >= wajanRect.top &&
      point.y <= wajanRect.bottom
    );
    setIsWajanActive(isInside);
  };

  const handleCorrectDrop = (ingredient: Ingredient, point: { x: number, y: number }) => {
    // Remove from available tray
    setAvailableIngredients(prev => prev.filter(ing => ing.id !== ingredient.id));

    // Add to found
    const newFound = [...foundIngredients, ingredient.id];
    setFoundIngredients(newFound);

    // Animate correct wajan
    setWajanStatus('correct');
    setTimeout(() => setWajanStatus('idle'), 500);

    // Add splash animation relative to wajan
    if (wajanRef.current) {
      const rect = wajanRef.current.getBoundingClientRect();
      const relativeX = point.x - rect.left;
      const relativeY = point.y - rect.top;

      const newSplash = { id: Date.now(), x: relativeX, y: relativeY };
      setSplashes(prev => [...prev, newSplash]);
      setTimeout(() => {
        setSplashes(prev => prev.filter(s => s.id !== newSplash.id));
      }, 500);
    }

    // Check if recipe is complete
    if (currentRecipe && newFound.length === currentRecipe.correctIngredients.length) {
      setChatMessage(`${currentRecipe.name} wes mateng!`);
      setShowConfetti(true);

      // Tambah waktu 5 detik
      setTimeLeft(prev => prev + 5);
      setShowTimeAdd(true);
      setTimeout(() => setShowTimeAdd(false), 2000);

      setTimeout(() => {
        setChatMessage(null);
        setShowConfetti(false);
        loadRecipe(currentRecipeIndex + 1);
        setCurrentRecipeIndex(prev => prev + 1);
      }, 3000);
    }
  };

  return (
    <main className={styles.pageBackground}>
      {showConfetti && <ConfettiEffect />}
      {gameState === 'playing' && currentRecipe && (
        <div className={styles.gameContainer}>
          <div className={styles.header}>
            <div className={styles.progressWrapper}>
              <span className={styles.progressText}>Masakan {currentRecipeIndex + 1} dari {gameRecipes.length}</span>
              <div className={styles.progressBarBg}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${((currentRecipeIndex + 1) / gameRecipes.length) * 100}%` }}
                />
              </div>
            </div>
            
            <div className={styles.headerControls}>
              <div className={`${styles.timer} ${timeLeft <= 10 ? styles.timerWarning : ''}`} style={{ position: 'relative' }}>
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

          <div className={styles.targetCard}>
            <div className={styles.titleWrapper}>
              <Image src="/motif/motif_button_kiri.webp" alt="Motif" width={24} height={24} className={styles.titleMotif} unoptimized />
              <h1 className={styles.targetTitle}>Ayo Masak {currentRecipe.name}!</h1>
              <Image src="/motif/motif_button_kanan.webp" alt="Motif" width={24} height={24} className={styles.titleMotif} unoptimized />
            </div>
            <p className={styles.targetDesc}>{currentRecipe.description}</p>

            <div className={styles.recipeProgress}>
              {currentRecipe.correctIngredients.map((_, i) => (
                <div key={i} className={`${styles.recipeDot} ${i < foundIngredients.length ? styles.filled : ''}`} />
              ))}
            </div>
          </div>

          {/* BOTTOM SECTION */}
          <div className={styles.bottomSection}>
            {/* WAJAN AREA - NOW ABOVE TRAY */}
            <div className={styles.wajanAreaWrapper}>
              <div className={styles.wajanContainer}>
                {/* Drop Hint */}
                <div className={styles.dropHint}>
                  <span className={styles.dropHintText}>Drop di sini</span>
                  <svg width="60" height="80" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.dropHintArrow}>
                    <path d="M 10 10 Q 50 20 40 70" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" fill="none" strokeLinecap="round"/>
                    <path d="M 25 60 L 40 75 L 55 55" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

              <div
                ref={wajanRef}
                className={`${styles.wajanPlaceholder} ${isWajanActive ? styles.wajanActive : ''}`}
              >
                {/* Efek Asap (Selalu Mengepul) */}
                <div className={styles.smokeContainer}>
                  <div className={`${styles.smoke} ${styles.smoke1}`}></div>
                  <div className={`${styles.smoke} ${styles.smoke2}`}></div>
                  <div className={`${styles.smoke} ${styles.smoke3}`}></div>
                  <div className={`${styles.smoke} ${styles.smoke4}`}></div>
                </div>

                {wajanStatus === 'correct' && (
                  <div className={styles.feedbackBadgeWrapper}>
                    <CheckCircle size={80} color="#4CAF50" fill="#fff" />
                  </div>
                )}
                {wajanStatus === 'wrong' && (
                  <div className={styles.feedbackBadgeWrapper}>
                    <XCircle size={80} color="#F44336" fill="#fff" />
                  </div>
                )}

                {splashes.map(splash => (
                  <div
                    key={splash.id}
                    className={styles.splashAnimation}
                    style={{ left: splash.x, top: splash.y }}
                  />
                ))}
              </div>
            </div>

            <div className={styles.mascotArea}>
              <Image src="/games/game1/mascot_masak.webp" alt="Si Podo Memasak" width={240} height={293} className={styles.cookingMascot} unoptimized />
              <AnimatePresence>
                {chatMessage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, x: -20, y: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, x: -20, y: 20 }}
                    className={styles.chatBubble}
                  >
                    {chatMessage}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* TRAY NOW BELOW WAJAN */}
          <div className={styles.trayContainer}>
            {availableIngredients.map(ingredient => (
              <IngredientDraggable
                key={ingredient.id}
                ingredient={ingredient}
                handleDrag={handleDrag}
                handleDragEnd={handleDragEnd}
              />
            ))}
            </div>
          </div>
        </div>
      )}

      {/* RESULT MODAL */}
      <div className={`${styles.resultOverlay} ${gameState === 'result' ? styles.active : ''}`}>
        <div className={styles.resultCard}>
          <Image src="/games/mascot_kuliner_1.webp" alt="Si Podo" width={150} height={150} className={styles.mascotReaction} unoptimized />
          <h2 className={styles.feedbackTitle}>
            {currentRecipeIndex >= gameRecipes.length ? 'Masakan Selesai!' : 'Waktune Habis!'}
          </h2>
          <div className={styles.subText} style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
            {currentRecipeIndex >= gameRecipes.length
              ? 'Luar biasa! Kamu berhasil meracik semua masakan.'
              : 'Oalah, waktunya keburu habis nih!'}
          </div>

          <p className={styles.subText}>
            {currentRecipeIndex >= gameRecipes.length
              ? 'Kemampuan meracik bumbumu sudah tidak diragukan lagi. Kamu adalah Chef sejati!'
              : 'Ojo nyerah! Ayo coba lagi dan racik bumbunya sing luwih cepet.'}
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
