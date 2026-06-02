'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import type { FeatureCollection } from 'geojson';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { BatikButton } from './components/BatikButton';
import { FilterBar } from './components/FilterBar';
import { StoryPanel } from './components/StoryPanel';
import { SiPodo } from './components/SiPodo';
import { AutoJourneyProgress } from './components/AutoJourneyProgress';
import { MapLegend } from './components/MapLegend';
import { MapControls } from './components/MapControls';
import ChapterCard from './components/ChapterCard';
import JangkepHero from '@/components/JangkepHero';
import AccordionModal from '@/components/AccordionModal';
import { foodsData, regions, regionCityMap } from './data/foods';
import type { Food } from './data/foods';
import { AnimatePresence, motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { kulinerData } from '@/data/kulinerData';
import './maps.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ─────────── Mapbox Config ─────────── */
mapboxgl.accessToken = 'pk.eyJ1IjoiZ2l0cmF5YTE0MDAiLCJhIjoiY21wcGl1M2hkMGpmaDJwcXBraXdobGZkdCJ9.J5D7thClJjFmcmnYmTlm3g';

const CUSTOM_STYLE = 'mapbox://styles/gitraya1400/cmppjivb8001h01qw6gqc68be';

/* ─────────── Helper: Create Polygon & Mask ─────────── */
function getHighlightGeoJSON(center: [number, number], radiusInKm: number) {
  const points = 64;
  const coords = { latitude: center[1], longitude: center[0] };
  const distanceX = radiusInKm / (111.320 * Math.cos((coords.latitude * Math.PI) / 180));
  const distanceY = radiusInKm / 110.574;

  const circleCoords = [];
  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    circleCoords.push([
      coords.longitude + distanceX * Math.cos(theta),
      coords.latitude + distanceY * Math.sin(theta)
    ]);
  }
  circleCoords.push(circleCoords[0]); // close ring

  const polygon: GeoJSON.Feature<GeoJSON.Polygon> = {
    type: 'Feature',
    geometry: { type: 'Polygon', coordinates: [circleCoords] },
    properties: {}
  };

  const holeCoords = [...circleCoords].reverse();
  const outerRing = [[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]];
  const maskPolygon: GeoJSON.Feature<GeoJSON.Polygon> = {
    type: 'Feature',
    geometry: { type: 'Polygon', coordinates: [outerRing, holeCoords] },
    properties: {}
  };

  return { polygon, maskPolygon };
}

/* ─────────── Scrollytelling Chapters ─────────── */
interface Chapter {
  id: string;
  title: string;
  javaneseTitle?: string;
  subtitle: string;
  javaneseSubtitle?: string;
  description: string;
  javaneseDescription?: string;
  location: {
    center: [number, number];
    zoom: number;
    pitch: number;
    bearing: number;
  };
  alignment: 'center' | 'left' | 'right';
  label?: string;
}

