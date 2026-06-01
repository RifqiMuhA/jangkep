"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { foodData, FoodQuestion } from './data';
import styles from './game3.module.css';

type GameState = 'intro' | 'playing' | 'feedback' | 'result';

export default function Game3Page() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [questions, setQuestions] = useState<FoodQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [options, setOptions] = useState<FoodQuestion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // Initialize game
  const startGame = () => {
    // Shuffle and pick 10 questions
    const shuffled = [...foodData].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);
    setQuestions(selected);
    setCurrentIndex(0);
    setScore(0);
    generateOptions(selected[0]);
    setGameState('playing');
    setTimeLeft(15);
  };

  const generateOptions = (correctFood: FoodQuestion) => {
    // Get 3 random distractors
    const distractors = foodData
      .filter((f) => f.id !== correctFood.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    // Combine and shuffle
    const allOptions = [correctFood, ...distractors].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
    setSelectedAnswer(null);
  };

  // Timer logic
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0) {
      handleTimeOut();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (answerId: string) => {
    if (gameState !== 'playing') return;
    
    setSelectedAnswer(answerId);
    if (answerId === currentQuestion.id) {
      setScore((prev) => prev + 1);
    }
    setGameState('feedback');
  };

  const handleTimeOut = () => {
    setSelectedAnswer('timeout');
    setGameState('feedback');
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      generateOptions(questions[nextIdx]);
      setGameState('playing');
      setTimeLeft(15);
    } else {
      setGameState('result');
    }
  };

  const isCorrect = selectedAnswer === currentQuestion?.id;

  return (
    <main className={styles.pageBackground}>
      {/* INTRO OVERLAY */}
      <div className={`${styles.resultOverlay} ${gameState === 'intro' ? styles.active : ''}`}>
        <div className={styles.resultCard}>
          <Image src="/games/mascot_kuliner_1.webp" alt="Si Podo" width={150} height={150} className={styles.mascotReaction} unoptimized />
          <h1 className={styles.feedbackTitle}>Kenali Masakanmu</h1>
          <p className={styles.subText}>
            Tebak masakan yang perlahan muncul dari buram. Waktu Anda hanya 15 detik per soal. Ayo buktikan pengetahuan kulinermu!
          </p>
          <button className={styles.nextButton} onClick={startGame}>Mulai Bermain</button>
        </div>
      </div>

      {gameState !== 'intro' && currentQuestion && (
        <div className={styles.gameContainer}>
          <div className={styles.header}>
            <span className={styles.progress}>Soal {currentIndex + 1} / 10</span>
            <span className={styles.timer}>
              ⏱ {timeLeft} detik
            </span>
          </div>

          <div className={styles.splitContainer}>
            {/* LEFT COLUMN: IMAGE */}
            <div className={styles.leftColumn}>
              <div className={styles.imageCard}>
                <div className={styles.imageWrapper}>
                  <Image 
                    src={currentQuestion.image} 
                    alt="Tebak Makanan" 
                    fill
                    className={`${styles.foodImage} ${gameState === 'feedback' || gameState === 'result' ? styles.revealed : ''}`}
                    style={{ filter: gameState === 'playing' ? `blur(${(timeLeft / 15) * 10}px)` : 'blur(0px)' }}
                    unoptimized
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: CONTROLS & FEEDBACK */}
            <div className={styles.rightColumn}>
              {gameState === 'playing' && (
              <div className={styles.playingArea}>
                <div className={styles.optionsGrid}>
                  {options.map((opt, index) => (
                    <button 
                      key={opt.id}
                      className={styles.optionButton}
                      onClick={() => handleAnswer(opt.id)}
                    >
                      <span className={styles.optionLetter}>{String.fromCharCode(65 + index)}</span>
                      <span className={styles.optionText}>{opt.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* INLINE FEEDBACK */}
            {gameState === 'feedback' && (
              <div className={styles.feedbackInline}>
                <div className={styles.feedbackHeader}>
                  <Image 
                    src={isCorrect ? '/games/mascot_kuliner_3.webp' : '/games/mascot_kuliner_12.webp'} 
                    alt="Mascot Reaction" 
                    width={80} 
                    height={80} 
                    className={styles.mascotReaction} 
                    unoptimized
                  />
                  <h2 className={`${styles.feedbackTitle} ${isCorrect ? styles.correctText : styles.wrongText}`}>
                    {isCorrect ? 'Benar Sekali!' : selectedAnswer === 'timeout' ? 'Waktu Habis!' : 'Kurang Tepat!'}
                  </h2>
                </div>
                {!isCorrect && (
                  <div style={{ marginBottom: '16px', color: 'var(--color-coklat-batik)', fontWeight: 'bold' }}>
                    Jawaban yang benar adalah: {currentQuestion?.name}
                  </div>
                )}
                <div className={styles.funFactBox}>
                  <strong>Tahukah kamu?</strong><br />
                  {currentQuestion?.funFact}
                </div>
                <button className={styles.nextButton} onClick={nextQuestion}>
                  {currentIndex + 1 < 10 ? 'Lanjut Soal Berikutnya' : 'Lihat Hasil Akhir'}
                </button>
              </div>
            )}
            </div>
          </div>

          <div className={styles.finishContainer}>
            <button 
              className={styles.finishButton}
              onClick={() => setGameState('result')}
            >
              Selesaikan Game
            </button>
          </div>
        </div>
      )}

      {/* FLOATING HINT (Only appears in last 8 seconds of playing) */}
      {gameState === 'playing' && timeLeft <= 8 && (
        <div className={styles.floatingHint}>
          <div className={styles.floatingBubble}>
            <strong>Petunjuk:</strong> {currentQuestion?.hint}
          </div>
          <Image src="/games/mascot_kuliner_1.webp" alt="Si Podo Hint" width={100} height={120} unoptimized className={styles.floatingMascot} />
        </div>
      )}

      {/* RESULT MODAL */}
      <div className={`${styles.resultOverlay} ${gameState === 'result' ? styles.active : ''}`}>
        <div className={styles.resultCard}>
          <Image src="/games/mascot_kuliner_1.webp" alt="Si Podo" width={150} height={150} className={styles.mascotReaction} unoptimized />
          <h2 className={styles.feedbackTitle}>Permainan Selesai!</h2>
          <div className={styles.resultScore}>Kamu menebak benar {score} dari 10 soal.</div>
          
          <p className={styles.subText}>
            {score === 100 ? 'Sempurna! Semua tebakanmu tepat sasaran!' :
             score >= 70 ? 'Hebat! Pengetahuan kulinermu sudah sangat luas.' :
             score >= 40 ? 'Lumayan! Masih banyak masakan yang bisa kamu pelajari.' :
             'Jangan menyerah! Ayo coba lagi dan kenali lebih banyak masakan Nusantara.'}
          </p>

          <div className={styles.actionRow}>
            <Link href="/games" className={`${styles.nextButton} ${styles.secondaryBtn}`}>
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
