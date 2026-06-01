'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Map from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { kotaAktif, type KotaAktif } from '@/data/peta';
import styles from './MiniPetaSection.module.css';

export default function MiniPetaSection() {
  const [selectedCity, setSelectedCity] = useState<KotaAktif | null>(null);
  const [previewCity, setPreviewCity] = useState<KotaAktif | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [svgLoaded, setSvgLoaded] = useState(false);

  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const animKeyRef = useRef(0);

  // The city to show in the panel: locked selection takes priority over hover preview
  const displayCity = isLocked ? selectedCity : previewCity || selectedCity;

  // ─── Fetch & inject SVG ───
  useEffect(() => {
    const wrapper = mapWrapperRef.current;
    if (!wrapper) return;

    fetch('/jateng_output/jateng_kabupaten.svg')
      .then((res) => res.text())
      .then((svgText) => {
        wrapper.innerHTML = svgText;
        setSvgLoaded(true);
      })
      .catch((err) => console.error('Failed to load SVG:', err));
  }, []);

  // ─── Attach SVG event listeners once loaded ───
  useEffect(() => {
    if (!svgLoaded) return;
    const wrapper = mapWrapperRef.current;
    if (!wrapper) return;

    const svgEl = wrapper.querySelector('svg');
    if (!svgEl) return;

    // 1. Mark kabupaten that have data
    kotaAktif.forEach((kota) => {
      const path = svgEl.querySelector(`#${kota.id}`);
      if (path) {
        path.classList.add('has-data');
        (path as HTMLElement).dataset.kotaId = kota.id;
      }
    });

    // 2. Hover & click on SVG paths
    const handleMouseEnter = (e: Event) => {
      const target = e.currentTarget as SVGPathElement;
      const id = target.dataset.kotaId;
      if (!id) return;
      const kota = kotaAktif.find((k) => k.id === id);
      if (kota) {
        setPreviewCity(kota);
      }
    };

    const handleMouseLeave = () => {
      setPreviewCity(null);
    };

    const handleClick = (e: Event) => {
      const target = e.currentTarget as SVGPathElement;
      const id = target.dataset.kotaId;
      if (!id) return;
      const kota = kotaAktif.find((k) => k.id === id);
      if (kota) {
        selectKota(kota);
      }
    };

    const paths = svgEl.querySelectorAll('.kab.has-data');
    paths.forEach((path) => {
      path.addEventListener('mouseenter', handleMouseEnter);
      path.addEventListener('mouseleave', handleMouseLeave);
      path.addEventListener('click', handleClick);
    });

    return () => {
      paths.forEach((path) => {
        path.removeEventListener('mouseenter', handleMouseEnter);
        path.removeEventListener('mouseleave', handleMouseLeave);
        path.removeEventListener('click', handleClick);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svgLoaded]);

  // ─── Update SVG selected class when selectedCity changes ───
  useEffect(() => {
    if (!svgLoaded) return;
    const wrapper = mapWrapperRef.current;
    if (!wrapper) return;
    const svgEl = wrapper.querySelector('svg');
    if (!svgEl) return;

    // Clear all selected
    svgEl.querySelectorAll('.kab').forEach((p) => p.classList.remove('is-selected'));

    // Set selected
    if (selectedCity) {
      const path = svgEl.querySelector(`#${selectedCity.id}`);
      if (path) path.classList.add('is-selected');
    }
  }, [selectedCity, svgLoaded]);

  // ─── Select a city (lock selection) ───
  const selectKota = useCallback((kota: KotaAktif) => {
    setSelectedCity(kota);
    setIsLocked(true);
    animKeyRef.current += 1;
  }, []);

  // ─── Handle pin click ───
  const handlePinClick = useCallback(
    (kota: KotaAktif) => {
      selectKota(kota);
    },
    [selectKota],
  );

  // ─── Handle pin hover ───
  const handlePinEnter = useCallback((kota: KotaAktif) => {
    setPreviewCity(kota);
  }, []);

  const handlePinLeave = useCallback(() => {
    setPreviewCity(null);
  }, []);

  // ─── Handle SVG area mouse leave (reset preview only if not locked) ───
  const handleMapLeave = useCallback(() => {
    setPreviewCity(null);
  }, []);

  return (
    <section className={styles.petaSection} id="peta-kuliner">
      <div className={styles.mapScene}>
        
        {/* Layer 1: Base Mapbox */}
        <div className={styles.mapboxLayer}>
          <Map
            mapboxAccessToken="pk.eyJ1IjoiZ2l0cmF5YTE0MDAiLCJhIjoiY21wcGl6YXR2MDFvMDJyc2VrOTJydHR1NyJ9.C1AZIJYhZ5ILwA6BbWrnWw"
            initialViewState={{
              longitude: 110.15,
              latitude: -7.2,
              zoom: 7.4
            }}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/gitraya1400/cmpvaoca6000r01rya7zhesa3"
            interactive={false}
            scrollZoom={false}
            dragPan={false}
            dragRotate={false}
            doubleClickZoom={false}
            touchZoomRotate={false}
            keyboard={false}
          />
        </div>

        {/* Layer 2: Dark warm overlay */}
        <div className={styles.mapOverlay} />
        <div className={styles.smokeLayer} />

        {/* Layer 3 & 4: SVG Layer & Culinary Pins */}
        <div className={styles.svgLayer} onMouseLeave={handleMapLeave}>
          <div className={styles.svgContainer} ref={mapWrapperRef}>
            {/* SVG injected here */}
          </div>
          
          {svgLoaded && kotaAktif.map((kota) => (
            <button
              key={kota.id}
              className={styles.petaPin}
              style={{ left: `${kota.pin.x}%`, top: `${kota.pin.y}%` }}
              onClick={() => handlePinClick(kota)}
              onMouseEnter={() => handlePinEnter(kota)}
              onMouseLeave={handlePinLeave}
              aria-label={`${kota.nama} — ${kota.makanan}`}
              type="button"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.petaPinImg}
                src={kota.foto}
                alt={kota.makanan}
              />
            </button>
          ))}
        </div>

        {/* Layer 5: Floating UI */}
        <div className={styles.uiLayer}>
          
          {/* Header */}
          <div className={styles.uiHeader}>
            <div className={styles.headerAksara}>ꦗꦮꦠꦼꦔꦃ</div>
            <div className={styles.uiLabel}>PETA KULINER</div>
            <h2 className={styles.uiTitle}>
              Jawa Tengah<br />di Atas Meja.
            </h2>
            <svg className={styles.uiTitleUnderline} viewBox="0 0 280 15" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5,10 Q140,0 275,8" stroke="#B8860B" strokeWidth="4" fill="none" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Panel */}
          <div ref={panelRef} className={styles.uiPanel}>
            {displayCity ? (
              <div key={animKeyRef.current} className={styles.panelActive}>
                <div className={styles.panelKota}>{displayCity.nama}</div>
                <div className={styles.panelMakanan}>{displayCity.makanan}</div>
                <div className={styles.panelDesc}>{displayCity.deskripsi}</div>
                
                <div className={styles.ctaWrap}>
                  <Link href={`/kuliner`} className={styles.btnSecondaryGold}>
                    Jelajahi Kuliner →
                  </Link>
                </div>
              </div>
            ) : (
              <div className={styles.panelEmpty}>
                <div className={styles.panelHintIcon}>🗺️</div>
                <div className={styles.panelHintText}>
                  Hover atau klik kabupaten untuk melihat kuliner khasnya
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
}