const scrollChapters: Chapter[] = [
  {
    id: 'intro',
    title: 'Perjalanan Dimulai',
    subtitle: 'MEMASUKI PETA JAWA TENGAH',
    description: 'Mari kita mulai perjalanan menelusuri kekayaan bumbu, tradisi, dan sejarah yang membentuk identitas kuliner Jawa Tengah.',
    location: { center: [110.4, -7.3], zoom: 7.8, pitch: 45, bearing: -20 },
    alignment: 'center',
  },
  {
    id: 'semarang',
    title: 'Semarang:\nPesisir & Akulturasi',
    javaneseTitle: 'ꦱꦼꦩꦫꦁ:\nꦥꦼꦱꦶꦱꦶꦂ ꧈ꦄꦏꦸꦭ꧀ꦠꦸꦫꦱꦶ',
    subtitle: 'Lumpia • Tahu Gimbal • Wingko Babat',
    javaneseSubtitle: 'ꦭꦸꦩ꧀ꦥꦶꦪ • ꦠꦲꦸꦒꦶꦩ꧀ꦧꦭ꧀ • ꦮꦶꦁꦏꦺꦴꦧꦧꦠ꧀',
    description: 'Sebagai kota pelabuhan utama, Semarang menjadi titik temu budaya Jawa dan Tionghoa, menciptakan harmoni rasa kuliner yang tak lekang oleh waktu.',
    javaneseDescription: 'ꦩꦶꦤꦁꦏ ꦏꦸꦛ ꦥꦭꦧꦸꦲꦤ꧀ ꦲꦸꦠꦩ꧈ ꦱꦼꦩꦫꦁ ꦢꦢꦶ ꦥꦥꦤ꧀ ꦥꦼꦛꦸꦏ꧀ ꦧꦸꦢꦪ ꦗꦮ ꦭꦤ꧀ ꦠꦶꦪꦺꦴꦁꦲꦺꦴꦮ꧈ ꦤ꧀ꦝꦢꦺꦏꦏꦺ ꦫꦱ ꦏꦸꦭꦶꦤꦺꦂ ꦏꦁ ꦲꦺꦤꦏ꧀ ꦭꦤ꧀ ꦲꦮꦺꦠ꧀꧈',
    location: { center: [110.45, -7.03], zoom: 11, pitch: 58, bearing: 25 },
    alignment: 'right',
  },
  {
    id: 'solo_raya',
    title: 'Solo Raya:\nWarisan Keraton',
    javaneseTitle: 'ꦱꦺꦴꦭꦺꦴꦫꦪ:\nꦮꦫꦶꦱꦤ꧀ ꦏꦿꦠꦺꦴꦤ꧀',
    subtitle: 'Nasi Liwet • Tengkleng • Bakso',
    javaneseSubtitle: 'ꦤꦱꦶꦭꦶꦮꦼꦠ꧀ • ꦠꦼꦁꦏ꧀ꦭꦺꦁ • ꦧꦏ꧀ꦱꦺꦴ',
    description: 'Di jantung budaya Jawa, kuliner Solo memancarkan keanggunan keraton. Ditambah kehangatan kaldu Bakso Wonogiri yang saling melengkapi dalam satu karesidenan.',
    javaneseDescription: 'ꦲꦶꦁ ꦥꦸꦱꦼꦂ ꦧꦸꦢꦪ ꦗꦮ꧈ ꦏꦸꦭꦶꦤꦺꦂ ꦱꦺꦴꦭꦺꦴ ꦤ꧀ꦢꦸꦮꦺꦤꦶ ꦏꦼꦲꦒꦸꦔꦤ꧀ ꦏꦿꦠꦺꦴꦤ꧀꧈ ꦢꦶꦠꦩ꧀ꦧꦃ ꦏꦭ꧀ꦢꦸ ꦧꦏ꧀ꦱꦺꦴ ꦮꦺꦴꦤꦺꦴꦒꦶꦫꦶ ꦏꦁ ꦔꦁꦒꦼꦠꦏꦺ ꦲꦶꦁ ꦱꦮꦶꦗꦶꦤꦶꦁ ꦏꦫꦺꦱꦶꦢꦺꦤꦤ꧀꧈',
    location: { center: [110.82, -7.56], zoom: 12.5, pitch: 55, bearing: -20 },
    alignment: 'left',
  },
  {
    id: 'pantura_timur',
    title: 'Pantura Timur:\nJejak Wali & Harmoni',
    javaneseTitle: 'ꦥꦤ꧀ꦠꦸꦫꦠꦶꦩꦸꦂ:\nꦗꦼꦗꦏ꧀ ꦮꦭꦶ ꧈ꦲꦂꦩꦺꦴꦤꦶ',
    subtitle: 'Garang Asem • Soto Kudus • Nasi Gandul',
    javaneseSubtitle: 'ꦒꦫꦁꦄꦱꦼꦩ꧀ • ꦱꦺꦴꦠꦺꦴꦏꦸꦢꦸꦱ꧀ • ꦤꦱꦶꦒꦤ꧀ꦢꦸꦭ꧀',
    description: 'Dari Demak hingga Jepara, deretan pesisir utara ini menyimpan sajian khas yang kaya kaldu dan bumbu. Merupakan perwujudan akulturasi maritim dan toleransi antar umat.',
    javaneseDescription: 'ꦱꦏ ꦢꦼꦩꦏ꧀ ꦠꦼꦏꦤ꧀ ꦗꦼꦥꦫ꧈ ꦥꦼꦱꦶꦱꦶꦂ ꦭꦺꦴꦂ ꦲꦶꦏꦶ ꦤ꧀ꦢꦸꦮꦺ ꦥꦔꦤꦤ꧀ ꦏꦁ ꦏꦪ ꦏꦭ꧀ꦢꦸ ꦭꦤ꧀ ꦧꦸꦩ꧀ꦧꦸ꧈ ꦩꦶꦤꦁꦏ ꦧꦸꦏ꧀ꦠꦶ ꦄꦏꦸꦭ꧀ꦠꦸꦫꦱꦶ ꦩꦫꦶꦠꦶꦩ꧀ ꦭꦤ꧀ ꦠꦺꦴꦭꦺꦫꦤ꧀ꦱꦶ꧈',
    location: { center: [110.85, -6.78], zoom: 10.2, pitch: 55, bearing: 30 },
    alignment: 'right',
  },
  {
    id: 'kedu_raya',
    title: 'Kedu Raya:\nKuliner Kaki Gunung',
    javaneseTitle: 'ꦏꦼꦢꦸꦫꦪ:\nꦏꦸꦭꦶꦤꦺꦂ ꦏꦏꦶ ꦒꦸꦤꦸꦁ',
    subtitle: 'Mie Ongklok • Carica • Getuk',
    javaneseSubtitle: 'ꦩꦶꦲꦺꦎꦁꦏ꧀ꦭꦺꦴꦏ꧀ • ꦕꦫꦶꦕ • ꦒꦼꦛꦸꦏ꧀',
    description: 'Terjepit gunung-gunung berapi raksasa, kawasan Magelang dan Wonosobo menyimpan kekayaan kuliner dataran tinggi. Hangat, manis, dan menyegarkan.',
    javaneseDescription: 'ꦏꦗꦼꦥꦶꦠ꧀ ꦒꦸꦤꦸꦁ ꦒꦸꦤꦸꦁ ꦒꦼꦢꦺ꧈ ꦏꦮꦱꦤ꧀ ꦩꦒꦼꦭꦁ ꦭꦤ꧀ ꦮꦺꦴꦤꦺꦴꦱꦺꦴꦧꦺꦴ ꦚꦶꦩ꧀ꦥꦼꦤ꧀ ꦏꦏꦪꦤ꧀ ꦏꦸꦭꦶꦤꦺꦂ ꦥꦒꦸꦤꦸꦔꦤ꧀꧈ ꦲꦔꦼꦠ꧀꧈ ꦩꦤꦶꦱ꧀꧈ ꦭꦤ꧀ ꦚꦼꦒꦼꦫꦏꦺ꧈',
    location: { center: [110.10, -7.45], zoom: 10.5, pitch: 58, bearing: 35 },
    alignment: 'left',
  },
  {
    id: 'banyumas_raya',
    title: 'Lembah Serayu:\nHangat di Balik Dingin',
    javaneseTitle: 'ꦊꦩ꧀ꦧꦃꦱꦼꦫꦪꦸ:\nꦲꦔꦼꦠ꧀ ꦲꦶꦁ ꦮալꦶꦏ꧀ ꦲꦝꦼꦩ꧀',
    subtitle: 'Tempe Mendoan • Dawet Ayu',
    javaneseSubtitle: 'ꦠꦺꦩ꧀ꦥꦺꦩꦼꦤ꧀ꦢꦺꦴꦮꦤ꧀ • ꦢꦮꦼꦠ꧀ꦄꦪꦸ',
    description: 'Dari dataran tinggi hingga lembah Sungai Serayu di Banyumas dan Banjarnegara. Cuaca sejuk melahirkan sajian hangat seperti Mendoan dan segarnya Dawet Ayu.',
    javaneseDescription: 'ꦱꦏ ꦥꦒꦸꦤꦸꦔꦤ꧀ ꦠꦼꦏꦤ꧀ ꦊꦩ꧀ꦧꦃ ꦏꦭꦶ ꦱꦼꦫꦪꦸ ꦲꦶꦁ ꦧꦚꦸꦩꦱ꧀ ꦭꦤ꧀ ꦧꦤ꧀ꦗꦂꦤꦼꦒꦫ꧈ ꦲꦮ ꦲꦝꦼꦩ꧀ ꦔ꧀ꦭꦲꦶꦫꦏꦺ ꦥꦔꦤꦤ꧀ ꦲꦔꦼꦠ꧀ ꦏꦪ ꦩꦼꦤ꧀ꦢꦺꦴꦮꦤ꧀ ꦭꦤ꧀ ꦱꦼꦒꦼꦂꦫꦺ ꦢꦮꦼꦠ꧀ ꦄꦪꦸ꧈',
    location: { center: [109.50, -7.48], zoom: 11, pitch: 60, bearing: -50 },
    alignment: 'right',
  },
  {
    id: 'blora',
    title: 'Blora:\nKekayaan Rasa Timur',
    javaneseTitle: 'ꦧ꧀ꦭꦺꦴꦫ:\nꦏꦏꦪꦤ꧀ ꦫꦱ ꦠꦶꦩꦸꦂ',
    subtitle: 'Sate Ayam Blora',
    javaneseSubtitle: 'ꦱꦠꦺꦄꦪꦩ꧀ꦧ꧀ꦭꦺꦴꦫ',
    description: 'Menyusuri sisi timur Jawa Tengah, kita disuguhkan kelembutan Sate Ayam Blora dengan siraman bumbu kacang yang melimpah dan gurih.',
    javaneseDescription: 'ꦚꦸꦱꦸꦫꦶ ꦱꦶꦱꦶ ꦮꦺꦠꦤ꧀ ꦗꦮ ꦠꦼꦔꦃ꧈ ꦏꦶꦠ ꦢꦶꦱꦸꦒꦸꦲꦶ ꦏꦊꦩ꧀ꦧꦸꦠꦤ꧀ ꦱꦠꦺ ꦄꦪꦩ꧀ ꦧ꧀ꦭꦺꦴꦫ ꦏꦫꦺꦴ ꦱꦶꦫꦩꦤ꧀ ꦧꦸꦩ꧀ꦧꦸ ꦏꦕꦁ ꦏꦁ ꦩ꧀ꦭꦶꦩ꧀ꦥꦃ ꦭꦤ꧀ ꦒꦸꦫꦶꦃ꧈',
    location: { center: [111.45, -7.15], zoom: 11, pitch: 55, bearing: -20 },
    alignment: 'left',
  },
  {
    id: 'pemalang',
    title: 'Pemalang:\nPesisir Pantura Barat',
    javaneseTitle: 'ꦥꦼꦩꦭꦁ:\nꦥꦼꦱꦶꦱꦶꦂ ꦥꦤ꧀ꦠꦸꦫ ꦏꦸꦭꦺꦴꦤ꧀',
    subtitle: 'Nasi Grombyang',
    javaneseSubtitle: 'ꦤꦱꦶꦒꦿꦺꦴꦩ꧀ꦧ꧀ꦪꦁ',
    description: 'Berada di jalur perdagangan legendaris Daendels, Pemalang menyajikan Nasi Grombyang — potongan daging kerbau empuk dengan kuah kluwek berlimpah.',
    javaneseDescription: 'ꦢꦸꦩꦸꦤꦸꦁ ꦲꦶꦁ ꦢꦭꦤ꧀ ꦥꦒꦸꦪꦸꦧꦤ꧀ ꦢꦲꦺꦤ꧀ꦢꦼꦭ꧀ꦱ꧀꧈ ꦥꦼꦩꦭꦁ ꦚꦗꦶꦏꦏꦺ ꦤꦱꦶ ꦒꦿꦺꦴꦩ꧀ꦧ꧀ꦪꦁ — ꦥꦺꦴꦠꦺꦴꦔꦤ꧀ ꦢꦒꦶꦁ ꦏꦼꦧꦺꦴ ꦲꦼꦩ꧀ꦥꦸꦏ꧀ ꦏꦫꦺꦴ ꦏꦸꦮꦃ ꦏ꧀ꦭꦸꦮꦼꦏ꧀ ꦏꦁ ꦩ꧀ꦭꦶꦩ꧀ꦥꦃ꧈',
    location: { center: [109.42, -6.95], zoom: 11, pitch: 55, bearing: 15 },
    alignment: 'right',
  },
  {
    id: 'explore',
    title: 'Kini, Giliranmu',
    subtitle: 'JELAJAHI PETA KULINER',
    description: 'Cerita ini belum selesai. Jelajahi peta untuk menemukan lebih banyak rahasia kuliner, atau biarkan Si Podo memandumu melalui Tur Otomatis ke setiap sudut Jawa Tengah.',
    location: { center: [110.4, -7.3], zoom: 8.5, pitch: 45, bearing: -15 },
    alignment: 'center',
  },
];

const INITIAL_VIEW = scrollChapters[0].location;

// Map chapter ID to cities for filtering kulinerData
const chapterOriginMap: Record<string, string[]> = {
  semarang: ['Semarang'],
  solo_raya: ['Solo', 'Wonogiri'],
  pantura_timur: ['Demak', 'Kudus', 'Pati', 'Jepara'],
  kedu_raya: ['Wonosobo', 'Magelang'],
  banyumas_raya: ['Banyumas', 'Banjarnegara'],
  blora: ['Blora'],
  pemalang: ['Pemalang']
};

const chapterMascotMap: Record<string, string> = {
  semarang: '/kuliner/mascot_kuliner_11.webp', // Lumpia
  solo_raya: '/kuliner/mascot_kuliner_2.webp', // Nasi Liwet Solo
  pantura_timur: '/kuliner/mascot_kuliner_6.webp', // Soto Kudus
  kedu_raya: '/kuliner/mascot_kuliner_7.webp', // Getuk Lindri
  banyumas_raya: '/kuliner/mascot_kuliner_5.webp', // Tempe Mendoan
  blora: '/kuliner/mascot_kuliner_3.webp', // Sate Blora
  pemalang: '/kuliner/mascot_kuliner_13.webp', // Nasi Grombyang
};

const CHAPTER_GALLERIES: Record<string, any[]> = {};
for (const [chapterId, origins] of Object.entries(chapterOriginMap)) {
  CHAPTER_GALLERIES[chapterId] = kulinerData
    .filter(item => origins.includes(item.origin))
    .slice(0, 3)
    .map(item => ({
      id: item.slug,
      url: (item.galleryImages && item.galleryImages.length > 0) ? item.galleryImages[0] : (item.locationImage || ''),
      title: item.name,
      subtitle: `${item.tasteProfile} • ${item.category}`,
      description: item.shortDescription
    }));
}

