'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState<number | null>(null);

  const games = [
    {
      id: 1,
      title: "Racik Masakan Jawa",
      desc: "Susun bahan-bahan yang benar ke dalam wajan dari tumpukan acak. Jangan sampai salah ambil decoy!",
      icon: "🥘"
    },
    {
      id: 2,
      title: "Dari Kota Mana?",
      desc: "Tarik makanan khas ke lokasinya di peta Jawa Tengah. Awas waktumu terbatas!",
      icon: "🗺️"
    },
    {
      id: 3,
      title: "Kenali Masakanmu",
      desc: "Tebak nama masakan dari gambar yang di-blur. Buktikan kamu Empu Kuliner Jawa Tengah!",
      icon: "🔍"
    }
  ];

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--color-coklat-batik)', padding: 'var(--spacing-96) var(--spacing-24)' }}>
      {/* Background Texture */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'url(/batik/batik_parang.webp)', opacity: 0.1, pointerEvents: 'none' }} />
      
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-64)' }}>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'var(--text-display-sm)', color: 'var(--color-krem-mori)' }}>
            Arena Dolanan Si Podo
          </h1>
          <p style={{ fontFamily: 'var(--font-dm-sans)', color: 'var(--color-krem-tua)', fontSize: 'var(--text-body-lg)', maxWidth: '600px', margin: 'var(--spacing-16) auto 0' }}>
            Buktikan pengetahuan kulinermu! Kumpulkan badge dan jadilah Empu Kuliner Jawa Tengah.
          </p>
        </div>

        {/* Games Selection */}
        <AnimatePresence mode="wait">
          {!activeGame ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-32)' }}
            >
              {games.map(game => (
                <div 
                  key={game.id}
                  onClick={() => setActiveGame(game.id)}
                  style={{
                    backgroundColor: 'var(--color-putih-santan)',
                    padding: 'var(--spacing-32)',
                    borderRadius: 'var(--radius-cards)',
                    cursor: 'pointer',
                    border: '2px solid transparent',
                    transition: 'all 0.3s ease',
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-emas-keris)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}
                >
                  <div style={{ fontSize: '64px', marginBottom: 'var(--spacing-16)' }}>{game.icon}</div>
                  <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'var(--text-heading)', color: 'var(--color-coklat-batik)', marginBottom: 'var(--spacing-16)' }}>
                    {game.title}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-dm-sans)', color: 'var(--color-coklat-batik)', opacity: 0.8 }}>
                    {game.desc}
                  </p>
                  <button style={{
                    marginTop: 'auto',
                    padding: '12px 24px',
                    backgroundColor: 'var(--color-kuning-kepodang)',
                    color: 'var(--color-coklat-batik)',
                    border: 'none',
                    borderRadius: 'var(--radius-buttons)',
                    fontFamily: 'var(--font-dm-sans)',
                    fontWeight: 700
                  }}>
                    Mainkan
                  </button>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                backgroundColor: 'var(--color-krem-mori)',
                borderRadius: 'var(--radius-cards)',
                height: '600px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ padding: 'var(--spacing-24)', borderBottom: '1px solid var(--color-krem-tua)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'var(--text-heading)', color: 'var(--color-coklat-batik)', margin: 0 }}>
                  {games.find(g => g.id === activeGame)?.title}
                </h2>
                <button 
                  onClick={() => setActiveGame(null)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--color-coklat-batik)',
                    borderRadius: 'var(--radius-buttons)',
                    color: 'var(--color-coklat-batik)',
                    cursor: 'pointer'
                  }}
                >
                  Kembali
                </button>
              </div>
              
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-putih-santan)' }}>
                {/* Game Interface Placeholder */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '80px', marginBottom: 'var(--spacing-16)' }}>🚧</div>
                  <h3 style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 'var(--text-subheading)', color: 'var(--color-coklat-batik)' }}>
                    Mini Game {activeGame} Sedang Dibangun
                  </h3>
                  <p style={{ fontFamily: 'var(--font-dm-sans)', color: 'var(--color-coklat-batik)', opacity: 0.7 }}>
                    Integrasi Physics (Matter.js) dan Canvas Drag & Drop segera hadir.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
