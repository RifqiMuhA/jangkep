'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
      <div className={styles.petaInner}>
        {/* Header */}
        <div className={styles.petaLabel}>PETA KULINER</div>
        <h2 className={styles.petaHeadline}>Jawa Tengah di Atas Meja</h2>
        <p className={styles.petaSubline}>Setiap kota punya cerita rasa</p>

        {/* Grid */}
        <div className={styles.petaGrid}>
          {/* ─── Panel Info (Kiri) ─── */}
          <div ref={panelRef}>
            {displayCity ? (
              <div
                key={animKeyRef.current}
                className={`${styles.petaPanel} ${styles.petaPanelActive}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.petaPanelFoto}
                  src={displayCity.logo}
                  alt={`Lambang ${displayCity.nama}`}
                />
                <div className={styles.petaPanelBody}>
                  <div className={styles.petaPanelKota}>{displayCity.nama}</div>
                  <div className={styles.petaPanelMakanan}>{displayCity.makanan}</div>
                  <div className={styles.petaPanelDesc}>{displayCity.deskripsi}</div>
                </div>
              </div>
            ) : (
              <div className={`${styles.petaPanel} ${styles.petaPanelEmpty}`}>
                <div className={styles.petaPanelHintIcon}>🗺️</div>
                <div className={styles.petaPanelHint}>
                  Hover atau klik kabupaten untuk melihat kuliner khasnya
                </div>
              </div>
            )}
          </div>

          {/* ─── Peta SVG (Kanan) ─── */}
          <div
            className={styles.petaMapWrapper}
            ref={mapWrapperRef}
            onMouseLeave={handleMapLeave}
          >
            {/* SVG gets injected here by useEffect */}

            {/* Pin foto makanan — rendered after SVG loads */}
            {svgLoaded &&
              kotaAktif.map((kota) => (
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
        </div>

        {/* CTA */}
        <div className={styles.petaCtaWrap}>
          <Link href="/maps" className={styles.btnSecondaryGold}>
            Jelajahi Peta Lengkap →
          </Link>
        </div>
      </div>
    </section>
  );
}
