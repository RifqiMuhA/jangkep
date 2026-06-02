'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AnimatePresence, motion } from 'motion/react';
import { FilterBar } from '../components/FilterBar';
import { StoryPanel } from '../components/StoryPanel';
import { SiPodo } from '../components/SiPodo';
import { AutoJourneyProgress } from '../components/AutoJourneyProgress';
import { MapLegend } from '../components/MapLegend';
import { MapControls } from '../components/MapControls';
import { Search, Play, Pause, X } from 'lucide-react';
import { foodsData, regions, regionCityMap } from '../data/foods';
import type { Food } from '../data/foods';
import '../maps.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiZ2l0cmF5YTE0MDAiLCJhIjoiY21wcGl1M2hkMGpmaDJwcXBraXdobGZkdCJ9.J5D7thClJjFmcmnYmTlm3g';
const CUSTOM_STYLE = 'mapbox://styles/gitraya1400/cmppjivb8001h01qw6gqc68be';

export default function ExploreMapPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const podoMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const flyIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [activeRegion, setActiveRegion] = useState('Semua');
  const [mapHighlightRegion, setMapHighlightRegion] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [isIndonesiaView, setIsIndonesiaView] = useState(true);

  const [showOnboarding, setShowOnboarding] = useState(true);

  // Helper to map a city to its region
  const getRegionForCity = useCallback((city: string): string => {
    const found = Object.entries(regionCityMap).find(([region, cities]) => region !== 'Semua' && cities.includes(city));
    return found ? found[0] : 'Semua';
  }, []);

  // GeoJSON Cache
  const boundaryCache = useRef<Record<string, GeoJSON.FeatureCollection>>({});

  // Auto tour state
  const [isAutoTourActive, setIsAutoTourActive] = useState(false);
  const [autoTourIndex, setAutoTourIndex] = useState(0);
  const [isAutoTourPaused, setIsAutoTourPaused] = useState(false);
  const autoTourTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFoods = useMemo(() => {
    let filtered = foodsData;
    if (activeRegion !== 'Semua') {
      const cities = regionCityMap[activeRegion];
      filtered = filtered.filter(f => cities.includes(f.city));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(f =>
        f.name.toLowerCase().includes(q) ||
        f.city.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        f.flavors.some(flavor => flavor.toLowerCase().includes(q))
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(f => f.category === selectedCategory);
    }
    return filtered;
  }, [activeRegion, searchQuery, selectedCategory]);

  const currentAutoTourFood = isAutoTourActive && filteredFoods.length > 0
    ? filteredFoods[autoTourIndex % filteredFoods.length]
    : null;

  // Init Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: CUSTOM_STYLE,
      center: [118.0, -2.5], // Center of Indonesia
      zoom: 4.5,
      pitch: 0,
      bearing: 0,
      attributionControl: false,
      dragRotate: true,
      pitchWithRotate: true,
      touchZoomRotate: true,
    });

    map.on('style.load', () => {
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
      });
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.8 });

      map.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 90.0],
          'sky-atmosphere-sun-intensity': 15
        }
      });

      map.setFog({
        range: [0.5, 3],
        color: '#3B1F0C',
        'high-color': '#1a0f06',
        'space-color': '#0d0703',
        'star-intensity': 0.1
      });

      // DIM LAYER
      map.addSource('world-dim-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });
      map.addLayer({
        id: 'world-dim-layer',
        type: 'fill',
        source: 'world-dim-source',
        paint: {
          'fill-color': '#000000',
          'fill-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            4.5, 0,
            7.5, 0,
            8.5, 0.6
          ],
          'fill-opacity-transition': { duration: 1000 }
        }
      });

      // HIGHLIGHT LAYERS - Source for all kabupaten/kota borders
      map.addSource('region-highlight-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });

      // Fill layer - subtle yellow tint on kabupaten areas
      map.addLayer({
        id: 'region-highlight-fill',
        type: 'fill',
        source: 'region-highlight-source',
        paint: {
          'fill-color': '#F5C400',
          'fill-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            6.5, 0,
            7.5, 0.05
          ],
          'fill-opacity-transition': { duration: 1000 }
        }
      });

      // Outer glow for the bold line (very wide, soft ambient glow)
      map.addLayer({
        id: 'region-highlight-glow-outer',
        type: 'line',
        source: 'region-highlight-source',
        paint: {
          'line-color': '#D4AF37', // Warm metallic gold
          'line-width': 16,
          'line-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            4.5, 0,
            6.5, 0,
            7.5, 0.15
          ],
          'line-blur': 8,
          'line-opacity-transition': { duration: 1000 }
        }
      });

      // Inner glow (medium width, subtle gold accent)
      map.addLayer({
        id: 'region-highlight-glow-inner',
        type: 'line',
        source: 'region-highlight-source',
        paint: {
          'line-color': '#B8860B', // Dark goldenrod
          'line-width': 6,
          'line-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            4.5, 0,
            6.5, 0,
            7.5, 0.25
          ],
          'line-blur': 3,
          'line-opacity-transition': { duration: 1000 }
        }
      });

      // SOLID line layer - this ALWAYS renders (no pattern dependency)
      map.addLayer({
        id: 'region-highlight-line',
        type: 'line',
        source: 'region-highlight-source',
        paint: {
          'line-color': '#D4AF37', // Elegant metallic gold line
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            6, 1,
            8, 2,
            10, 3,
            13, 5
          ],
          'line-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            4.5, 0,
            6.5, 0,
            7.5, 0.5
          ],
          'line-opacity-transition': { duration: 1000 }
        }
      });

      // Optional batik pattern layer ON TOP of the solid line (graceful enhancement)
      map.loadImage('/batik/batik_kawung.webp', (error, image) => {
        if (!error && image) {
          if (!map.hasImage('batik-pattern')) map.addImage('batik-pattern', image);
          map.addLayer({
            id: 'region-highlight-line-pattern',
            type: 'line',
            source: 'region-highlight-source',
            paint: {
              'line-pattern': 'batik-pattern',
              'line-width': [
                'interpolate',
                ['linear'],
                ['zoom'],
                6, 1,
                8, 3,
                10, 5,
                13, 8
              ],
              'line-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                4.5, 0,
                6.5, 0,
                7.5, 0.6
              ],
              'line-opacity-transition': { duration: 1000 }
            }
          });
        }
      });
    });

    // ── ADD MASCOT MARKER (SI PODO) ──
    const mascotContainer = document.createElement('div');
    mascotContainer.className = 'si-podo-container-map';
    mascotContainer.style.width = '120px';
    mascotContainer.style.height = '120px';
    mascotContainer.style.display = 'none'; // Default hidden
    mascotContainer.style.justifyContent = 'center';
    mascotContainer.style.alignItems = 'center';
    mascotContainer.style.opacity = '0';
    mascotContainer.style.pointerEvents = 'none';
    mascotContainer.style.zIndex = '9999'; // Ensure Podo is always above food pins
    mascotContainer.style.transition = 'opacity 0.5s ease';

    const mascotInner = document.createElement('div');
    mascotInner.className = 'si-podo-walker is-standing';
    mascotInner.style.width = '100%';
    mascotInner.style.height = '100%';
    mascotInner.style.display = 'flex';
    mascotInner.style.justifyContent = 'center';
    mascotInner.style.alignItems = 'center';

    const mascotImg = document.createElement('img');
    mascotImg.className = 'si-podo-img';
    mascotImg.src = '/kuliner/mascot_kuliner_1.webp';
    mascotImg.style.width = '100%';
    mascotImg.style.height = '100%';
    mascotImg.style.objectFit = 'contain';
    mascotImg.style.filter = 'drop-shadow(0px 8px 16px rgba(0,0,0,0.5))';

    mascotInner.appendChild(mascotImg);
    mascotContainer.appendChild(mascotInner);

    const mMarker = new mapboxgl.Marker({ element: mascotContainer, anchor: 'center' })
      .setLngLat([110.4, -7.3])
      .addTo(map);

    podoMarkerRef.current = mMarker;

    // Mascot Flying Frame Cycler
    let frame = 1;
    flyIntervalRef.current = setInterval(() => {
      const walker = mascotContainer.querySelector('.si-podo-walker');
      if (walker) {
        const img = walker.querySelector('.si-podo-img') as HTMLImageElement;
        if (img) {
          if (walker.classList.contains('is-walking')) {
            frame = (frame % 3) + 1;
            img.src = `/kuliner/sejarah/terbang_${frame}.webp`;
          } else {
            img.src = '/kuliner/mascot_kuliner_1.webp';
          }
        }
      }
    }, 200);

    let prevLng = 110.4;
    map.on('render', () => {
      if (podoMarkerRef.current && mapContainerRef.current?.classList.contains('is-auto-tour')) {
        const center = map.getCenter();
        podoMarkerRef.current.setLngLat(center);
        const walker = podoMarkerRef.current.getElement().querySelector('.si-podo-walker');
        if (walker) {
          const currentLng = center.lng;
          const diff = currentLng - prevLng;
          if (Math.abs(diff) > 0.0001) {
            const img = walker.querySelector('.si-podo-img') as HTMLImageElement;
            if (img) {
              if (diff < 0) {
                img.style.transform = 'scaleX(-1)';
              } else {
                img.style.transform = 'scaleX(1)';
              }
            }
          }
          prevLng = currentLng;

          if (map.isMoving()) {
            walker.classList.add('is-walking');
            walker.classList.remove('is-standing');
          } else {
            walker.classList.remove('is-walking');
            walker.classList.add('is-standing');
          }
        }
      }
    });

    map.on('rotate', () => {
      const bearing = map.getBearing();
      const compassIcon = document.querySelector('.map-ctrl-btn.solo svg');
      if (compassIcon) {
        (compassIcon as HTMLElement).style.transform = `rotate(${-bearing}deg)`;
      }
    });

    map.on('load', () => {
      setIsMapLoaded(true);
      setTimeout(() => {
        map.flyTo({
          center: [110.4, -7.3],
          zoom: 8.5,
          pitch: 45,
          bearing: -15,
          duration: 5000,
          essential: true
        });
      }, 2500);
    });
    mapRef.current = map;

    const toggleMarkers = () => {
      const zoom = map.getZoom();
      const isMapZoomedOut = zoom < 7.5; // Indonesia view
      const isZoomedIn = zoom > 8.7; // City view

      setIsIndonesiaView(isMapZoomedOut);

      if (mapContainerRef.current) {
        if (isZoomedIn) mapContainerRef.current.classList.add('markers-zoomed-in');
        else mapContainerRef.current.classList.remove('markers-zoomed-in');
      }
      
      const wrapper = document.getElementById('explore-page-wrapper');
      if (wrapper) {
        if (isMapZoomedOut) {
          wrapper.classList.add('map-is-indonesia');
          document.body.classList.add('map-is-indonesia');
        } else {
          wrapper.classList.remove('map-is-indonesia');
          document.body.classList.remove('map-is-indonesia');
        }
      }

      // Robust JS fallback to ensure visibility is correctly applied
      document.querySelectorAll('.cluster-marker-wrapper').forEach(el => {
        (el as HTMLElement).style.opacity = isMapZoomedOut ? '0' : (isZoomedIn ? '0' : '1');
        (el as HTMLElement).style.pointerEvents = isMapZoomedOut ? 'none' : (isZoomedIn ? 'none' : 'auto');
      });

      document.querySelectorAll('.food-marker-wrapper').forEach(el => {
        if (el.classList.contains('grouped')) {
          (el as HTMLElement).style.opacity = isMapZoomedOut ? '0' : (isZoomedIn ? '1' : '0');
          (el as HTMLElement).style.pointerEvents = isMapZoomedOut ? 'none' : (isZoomedIn ? 'auto' : 'none');
        } else {
          // Single markers
          (el as HTMLElement).style.opacity = isMapZoomedOut ? '0' : '1';
          (el as HTMLElement).style.pointerEvents = isMapZoomedOut ? 'none' : 'auto';
        }
      });
    };

    map.on('zoom', toggleMarkers);
    map.on('moveend', toggleMarkers);
    toggleMarkers();

    return () => {
      map.remove();
      mapRef.current = null;
      document.body.classList.remove('map-is-indonesia');
    };
  }, []);

  // --- BOUNDARY LOGIC ---
  const createMaskFromBoundary = useCallback((boundaryFc: GeoJSON.FeatureCollection): GeoJSON.Feature => {
    if (!boundaryFc.features.length) return { type: 'Feature', geometry: { type: 'Polygon', coordinates: [] }, properties: {} };
    const outerRing = [[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]];
    const holes: number[][][] = [];
    for (const feature of boundaryFc.features) {
      const geo = feature.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon;
      if (geo.type === 'Polygon') holes.push([...geo.coordinates[0]].reverse());
      else if (geo.type === 'MultiPolygon') {
        for (const poly of geo.coordinates) holes.push([...poly[0]].reverse());
      }
    }
    return { type: 'Feature', geometry: { type: 'Polygon', coordinates: [outerRing, ...holes] }, properties: {} };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;
    const map = mapRef.current;

    const activeRegionFiles: Record<string, string[]> = {
      'Semua': ['jateng_full'],
      'Semarang Raya': ['semarang'],
      'Solo Raya': ['solo_wonogiri'],
      'Banyumas & Kedu': ['banyumas', 'wonosobo_magelang'],
      'Pantura': ['pemalang', 'semarang'],
      'Muria & Pati': ['kudus_jepara', 'pati_blora']
    };

    const activeRegionMaskFiles: Record<string, string[]> = {
      'Semua': ['jateng_merged'],
      'Semarang Raya': ['semarang'],
      'Solo Raya': ['solo_wonogiri'],
      'Banyumas & Kedu': ['banyumas', 'wonosobo_magelang'],
      'Pantura': ['pemalang', 'semarang'],
      'Muria & Pati': ['kudus_jepara', 'pati_blora']
    };

    // Tampilkan seluruh batas kabupaten/kota di Jateng!
    const filesLine = ['jateng_full'];
    const filesMask = activeRegionMaskFiles[mapHighlightRegion] || activeRegionMaskFiles['Semua'];

    const loadData = async () => {
      const allFeaturesMask: GeoJSON.Feature[] = [];
      const isExactCity = Object.values(regionCityMap).some(cities => cities.includes(mapHighlightRegion));

      if (isExactCity && mapHighlightRegion !== 'Semua') {
        const file = 'jateng_full';
        if (!boundaryCache.current[file]) {
          try {
            const res = await fetch(`/geo/${file}.json?v=${Date.now()}`);
            if (res.ok) boundaryCache.current[file] = await res.json();
          } catch (e) { }
        }
        if (boundaryCache.current[file]) {
          const searchName = mapHighlightRegion === 'Solo' ? 'Surakarta' : mapHighlightRegion;
          const cityFeatures = boundaryCache.current[file].features.filter((f: any) => {
            const sName = (f.properties?.shapeName || '').toLowerCase();
            return sName === searchName.toLowerCase() || sName === `kota ${searchName.toLowerCase()}`;
          });
          
          if (cityFeatures.length > 0) {
            allFeaturesMask.push(...cityFeatures);
          } else {
            const fallbackFeatures = boundaryCache.current[file].features.filter((f: any) => 
              (f.properties?.shapeName || '').toLowerCase().includes(searchName.toLowerCase())
            );
            if (fallbackFeatures.length > 0) allFeaturesMask.push(...fallbackFeatures);
          }
        }
      } else {
        // Standard regional mask loading (for Filter Bar clicks)
        for (const file of filesMask) {
          if (!boundaryCache.current[file]) {
            try {
              const res = await fetch(`/geo/${file}.json?v=${Date.now()}`);
              if (res.ok) boundaryCache.current[file] = await res.json();
            } catch (e) { }
          }
          if (boundaryCache.current[file]) {
            allFeaturesMask.push(...boundaryCache.current[file].features);
          }
        }
      }

      const fcMask: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: allFeaturesMask };
      const mask = createMaskFromBoundary(fcMask);
      const dimSource = map.getSource('world-dim-source') as mapboxgl.GeoJSONSource;
      if (dimSource) dimSource.setData({ type: 'FeatureCollection', features: [mask] });

      // 2. Load data for Border Lines
      const allFeaturesLine: GeoJSON.Feature[] = [];
      for (const file of filesLine) {
        if (!boundaryCache.current[file]) {
          try {
            const res = await fetch(`/geo/${file}.json?v=${Date.now()}`);
            if (res.ok) {
              boundaryCache.current[file] = await res.json();
              console.log(`[Jangkep] Loaded border file: ${file} with ${boundaryCache.current[file].features.length} features`);
            } else {
              console.warn(`[Jangkep] Failed to load border: ${file}`, res.status);
            }
          } catch (e) { console.warn(`[Jangkep] Error loading border: ${file}`, e); }
        }
        if (boundaryCache.current[file]) {
          allFeaturesLine.push(...boundaryCache.current[file].features);
        }
      }

      console.log(`[Jangkep] Total border features to render: ${allFeaturesLine.length}`);
      const fcLine: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: allFeaturesLine };
      const hlSource = map.getSource('region-highlight-source') as mapboxgl.GeoJSONSource;
      if (hlSource) {
        hlSource.setData(fcLine);
        console.log('[Jangkep] Border data set to region-highlight-source');
      } else {
        console.warn('[Jangkep] region-highlight-source NOT FOUND!');
      }
    };

    loadData();
  }, [mapHighlightRegion, isMapLoaded, createMaskFromBoundary]);

  const handleMarkerClick = useCallback((food: Food) => {
    setShowOnboarding(false);
    setSelectedFood(food);
    // Focus exactly on the specific city/district rather than the massive culinary region
    setMapHighlightRegion(food.city);
    mapRef.current?.flyTo({
      center: [food.longitude, food.latitude],
      zoom: 13.5,
      pitch: 60,
      bearing: 15,
      speed: 0.8,
      curve: 1.2,
      essential: true
    });
  }, [getRegionForCity]);

  // Sync Markers
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;
    markersRef.current.forEach(m => m.remove());
    markersRef.current.clear();

    const cityGroups = filteredFoods.reduce((acc, food) => {
      if (!acc[food.city]) acc[food.city] = [];
      acc[food.city].push(food);
      return acc;
    }, {} as Record<string, Food[]>);

    const zoom = mapRef.current?.getZoom() ?? 8;
    const isZoomedIn = zoom > 8.7;

    Object.entries(cityGroups).forEach(([city, foods]) => {
      const isGroup = foods.length > 1;

      if (isGroup) {
        // Create Cluster Marker
        const clusterEl = document.createElement('div');
        clusterEl.className = 'cluster-marker-wrapper';
        const zoom = mapRef.current?.getZoom() ?? 8;
        const isMapZoomedOut = zoom < 7.5;
        const isZoomedIn = zoom > 8.7;

        clusterEl.style.opacity = isMapZoomedOut ? '0' : (isZoomedIn ? '0' : '1');
        clusterEl.style.pointerEvents = isMapZoomedOut ? 'none' : (isZoomedIn ? 'none' : 'auto');
        clusterEl.style.transition = 'opacity 0.3s ease';
        clusterEl.innerHTML = `
          <div style="width: 28px; height: 28px; background: var(--color-emas-keris); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: var(--font-dm-sans); font-weight: bold; color: white; cursor: pointer; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-size: 14px;">
            ${foods.length}
          </div>`;
        clusterEl.addEventListener('click', () => {
          mapRef.current?.flyTo({ center: [foods[0].longitude, foods[0].latitude], zoom: 11, duration: 1500 });
        });
        const marker = new mapboxgl.Marker({ element: clusterEl, anchor: 'center' })
          .setLngLat([foods[0].longitude, foods[0].latitude])
          .addTo(mapRef.current!);
        markersRef.current.set(`cluster-${city}`, marker);
      }

      // Create Individual Markers
      foods.forEach((food, index) => {
        const isActive = selectedFood?.id === food.id;
        const isTour = currentAutoTourFood?.id === food.id;

        const el = document.createElement('div');
        el.className = `food-marker-wrapper ${isActive ? 'active' : ''} ${isTour ? 'auto-tour' : ''} ${isGroup ? 'grouped' : ''}`;

        const zoom = mapRef.current?.getZoom() ?? 8;
        const isMapZoomedOut = zoom < 7.5;
        const isZoomedIn = zoom > 8.7;

        if (isGroup) {
          el.style.opacity = isMapZoomedOut ? '0' : (isZoomedIn ? '1' : '0');
          el.style.pointerEvents = isMapZoomedOut ? 'none' : (isZoomedIn ? 'auto' : 'none');
          el.style.transition = 'opacity 0.3s ease';
        } else {
          el.style.opacity = isMapZoomedOut ? '0' : '1';
          el.style.pointerEvents = isMapZoomedOut ? 'none' : 'auto';
          el.style.transition = 'opacity 0.3s ease';
        }

        if (isActive && food.image) {
          el.innerHTML = `
            <div class="food-marker active-marker">
              <img src="${food.image}" alt="${food.name}" />
            </div>
          `;
        } else {
          el.innerHTML = `
            <div class="food-marker inactive-flower" style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.3s ease;">
              <svg viewBox="0 0 24 24" width="22" height="22" style="transform: rotate(45deg); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35)); transition: all 0.3s ease;">
                <ellipse cx="12" cy="7" rx="3.5" ry="5.5" fill="#3B1F0C" stroke="#B8860B" stroke-width="1.5" />
                <ellipse cx="12" cy="17" rx="3.5" ry="5.5" fill="#3B1F0C" stroke="#B8860B" stroke-width="1.5" />
                <ellipse cx="7" cy="12" rx="5.5" ry="3.5" fill="#3B1F0C" stroke="#B8860B" stroke-width="1.5" />
                <ellipse cx="17" cy="12" rx="5.5" ry="3.5" fill="#3B1F0C" stroke="#B8860B" stroke-width="1.5" />
                <circle cx="12" cy="12" r="2.5" fill="#F5C400" stroke="#3B1F0C" stroke-width="0.8" />
              </svg>
            </div>
          `;
        }
        el.addEventListener('click', () => handleMarkerClick(food));

        const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([food.longitude, food.latitude])
          .addTo(mapRef.current!);
        markersRef.current.set(food.id, marker);
      });
    });
  }, [filteredFoods, selectedFood, currentAutoTourFood, isMapLoaded, handleMarkerClick]);

  const [tourFoods, setTourFoods] = useState<Food[]>([]);

  // Auto Tour Effect
  useEffect(() => {
    if (isAutoTourActive && !isAutoTourPaused && tourFoods.length > 0) {
      const cur = tourFoods[autoTourIndex % tourFoods.length];
      mapRef.current?.flyTo({
        center: [cur.longitude, cur.latitude],
        zoom: 13.5,
        pitch: 45,
        bearing: 15,
        speed: 0.28, // Slower, smoother cinematic glide
        curve: 1.3,
        essential: true,
      });

      setSelectedFood(cur);
      const reg = getRegionForCity(cur.city);
      setMapHighlightRegion(reg);
      setShowOnboarding(false);

      autoTourTimerRef.current = setTimeout(() => {
        setAutoTourIndex(p => (p + 1) % tourFoods.length);
      }, 7000); // 7 seconds per stop to feel like a documentary segment

      return () => { if (autoTourTimerRef.current) clearTimeout(autoTourTimerRef.current); };
    }
  }, [isAutoTourActive, isAutoTourPaused, autoTourIndex, tourFoods, getRegionForCity]);

  const handleAutoTourStart = useCallback(() => {
    if (filteredFoods.length === 0) return;

    // Sort so Semarang is first, Solo is last
    const sorted = [...filteredFoods].sort((a, b) => {
      if (a.city === 'Semarang' && b.city !== 'Semarang') return -1;
      if (b.city === 'Semarang' && a.city !== 'Semarang') return 1;
      if (a.city === 'Solo' && b.city !== 'Solo') return 1;
      if (b.city === 'Solo' && a.city !== 'Solo') return -1;
      return 0;
    });

    setTourFoods(sorted);
    setIsAutoTourActive(true);
    setAutoTourIndex(0);
    setIsAutoTourPaused(false);
    setSelectedFood(null);
  }, [filteredFoods]);

  const handleAutoTourStop = useCallback(() => {
    setIsAutoTourActive(false);
    setAutoTourIndex(0);
    setIsAutoTourPaused(false);
    setMapHighlightRegion(activeRegion);
    if (autoTourTimerRef.current) clearTimeout(autoTourTimerRef.current);
    mapRef.current?.flyTo({ center: [110.4, -7.3], zoom: 8.5, pitch: 45, bearing: -15, duration: 2000 });
  }, [activeRegion]);

  // Manage Podo Mascot Visibility
  useEffect(() => {
    if (mapContainerRef.current) {
      if (isAutoTourActive) {
        mapContainerRef.current.classList.add('is-auto-tour');
        if (podoMarkerRef.current) {
          const el = podoMarkerRef.current.getElement();
          el.style.display = 'flex';
          setTimeout(() => {
            el.style.opacity = '1';
          }, 50);
        }
      } else {
        mapContainerRef.current.classList.remove('is-auto-tour');
        if (podoMarkerRef.current) {
          const el = podoMarkerRef.current.getElement();
          el.style.opacity = '0';
          setTimeout(() => {
            el.style.display = 'none';
          }, 500); // match transition
        }
      }
    }
  }, [isAutoTourActive]);

  const handleAutoTourPauseToggle = useCallback(() => setIsAutoTourPaused(p => !p), []);

  const handleZoomIn = useCallback(() => mapRef.current?.easeTo({ zoom: (mapRef.current?.getZoom() ?? 8) + 1, duration: 300 }), []);
  const handleZoomOut = useCallback(() => mapRef.current?.easeTo({ zoom: (mapRef.current?.getZoom() ?? 8) - 1, duration: 300 }), []);
  const handleReset = useCallback(() => mapRef.current?.flyTo({ center: [110.4, -7.3], zoom: 8.5, pitch: 45, bearing: -15, duration: 2000 }), []);

  const handleRegionChange = useCallback((region: string) => {
    setActiveRegion(region);
    setMapHighlightRegion(region);
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
      bearing: 0,
      duration: 1500
    });
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedFood(null);
    setMapHighlightRegion(activeRegion);
    handleRegionChange(activeRegion); // Kembalikan POV kamera ke region semula!
  }, [activeRegion, handleRegionChange]);

  const suggestions = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    
    // 1. Food matches
    const matchedFoods = foodsData.filter(f => f.name.toLowerCase().includes(q));
    
    // 2. City matches
    const matchedCities = Array.from(new Set(foodsData.map(f => f.city)))
      .filter(city => city.toLowerCase().includes(q));
      
    // 3. Category matches
    const matchedCategories = ['Makanan Berat', 'Jajanan', 'Minuman']
      .filter(cat => cat.toLowerCase().includes(q));

    const list: Array<{ type: 'food' | 'city' | 'category'; label: string; sub: string; icon: string; value: any }> = [];

    matchedFoods.slice(0, 3).forEach(f => {
      list.push({ type: 'food', label: f.name, sub: `${f.city} • ${f.category}`, icon: f.icon, value: f });
    });

    matchedCities.slice(0, 2).forEach(c => {
      list.push({ type: 'city', label: c, sub: 'Kota / Wilayah', icon: '📍', value: c });
    });

    matchedCategories.slice(0, 1).forEach(cat => {
      list.push({ type: 'category', label: cat, sub: 'Kategori Kuliner', icon: '🍛', value: cat });
    });

    return list.slice(0, 5); // Max 5 suggestions
  }, [searchQuery]);

  const handleSuggestionClick = useCallback((s: any) => {
    if (s.type === 'food') {
      handleMarkerClick(s.value);
      setSearchQuery('');
    } else if (s.type === 'city') {
      setSearchQuery('');
      // Find the region for this city
      const region = Object.keys(regionCityMap).find(reg => regionCityMap[reg].includes(s.value));
      if (region) {
        handleRegionChange(region);
      }
      setSearchQuery(s.value);
    } else if (s.type === 'category') {
      setSelectedCategory(s.value);
      setSearchQuery('');
    }
  }, [handleMarkerClick, handleRegionChange]);

  return (
    <div id="explore-page-wrapper" style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <style dangerouslySetInnerHTML={{
        __html: `
        /* Hide global navigation bar when map is zoomed out */
        body.map-is-indonesia nav {
          opacity: 0 !important;
          pointer-events: none !important;
          transform: translateY(-100%) !important;
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        .map-is-indonesia #explore-ui-overlay,
        .map-is-indonesia #explore-ui-overlay * { opacity: 0 !important; pointer-events: none !important; }
        
        .map-is-indonesia .cluster-marker-wrapper,
        .map-is-indonesia .food-marker-wrapper { opacity: 0 !important; pointer-events: none !important; }
        
        .markers-zoomed-in .cluster-marker-wrapper { opacity: 0; pointer-events: none; transition: opacity 0.3s; }
        .cluster-marker-wrapper { transition: opacity 0.3s; }
        .food-marker-wrapper.grouped { opacity: 0; pointer-events: none; transition: opacity 0.3s; }
        .markers-zoomed-in .food-marker-wrapper.grouped { opacity: 1; pointer-events: auto; }

        /* Javanese-Indonesian Button Hover Slider */
        .jawa-indo-btn {
          position: relative;
          overflow: hidden;
        }
        .jawa-indo-btn .btn-content-slider {
          display: flex;
          flex-direction: column;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          transform: translateY(0);
        }
        .jawa-indo-btn:hover .btn-content-slider {
          transform: translateY(-50%);
        }

        /* Inactive flower marker animations */
        .food-marker-wrapper:hover .inactive-flower svg {
          transform: rotate(135deg) scale(1.2) !important;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5)) !important;
        }
        .food-marker-wrapper:hover .inactive-flower {
          transform: scale(1.1);
        }
      `}} />

      {/* Map Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />

      {/* Welcome Card Overlay */}
      <AnimatePresence>
        {isIndonesiaView && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: 'translateX(-50%) translateY(-50%)',
              zIndex: 100,
              pointerEvents: 'none',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              width: '90%',
              maxWidth: '650px',
              color: '#F8F5E9',
              textShadow: '0 4px 15px rgba(0, 0, 0, 0.9)'
            }}
          >
            {/* Elegant batik decorative line at the top */}
            <div style={{ width: '120px', height: '2px', background: 'linear-gradient(90deg, transparent, var(--color-emas-keris), transparent)' }} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{
                fontFamily: '"Noto Sans Javanese", sans-serif',
                fontSize: '22px',
                color: 'var(--color-emas-keris)',
                letterSpacing: '1.5px',
                lineHeight: '1.4'
              }}>
                ꦥꦺꦠꦫꦱꦗꦮꦠꦼꦔꦲ꧀
              </span>
              <h1 style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '52px',
                fontWeight: 800,
                color: '#F5C400',
                margin: '8px 0 0 0',
                letterSpacing: '6px',
                textShadow: '0 2px 20px rgba(245, 196, 0, 0.5)'
              }}>
                PETA RASA
              </h1>
              <p style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '16px',
                lineHeight: '1.8',
                color: 'rgba(248, 245, 233, 0.95)',
                margin: '16px 0 0 0',
                maxWidth: '560px'
              }}>
                Mengarungi mahakarya kuliner tradisional Jawa Tengah. Temukan kekayaan cerita sejarah, filosofi budaya, dan cita rasa autentik di balik setiap hidangan legendaris.
              </p>
            </div>
            <div style={{ width: '120px', height: '2px', background: 'linear-gradient(90deg, transparent, var(--color-emas-keris), transparent)', marginTop: '8px' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* UI Overlay */}
      <div id="explore-ui-overlay" style={{ pointerEvents: 'none', width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 10, transition: 'opacity 0.8s ease' }}>

        <div style={{ pointerEvents: 'none', width: '100%', height: '100%', position: 'relative' }}>
          {/* Navigation / Header */}
          <div style={{ padding: '24px', position: 'relative', zIndex: 50, pointerEvents: 'auto' }}>
            <FilterBar
              regions={regions}
              activeRegion={activeRegion}
              onRegionChange={handleRegionChange}
              onAutoTourStart={handleAutoTourStart}
              isAutoTourActive={isAutoTourActive}
              onSearchChange={setSearchQuery}
            />
          </div>

          <div style={{ pointerEvents: 'auto' }}>
            <MapControls 
              onZoomIn={handleZoomIn} 
              onZoomOut={handleZoomOut} 
              onReset={handleReset} 
            />

            {/* Combined Left Sidebar Container (prevents overlap) */}
            <div style={{
              pointerEvents: 'auto',
              position: 'absolute',
              bottom: '32px',
              left: '32px',
              zIndex: 110,
              width: '320px',
              display: 'flex',
              flexDirection: 'column-reverse',
              gap: '16px'
            }}>
              
              {/* 1. Si Podo & Legend Bubble */}
              <div style={{ pointerEvents: 'auto' }}>
                <SiPodo style={{ position: 'relative', bottom: 'auto', left: 'auto' }} />
              </div>

              {/* 2. Suggestions / Filters / Search block */}
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                
                {/* Suggestions panel positioned absolutely ABOVE the filters/search */}
                {suggestions.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: 0,
                    right: 0,
                    marginBottom: '10px',
                    background: '#F5F2EB',
                    border: '1.5px solid var(--color-emas-keris)',
                    borderRadius: '20px',
                    padding: '8px 0',
                    boxShadow: '0 -10px 30px rgba(59, 31, 12, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 120
                  }}>
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(s)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 16px',
                          border: 'none',
                          background: 'transparent',
                          width: '100%',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(184, 134, 11, 0.08)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <span style={{ fontSize: '18px' }}>{s.icon}</span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 600, fontSize: '13px', color: '#3B1F0C' }}>{s.label}</span>
                          <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', color: 'rgba(59, 31, 12, 0.6)' }}>{s.sub}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Category Filters (3 side-by-side) */}
                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="jawa-indo-btn"
                    style={{
                      flex: 1,
                      height: '42px',
                      borderRadius: '99px',
                      border: selectedCategory === null ? '2px solid var(--color-emas-keris)' : '1px solid rgba(184, 134, 11, 0.3)',
                      background: selectedCategory === null ? '#F5F2EB' : 'rgba(59, 31, 12, 0.85)',
                      color: selectedCategory === null ? '#3B1F0C' : '#F5F2EB',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div className="btn-content-slider" style={{ height: '84px', width: '100%' }}>
                      <div style={{ height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="text-jawa" style={{ fontFamily: '"Noto Sans Javanese", sans-serif', fontSize: '12px', fontWeight: 'bold' }}>ꦱꦼꦩꦸꦮ</span>
                      </div>
                      <div style={{ height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="text-indo" style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Semua</span>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedCategory('Makanan Berat')}
                    className="jawa-indo-btn"
                    style={{
                      flex: 1,
                      height: '42px',
                      borderRadius: '99px',
                      border: selectedCategory === 'Makanan Berat' ? '2px solid var(--color-emas-keris)' : '1px solid rgba(184, 134, 11, 0.3)',
                      background: selectedCategory === 'Makanan Berat' ? '#F5F2EB' : 'rgba(59, 31, 12, 0.85)',
                      color: selectedCategory === 'Makanan Berat' ? '#3B1F0C' : '#F5F2EB',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div className="btn-content-slider" style={{ height: '84px', width: '100%' }}>
                      <div style={{ height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="text-jawa" style={{ fontFamily: '"Noto Sans Javanese", sans-serif', fontSize: '12px', fontWeight: 'bold' }}>ꦥꦔꦤꦤ꧀</span>
                      </div>
                      <div style={{ height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="text-indo" style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Makanan</span>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedCategory('Jajanan')}
                    className="jawa-indo-btn"
                    style={{
                      flex: 1,
                      height: '42px',
                      borderRadius: '99px',
                      border: selectedCategory === 'Jajanan' ? '2px solid var(--color-emas-keris)' : '1px solid rgba(184, 134, 11, 0.3)',
                      background: selectedCategory === 'Jajanan' ? '#F5F2EB' : 'rgba(59, 31, 12, 0.85)',
                      color: selectedCategory === 'Jajanan' ? '#3B1F0C' : '#F5F2EB',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div className="btn-content-slider" style={{ height: '84px', width: '100%' }}>
                      <div style={{ height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="text-jawa" style={{ fontFamily: '"Noto Sans Javanese", sans-serif', fontSize: '12px', fontWeight: 'bold' }}>ꦗꦗꦤꦤ꧀</span>
                      </div>
                      <div style={{ height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="text-indo" style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Jajanan</span>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Search Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(59, 31, 12, 0.9)',
                  border: '2.5px solid var(--color-emas-keris)',
                  borderRadius: '99px',
                  padding: '8px 16px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  <Search style={{ color: 'var(--color-emas-keris)', marginRight: '10px', flexShrink: 0 }} size={18} />
                  <input
                    type="text"
                    placeholder="Cari kuliner, daerah, rasa..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    suppressHydrationWarning
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#F8F5E9',
                      fontFamily: 'var(--font-dm-sans)',
                      fontSize: '14px',
                      width: '100%'
                    }}
                  />
                </div>

              </div>

            </div>

            {/* Bottom Center Unified Playback Controller */}
            <div style={{ pointerEvents: 'auto' }}>
              {!isAutoTourActive ? (
                <button
                  onClick={handleAutoTourStart}
                  className="jawa-indo-btn"
                  suppressHydrationWarning
                  style={{
                    position: 'absolute',
                    bottom: '36px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 110,
                    width: '260px',
                    height: '56px',
                    borderRadius: '99px',
                    background: '#F5F2EB', // Cream white
                    border: '2px solid var(--color-emas-keris)',
                    boxShadow: '0 8px 30px rgba(59, 31, 12, 0.25)',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(-50%) translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(59, 31, 12, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(-50%)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(59, 31, 12, 0.25)';
                  }}
                >
                  <div className="btn-content-slider" style={{ height: '112px', width: '100%' }}>
                    <div style={{ height: '56px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                      <span className="text-jawa" style={{ fontFamily: '"Noto Sans Javanese", sans-serif', fontSize: '18px', fontWeight: 'bold', color: '#3B1F0C' }}>ꦩꦶꦮꦶꦠꦶꦠꦸꦂ</span>
                    </div>
                    <div style={{ height: '56px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                      <span className="text-indo" style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#3B1F0C' }}>Mulai Tur</span>
                    </div>
                  </div>
                </button>
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '36px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 110,
                    width: 'max-content',
                    minWidth: '460px',
                    maxWidth: '90vw',
                    height: '56px',
                    borderRadius: '99px',
                    background: '#F5F2EB', // Cream white
                    border: '2px solid var(--color-emas-keris)',
                    boxShadow: '0 8px 30px rgba(59, 31, 12, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 24px',
                    boxSizing: 'border-box',
                    gap: '12px'
                  }}
                >
                  {/* Play/Pause Button */}
                  <button
                    onClick={handleAutoTourPauseToggle}
                    className="jawa-indo-btn"
                    suppressHydrationWarning
                    style={{
                      width: '110px', // Wider to prevent text squishing
                      height: '40px',
                      borderRadius: '99px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      flexShrink: 0,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div className="btn-content-slider" style={{ height: '80px', width: '100%' }}>
                      <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%' }}>
                        {isAutoTourPaused ? <Play size={14} fill="#3B1F0C" style={{ color: '#3B1F0C', flexShrink: 0 }} /> : <Pause size={14} fill="#3B1F0C" style={{ color: '#3B1F0C', flexShrink: 0 }} />}
                        <span className="text-jawa" style={{ fontFamily: '"Noto Sans Javanese", sans-serif', fontSize: '14px', color: '#3B1F0C', whiteSpace: 'nowrap', flexShrink: 0 }}>
                          {isAutoTourPaused ? 'ꦩꦸꦭꦻ' : 'ꦔꦱꦺꦴ'}
                        </span>
                      </div>
                      <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%' }}>
                        {isAutoTourPaused ? <Play size={14} fill="#3B1F0C" style={{ color: '#3B1F0C', flexShrink: 0 }} /> : <Pause size={14} fill="#3B1F0C" style={{ color: '#3B1F0C', flexShrink: 0 }} />}
                        <span className="text-indo" style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#3B1F0C', whiteSpace: 'nowrap', flexShrink: 0 }}>
                          {isAutoTourPaused ? 'Play' : 'Pause'}
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Divider */}
                  <div style={{ width: '1.5px', height: '24px', background: 'rgba(184, 134, 11, 0.3)', margin: '0 4px', flexShrink: 0 }} />

                  {/* Progress Dots */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'center' }}>
                    {tourFoods.map((_, index) => {
                      const isActive = index === autoTourIndex % tourFoods.length;
                      const isCompleted = index <= autoTourIndex % tourFoods.length;
                      return (
                        <div
                          key={index}
                          onClick={() => setAutoTourIndex(index)}
                          style={{
                            position: 'relative',
                            width: isActive ? '10px' : '6px',
                            height: isActive ? '10px' : '6px',
                            borderRadius: '50%',
                            backgroundColor: isActive
                              ? 'var(--color-emas-keris)'
                              : (isCompleted ? '#8C6A48' : 'rgba(140, 106, 72, 0.3)'),
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: isActive ? '0 0 8px rgba(184, 134, 11, 0.6)' : 'none',
                          }}
                        >
                          {isActive && (
                            <motion.div
                              style={{
                                position: 'absolute',
                                inset: '-3px',
                                borderRadius: '50%',
                                border: '1.5px solid var(--color-emas-keris)',
                              }}
                              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Divider */}
                  <div style={{ width: '1.5px', height: '24px', background: 'rgba(184, 134, 11, 0.3)', margin: '0 4px', flexShrink: 0 }} />

                  {/* Stop Button */}
                  <button
                    onClick={handleAutoTourStop}
                    className="jawa-indo-btn"
                    suppressHydrationWarning
                    style={{
                      width: '110px', // Wider to prevent text squishing
                      height: '40px',
                      borderRadius: '99px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      flexShrink: 0,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div className="btn-content-slider" style={{ height: '80px', width: '100%' }}>
                      <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%' }}>
                        <X size={14} style={{ color: '#3B1F0C', flexShrink: 0 }} />
                        <span className="text-jawa" style={{ fontFamily: '"Noto Sans Javanese", sans-serif', fontSize: '14px', color: '#3B1F0C', whiteSpace: 'nowrap', flexShrink: 0 }}>ꦩꦦ꧀ꦢꦼꦒ꧀</span>
                      </div>
                      <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%' }}>
                        <X size={14} style={{ color: '#3B1F0C', flexShrink: 0 }} />
                        <span className="text-indo" style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#3B1F0C', whiteSpace: 'nowrap', flexShrink: 0 }}>Stop</span>
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <AnimatePresence>
              {selectedFood && (
                <StoryPanel
                  food={selectedFood}
                  onClose={handleClosePanel}
                  onFoodSelect={(id) => {
                    const f = foodsData.find((x) => x.id === id);
                    if (f) handleMarkerClick(f);
                  }}
                  allFoods={foodsData}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
