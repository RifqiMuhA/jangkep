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
}

const scrollChapters: Chapter[] = [
  {
    id: 'intro',
    title: 'Perjalanan\nDimulai',
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
    location: { center: [110.42, -6.99], zoom: 11, pitch: 58, bearing: 25 },
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
    location: { center: [110.85, -7.65], zoom: 10.8, pitch: 55, bearing: -40 },
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
    location: { center: [110.8, -6.75], zoom: 10.2, pitch: 55, bearing: 30 },
    alignment: 'right',
  },
  {
    id: 'kedu_raya',
    title: 'Kedu Raya:\nKuliner Kaki Gunung',
    subtitle: 'Mie Ongklok • Carica • Getuk',
    description: 'Terjepit gunung-gunung berapi raksasa, kawasan Magelang dan Wonosobo menyimpan kekayaan kuliner dataran tinggi. Hangat, manis, dan menyegarkan.',
    location: { center: [110.05, -7.42], zoom: 10.5, pitch: 58, bearing: 35 },
    alignment: 'left',
  },
  {
    id: 'banyumas_raya',
    title: 'Lembah Serayu:\nHangat di Balik Dingin',
    subtitle: 'Tempe Mendoan • Dawet Ayu',
    description: 'Dari dataran tinggi hingga lembah Sungai Serayu di Banyumas dan Banjarnegara. Cuaca sejuk melahirkan sajian hangat seperti Mendoan dan segarnya Dawet Ayu.',
    location: { center: [109.45, -7.45], zoom: 11, pitch: 60, bearing: -50 },
    alignment: 'right',
  },
  {
    id: 'blora',
    title: 'Blora:\nKekayaan Rasa Timur',
    subtitle: 'Sate Ayam Blora',
    description: 'Menyusuri sisi timur Jawa Tengah, kita disuguhkan kelembutan Sate Ayam Blora dengan siraman bumbu kacang yang melimpah dan gurih.',
    location: { center: [111.41, -7.11], zoom: 11, pitch: 55, bearing: -20 },
    alignment: 'left',
  },
  {
    id: 'pemalang',
    title: 'Pemalang:\nPesisir Pantura Barat',
    subtitle: 'Nasi Grombyang',
    description: 'Berada di jalur perdagangan legendaris Daendels, Pemalang menyajikan Nasi Grombyang — potongan daging kerbau empuk dengan kuah kluwek berlimpah.',
    location: { center: [109.38, -6.89], zoom: 11.5, pitch: 55, bearing: 15 },
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

  /* ── Story mode vs Explore mode ── */
  const [mode, setMode] = useState<'story' | 'explore'>('story');
  const [activeChapter, setActiveChapter] = useState(-1); // -1 means bridging intro
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
    }, 100);

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

  /* ── Explore mode state ── */
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [activeRegion, setActiveRegion] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFoods = useMemo(() => {
    if (mode !== 'explore') return foodsData;
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
  }, [activeRegion, searchQuery, mode]);

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

      // ── ADD MASCOT MARKER (EMOJI / IMG) ──
      const mascotContainer = document.createElement('div');
      mascotContainer.className = 'si-podo-container-map';
      mascotContainer.style.width = '80px';
      mascotContainer.style.height = '80px';
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
      mascotImg.src = '/kuliner/sejarah/terbang_1.webp';
      mascotImg.style.width = '100%';
      mascotImg.style.height = '100%';
      mascotImg.style.objectFit = 'contain';
      mascotImg.style.filter = 'drop-shadow(0px 8px 16px rgba(0,0,0,0.5))';

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
          const img = walker.querySelector('img');
          if (img) {
            if (walker.classList.contains('is-walking')) {
              frame = (frame % 3) + 1;
              img.src = `/kuliner/sejarah/terbang_${frame}.webp`;
            } else {
              img.src = '/kuliner/sejarah/terbang_1.webp';
            }
          }
        }
      }, 120);

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
          'fill-opacity': 0.15,
          'fill-opacity-transition': { duration: 1000 }
        }
      });

      map.addLayer({
        id: 'region-highlight-line',
        type: 'line',
        source: 'region-highlight-source',
        paint: {
          'line-color': '#F5C400',
          'line-width': 3,
          'line-opacity': 0.8,
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
    const horizontalContainer = document.querySelector('.horizontal-scroll-container');
    const horizontalPanels = gsap.utils.toArray('.horizontal-panel');
    if (horizontalContainer && horizontalPanels.length > 0) {
      ScrollTrigger.create({
        trigger: horizontalContainer,
        start: 'top top',
        end: `+=${100 * horizontalPanels.length}%`,
        pin: true,
        animation: gsap.to(horizontalPanels, {
          xPercent: -100 * (horizontalPanels.length - 1),
          ease: 'none'
        }),
        scrub: 1
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
        onEnterBack: () => setActiveChapter(-1),
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

    // 2b. Chaotic Screen Flying Mascot Overlay (Si Podo flies forward to front of screen)
    const horizContainer = document.querySelector('.horizontal-scroll-container');
    if (horizContainer && firstMapTriggerRef.current) {
      const flightTl = gsap.timeline({
        scrollTrigger: {
          trigger: horizContainer,
          start: 'top bottom',
          endTrigger: firstMapTriggerRef.current,
          end: 'bottom top',
          scrub: 1.8, // extremely smooth lag
        }
      });

      // Fly closer to screen, erratically swooping and rotating, then diving down to map
      flightTl.fromTo('#podo-flying-overlay',
        { 
          x: '50vw', 
          y: '80vh', 
          scale: 0.3, 
          rotation: -10, 
          opacity: 0,
        },
        {
          opacity: 1,
          keyframes: [
            { x: '20vw', y: '45vh', scale: 1.4, rotation: 25, duration: 1, ease: 'sine.inOut' },
            { x: '85vw', y: '20vh', scale: 2.3, rotation: -15, duration: 1, ease: 'sine.inOut' },
            { x: '30vw', y: '15vh', scale: 1.8, rotation: 10, duration: 1.2, ease: 'sine.inOut' },
            { x: '75vw', y: '65vh', scale: 1.2, rotation: -20, duration: 1, ease: 'sine.inOut' },
            { x: '45vw', y: '40vh', scale: 0.9, rotation: 30, duration: 1.2, ease: 'sine.inOut' },
            { x: '65vw', y: '50vh', scale: 0.6, rotation: -10, opacity: 0.8, duration: 1, ease: 'sine.inOut' },
            { x: '42vw', y: '35vh', scale: 0.3, rotation: -45, opacity: 0, duration: 0.8, ease: 'power2.in' } // Dives down into Semarang location on map
          ]
        }
      );
    }

    // 3. Map flyTo triggers for each chapter
    chapterRefs.current.forEach((ref, index) => {
      if (!ref) return;

      const trigger = ScrollTrigger.create({
        trigger: ref,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => {
          setActiveChapter(index);
          const chapter = scrollChapters[index];
          mapRef.current?.flyTo({
            center: chapter.location.center,
            zoom: chapter.location.zoom,
            pitch: chapter.location.pitch,
            bearing: chapter.location.bearing,
            duration: 2800, // Slightly slower flyTo camera for smoother look
            curve: 0.9,
            essential: true,
          });
        },
        onEnterBack: () => {
          setActiveChapter(index);
          const chapter = scrollChapters[index];
          mapRef.current?.flyTo({
            center: chapter.location.center,
            zoom: chapter.location.zoom,
            pitch: chapter.location.pitch,
            bearing: chapter.location.bearing,
            duration: 2800,
            curve: 0.9,
            essential: true,
          });
        },
        toggleClass: { targets: ref, className: 'is-active' }
      });
      triggers.push(trigger);
    });

    // 4. Mascot continuous walking scrubbed to scroll transitions
    chapterRefs.current.forEach((ref, index) => {
      if (!ref || index === 0) return;

      const prevChapter = scrollChapters[index - 1];
      const currentChapter = scrollChapters[index];
      const startCenter = prevChapter.location.center;
      const endCenter = currentChapter.location.center;

      // Animate an object representing lng/lat
      const pos = { lng: startCenter[0], lat: startCenter[1] };

      const trigger = ScrollTrigger.create({
        trigger: ref,
        start: 'top bottom', // Start walking when card begins to enter the screen
        end: 'top center',   // Stop walking when card is focused
        scrub: 2.2,          // slow, beautiful glide with soft inertia (terbang smooth)
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          if (mascotMarkerRef.current) {
            // Flip the mascot inside the walker container based on direction
            const isGoingForward = self.direction > 0;
            const isGoingLeft = endCenter[0] < startCenter[0];
            const goingLeftNow = isGoingForward ? isGoingLeft : !isGoingLeft;
            
            const walker = mascotMarkerRef.current.getElement().querySelector('.si-podo-walker') as HTMLDivElement;
            if (walker) {
              const img = walker.querySelector('img') as HTMLImageElement;
              if (img) {
                img.style.transform = goingLeftNow ? 'scaleX(-1)' : 'scaleX(1)';
              }
              
              // Only trigger bounce/walk animation if scroll velocity is non-zero
              if (Math.abs(velocity) > 5) {
                walker.classList.add('is-walking');
              } else {
                walker.classList.remove('is-walking');
              }
            }
          }
        },
        onLeave: () => {
          const walker = mascotMarkerRef.current?.getElement().querySelector('.si-podo-walker');
          walker?.classList.remove('is-walking');
        },
        onLeaveBack: () => {
          const walker = mascotMarkerRef.current?.getElement().querySelector('.si-podo-walker');
          walker?.classList.remove('is-walking');
        },
        animation: gsap.to(pos, {
          lng: endCenter[0],
          lat: endCenter[1],
          ease: 'none',
          onUpdate: function () {
            if (mascotMarkerRef.current) {
              mascotMarkerRef.current.setLngLat([pos.lng, pos.lat]);
            }
          }
        })
      });
      triggers.push(trigger);
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
    solo_raya: { files: ['solo_wonogiri'] },
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
        } else {
          // Fallback: use old circular approach if boundary not found
          const radiusKm = chapter.id === 'solo' ? 10 : 8;
          const geojsons = getHighlightGeoJSON(chapter.location.center, radiusKm);
          const dimSource = map.getSource('world-dim-source') as mapboxgl.GeoJSONSource;
          if (dimSource) dimSource.setData({ type: 'FeatureCollection', features: [geojsons.maskPolygon] });
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
    if (mode !== 'explore') return;

    const cityGroups = filteredFoods.reduce((acc, food) => {
      if (!acc[food.city]) acc[food.city] = [];
      acc[food.city].push(food);
      return acc;
    }, {} as Record<string, Food[]>);

    Object.entries(cityGroups).forEach(([city, foods]) => {
      const first = foods[0];
      if (foods.length > 1) {
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
        const isActive = selectedFood?.id === food.id;
        const isTour = currentAutoTourFood?.id === food.id;
        const el = document.createElement('div');
        el.className = `food-marker-wrapper ${isActive ? 'active' : ''} ${isTour ? 'auto-tour' : ''}`;
        el.innerHTML = `<div class="food-marker">${food.icon}</div>`;
        el.addEventListener('click', () => handleMarkerClick(food));
        const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([food.longitude, food.latitude])
          .addTo(mapRef.current!);
        markersRef.current.set(food.id, marker);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredFoods, selectedFood, currentAutoTourFood, isMapLoaded, mode]);

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
      autoTourTimerRef.current = setTimeout(() => {
        setAutoTourIndex((p) => (p + 1) % filteredFoods.length);
      }, 8000);
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
      window.scrollTo({
        top: el.offsetTop,
        behavior: 'smooth'
      });
    }
  }, []);

  // ═══════════ RENDER ═══════════
  return (
    <div className={`maps-page mode-${mode}`}>

      {/* 0b. Chaotic Screen Flying Mascot Overlay */}
      {mode === 'story' && activeChapter < 1 && (
        <div id="podo-flying-overlay" className="podo-flying-overlay">
          <img src={`/kuliner/sejarah/terbang_${flyingFrame}.webp`} alt="Si Podo Flying" />
        </div>
      )}

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
            <div className="horizontal-scroll-container">
              <div className="horizontal-panel panel-1">
                <div className="bridging-content bridge-text-anim-1">
                  <h2 className="bridging-quote">&quot;Setiap daerah memiliki rasanya sendiri.&quot;</h2>
                </div>
              </div>
              <div className="horizontal-panel panel-2">
                <div className="bridging-content bridge-text-anim-2">
                  <h2 className="bridging-quote">&quot;Dan setiap rasa menyimpan sejarahnya sendiri.&quot;</h2>
                  <div className="bridging-divider"></div>
                  <p className="bridging-desc">
                    Lebih dari sekadar direktori makanan, ini adalah perjalanan menyusuri jejak rempah, akulturasi budaya, dan tradisi keraton yang membentuk identitas kita.
                  </p>
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
                  className="chapter-section"
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
                    onExploreStart={enterExploreMode}
                  />
                </div>
              );
            })}
          </div>

          {/* Progress Nav (Only show when past intro) */}
          <AnimatePresence>
            {activeChapter >= 0 && (
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
