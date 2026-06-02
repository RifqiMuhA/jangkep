import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitText from './SplitText';
import TextType from './TextType';
import VariableProximity from './VariableProximity';
import './JangkepHero.css';

gsap.registerPlugin(useGSAP);

export default function JangkepHero() {
  const [frame, setFrame] = useState(1);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev % 3) + 1);
    }, 600); // Slower 600ms cooking animation
    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline();

    // 1. Si Podo appears immediately
    tl.fromTo('.mascot-area', 
      { scale: 0, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.5)' }
    );

    // 2. SVG Paths draw in
    tl.fromTo(['.path-bg-solid', '.path-bg-pattern'], 
      { strokeDashoffset: 3000 }, 
      { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' },
      '>' // wait for Podo
    );
    tl.fromTo('.path-stroke',
      { strokeDasharray: '0 1000' },
      { strokeDasharray: '4 8', duration: 1 },
      '<'
    );

    // 3. Text on paths fades in
    tl.fromTo('.path-text', 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.8 },
      '>'
    );

    // 4. Ingredients and Food Results start moving
    tl.fromTo('.chips-container',
      { opacity: 0 },
      { opacity: 1, duration: 1 },
      '>'
    );

  }, { scope: containerRef });

  return (
    <section className="jangkep-hero" ref={containerRef}>
      {/* Wayang Decoration (Left side, moving like playing wayang) */}
      <div className="wayang-ornament" style={{ transformOrigin: 'bottom center', animation: 'wayang-play 8s infinite ease-in-out' }}>
        <img src="/motif/wayang_2.webp" alt="Wayang" className="wayang-img" />
      </div>

      {/* Compass Decoration (Top Right) */}
      <div className="compass-ornament">
        <img src="/bg mapz/kompas.webp" alt="Kompas" className="compass-img" />
      </div>

      {/* Hero Copy (Center Layout based on Idea Image) */}
      <div className="hero-content-new">
        {/* Javanese Script Top (Jelajahi Rasa Jawa Tengah) */}
        <TextType 
          text="ꦗꦼꦭꦗꦲꦶ ꦫꦱ ꦗꦮ ꦠꦼꦔꦃ"
          typingSpeed={80}
          showCursor={false}
          loop={false}
          className="javanese-script-top"
        />

        {/* Main Title with SplitText and VariableProximity */}
        <div className="hero-headline-new">
          <SplitText
            text="Jelajahi Rasa Jawa Tengah,"
            className="headline-latin-top"
            delay={30}
            duration={1.2}
            ease="power3.out"
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
          />
          <VariableProximity
            label="Dari Cerita Jadi Peta Hidup"
            className="headline-latin-bottom"
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
          className="javanese-script-bottom"
        />

        {/* Subtitle Description */}
        <div className="hero-description-new">
          <SplitText
            text="Lebih dari sekadar peta geografis, ini adalah jendela menuju kekayaan rasa Nusantara. Temukan kisah bersejarah di balik legitnya hidangan pesisir hingga gurihnya kuliner pedalaman dalam satu penjelajahan yang menggugah selera."
            className="description-text"
            delay={10}
            duration={0.8}
            ease="power2.out"
            splitType="words"
            from={{ opacity: 0, y: 15 }}
            to={{ opacity: 1, y: 0 }}
          />
        </div>
      </div>

      {/* Cooking Flow Stage */}
      <div className="hero-cooking-stage">
        <div className="cooking-stage-inner">
          {/* SVG Paths for dashed lines and textPath */}
          <svg className="cooking-svg" viewBox="0 0 1920 600" preserveAspectRatio="xMidYMid slice">
            <defs>
              {/* Batik pattern for path background */}
              <pattern id="batik-path-bg" patternUnits="userSpaceOnUse" width="100" height="100" patternTransform="scale(0.5)">
                <image href="/batik/pattern_background.webp" width="200" height="200" />
              </pattern>

              {/* Input Path: Starts far left, makes a loop-de-loop, ends precisely at wok center (960, 330) */}
              <path id="ingredient-path" d="M -50 350 C 200 350, 300 50, 450 200 C 550 300, 450 550, 300 450 C 200 350, 350 150, 550 250 C 700 350, 800 500, 960 330" />
              {/* Output Path: Starts at wok center (960, 330), loops to far right (simpler curve) */}
              <path id="food-path" d="M 960 330 C 980 370, 1000 450, 1100 450 C 1250 450, 1300 200, 1500 150 C 1700 100, 1800 350, 1970 350" />
            </defs>

            {/* Solid Background for Text Path (Pill/Cylinder) */}
            <use href="#ingredient-path" className="path-bg-solid" />
            <use href="#food-path" className="path-bg-solid" />

            {/* Batik Pattern overlay for Text Path */}
            <use href="#ingredient-path" className="path-bg-pattern" />
            <use href="#food-path" className="path-bg-pattern" />

            {/* Visible Dashed Paths (Less visible) */}
            <use href="#ingredient-path" className="path-stroke" />
            <use href="#food-path" className="path-stroke" />

            {/* Animated Text on Paths */}
            <text className="path-text">
              <textPath href="#ingredient-path" startOffset="0%" className="text-animate">
                bawang merah • cabai • kunyit • daun salam • santan • gula jawa • rempah pasar • cerita kota • resep turun-temurun • bawang merah • cabai • kunyit • daun salam • santan • gula jawa • rempah pasar • cerita kota • resep turun-temurun •
              </textPath>
            </text>
            
            <text className="path-text">
              <textPath href="#food-path" startOffset="0%" className="text-animate">
                jadi lumpia • soto kudus • gudeg • nasi liwet • mendoan • megono • jadi lumpia • soto kudus • gudeg • nasi liwet • mendoan • megono •
              </textPath>
            </text>
          </svg>

          {/* Animated Ingredients & Foods wrapped for GSAP opacity control */}
          <div className="chips-container" style={{ opacity: 0 }}>
            <div className="ingredient-chip ing-1"><img src="/kuliner/ingredients/bawang.webp" alt="Bawang" className="chip-img" /></div>
            <div className="ingredient-chip ing-2"><img src="/kuliner/ingredients/cabai.webp" alt="Cabai" className="chip-img" /></div>
            <div className="ingredient-chip ing-3"><img src="/kuliner/ingredients/santan.webp" alt="Santan" className="chip-img" /></div>
            <div className="ingredient-chip ing-4"><img src="/kuliner/ingredients/rempah-daun.webp" alt="Daun Salam" className="chip-img" /></div>
            <div className="ingredient-chip ing-5"><img src="/kuliner/ingredients/gula-merah.webp" alt="Gula Merah" className="chip-img" /></div>

            <div className="food-chip food-1"><img src="/kuliner/gallery/soto_1.webp" alt="Soto Kudus" className="food-chip-img" /> Soto Kudus</div>
            <div className="food-chip food-2"><img src="/kuliner/gallery/lumpia_1.webp" alt="Lumpia" className="food-chip-img" /> Lumpia</div>
            <div className="food-chip food-3"><img src="/kuliner/gallery/nasi-liwet_1.webp" alt="Nasi Liwet" className="food-chip-img" /> Nasi Liwet</div>
          </div>

          {/* Mascot Center (Exactly at 960, 330) */}
          <div className="mascot-area">
            <img src={`/kuliner/podo_masak_${frame}.png`} alt="Si Podo Chef" className="podo-sprite" />
            {/* Steam effect only triggers on frame 2 */}
            <div className={`steam-container ${frame === 2 ? 'active' : ''}`}>
              <span className="steam-particle"></span>
              <span className="steam-particle"></span>
              <span className="steam-particle"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
