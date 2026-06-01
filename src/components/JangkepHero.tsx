import React, { useState, useEffect } from 'react';
import './JangkepHero.css';

export default function JangkepHero() {
  const [frame, setFrame] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev % 3) + 1);
    }, 600); // Slower 600ms cooking animation
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="jangkep-hero">
      {/* Navbar Pill */}
      <div className="hero-nav-pill">
        <div className="nav-logo-circle">J</div>
        <span>Jangkep Story Maps</span>
        <div className="nav-separator"></div>
        <span>Jawa Tengah</span>
      </div>

      {/* Hero Copy */}
      <div className="hero-content">
        <div className="hero-eyebrow">DIPANDU SI PODO • PETA KULINER 3D</div>
        <h1 className="hero-headline">
          Jelajahi rasa Jawa Tengah, dari cerita jadi peta hidup.
        </h1>
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

          {/* Animated Ingredients (CSS offset-path) */}
          <div className="ingredient-chip ing-1"><img src="/kuliner/ingredients/bawang.webp" alt="Bawang" className="chip-img" /></div>
          <div className="ingredient-chip ing-2"><img src="/kuliner/ingredients/cabai.webp" alt="Cabai" className="chip-img" /></div>
          <div className="ingredient-chip ing-3"><img src="/kuliner/ingredients/santan.webp" alt="Santan" className="chip-img" /></div>
          <div className="ingredient-chip ing-4"><img src="/kuliner/ingredients/rempah-daun.webp" alt="Daun Salam" className="chip-img" /></div>
          <div className="ingredient-chip ing-5"><img src="/kuliner/ingredients/gula-merah.webp" alt="Gula Merah" className="chip-img" /></div>

          {/* Animated Food Results (CSS offset-path) */}
          <div className="food-chip food-1"><img src="/kuliner/gallery/soto_1.webp" alt="Soto Kudus" className="food-chip-img" /> Soto Kudus</div>
          <div className="food-chip food-2"><img src="/kuliner/gallery/lumpia_1.webp" alt="Lumpia" className="food-chip-img" /> Lumpia</div>
          <div className="food-chip food-3"><img src="/kuliner/gallery/nasi-liwet_1.webp" alt="Nasi Liwet" className="food-chip-img" /> Nasi Liwet</div>

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
