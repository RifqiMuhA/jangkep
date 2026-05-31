'use client';

import React, { useRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import Image from 'next/image';
import styles from './RecipeBook.module.css';

interface Ingredient {
  name: string;
  description: string;
}

interface RecipeBookProps {
  ingredients: Ingredient[];
}

// @ts-ignore - react-pageflip types are missing/incomplete for functional components
const Page = React.forwardRef<HTMLDivElement, { children: React.ReactNode, density?: "hard" | "soft" }>((props, ref) => {
  return (
    <div className={styles.page} ref={ref} data-density={props.density || "soft"}>
      {props.children}
    </div>
  );
});

Page.displayName = 'Page';

export default function RecipeBook({ ingredients }: RecipeBookProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [scale, setScale] = useState(1);

  // Always use 400x560 as the base resolution so internal elements (text/images) keep their proportions
  const baseWidth = 400;
  const baseHeight = 560;

  useEffect(() => {
    let lastWidth = window.innerWidth;

    const handleResize = () => {
      const currentWidth = window.innerWidth;
      if (Math.abs(currentWidth - lastWidth) > 10) {
        lastWidth = currentWidth;
        const mobile = currentWidth < 1024;
        setIsMobile(mobile);
        
        if (mobile) {
          // On mobile, the available width is 90% of screen (due to 5% padding)
          const availableWidth = currentWidth * 0.9;
          // Calculate scale factor, max 1.0
          setScale(Math.min(availableWidth / baseWidth, 1));
        } else {
          // On desktop, the book is part of a spread, so baseWidth is one page of the spread
          // Let's ensure it fits within the desktop container 
          // Usually desktop has plenty of room, so scale is 1
          setScale(1);
        }
      }
    };

    // Initial setup
    const currentWidth = window.innerWidth;
    const mobile = currentWidth < 1024;
    setIsMobile(mobile);
    if (mobile) {
      setScale(Math.min((currentWidth * 0.9) / baseWidth, 1));
    }
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pages = [];
  let pageNum = 1;

  // Index 0: Front Cover (Right)
  pages.push(
    <Page key="cover" density="soft">
      <div className={`${styles.pageContent} ${styles.cover}`}>
        <div className={styles.javaneseScript}>ꦧꦲꦤ꧀ꦧꦲꦤ꧀</div>
        <h2 className={styles.coverTitle}>Bahan Bahan</h2>
        <div className={styles.coverSubtitle}>Manuskrip Resep</div>
      </div>
    </Page>
  );


  // Index 2: Intro Page (Right)
  pages.push(
    <Page key="intro-page" density="soft">
      <div className={`${styles.pageContent} ${styles.rightPage}`} style={{ justifyContent: 'center' }}>
        <div className={styles.javaneseScript} style={{ color: '#3B1F0C' }}>ꦧꦲꦤ꧀ꦧꦲꦤ꧀</div>
        <h2 className={styles.instructionTitle} style={{ borderBottom: 'none' }}>Daftar Bahan</h2>
        <p className={styles.ingredientDescriptionText}>Kumpulan bahan baku pilihan yang merajut cita rasa warisan leluhur.</p>
      </div>
    </Page>
  );

  // Ingredients Pages
  ingredients.forEach((ingredient, index) => {

    // Left Page (Image + Title - ODD Index)
    pages.push(
      <Page key={`ingredient-img-${index}`} density="soft">
        <div className={`${styles.pageContent} ${styles.leftPage}`}>
          <div className={styles.ingredientContainer}>
            <div className={styles.ingredientImgWrapper}>
              <Image
                src={`/kuliner/ingredients/${ingredient.name}.webp`}
                alt={ingredient.name.replace(/-/g, ' ')}
                fill
                className={styles.ingredientImage}
                unoptimized
              />
            </div>
            <h3 className={styles.ingredientName}>{ingredient.name.replace(/-/g, ' ')}</h3>
          </div>
          <div className={styles.pageNumber}>{pageNum}</div>
        </div>
      </Page>
    );
    pageNum++;

    // Right Page (Description - EVEN Index)
    pages.push(
      <Page key={`ingredient-desc-${index}`} density="soft">
        <div className={`${styles.pageContent} ${styles.rightPage}`} style={{ justifyContent: 'center' }}>
          <p className={styles.ingredientDescriptionText}>{ingredient.description}</p>
          <div className={styles.pageNumber}>{pageNum}</div>
        </div>
      </Page>
    );
    pageNum++;
  });

  // After loop, the next index is ODD (Left Page)
  // Index: ODD -> "Selamat Mencoba" (Left)
  pages.push(
    <Page key="selamat-mencoba" density="soft">
      <div className={`${styles.pageContent} ${styles.leftPage}`} style={{ justifyContent: 'center', textAlign: 'center' }}>
        <div className={styles.javaneseScript} style={{ color: '#3B1F0C' }}>ꦱꦼꦭꦩꦠ꧀ꦩꦼꦚ꧀ꦕꦺꦴꦧ</div>
        <h2 className={styles.instructionTitle} style={{ borderBottom: 'none', fontSize: '2.5rem' }}>Selamat Mencoba</h2>
      </div>
    </Page>
  );


  // Index: ODD -> Back Cover (Left)
  pages.push(
    <Page key="back-cover" density="soft">
      <div className={`${styles.pageContent} ${styles.cover} ${styles.backCover}`}>
      </div>
    </Page>
  );

  // Total pages pushed: 
  // 1 (cover) + 1 (intro) + 2*N (ingredients) + 1 (selamat) + 1 (back cover)
  // = 2N + 4 (which is an EVEN number of pages!). The last index is 2N + 3 (ODD). This is PERFECT!

  return (
    <div 
      className={styles.bookContainer}
      style={{ 
        height: isMobile ? `${baseHeight * scale}px` : 'auto',
      }}
    >
      <div 
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'top center',
          width: isMobile ? `${baseWidth}px` : `${baseWidth * 2}px`,
          height: `${baseHeight}px`,
          position: 'relative'
        }}
      >
        <div className={styles.bookSideDecorLeft}>
          <Image src="/motif/motif_kiri_buku.webp" alt="Dekorasi Kiri" fill sizes="300px" className={styles.bookSideDecorImage} unoptimized />
        </div>
        <div className={styles.bookSideDecorRight}>
          <Image src="/motif/motif_kanan_buku.webp" alt="Dekorasi Kanan" fill sizes="300px" className={styles.bookSideDecorImage} unoptimized />
        </div>
        
        {/* @ts-ignore */}
        <HTMLFlipBook
          key={`flipbook-${isMobile ? 'mobile' : 'desktop'}`}
          width={baseWidth}
          height={baseHeight}
          minWidth={baseWidth}
          maxWidth={baseWidth}
          minHeight={baseHeight}
          maxHeight={baseHeight}
          size="fixed"
          showCover={false}
          maxShadowOpacity={0.5}
          mobileScrollSupport={true}
          className="recipe-flipbook"
          usePortrait={isMobile}
        >
          {pages}
        </HTMLFlipBook>
      </div>
    </div>
  );
}