export default function StoryMapsClient() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const mascotMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const mascotAnimRef = useRef<any>(null); // Referensi untuk Lottie player
  const highlightMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const curtainRef = useRef<HTMLDivElement>(null);
  const firstMapTriggerRef = useRef<HTMLDivElement>(null);
  const isJumpingRef = useRef<boolean>(false);
  const activeChapterRef = useRef<number>(-1);

  /* ── Story mode vs Explore mode ── */
  const [mode, setMode] = useState<'story' | 'explore'>('story');
  const [activeChapter, setActiveChapter] = useState(-1); // -1 means bridging intro
  const [isInMapSection, setIsInMapSection] = useState(false); // true only when past bridging sections
  const [activeFoodItems, setActiveFoodItems] = useState<Record<string, any>>({});

  /* ── Si Podo Mascot States & Effects ── */
  const [peekingFrame, setPeekingFrame] = useState(1);
  const [flyingFrame, setFlyingFrame] = useState(1);

  // Cycle animation frames for peeking and flying overlays
  useEffect(() => {
    if (mode !== 'story') return;
    const peekingInterval = setInterval(() => {
      setPeekingFrame((f) => {
        if (f === 1) return Math.random() > 0.4 ? 2 : 1;
        if (f === 2) return Math.random() > 0.5 ? 3 : 1;
        return 2;
      });
    }, 450);

    const flyingInterval = setInterval(() => {
      setFlyingFrame((f) => (f % 3) + 1);
    }, 200);

    return () => {
      clearInterval(peekingInterval);
      clearInterval(flyingInterval);
    };
  }, [mode]);

  // Dynamically control Mapbox mascot marker visibility (hide in intro, show in regions)
  useEffect(() => {
    if (mascotMarkerRef.current) {
      const el = mascotMarkerRef.current.getElement();
      if (el) {
        el.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        if (activeChapter >= 1) {
          el.style.display = 'flex';
          // small timeout to allow display: flex to apply before transitioning opacity
          setTimeout(() => {
            if (mascotMarkerRef.current) {
              mascotMarkerRef.current.getElement().style.opacity = '1';
              mascotMarkerRef.current.getElement().style.pointerEvents = 'auto';
            }
          }, 50);
        } else {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          // Wait for fade out then hide
          setTimeout(() => {
            if (mascotMarkerRef.current && activeChapter < 1) {
              mascotMarkerRef.current.getElement().style.display = 'none';
            }
          }, 600);
        }
      }
    }
  }, [activeChapter]);

  // Keep activeChapterRef in sync
  useEffect(() => {
    activeChapterRef.current = activeChapter;
  }, [activeChapter]);

  // Update thought bubble and pin data when chapter or food selection changes
  useEffect(() => {
    if (!mascotMarkerRef.current) return;
    const container = mascotMarkerRef.current.getElement();
    const walker = container.querySelector('.si-podo-walker') as HTMLDivElement;
    if (!walker) return;

    if (activeChapter >= 1 && activeChapter < scrollChapters.length - 1) {
      const chapter = scrollChapters[activeChapter];
      const foodItem = activeFoodItems[chapter.id] || CHAPTER_GALLERIES[chapter.id]?.[0];
      
      const bubbleText = walker.querySelector('.bubble-text');
      const pinImg = walker.querySelector('.pin-image') as HTMLImageElement;
      
      if (foodItem) {
        if (bubbleText) bubbleText.textContent = `"${foodItem.title} enak tenan!"`;
        if (pinImg) pinImg.src = foodItem.url;
      }

      const mascotUrl = chapterMascotMap[chapter.id] || '/kuliner/mascot_kuliner_1.webp';
      container.dataset.mascotUrl = mascotUrl;

      if (walker.classList.contains('is-standing')) {
        const img = walker.querySelector('.si-podo-img') as HTMLImageElement;
        if (img) img.src = mascotUrl;
      }
    }
  }, [activeChapter, activeFoodItems]);

  /* ── Explore mode state ── */
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [activeRegion, setActiveRegion] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFoods = useMemo(() => {
    if (mode === 'story') {
      if (activeChapter >= 1 && activeChapter < scrollChapters.length - 1) {
        const chapter = scrollChapters[activeChapter];
        const origins = chapterOriginMap[chapter.id] || [];
        const baseFoods = foodsData.filter((f) => origins.includes(f.city));
        
        if (baseFoods.length === 0) return [];

        const randomized: Food[] = [];
        const centerLng = chapter.location.center[0];
        const centerLat = chapter.location.center[1];

        // Generate 5 scattered pins to make the map look rich (Figma design)
        for (let i = 0; i < 5; i++) {
          const food = baseFoods[i % baseFoods.length];
          const angle = i * (Math.PI * 2 / 5);
          // deterministic distance
          const dist = 0.05 + (i % 2) * 0.05; 
          randomized.push({
            ...food,
            id: `${food.id}-rand-${i}`,
            longitude: centerLng + Math.cos(angle) * dist,
            latitude: centerLat + Math.sin(angle) * dist,
            image: `/kuliner/mascot_ngintip_${(i % 4) + 1}.webp`
          });
        }
        return randomized;
      }
      return [];
    }

    let filtered = foodsData;
    if (activeRegion !== 'Semua') {
      const cities = regionCityMap[activeRegion];
      filtered = filtered.filter((f) => cities.includes(f.city));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (f) => f.name.toLowerCase().includes(q) || f.city.toLowerCase().includes(q),
      );
    }
    return filtered;
  }, [activeRegion, searchQuery, mode, activeChapter]);

  const [isMapLoaded, setIsMapLoaded] = useState(false);

  /* ── Auto Tour ── */
  const [isAutoTourActive, setIsAutoTourActive] = useState(false);
  const [autoTourIndex, setAutoTourIndex] = useState(0);
  const [isAutoTourPaused, setIsAutoTourPaused] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const autoTourTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentAutoTourFood = isAutoTourActive && filteredFoods.length > 0
    ? filteredFoods[autoTourIndex % filteredFoods.length]
    : null;

  const handleMarkerClick = useCallback((food: Food) => {
    setSelectedFood(food);
    setIsAutoTourActive(false);
    if (autoTourTimerRef.current) clearTimeout(autoTourTimerRef.current);
    mapRef.current?.flyTo({
      center: [food.longitude, food.latitude],
      zoom: 12,
      pitch: 50,
      bearing: 20,
      duration: 1500,
      essential: true,
    });
  }, []);

  // ═══════════ MAPBOX INIT ═══════════
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: CUSTOM_STYLE,
      center: INITIAL_VIEW.center,
      zoom: INITIAL_VIEW.zoom,
      pitch: INITIAL_VIEW.pitch,
      bearing: INITIAL_VIEW.bearing,
      antialias: true,
      attributionControl: false,
      interactive: mode === 'explore',
    });

    let flyInterval: ReturnType<typeof setInterval>;

    map.on('style.load', () => {
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      });
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.8 });

      map.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 45.0],
          'sky-atmosphere-sun-intensity': 5,
        },
      });

      map.setFog({
        color: '#1A0A02',
        'high-color': '#3B1F0C',
        'horizon-blend': 0.05,
        'space-color': '#000000',
        'star-intensity': 0.1,
      });

      // ── LIGHTS (wajib untuk Mapbox Standard agar fill-extrusion terlihat) ──
      try {
        map.setLights([{
          id: 'flat-light',
          type: 'flat',
          properties: {
            color: 'white',
            intensity: 0.6,
          }
        }]);
      } catch (e) {
        console.log('setLights not supported on this style, skipping.');
      }

      // ── ANIMATED BATIK PATTERN ──
      const batikImg = new Image();
      batikImg.src = '/batik/batik_parang.webp';
      batikImg.onload = () => {
        const size = 128; // better quality
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.drawImage(batikImg, 0, 0, size, size);
        if (!map.hasImage('batik-pattern')) {
          map.addImage('batik-pattern', ctx.getImageData(0, 0, size, size));
          // Apply the pattern to the line layer once loaded by recreating it
          if (map.getLayer('region-highlight-line')) {
            map.removeLayer('region-highlight-line');
            map.addLayer({
              id: 'region-highlight-line',
              type: 'line',
              source: 'region-highlight-source',
              paint: {
                'line-pattern': 'batik-pattern',
                'line-width': 12,
                'line-opacity': 1,
                'line-opacity-transition': { duration: 1000 }
              }
            });
          }
        }
        
        let offset = 0;
        let lastTime = 0;
        const animatePattern = (time: number) => {
          if (!mapRef.current) return;
          if (time - lastTime > 30) {
            lastTime = time;
            if (map.hasImage('batik-pattern')) {
              offset = (offset + 1) % size; // Move 1px per frame
              ctx.clearRect(0, 0, size, size);
              
              // Draw translated to create infinite horizontal scroll effect
              ctx.drawImage(batikImg, offset, 0, size, size);
              ctx.drawImage(batikImg, offset - size, 0, size, size);
              
              map.updateImage('batik-pattern', ctx.getImageData(0, 0, size, size));
              map.triggerRepaint(); // force redraw
            }
          }
          requestAnimationFrame(animatePattern);
        };
        requestAnimationFrame(animatePattern);
      };

      // ── ADD MASCOT MARKER (EMOJI / IMG) ──
      const mascotContainer = document.createElement('div');
      mascotContainer.className = 'si-podo-container-map';
      mascotContainer.style.width = '120px';
      mascotContainer.style.height = '120px';
      mascotContainer.style.display = 'none'; // Hide completely during intro
      mascotContainer.style.justifyContent = 'center';
      mascotContainer.style.alignItems = 'center';
      mascotContainer.style.opacity = '0'; // Hide initially during intro
      mascotContainer.style.pointerEvents = 'none';

      const mascotInner = document.createElement('div');
      mascotInner.className = 'si-podo-walker';
      mascotInner.style.width = '100%';
      mascotInner.style.height = '100%';
      mascotInner.style.display = 'flex';
      mascotInner.style.justifyContent = 'center';
      mascotInner.style.alignItems = 'center';

      const mascotImg = document.createElement('img');
      mascotImg.className = 'si-podo-img';
      mascotImg.src = '/kuliner/sejarah/terbang_1.webp';
      mascotImg.style.width = '100%';
      mascotImg.style.height = '100%';
      mascotImg.style.objectFit = 'contain';
      mascotImg.style.filter = 'drop-shadow(0px 8px 16px rgba(0,0,0,0.5))';

      // Thought bubble
      const thoughtBubble = document.createElement('div');
      thoughtBubble.className = 'podo-thought-bubble';
      thoughtBubble.innerHTML = `
        <div class="bubble-text"></div>
        <div class="bubble-tail-1"></div>
        <div class="bubble-tail-2"></div>
      `;
      
      // Popup pin
      const popupPin = document.createElement('div');
      popupPin.className = 'podo-popup-pin';
      popupPin.innerHTML = `
        <img class="pin-image" src="" alt="Food" />
      `;

      mascotInner.appendChild(thoughtBubble);
      mascotInner.appendChild(popupPin);
      mascotInner.appendChild(mascotImg);
      mascotContainer.appendChild(mascotInner);

      const mMarker = new mapboxgl.Marker({ element: mascotContainer, anchor: 'center' })
        .setLngLat(INITIAL_VIEW.center)
        .addTo(map);

      mascotMarkerRef.current = mMarker;

      // ── Mascot Flying Frame Cycler ──
      let frame = 1;
      flyInterval = setInterval(() => {
        const walker = mascotContainer.querySelector('.si-podo-walker');
        if (walker) {
          const img = walker.querySelector('.si-podo-img') as HTMLImageElement;
          if (img) {
            if (walker.classList.contains('is-walking')) {
              frame = (frame % 3) + 1;
              img.src = `/kuliner/sejarah/terbang_${frame}.webp`;
            } else if (walker.classList.contains('is-standing')) {
              img.src = mascotContainer.dataset.mascotUrl || '/kuliner/mascot_kuliner_1.webp';
            } else {
              img.src = '/kuliner/sejarah/terbang_1.webp';
            }
          }
        }
      }, 200);

      // Register map events for manual jumping sync
      map.on('move', () => {
        if (isJumpingRef.current && mascotMarkerRef.current) {
          mascotMarkerRef.current.setLngLat(map.getCenter());
        }
      });

      map.on('moveend', () => {
        if (isJumpingRef.current) {
          isJumpingRef.current = false;
          const walker = mascotMarkerRef.current?.getElement().querySelector('.si-podo-walker');
          if (walker) {
            walker.classList.remove('is-walking');
            walker.classList.add('is-standing');
            
            const activeIdx = activeChapterRef.current;
            if (activeIdx >= 0 && activeIdx < scrollChapters.length) {
              const activeId = scrollChapters[activeIdx]?.id;
              if (activeId) {
                const mascotUrl = chapterMascotMap[activeId] || '/kuliner/mascot_kuliner_1.webp';
                const img = walker.querySelector('.si-podo-img') as HTMLImageElement;
                if (img) img.src = mascotUrl;
              }
            }
          }
        }
      });

      // ── WORLD DIMMING LAYER (Hides the bright green base map) ──
      map.addSource('world-dim-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]]
            },
            properties: {}
          }]
        }
      });

      map.addLayer({
        id: 'world-dim-layer',
        type: 'fill',
        source: 'world-dim-source',
        paint: {
          'fill-color': '#000000',
          'fill-opacity': 0.85, /* Set to dark by default for premium look */
          'fill-opacity-transition': { duration: 1000, delay: 0 }
        }
      });

      // ── REGION HIGHLIGHT SOURCE (for dim mask data) ──
      map.addSource('region-highlight-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });

      map.addLayer({
        id: 'region-highlight-fill',
        type: 'fill',
        source: 'region-highlight-source',
        paint: {
          'fill-color': '#F5C400',
          'fill-opacity': 0.05, // very subtle fill
          'fill-opacity-transition': { duration: 1000 }
        }
      });

      // Outer glow for the bold line (very wide, soft ambient glow)
      map.addLayer({
        id: 'region-highlight-glow-outer',
        type: 'line',
        source: 'region-highlight-source',
        paint: {
          'line-color': '#F5C400',
          'line-width': 32,
          'line-opacity': 0.45,
          'line-blur': 24,
          'line-opacity-transition': { duration: 1000 }
        }
      });

      // Inner glow (medium width, vibrant neon glow)
      map.addLayer({
        id: 'region-highlight-glow-inner',
        type: 'line',
        source: 'region-highlight-source',
        paint: {
          'line-color': '#FFA500', // Neon orange-gold accent
          'line-width': 16,
          'line-opacity': 0.8,
          'line-blur': 8,
          'line-opacity-transition': { duration: 1000 }
        }
      });

      // Main accent border line
      map.addLayer({
        id: 'region-highlight-line',
        type: 'line',
        source: 'region-highlight-source',
        paint: {
          'line-color': '#F5C400',
          'line-width': 8,
          'line-opacity': 0.9,
          'line-blur': 1,
          'line-opacity-transition': { duration: 1000 }
        }
      });

      // Ultra-bright core (high-intensity white filament light source)
      map.addLayer({
        id: 'region-highlight-line-core',
        type: 'line',
        source: 'region-highlight-source',
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 3,
          'line-opacity': 0.95,
          'line-blur': 0,
          'line-opacity-transition': { duration: 1000 }
        }
      });

    // ── EXTRUSION LAYER REMOVED BY USER REQUEST ──
    });

    map.on('load', () => setIsMapLoaded(true));

    mapRef.current = map;
    return () => { 
      clearInterval(flyInterval);
      map.remove(); 
      mapRef.current = null; 
    };
  }, [mode]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (mode === 'story') {
      mapRef.current.scrollZoom.disable();
      mapRef.current.boxZoom.disable();
      mapRef.current.dragRotate.disable();
      mapRef.current.dragPan.disable();
      mapRef.current.keyboard.disable();
      mapRef.current.doubleClickZoom.disable();
      mapRef.current.touchZoomRotate.disable();
    } else {
      mapRef.current.scrollZoom.enable();
      mapRef.current.boxZoom.enable();
      mapRef.current.dragRotate.enable();
      mapRef.current.dragPan.enable();
      mapRef.current.keyboard.enable();
      mapRef.current.doubleClickZoom.enable();
      mapRef.current.touchZoomRotate.enable();
    }
  }, [mode, isMapLoaded]);

  // ═══════════ SCROLLYTELLING — GSAP ScrollTrigger ═══════════
  useGSAP(() => {
    if (mode !== 'story' || !isMapLoaded || !scrollContainerRef.current) return;

    const triggers: ScrollTrigger[] = [];

    // 0. Page load entrance animations for JangkepHero
    gsap.fromTo('.hero-headline', 
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }
    );
    gsap.fromTo('.hero-eyebrow',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.0, delay: 0.3, ease: 'power2.out' }
    );
    gsap.fromTo('.hero-nav-pill',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1.0, delay: 0.6, ease: 'power2.out' }
    );
    gsap.fromTo('.hero-cooking-stage',
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, delay: 0.4, ease: 'power3.out' }
    );

    // 1. (Hero zoom removed, hero will scroll up normally)

    // 1b. Horizontal Scroll Sections
    const horizontalWrapper = document.querySelector('.horizontal-scroll-wrapper');
    const horizontalContainer = document.querySelector('.horizontal-scroll-container');
    const horizontalPanels = gsap.utils.toArray('.horizontal-panel');
    if (horizontalWrapper && horizontalContainer && horizontalPanels.length > 0) {
      ScrollTrigger.create({
        trigger: horizontalWrapper,
        start: 'top top',
        end: `+=${100 * horizontalPanels.length}%`,
        pin: true,
        animation: gsap.to(horizontalContainer, {
          x: () => -(horizontalContainer.scrollWidth - window.innerWidth),
          ease: 'none'
        }),
        scrub: 1,
        invalidateOnRefresh: true // recalculates width if window resizes
      });

      // Spice Route entrance — triggered via horizontal scroll progress
      // IntersectionObserver doesn't work inside GSAP pinned containers (CSS transform, not scroll)
      // So we hook into the scroll trigger's progress instead.
      let spiceTriggered = false;
      const spiceTl = gsap.timeline({ paused: true });

      const setupSpiceTimeline = () => {
        const spicePoints = Array.from(document.querySelectorAll<HTMLElement>('.spice-point-animated'));
        const spiceDots   = Array.from(document.querySelectorAll<HTMLElement>('.spice-dot-animated'));
        const spiceLine   = document.querySelector('.spice-line-animated');

        if (spicePoints.length === 0 || !spiceLine) return null;

        spiceTl.clear();
        
        // The total animation duration for the line
        const totalDuration = 2;
        
        // 1. Animate the line growing from left to right
        spiceTl.to(spiceLine, { scaleX: 1, duration: totalDuration, ease: "none" }, 0);
        
        // 2. Activate points as the line reaches them
        // Point 1 is at the start (0%)
        spiceTl.call(() => {
          spicePoints[0]?.classList.add('is-visible');
          spiceDots[0]?.classList.add('is-active');
        }, [], 0);

        // Point 2 is at the middle (50%)
        spiceTl.call(() => {
          spicePoints[1]?.classList.add('is-visible');
          spiceDots[1]?.classList.add('is-active');
        }, [], totalDuration * 0.5);

        // Point 3 is at the end (100%)
        spiceTl.call(() => {
          spicePoints[2]?.classList.add('is-visible');
          spiceDots[2]?.classList.add('is-active');
        }, [], totalDuration);

        return spiceTl;
      };

      const fireSpiceAnimations = () => {
        if (spiceTriggered) return;
        spiceTriggered = true;
        const tl = setupSpiceTimeline();
        if (tl) tl.play(0);
      };

      const resetSpiceAnimations = () => {
        if (!spiceTriggered) return;
        spiceTriggered = false;
        spiceTl.pause(0);
        gsap.set('.spice-line-animated', { scaleX: 0 });
        document.querySelectorAll('.spice-point-animated').forEach(el => el.classList.remove('is-visible'));
        document.querySelectorAll('.spice-dot-animated').forEach(el => el.classList.remove('is-active'));
      };

      // With 3 panels (0-based), panel-3 (index 2) starts at progress ~0.66
      // We fire when progress > 0.62 (entering the last panel)
      ScrollTrigger.create({
        trigger: horizontalWrapper,
        start: 'top top',
        end: `+=${100 * horizontalPanels.length}%`,
        onUpdate: (self) => {
          if (self.progress > 0.62) {
            fireSpiceAnimations();
          } else {
            resetSpiceAnimations();
          }
        }
      });
    }

    // 1c. Animate the curtain reveal to expose the map smoothly
    if (curtainRef.current && firstMapTriggerRef.current) {
      ScrollTrigger.create({
        trigger: firstMapTriggerRef.current,
        start: 'top bottom',
        end: 'top 20%',
        scrub: true,
        animation: gsap.to(curtainRef.current, {
          opacity: 0,
          scale: 1.15,
          ease: 'power1.inOut'
        })
      });

      // Keep track of active chapter state for navigation dots
      const activeTrigger = ScrollTrigger.create({
        trigger: firstMapTriggerRef.current,
        start: 'top center',
        onEnter: () => setIsInMapSection(true),
        onEnterBack: () => setActiveChapter(-1),
        onLeaveBack: () => setIsInMapSection(false),
      });
      triggers.push(activeTrigger);
    }

    // 2. Animate bridging typography texts
    gsap.utils.toArray<HTMLElement>('.bridge-text-anim').forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 75%',
        animation: gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 1.5,
          ease: 'power3.out',
        })
      });
    });

    // 2b. Make Mascot Marker Visible when past intro
    const introRef = chapterRefs.current[0];
    if (introRef && mascotMarkerRef.current) {
      ScrollTrigger.create({
        trigger: introRef,
        start: 'bottom center', // Show when intro is halfway scrolled up
        onEnter: () => {
          const el = mascotMarkerRef.current?.getElement();
          if (el) {
            el.style.display = 'flex';
            gsap.to(el, { opacity: 1, duration: 0.5 });
          }
        },
        onLeaveBack: () => {
          const el = mascotMarkerRef.current?.getElement();
          if (el) {
            gsap.to(el, { opacity: 0, duration: 0.5, onComplete: () => el.style.display = 'none' });
          }
        }
      });
    }

    // 3. Map & Mascot Scrubbed Transitions
    chapterRefs.current.forEach((ref, index) => {
      if (!ref) return;

      // A. State & Pin Triggers (Discrete changes for highlights and pins)
      const stateTrigger = ScrollTrigger.create({
        trigger: ref,
        start: 'top 55%',
        end: 'bottom 55%',
        onEnter: () => {
          if (isJumpingRef.current) return;
          gsap.to('.food-marker-wrapper', {
            scale: 0,
            duration: 0.2,
            onComplete: () => {
              setActiveChapter(index);
              
              // Only flyTo for the very first chapter (intro), others use scrub
              if (index === 0) {
                const chapter = scrollChapters[index];
                mapRef.current?.flyTo({
                  center: chapter.location.center,
                  zoom: chapter.location.zoom,
                  pitch: chapter.location.pitch,
                  bearing: chapter.location.bearing,
                  duration: 2000,
                  essential: true,
                });
              }

              gsap.fromTo('.food-marker-wrapper', 
                { scale: 0 }, 
                { scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)', delay: 0.3 }
              );
            }
          });
        },
        onEnterBack: () => {
          if (isJumpingRef.current) return;
          gsap.to('.food-marker-wrapper', {
            scale: 0,
            duration: 0.2,
            onComplete: () => {
              setActiveChapter(index);
              
              if (index === 0) {
                const chapter = scrollChapters[index];
                mapRef.current?.flyTo({
                  center: chapter.location.center,
                  zoom: chapter.location.zoom,
                  pitch: chapter.location.pitch,
                  bearing: chapter.location.bearing,
                  duration: 2000,
                  essential: true,
                });
              }

              gsap.fromTo('.food-marker-wrapper', 
                { scale: 0 }, 
                { scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)', delay: 0.3 }
              );
            }
          });
        },
        toggleClass: { targets: ref, className: 'is-active' }
      });
      triggers.push(stateTrigger);

      // B. Camera & Mascot Scrub (Continuous changes synchronized with scroll!)
      if (index > 0) {
        const prevLoc = scrollChapters[index - 1].location;
        const curLoc = scrollChapters[index].location;
        
        const camState = {
           lng: prevLoc.center[0],
           lat: prevLoc.center[1],
           zoom: prevLoc.zoom,
           pitch: prevLoc.pitch,
           bearing: prevLoc.bearing
        };

        const scrubTrigger = ScrollTrigger.create({
          trigger: ref,
          start: 'top bottom', // Start bridging when the new card starts appearing at the bottom
          end: 'top center',   // Finish bridging exactly when card is centered in focus
          scrub: 1.5,          // 1.5s inertia for cinematic smoothness but close tracking
          onUpdate: (self) => {
             if (isJumpingRef.current) return;
             const walker = mascotMarkerRef.current?.getElement().querySelector('.si-podo-walker');
             if (walker) {
               const isGoingForward = self.direction > 0;
               const isGoingLeft = curLoc.center[0] < prevLoc.center[0];
               const goingLeftNow = isGoingForward ? isGoingLeft : !isGoingLeft;
               const img = walker.querySelector('.si-podo-img') as HTMLImageElement;
               if (img) img.style.transform = goingLeftNow ? 'scaleX(-1)' : 'scaleX(1)';

               if (self.progress > 0.05 && self.progress < 0.95) {
                 walker.classList.add('is-walking');
                 walker.classList.remove('is-standing');
               } else {
                 walker.classList.remove('is-walking');
                 walker.classList.add('is-standing');
               }
             }
          },
          animation: gsap.to(camState, {
             lng: curLoc.center[0],
             lat: curLoc.center[1],
             zoom: curLoc.zoom,
             pitch: curLoc.pitch,
             bearing: curLoc.bearing,
             ease: 'power1.inOut',
             onUpdate: () => {
                if (isJumpingRef.current) return;
                mapRef.current?.jumpTo({
                  center: [camState.lng, camState.lat],
                  zoom: camState.zoom,
                  pitch: camState.pitch,
                  bearing: camState.bearing
                });
                if (mascotMarkerRef.current) {
                  mascotMarkerRef.current.setLngLat([camState.lng, camState.lat]);
                }
             }
          })
        });
        triggers.push(scrubTrigger);
      }
    });

    return () => {
      triggers.forEach((t) => t.kill());
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, { dependencies: [mode, isMapLoaded], scope: scrollContainerRef });

  // ═══════════ ENTER EXPLORE MODE ═══════════
  const enterExploreMode = useCallback(() => {
    setMode('explore');
    window.scrollTo({ top: 0, behavior: 'auto' });
    setShowOnboarding(true);
    mapRef.current?.flyTo({
      center: [110.4, -7.3],
      zoom: 8.5,
      pitch: 45,
      bearing: -15,
      duration: 2000,
    });
    setTimeout(() => setShowOnboarding(false), 4000);
  }, []);

  const exitExploreMode = useCallback(() => {
    setMode('story');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  // ═══════════ HIGHLIGHT SPOTLIGHT (REAL BOUNDARY FLOATING ISLAND) ═══════════
  const boundaryCache = useRef<Record<string, GeoJSON.FeatureCollection>>({});

  // Map chapter IDs to GeoJSON file(s) and optional feature name filter
  const chapterBoundaryMap: Record<string, { files: string[]; filterNames?: string[] }> = {
    semarang: { files: ['semarang'], filterNames: ['Kota Semarang', 'Semarang'] },
    solo_raya: { files: ['solo_wonogiri'], filterNames: ['Kota Surakarta'] },
    pantura_timur: { files: ['semarang', 'kudus_jepara', 'pati_blora'], filterNames: ['Demak', 'Kudus', 'Jepara', 'Pati'] },
    kedu_raya: { files: ['wonosobo_magelang'] },
    banyumas_raya: { files: ['banyumas'] },
    blora: { files: ['pati_blora'], filterNames: ['Blora'] },
    pemalang: { files: ['pemalang'] },
  };

  // Helper: load boundary GeoJSON (cached), with chapter-aware file mapping & filtering
  const loadBoundary = useCallback(async (chapterId: string): Promise<GeoJSON.FeatureCollection | null> => {
    if (boundaryCache.current[chapterId]) return boundaryCache.current[chapterId];
    try {
      const mapping = chapterBoundaryMap[chapterId];
      if (!mapping) {
        // Fallback: try direct file
        const res = await fetch(`/geo/${chapterId}.json`);
        if (!res.ok) return null;
        const data = await res.json();
        boundaryCache.current[chapterId] = data;
        return data;
      }

      // Load all mapped files
      const allFeatures: GeoJSON.Feature[] = [];
      for (const file of mapping.files) {
        const cacheKey = `__file__${file}`;
        let fileData: GeoJSON.FeatureCollection;
        if (boundaryCache.current[cacheKey]) {
          fileData = boundaryCache.current[cacheKey];
        } else {
          const res = await fetch(`/geo/${file}.json`);
          if (!res.ok) continue;
          fileData = await res.json();
          boundaryCache.current[cacheKey] = fileData;
        }
        allFeatures.push(...fileData.features);
      }

      // Filter features by shapeName if filterNames is specified
      let filtered = allFeatures;
      if (mapping.filterNames) {
        filtered = allFeatures.filter(f =>
          mapping.filterNames!.includes((f.properties as any)?.shapeName)
        );
      }

      const result: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: filtered };
      boundaryCache.current[chapterId] = result;
      return result;
    } catch {
      return null;
    }
  }, []);

  // Helper: create a dim mask from boundary features (world polygon with holes for ALL features)
  const createMaskFromBoundary = useCallback((boundaryFc: GeoJSON.FeatureCollection): GeoJSON.Feature => {
    if (!boundaryFc.features.length) {
      return {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]] },
        properties: {}
      };
    }
    const outerRing = [[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]];
    const holes: number[][][] = [];

    for (const feature of boundaryFc.features) {
      const geo = feature.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon;
      if (geo.type === 'Polygon') {
        holes.push([...geo.coordinates[0]].reverse());
      } else if (geo.type === 'MultiPolygon') {
        // Add all polygons of the MultiPolygon as separate holes
        for (const poly of geo.coordinates) {
          holes.push([...poly[0]].reverse());
        }
      }
    }

    return {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [outerRing, ...holes] },
      properties: {}
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !isMapLoaded || mode !== 'story') return;

    const map = mapRef.current;

    if (activeChapter >= 0 && activeChapter < scrollChapters.length) {
      const chapter = scrollChapters[activeChapter];

      if (chapter.id === 'intro' || chapter.id === 'explore') {
        // Hide dim layer
        const dimSource = map.getSource('world-dim-source') as mapboxgl.GeoJSONSource;
        if (dimSource) dimSource.setData({ type: 'FeatureCollection', features: [] });
        const hlSource = map.getSource('region-highlight-source') as mapboxgl.GeoJSONSource;
        if (hlSource) hlSource.setData({ type: 'FeatureCollection', features: [] });

        try {
          if (map.getLayer('world-dim-layer')) {
            map.setPaintProperty('world-dim-layer', 'fill-opacity', 0);
          }
        } catch (e) { console.warn("Dim layer update skipped:", e); }
        return;
      }

      // LOAD BOUNDARY AND APPLY MASK
      const applyBoundary = async () => {
        const boundaryData = await loadBoundary(chapter.id);

        if (boundaryData && boundaryData.features.length > 0) {
          // Create dim mask with hole shaped like the real boundary
          const maskFeature = createMaskFromBoundary(boundaryData);
          const dimSource = map.getSource('world-dim-source') as mapboxgl.GeoJSONSource;
          if (dimSource) {
            dimSource.setData({ type: 'FeatureCollection', features: [maskFeature] });
          }
          const hlSource = map.getSource('region-highlight-source') as mapboxgl.GeoJSONSource;
          if (hlSource) {
            hlSource.setData(boundaryData);
          }
        } else {
          // Fallback: use old circular approach if boundary not found
          const radiusKm = chapter.id === 'solo' ? 10 : 8;
          const geojsons = getHighlightGeoJSON(chapter.location.center, radiusKm);
          const dimSource = map.getSource('world-dim-source') as mapboxgl.GeoJSONSource;
          if (dimSource) dimSource.setData({ type: 'FeatureCollection', features: [geojsons.maskPolygon] });
          const hlSource = map.getSource('region-highlight-source') as mapboxgl.GeoJSONSource;
          if (hlSource) hlSource.setData({ type: 'FeatureCollection', features: [] });
        }

        // Dimming contrast (0.7 is a good balance between dark and visible)
        try {
          if (map.getLayer('world-dim-layer')) {
            map.setPaintProperty('world-dim-layer', 'fill-opacity', 0.7);
          }
        } catch (e) { console.warn("Dim layer update skipped:", e); }
      };

      applyBoundary();

    } else {
      // Clear dim
      const dimSource = map.getSource('world-dim-source') as mapboxgl.GeoJSONSource;
      if (dimSource) dimSource.setData({ type: 'FeatureCollection', features: [] });
      const hlSource = map.getSource('region-highlight-source') as mapboxgl.GeoJSONSource;
      if (hlSource) hlSource.setData({ type: 'FeatureCollection', features: [] });
      try {
        if (map.getLayer('world-dim-layer')) {
          map.setPaintProperty('world-dim-layer', 'fill-opacity', 0);
        }
      } catch (e) { console.warn("Dim layer update skipped:", e); }
    }
  }, [activeChapter, isMapLoaded, mode, loadBoundary, createMaskFromBoundary, getHighlightGeoJSON, scrollChapters]);

  // ═══════════ REST OF LOGIC (filtering, auto tour, etc) ═══════════

  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    // 1. Determine which foods to render based on mode
    let foodsToRender = filteredFoods;
    if (mode === 'story') {
      if (activeChapter > 0 && activeChapter < scrollChapters.length - 1) {
        // Only show foods from the active chapter by filtering the full food objects
        const chapId = scrollChapters[activeChapter].id;
        const validIds = (CHAPTER_GALLERIES[chapId] || []).map(g => g.id);
        foodsToRender = filteredFoods.filter(f => validIds.includes(f.id));
      } else {
        foodsToRender = []; // Hide pins in intro or epilogue
      }
    }

    const cityGroups = foodsToRender.reduce((acc, food) => {
      // Don't cluster in story mode, treat each pin individually
      const key = mode === 'story' ? food.id : food.city;
      if (!acc[key]) acc[key] = [];
      acc[key].push(food);
      return acc;
    }, {} as Record<string, Food[]>);

    const markerElements: HTMLElement[] = [];

    Object.entries(cityGroups).forEach(([city, foods]) => {
      const first = foods[0];
      if (foods.length > 1 && mode !== 'story') {
        const el = document.createElement('div');
        el.className = 'cluster-marker-wrapper';
        el.innerHTML = `<div class="cluster-marker">${foods.length}</div>`;
        el.addEventListener('click', () => handleMarkerClick(first));
        const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat([first.longitude, first.latitude])
          .addTo(mapRef.current!);
        markersRef.current.set(`cluster-${city}`, marker);
      } else {
        const food = foods[0];
        
        let isActive = false;
        if (mode === 'explore') {
          isActive = selectedFood?.id === food.id;
        } else if (mode === 'story') {
          // In story mode, the side gallery handles active item, but we can highlight the one selected
          const chapId = scrollChapters[activeChapter].id;
          const activeId = activeFoodItems[chapId]?.id || CHAPTER_GALLERIES[chapId]?.[0]?.id;
          isActive = activeId === food.id;
        }

        const isTour = currentAutoTourFood?.id === food.id;
        const el = document.createElement('div');
        el.className = `food-marker-wrapper ${isActive ? 'active' : ''} ${isTour ? 'auto-tour' : ''}`;
        
        // In story mode, show images for all pins, make them unclickable
        if (mode === 'story') {
          el.style.pointerEvents = 'none'; // Unclickable
          if (food.image) {
            el.innerHTML = `
              <div class="food-marker active-marker">
                <img src="${food.image}" alt="${food.name}" style="pointer-events: none;" />
              </div>
            `;
          }
        } else {
          // Explore mode
          if (isActive && food.image) {
            el.innerHTML = `
              <div class="food-marker active-marker">
                <img src="${food.image}" alt="${food.name}" />
              </div>
            `;
          } else {
            el.innerHTML = `<div class="food-marker inactive-dot"></div>`;
          }
          el.addEventListener('click', () => handleMarkerClick(food));
        }
        
        const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([food.longitude, food.latitude])
          .addTo(mapRef.current!);
        markersRef.current.set(food.id, marker);
        
        if (mode === 'story') {
          markerElements.push(el);
        }
      }
    });

    // Pop-up animation for story mode markers when chapter changes
    if (mode === 'story' && markerElements.length > 0) {
      gsap.fromTo(markerElements, 
        { scale: 0, y: 50, opacity: 0 }, 
        { scale: 1, y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.5)', delay: 0.3 }
      );
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredFoods, selectedFood, currentAutoTourFood, isMapLoaded, mode, activeChapter, activeFoodItems]);

  useEffect(() => {
    if (isAutoTourActive && !isAutoTourPaused && filteredFoods.length > 0) {
      const cur = filteredFoods[autoTourIndex % filteredFoods.length];
      mapRef.current?.flyTo({
        center: [cur.longitude, cur.latitude],
        zoom: 13.5,
        pitch: 45,
        bearing: 15,
        speed: 0.5,
        curve: 1.2,
        essential: true,
      });
      
      // Auto-open story panel
      setSelectedFood(cur);

      autoTourTimerRef.current = setTimeout(() => {
        setAutoTourIndex((p) => (p + 1) % filteredFoods.length);
      }, 6000);
      return () => { if (autoTourTimerRef.current) clearTimeout(autoTourTimerRef.current); };
    }
  }, [isAutoTourActive, isAutoTourPaused, autoTourIndex, filteredFoods]);

  const handleAutoTourStart = useCallback(() => {
    if (filteredFoods.length === 0) return;
    setIsAutoTourActive(true);
    setAutoTourIndex(0);
    setIsAutoTourPaused(false);
    setSelectedFood(null);
  }, [filteredFoods]);

  const handleAutoTourStop = useCallback(() => {
    setIsAutoTourActive(false);
    setAutoTourIndex(0);
    setIsAutoTourPaused(false);
    if (autoTourTimerRef.current) clearTimeout(autoTourTimerRef.current);
    mapRef.current?.flyTo({ center: [110.4, -7.3], zoom: 8.5, pitch: 45, bearing: -15, duration: 2000 });
  }, []);

  const handleAutoTourPauseToggle = useCallback(() => setIsAutoTourPaused((p) => !p), []);



  const handleZoomIn = useCallback(() => {
    const z = mapRef.current?.getZoom() ?? 8;
    mapRef.current?.easeTo({ zoom: z + 1, duration: 300 });
  }, []);
  const handleZoomOut = useCallback(() => {
    const z = mapRef.current?.getZoom() ?? 8;
    mapRef.current?.easeTo({ zoom: z - 1, duration: 300 });
  }, []);
  const handleReset = useCallback(() => {
    mapRef.current?.flyTo({ center: [110.4, -7.3], zoom: 8.5, pitch: 45, bearing: -15, duration: 2000 });
  }, []);

  const handleRegionChange = useCallback((region: string) => {
    setActiveRegion(region);
    const regionCenters: Record<string, { center: [number, number]; zoom: number }> = {
      'Semua': { center: [110.4, -7.3], zoom: 8.5 },
      'Semarang Raya': { center: [110.4167, -7.05], zoom: 11 },
      'Solo Raya': { center: [110.8167, -7.5667], zoom: 11.5 },
      'Banyumas & Kedu': { center: [109.7, -7.4], zoom: 9.5 },
      'Pantura': { center: [109.9, -6.88], zoom: 10 },
      'Muria & Pati': { center: [110.85, -6.8], zoom: 11 },
    };
    const target = regionCenters[region] || regionCenters['Semua'];
    mapRef.current?.flyTo({
      center: target.center,
      zoom: target.zoom,
      pitch: 45,
      bearing: -15,
      duration: 2000,
    });
  }, []);

  const handleScrollToChapter = useCallback((index: number) => {
    const el = chapterRefs.current[index];
    if (el) {
      if (activeChapter !== index && mapRef.current) {
        isJumpingRef.current = true;
        
        const targetLoc = scrollChapters[index].location;
        const currentLng = mapRef.current.getCenter().lng;
        
        const walker = mascotMarkerRef.current?.getElement().querySelector('.si-podo-walker');
        if (walker) {
          walker.classList.add('is-walking');
          walker.classList.remove('is-standing');
          
          const isGoingLeft = targetLoc.center[0] < currentLng;
          const img = walker.querySelector('.si-podo-img') as HTMLImageElement;
          if (img) img.style.transform = isGoingLeft ? 'scaleX(-1)' : 'scaleX(1)';
        }

        // Set the active chapter immediately so boundaries and thought bubble start loading
        setActiveChapter(index);

        mapRef.current.flyTo({
          center: targetLoc.center,
          zoom: targetLoc.zoom,
          pitch: targetLoc.pitch,
          bearing: targetLoc.bearing,
          duration: 1500,
          essential: true
        });
      }

      window.scrollTo({
        top: el.offsetTop,
        behavior: 'smooth'
      });
    }
  }, [activeChapter]);

  // ═══════════ RENDER ═══════════
  return (
    <div className={`maps-page mode-${mode}`}>



      {/* ████ FULL-SCREEN MAP (Fixed in background) ████ */}
      <div className="map-fixed-layer">
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

        {/* Ornaments for Map (So it's not plain) */}
        {mode === 'story' && (
          <div className="map-ornaments-container">
            <svg className="ornament-svg top-left" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,0 L100,0 C100,0 100,50 50,50 C0,50 0,100 0,100 Z" fill="rgba(245, 196, 0, 0.15)" />
              <circle cx="20" cy="20" r="4" fill="var(--color-emas-keris)" />
              <circle cx="40" cy="20" r="2" fill="var(--color-emas-keris)" />
              <circle cx="20" cy="40" r="2" fill="var(--color-emas-keris)" />
            </svg>
            <svg className="ornament-svg bottom-right" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100,100 L0,100 C0,100 0,50 50,50 C100,50 100,0 100,0 Z" fill="rgba(245, 196, 0, 0.15)" />
              <circle cx="80" cy="80" r="4" fill="var(--color-emas-keris)" />
              <circle cx="60" cy="80" r="2" fill="var(--color-emas-keris)" />
              <circle cx="80" cy="60" r="2" fill="var(--color-emas-keris)" />
            </svg>
            {/* Glowing Map Frame */}
            <div className="map-glow-frame"></div>
          </div>
        )}

        {/* Subtle dark gradient overlay fixed with map */}
        {mode === 'story' && (
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 5,
            pointerEvents: 'none',
            background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 20%, transparent 100%)',
          }} />
        )}
      </div>

      {/* ████ STORY MODE — Continuous Scrollytelling ████ */}
      {mode === 'story' && (
        <>
          {/* INTRO CURTAIN (Covers the map initially, fades out) */}
          <div ref={curtainRef} className="intro-curtain">
            <div className="curtain-noise"></div>
          </div>

          <div
            ref={scrollContainerRef}
            className="story-content-layer"
          >
            {/* 1. BRIDGING INTRO SECTIONS */}
            <JangkepHero />

            {/* HORIZONTAL SCROLL SECTIONS */}
            <div className="horizontal-scroll-wrapper">
              {/* Corner Ornaments that stay fixed on screen during horizontal scroll */}
              <img src="/motif/motif_button_kiri.webp" alt="Ornament Left" className="corner-ornament top-left" />
              <img src="/motif/motif_button_kanan.webp" alt="Ornament Right" className="corner-ornament top-right" />

              <div className="horizontal-scroll-container">
                {/* Panel 1: Combined Intro Texts */}
                <div className="horizontal-panel panel-1">
                  <div className="bridging-content bridge-text-anim-1">
                    <h2 className="bridging-quote">&quot;Setiap daerah memiliki rasanya sendiri. Dan setiap rasa menyimpan sejarahnya sendiri.&quot;</h2>
                    <div className="bridging-divider"></div>
                    <p className="bridging-desc">
                      Lebih dari sekadar direktori makanan, ini adalah perjalanan menyusuri jejak rempah, akulturasi budaya, dan tradisi keraton yang membentuk identitas kita.
                    </p>
                  </div>
                </div>

                {/* Panel 2: Topography Biomes (formerly Panel 3) */}
                <div className="horizontal-panel panel-2">
                  <div className="bridging-content" style={{ width: '100%', maxWidth: '1400px', position: 'relative' }}>
                    <h2 className="bridging-quote" style={{ fontSize: '36px', marginBottom: '60px', position: 'relative', zIndex: 10 }}>Bentang Alam & Lahirnya Rasa</h2>
                    <div className="biome-container">
                      {/* Card 1: Pesisir */}
                      <div className="biome-card">
                        <div className="biome-card-inner">
                          <div className="biome-card-front">
                            <div className="biome-motif biome-motif-left-top"><img src="/motif/motif_bunga_card.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
                            <div className="biome-motif biome-motif-left-bottom"><img src="/motif/motif_bunga_card.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
                            <div className="biome-motif biome-motif-left-center"><img src="/motif/motif_bunga_card.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
                            <div className="biome-motif biome-motif-right-top"><img src="/motif/motif_bunga_card.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
                            <div className="biome-motif biome-motif-right-bottom"><img src="/motif/motif_bunga_card.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
                            <h3 className="biome-title">Pesisir & Pantai</h3>
                            <div className="bridging-divider" style={{ margin: '0 auto', background: 'linear-gradient(90deg, transparent, var(--color-coklat-batik), transparent)' }}></div>
                            <p className="biome-desc">Lahir dari udara panas dan hasil tangkapan laut. Mengandalkan terasi, garam, dan rempah berani untuk menghasilkan rasa gurih dan pedas yang menantang.</p>
                          </div>
                          <div className="biome-card-back">
                            <video autoPlay loop muted playsInline className="biome-video" src="/bg mapz/pesisir.webm" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Card 2: Dataran Rendah */}
                      <div className="biome-card">
                        <div className="biome-card-inner">
                          <div className="biome-card-front">
                            <div className="biome-motif biome-motif-left-top"><img src="/motif/motif_bunga_card.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
                            <div className="biome-motif biome-motif-left-bottom"><img src="/motif/motif_bunga_card.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
                            <div className="biome-motif biome-motif-left-center"><img src="/motif/motif_bunga_card.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
                            <div className="biome-motif biome-motif-right-top"><img src="/motif/motif_bunga_card.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
                            <div className="biome-motif biome-motif-right-bottom"><img src="/motif/motif_bunga_card.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
                            <h3 className="biome-title">Dataran Rendah</h3>
                            <div className="bridging-divider" style={{ margin: '0 auto', background: 'linear-gradient(90deg, transparent, var(--color-coklat-batik), transparent)' }}></div>
                            <p className="biome-desc">Didominasi oleh hasil tani padi dan kelapa. Mengandalkan gula jawa dan santan kental yang melahirkan rasa manis legit, melambangkan kelembutan karakter.</p>
                          </div>
                          <div className="biome-card-back">
                            <video autoPlay loop muted playsInline className="biome-video" src="/bg mapz/dataranrendah.webm" />
                          </div>
                        </div>
                      </div>

                      {/* Card 3: Pegunungan */}
                      <div className="biome-card">
                        <div className="biome-card-inner">
                          <div className="biome-card-front">
                            <div className="biome-motif biome-motif-left-top"><img src="/motif/motif_bunga_card.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
                            <div className="biome-motif biome-motif-left-bottom"><img src="/motif/motif_bunga_card.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
                            <div className="biome-motif biome-motif-left-center"><img src="/motif/motif_bunga_card.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
                            <div className="biome-motif biome-motif-right-top"><img src="/motif/motif_bunga_card.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
                            <div className="biome-motif biome-motif-right-bottom"><img src="/motif/motif_bunga_card.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
                            <h3 className="biome-title">Pegunungan</h3>
                            <div className="bridging-divider" style={{ margin: '0 auto', background: 'linear-gradient(90deg, transparent, var(--color-coklat-batik), transparent)' }}></div>
                            <p className="biome-desc">Cuaca dingin menuntut kehangatan konstan. Melahirkan tradisi hidangan berkuah kaldu panas dengan racikan rempah lada dan jahe yang kuat.</p>
                          </div>
                          <div className="biome-card-back">
                            <video autoPlay loop muted playsInline className="biome-video" src="/bg mapz/pegunungan.webm" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Panel 3: Spice Route Parallax */}
                <div className="horizontal-panel panel-3">
                  <div className="bridging-content" style={{ width: '100%', maxWidth: '1100px' }}>
                    <h2 className="bridging-quote" style={{ fontSize: '36px', marginBottom: '100px', position: 'relative', zIndex: 2 }}>Jejak Akulturasi Rempah</h2>
                    <div className="spice-route-container">
                      <div className="spice-line-bg"></div>
                      <div className="spice-line spice-line-animated"></div>

                      {/* Point 1: Pelabuhan */}
                      <div className="spice-point spice-point-animated">
                        <div className="spice-image-wrapper">
                          <img src="/bg mapz/pelabuhan.webp" alt="Pelabuhan" className="spice-image" style={{ transform: "scale(1.15) translateY(15px)" }} />
                        </div>
                        <div className="spice-dot spice-dot-animated"></div>
                        <h3 className="spice-title">Pelabuhan</h3>
                        <p className="spice-desc">Pedagang Tiongkok dan Arab bersandar di utara membawa mie, kecap, dan daging kambing.</p>
                      </div>

                      {/* Point 2: Keraton */}
                      <div className="spice-point spice-point-animated">
                        <div className="spice-image-wrapper">
                          <img src="/bg mapz/keraton.webp" alt="Keraton" className="spice-image" style={{ transform: "scale(1.15) translateY(70px)" }} />
                        </div>
                        <div className="spice-dot spice-dot-animated"></div>
                        <h3 className="spice-title">Keraton</h3>
                        <p className="spice-desc">Bumbu pendatang diracik dan disempurnakan dengan filosofi serta teknik masak tingkat tinggi.</p>
                      </div>

                      {/* Point 3: Rakyat */}
                      <div className="spice-point spice-point-animated">
                        <div className="spice-image-wrapper">
                          <img src="/bg mapz/rakyat.webp" alt="Rakyat" className="spice-image" />
                        </div>
                        <div className="spice-dot spice-dot-animated"></div>
                        <h3 className="spice-title">Rakyat</h3>
                        <p className="spice-desc">Resep menyebar ke pelosok jalanan, menjadi jajanan pasar dan hidangan yang kita petakan hari ini.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* 2. MAP CHAPTERS */}
            <div ref={firstMapTriggerRef} style={{ width: '100%', height: '1px' }}></div>

            {scrollChapters.map((chapter, index) => {
              const isActive = activeChapter === index;
              const isFirst = index === 0;
              const isLast = index === scrollChapters.length - 1;

              return (
                <div
                  key={chapter.id}
                  ref={(el) => { chapterRefs.current[index] = el; }}
                  className={`chapter-section ${isLast ? 'last-chapter-section' : ''} ${isFirst ? 'first-chapter-section' : ''}`}
                >
                  <ChapterCard 
                    chapter={chapter}
                    isActive={isActive}
                    isFirst={isFirst}
                    isLast={isLast}
                    peekingFrame={peekingFrame}
                    galleries={CHAPTER_GALLERIES[chapter.id]}
                    activeFoodItem={activeFoodItems[chapter.id]}
                    onFoodChange={(item) => {
                      setActiveFoodItems((prev) => {
                        if (prev[chapter.id]?.id === item.id) return prev;
                        return {
                          ...prev,
                          [chapter.id]: item,
                        };
                      });
                    }}
                    onExploreStart={() => window.location.href = '/maps/explore'}
                  />
                </div>
              );
            })}
          </div>

          {/* Progress Nav (Only show when in map section) */}
          <AnimatePresence>
            {isInMapSection && activeChapter >= 0 && (
              <motion.div
                className="story-progress-nav"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {scrollChapters.map((ch, i) => (
                  <div
                    key={i}
                    className={`progress-dot ${activeChapter === i ? 'active' : ''}`}
                    onClick={() => handleScrollToChapter(i)}
                    data-title={ch.label}
                  >
                    <div className="dot-inner"></div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* ████ EXPLORE MODE — Interactive Map UI ████ */}
      {mode === 'explore' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}
        >
          <div style={{ pointerEvents: 'auto', width: '100%', height: '100%' }}>
            <FilterBar
              regions={regions}
              activeRegion={activeRegion}
              onRegionChange={handleRegionChange}
              onAutoTourStart={handleAutoTourStart}
              isAutoTourActive={isAutoTourActive}
              onSearchChange={setSearchQuery}
            />

            <MapLegend />
            <MapControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onReset={handleReset} />

            <AnimatePresence>
              {(showOnboarding || (isAutoTourActive && currentAutoTourFood)) && (
                <SiPodo
                  message={
                    showOnboarding
                      ? 'Klik pin manapun kanggo mulai njelajah!'
                      : currentAutoTourFood
                        ? `${currentAutoTourFood.city} — ${currentAutoTourFood.name} enak tenan!`
                        : ''
                  }
                  isWalking={isAutoTourActive && !showOnboarding}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isAutoTourActive && (
                <AutoJourneyProgress
                  currentIndex={autoTourIndex}
                  total={Math.min(filteredFoods.length, 10)}
                  isPaused={isAutoTourPaused}
                  onPauseToggle={handleAutoTourPauseToggle}
                  onStop={handleAutoTourStop}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {selectedFood && (
                <StoryPanel
                  food={selectedFood}
                  onClose={() => setSelectedFood(null)}
                  onFoodSelect={(id) => {
                    const f = foodsData.find((x) => x.id === id);
                    if (f) handleMarkerClick(f);
                  }}
                  allFoods={foodsData}
                />
              )}
            </AnimatePresence>

            {!isAutoTourActive && !selectedFood && (
              <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', zIndex: 15 }}>
                <BatikButton
                  javaneseText="ꦏꦼꦩ꧀ꦧꦭꦶꦏꦼꦕꦼꦫꦶꦠ"
                  latinText="Kembali ke Cerita"
                  onClick={exitExploreMode}
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5"></path>
                      <path d="m12 19-7-7 7-7"></path>
                    </svg>
                  }
                />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
