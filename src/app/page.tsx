'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import Matter from 'matter-js';


function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} style={{ height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: 'var(--color-coklat-batik)' }}>
      {/* Background Image/Video placeholder */}
      <motion.div style={{ y, position: 'absolute', inset: 0, opacity: 0.4 }}>
        <div style={{ width: '100%', height: '100%', backgroundColor: '#2a1407', backgroundImage: 'url(/batik/batik_parang.webp)', backgroundSize: '200px', opacity: 0.3 }} />
      </motion.div>
      
      {/* Content */}
      <motion.div 
        style={{ opacity, position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'var(--spacing-96)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div style={{ fontFamily: 'var(--font-noto-javanese)', fontSize: '48px', color: 'var(--color-kuning-kepodang)', opacity: 0.5, marginBottom: 'var(--spacing-16)' }}>
            ꦗꦁꦏꦼꦥ꧀
          </div>
          <h1 style={{ 
            fontFamily: 'var(--font-playfair)', 
            fontSize: 'clamp(48px, 8vw, 120px)', 
            color: 'var(--color-krem-mori)', 
            lineHeight: 1.1, 
            maxWidth: '1000px',
            marginBottom: 'var(--spacing-32)'
          }}>
            Jangkep Rasane,<br />Jangkep Critane.
          </h1>
          <Link href="/maps">
            <button style={{
              backgroundColor: 'transparent',
              color: 'var(--color-kuning-kepodang)',
              border: '2px solid var(--color-emas-keris)',
              padding: '16px 32px',
              borderRadius: 'var(--radius-buttons)',
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 700,
              fontSize: 'var(--text-body)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-emas-keris)';
              e.currentTarget.style.color = 'var(--color-krem-mori)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--color-kuning-kepodang)';
            }}
            >
              Mulai Perjalanan
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

function FlavorTeaserSection() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;
    
    // Matter.js setup
    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          MouseConstraint = Matter.MouseConstraint,
          Mouse = Matter.Mouse,
          World = Matter.World,
          Bodies = Matter.Bodies;

    const engine = Engine.create();
    engineRef.current = engine;
    const world = engine.world;
    engine.gravity.y = 0.5;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: 600,
        background: 'transparent',
        wireframes: false
      }
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Add boundaries
    const ground = Bodies.rectangle(window.innerWidth / 2, 610, window.innerWidth, 20, { isStatic: true });
    const leftWall = Bodies.rectangle(-10, 300, 20, 600, { isStatic: true });
    const rightWall = Bodies.rectangle(window.innerWidth + 10, 300, 20, 600, { isStatic: true });
    World.add(world, [ground, leftWall, rightWall]);

    // Add "spices" (circles/rectangles for now since we don't have images)
    const spices = [];
    const colors = ['#C0392B', '#F5C400', '#B8860B', '#4A7C3F', '#6B3A2A'];
    for (let i = 0; i < 15; i++) {
      const isCircle = Math.random() > 0.5;
      const x = Math.random() * window.innerWidth;
      const color = colors[Math.floor(Math.random() * colors.length)];
      if (isCircle) {
        spices.push(Bodies.circle(x, -50 - (Math.random() * 500), 30 + Math.random() * 20, {
          restitution: 0.6,
          render: { fillStyle: color }
        }));
      } else {
        spices.push(Bodies.rectangle(x, -50 - (Math.random() * 500), 50 + Math.random() * 30, 50 + Math.random() * 30, {
          restitution: 0.6,
          render: { fillStyle: color }
        }));
      }
    }
    World.add(world, spices);

    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    World.add(world, mouseConstraint);
    render.mouse = mouse;

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      if (engineRef.current) {
        Engine.clear(engineRef.current);
      }
      render.canvas.remove();
      render.canvas = null as unknown as HTMLCanvasElement;
      render.context = null as unknown as CanvasRenderingContext2D;
      render.textures = {};
    };
  }, []);

  return (
    <section style={{ height: '600px', position: 'relative', backgroundColor: 'var(--color-coklat-batik)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'url(/batik/batik_parang.webp)', backgroundSize: '150px' }} />
      <div style={{ position: 'absolute', top: '100px', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none', zIndex: 10 }}>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: 'var(--text-display-sm)', color: 'var(--color-krem-mori)' }}
        >
          Dari rempah-rempah inilah semua dimulai.
        </motion.h2>
        <p style={{ color: 'var(--color-krem-tua)', fontFamily: 'var(--font-dm-sans)', marginTop: 'var(--spacing-16)' }}>
          (Klik dan lempar rempah-rempah ini)
        </p>
      </div>
      <div ref={sceneRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 5 }} />
    </section>
  );
}

function FeaturedSection() {
  const foods = [
    { name: 'Gudeg', city: 'Solo', tag: 'Manis', color: 'var(--color-rasa-manis)' },
    { name: 'Nasi Liwet', city: 'Solo', tag: 'Gurih', color: 'var(--color-rasa-gurih)' },
    { name: 'Lumpia', city: 'Semarang', tag: 'Gurih', color: 'var(--color-rasa-gurih)' },
    { name: 'Tengkleng', city: 'Solo', tag: 'Pedas', color: 'var(--color-rasa-pedas)' },
  ];

  return (
    <section style={{ padding: 'var(--spacing-160) var(--spacing-48)', backgroundColor: 'var(--color-krem-mori)' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'var(--text-display-md)', color: 'var(--color-coklat-batik)', marginBottom: 'var(--spacing-64)' }}>
          Karya Rasa Ikonik
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-32)' }}>
          {foods.map((food, i) => (
            <Link href={`/kuliner/${food.name.toLowerCase().replace(' ', '-')}`} key={i}>
              <motion.div 
                whileHover={{ y: -10, boxShadow: 'var(--shadow-card-hover)' }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  backgroundColor: 'var(--color-putih-santan)',
                  borderRadius: 'var(--radius-cards)',
                  border: '1px solid var(--color-krem-tua)',
                  boxShadow: 'var(--shadow-card)',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
              >
                <div style={{ height: '250px', backgroundColor: '#e2d5bc', position: 'relative' }}>
                  {/* Image placeholder */}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}>
                    📸
                  </div>
                </div>
                <div style={{ padding: 'var(--spacing-24)' }}>
                  <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'var(--text-heading)', color: 'var(--color-coklat-batik)', margin: '0 0 var(--spacing-8) 0' }}>
                    {food.name}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-dm-sans)', color: 'var(--color-coklat-batik)', opacity: 0.8, marginBottom: 'var(--spacing-16)' }}>
                    Asli {food.city}
                  </p>
                  <span style={{ 
                    backgroundColor: food.color, 
                    color: '#fff', 
                    padding: '4px 12px', 
                    borderRadius: 'var(--radius-badges)',
                    fontFamily: 'var(--font-dm-sans)',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}>
                    {food.tag}
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function GamesPromoSection() {
  return (
    <section style={{ 
      padding: 'var(--spacing-128) var(--spacing-48)', 
      backgroundColor: 'var(--color-coklat-batik)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'url(/batik/batik_parang.webp)', backgroundSize: '200px' }} />
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', display: 'flex', alignItems: 'center', gap: 'var(--spacing-64)', position: 'relative', zIndex: 10 }}>
        
        <div style={{ flex: 1 }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            style={{
              backgroundColor: 'var(--color-kuning-kepodang)',
              borderRadius: '50%',
              width: '400px',
              height: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '120px'
            }}
          >
            🐣
          </motion.div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ 
            backgroundColor: 'var(--color-putih-santan)', 
            padding: 'var(--spacing-24)', 
            borderRadius: 'var(--radius-bubble)',
            border: '2px solid var(--color-emas-keris)',
            marginBottom: 'var(--spacing-32)',
            display: 'inline-block',
            position: 'relative'
          }}>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 'var(--text-subheading)', fontWeight: 700, color: 'var(--color-coklat-batik)', margin: 0 }}>
              &quot;Ayo, bisa tebak ini masakan apa?&quot;
            </p>
            {/* Bubble tail */}
            <div style={{
              position: 'absolute',
              bottom: '-12px',
              left: '40px',
              width: '20px',
              height: '20px',
              backgroundColor: 'var(--color-putih-santan)',
              borderBottom: '2px solid var(--color-emas-keris)',
              borderRight: '2px solid var(--color-emas-keris)',
              transform: 'rotate(45deg)'
            }} />
          </div>
          
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'var(--text-display-sm)', color: 'var(--color-krem-mori)', marginBottom: 'var(--spacing-24)' }}>
            Uji Pengetahuan Kulinermu
          </h2>
          <p style={{ fontFamily: 'var(--font-dm-sans)', color: 'var(--color-krem-tua)', fontSize: 'var(--text-body-lg)', marginBottom: 'var(--spacing-48)', maxWidth: '500px' }}>
            Mainkan berbagai mini games seru bersama Si Podo. Racik resep rahasia, cocokkan daerah asal, dan tebak masakan yang tersembunyi!
          </p>

          <Link href="/games">
            <button style={{
              backgroundColor: 'var(--color-kuning-kepodang)',
              color: 'var(--color-coklat-batik)',
              border: 'none',
              padding: '16px 32px',
              borderRadius: 'var(--radius-buttons)',
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 700,
              fontSize: 'var(--text-body)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-button-accent)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Main Sekarang
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--color-coklat-batik)', color: 'var(--color-krem-mori)', padding: 'var(--spacing-96) var(--spacing-48) var(--spacing-48)', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '20px', backgroundImage: 'url(/batik/batik_parang.webp)', opacity: 0.1 }} />
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '32px', marginBottom: 'var(--spacing-8)', color: 'var(--color-emas-keris)' }}>
          &quot;Mangan ora mangan sing penting kumpul&quot;
        </h3>
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 'var(--text-caption)', opacity: 0.7, marginBottom: 'var(--spacing-64)' }}>
          Makan atau tidak makan, yang penting berkumpul.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-32)', marginBottom: 'var(--spacing-64)' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 500 }}>Beranda</Link>
          <Link href="/maps" style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 500 }}>Story Maps</Link>
          <Link href="/games" style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 500 }}>Mini Games</Link>
        </div>

        <div style={{ fontFamily: 'var(--font-noto-javanese)', fontSize: '32px', opacity: 0.3, marginBottom: 'var(--spacing-24)' }}>
          ꦗꦁꦏꦼꦥ꧀
        </div>
        
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 'var(--text-caption)', opacity: 0.5 }}>
          © 2026 Jangkep - Lomba Web Design. Data: Kemenparekraf.
        </p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FlavorTeaserSection />
      <FeaturedSection />
      <GamesPromoSection />
      <Footer />
    </main>
  );
}
