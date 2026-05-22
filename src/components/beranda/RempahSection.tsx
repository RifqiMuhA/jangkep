'use client';

import { useEffect, useRef, useState } from 'react';
import { rempahData, type Rempah } from '@/data/rempah';
import styles from './RempahSection.module.css';

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  rempah: Rempah | null;
}

export default function RempahSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    rempah: null,
  });

  const bodyMapRef = useRef<Map<number, Rempah>>(new Map());

  // Matter.js setup (client-only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    let destroyed = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let engine: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let render: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let runner: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mouseConstraint: any;

    (async () => {
      const Matter = (await import('matter-js')).default;
      if (destroyed) return;

      const {
        Engine,
        Render,
        Runner,
        Bodies,
        Body,
        Composite,
        Mouse,
        MouseConstraint,
        Events,
      } = Matter;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Query = (Matter as any).Query;

      // Fixed dimensions for the new layout
      const width = 900;
      const height = 520;

      // Create engine with gentle gravity
      engine = Engine.create({
        gravity: { x: 0, y: 0.5 },
      });

      // Create renderer
      render = Render.create({
        element: canvasEl,
        engine,
        options: {
          width,
          height,
          wireframes: false,
          background: 'transparent',
          pixelRatio: window.devicePixelRatio || 1,
        },
      });

      // Create rempah bodies
      const rempahBodies = rempahData.map((r, i) => {
        const x = (width / (rempahData.length + 1)) * (i + 1) + (Math.random() - 0.5) * 40;
        const y = 40 + Math.random() * 100; // Spawn inside the box, below the ceiling

        const body = Bodies.rectangle(x, y, r.width, r.height, {
          restitution: 0.35,
          friction: 0.6,
          frictionAir: 0.012,
          density: 0.002,
          render: {
            sprite: {
              texture: r.asset,
              xScale: r.width / 1024,
              yScale: r.height / 1024,
            },
          },
        });
        
        // Initial random velocity
        Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 6,
          y: -Math.random() * 2,
        });

        bodyMapRef.current.set(body.id, r);
        return body;
      });

      // Invisible boundary walls matching the 900x520 box
      const ground = Bodies.rectangle(450, 540, 900, 40, { isStatic: true, render: { visible: false } });
      const wallL = Bodies.rectangle(-20, 260, 40, 520, { isStatic: true, render: { visible: false } });
      const wallR = Bodies.rectangle(920, 260, 40, 520, { isStatic: true, render: { visible: false } });
      const ceiling = Bodies.rectangle(450, -20, 900, 40, { isStatic: true, render: { visible: false } });

      // Create runner and run it first BEFORE adding bodies (Checklist #9)
      runner = Runner.create();
      Runner.run(runner, engine);
      Render.run(render);

      Composite.add(engine.world, [...rempahBodies, ground, wallL, wallR, ceiling]);

      // Mouse constraint for drag & throw
      const mouse = Mouse.create(render.canvas);
      mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: 0.05,
          damping: 0.1,
          render: { visible: false },
        },
      });
      Composite.add(engine.world, mouseConstraint);

      // Keep the render in sync with the mouse
      render.mouse = mouse;

      // Ensure mouse offset is synced with layout (Checklist #6)
      const updateMouseOffset = () => {
        if (!render.canvas) return;
        const rect = render.canvas.getBoundingClientRect();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (Mouse as any).setOffset(mouse, {
          x: rect.left,
          y: rect.top
        });
      };
      
      // We delay the offset update slightly to ensure layout is complete
      setTimeout(updateMouseOffset, 50);
      window.addEventListener('resize', updateMouseOffset);


      // Click vs Drag detection for Tooltip via startdrag/enddrag
      let pointerStartX = 0;
      let pointerStartY = 0;
      let hasDragged = false;
      let activeBodyId: number | null = null;
      let clickedEmptySpace = false;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Events.on(mouseConstraint, 'mousedown', (e: any) => {
        activeBodyId = null;
        hasDragged = false;
        pointerStartX = e.mouse.mousedownPosition.x;
        pointerStartY = e.mouse.mousedownPosition.y;
        clickedEmptySpace = true; // Assume empty until startdrag proves otherwise
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Events.on(mouseConstraint, 'startdrag', (e: any) => {
        if (e.body) {
          activeBodyId = e.body.id;
          clickedEmptySpace = false;
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Events.on(mouseConstraint, 'mousemove', (e: any) => {
        if (activeBodyId === null) return;
        const dx = e.mouse.position.x - pointerStartX;
        const dy = e.mouse.position.y - pointerStartY;
        // Threshold 8px
        if (dx * dx + dy * dy > 64) {
          hasDragged = true;
          // Hide tooltip if they start dragging
          setTooltip((prev) => (prev.visible ? { ...prev, visible: false } : prev));
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Events.on(mouseConstraint, 'enddrag', (e: any) => {
        if (!hasDragged && activeBodyId !== null) {
          const rempah = bodyMapRef.current.get(activeBodyId);
          if (rempah) {
            // Coordinate mapping as requested
            const canvas = render.canvas;
            const rect = canvas.getBoundingClientRect();
            
            const scaleX = rect.width / render.options.width;
            const scaleY = rect.height / render.options.height;
            
            const domX = e.mouse.position.x * scaleX;
            const domY = e.mouse.position.y * scaleY;
            
            const wrapperWidth = containerRef.current ? containerRef.current.clientWidth : 900;
            const tooltipWidth = 220;
            
            let finalLeft = domX;
            if (finalLeft + tooltipWidth > wrapperWidth) {
              finalLeft = wrapperWidth - tooltipWidth - 12;
            }
            if (finalLeft < 12) finalLeft = 12;
            
            let finalTop = domY - 40;
            if (finalTop < 12) finalTop = 12;
            
            setTooltip({
              visible: true,
              x: finalLeft,
              y: finalTop,
              rempah,
            });
          }
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Events.on(mouseConstraint, 'mouseup', (e: any) => {
         // Also handle clicks that don't trigger startdrag/enddrag (clicking empty space)
         if (clickedEmptySpace) {
           setTooltip((prev) => (prev.visible ? { ...prev, visible: false } : prev));
         }
      });

      // Handle scroll offset updates if the container is scrolled (Checklist #10)
      const containerElement = document.querySelector('.rempah-section');
      if (containerElement) {
        containerElement.addEventListener('scroll', updateMouseOffset);
      }

      // Store cleanup ref
      (canvasEl as HTMLDivElement & { _matterCleanup?: () => void })._matterCleanup = () => {
        window.removeEventListener('resize', updateMouseOffset);
        if (containerElement) containerElement.removeEventListener('scroll', updateMouseOffset);
      };
    })();

    return () => {
      destroyed = true;
      // Dynamic import for cleanup
      import('matter-js').then((Matter) => {
        const { Render: R, Runner: Ru, Engine: E } = Matter.default;
        if (render) R.stop(render);
        if (runner) Ru.stop(runner);
        if (engine) E.clear(engine);
        if (render?.canvas) render.canvas.remove();
      });
      bodyMapRef.current.clear();
      const el = canvasEl as HTMLDivElement & { _matterCleanup?: () => void };
      el._matterCleanup?.();
    };
  }, []);

  return (
    <section className={styles.section} id="rempah">
      <div className={styles.label}>REMPAH JAWA</div>
      <h2 className={styles.headline}>Rempah yang Menghidupkan Rasa</h2>
      
      <div className={styles.canvasWrapper} ref={containerRef}>
        {/* Matter.js canvas mounts here */}
        <div ref={canvasRef} className={styles.canvasContainer} />
        
        {/* Tooltip Overlay */}
        {tooltip.visible && tooltip.rempah && (
          <div 
            className={styles.rempahTooltip}
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            <button 
              className={styles.tooltipClose} 
              onClick={() => setTooltip({ ...tooltip, visible: false })}
              aria-label="Tutup tooltip"
            >
              ×
            </button>
            <div className={styles.tooltipRempahName}>{tooltip.rempah.nama}</div>
            <div className={styles.tooltipRole}>{tooltip.rempah.peran}</div>
            <div className={styles.tooltipDivider}></div>
            <div className={styles.tooltipLabel}>Dipakai di:</div>
            <div className={styles.tooltipFoods}>{tooltip.rempah.makanan}</div>
          </div>
        )}
      </div>

      <p className={styles.hintText}>Seret &amp; lemparkan rempah — klik untuk info</p>
      <p className={styles.pullQuote}>"Dari rempah-rempah inilah semua dimulai."</p>
    </section>
  );
}
