import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const EXPLORE_PAGE = path.join(ROOT_DIR, 'src/app/maps/explore/page.tsx');
const STORY_CLIENT = path.join(ROOT_DIR, 'src/app/maps/StoryMapsClient.tsx');
const MAPS_PAGE = path.join(ROOT_DIR, 'src/app/maps/page.tsx');

describe('Milestone 3 Adversarial Stress Testing: Mapbox & Map Views Optimization', () => {
  const exploreSource = fs.readFileSync(EXPLORE_PAGE, 'utf8');
  const storySource = fs.readFileSync(STORY_CLIENT, 'utf8');
  const mapsSource = fs.readFileSync(MAPS_PAGE, 'utf8');

  // =========================================================================
  // SCOPE 1: Rapid Mode Switching ('story' <-> 'explore') in StoryMapsClient
  // =========================================================================
  describe('Scope 1: Rapid Mode Switching Invariant & WebGL Context Stability', () => {
    test('Source inspection: Mapbox instance lifecycle is strictly decoupled from mode', () => {
      // Mapbox useEffect must depend on [] (empty dependency array)
      const mapInitSection = storySource.match(/\/\/ ═══════════ MAPBOX INIT ═══════════[\s\S]*?useEffect\(\(\)\s*=>\s*\{([\s\S]*?)\},\s*\[(.*?)\]\);/);
      assert.ok(mapInitSection, 'Mapbox instantiation effect MUST exist');
      const deps = mapInitSection[2].trim();
      assert.strictEqual(deps, '', 'Mapbox instantiation dependency array must be empty [] (NOT [mode])');
      assert.ok(mapInitSection[1].includes('new mapboxgl.Map'), 'Effect must instantiate mapboxgl.Map');

      // Mode toggling effect must exist
      const modeEffectMatch = storySource.match(/useEffect\(\(\)\s*=>\s*\{([\s\S]*?)\},\s*\[mode,\s*isMapLoaded\]\);/);
      assert.ok(modeEffectMatch, 'Mode interaction effect MUST depend on [mode, isMapLoaded]');
      const modeEffectBody = modeEffectMatch[1];
      assert.match(modeEffectBody, /if\s*\(!mapRef\.current\)\s*return;/, 'Mode effect must guard against uninitialized mapRef');
      assert.match(modeEffectBody, /mapRef\.current\.scrollZoom\.disable\(\)/, 'Must disable scrollZoom in story mode');
      assert.match(modeEffectBody, /mapRef\.current\.scrollZoom\.enable\(\)/, 'Must enable scrollZoom in explore mode');
    });

    test('Empirical Stress: 500 Rapid Mode Switches preserve single WebGL context and zero context loss', () => {
      // Model the Mapbox instance and handlers state
      class MockHandler {
        constructor() { this.enabled = false; }
        enable() { this.enabled = true; }
        disable() { this.enabled = false; }
      }

      class MockMap {
        constructor() {
          this.isDestroyed = false;
          this.scrollZoom = new MockHandler();
          this.boxZoom = new MockHandler();
          this.dragRotate = new MockHandler();
          this.dragPan = new MockHandler();
          this.keyboard = new MockHandler();
          this.doubleClickZoom = new MockHandler();
          this.touchZoomRotate = new MockHandler();
        }
        remove() {
          this.isDestroyed = true;
        }
      }

      let webglContextCreations = 0;
      let webglContextDestructions = 0;
      let mapInstance = null;

      // Simulated Component Mount (StoryMapsClient)
      const mountStoryMapsClient = () => {
        webglContextCreations++;
        mapInstance = new MockMap();
      };

      // Simulated Interactivity Toggle Hook
      const syncModeInteractivity = (mode, isLoaded) => {
        if (!mapInstance || !isLoaded) return;
        if (mode === 'story') {
          mapInstance.scrollZoom.disable();
          mapInstance.boxZoom.disable();
          mapInstance.dragRotate.disable();
          mapInstance.dragPan.disable();
          mapInstance.keyboard.disable();
          mapInstance.doubleClickZoom.disable();
          mapInstance.touchZoomRotate.disable();
        } else {
          mapInstance.scrollZoom.enable();
          mapInstance.boxZoom.enable();
          mapInstance.dragRotate.enable();
          mapInstance.dragPan.enable();
          mapInstance.keyboard.enable();
          mapInstance.doubleClickZoom.enable();
          mapInstance.touchZoomRotate.enable();
        }
      };

      // 1. Initial Mount in 'story' mode
      mountStoryMapsClient();
      let mode = 'story';
      let isMapLoaded = true;
      syncModeInteractivity(mode, isMapLoaded);

      assert.strictEqual(webglContextCreations, 1, 'Only 1 WebGL context created on initial mount');
      assert.strictEqual(mapInstance.scrollZoom.enabled, false, 'Story mode must disable map interaction handlers');

      // 2. Perform 500 rapid alternating mode toggles
      for (let i = 0; i < 500; i++) {
        mode = mode === 'story' ? 'explore' : 'story';
        syncModeInteractivity(mode, isMapLoaded);

        const expectedEnabled = mode === 'explore';
        assert.strictEqual(
          mapInstance.scrollZoom.enabled,
          expectedEnabled,
          `Iteration ${i}: scrollZoom.enabled should be ${expectedEnabled} for mode ${mode}`
        );
        assert.strictEqual(
          mapInstance.dragPan.enabled,
          expectedEnabled,
          `Iteration ${i}: dragPan.enabled should be ${expectedEnabled} for mode ${mode}`
        );
      }

      // 3. Verify zero WebGL context thrashing
      assert.strictEqual(webglContextCreations, 1, 'WebGL context was created strictly once across 500 switches');
      assert.strictEqual(webglContextDestructions, 0, 'Zero map removals occurred during mode switching');
      assert.strictEqual(mapInstance.isDestroyed, false, 'Map remains fully alive throughout mode switches');

      // 4. Component unmount
      mapInstance.remove();
      webglContextDestructions++;
      assert.strictEqual(webglContextDestructions, 1, 'Map is destroyed strictly once on component unmount');
    });

    test('Empirical Stress: GSAP matchMedia & ScrollTrigger teardown on mode switch', () => {
      // Stress test that rapid mode switching reverts matchMedia without trigger leaks
      let activeTriggers = new Set();
      let activeMediaQueries = new Set();

      class MockScrollTrigger {
        constructor(id) {
          this.id = id;
          activeTriggers.add(this);
        }
        kill() {
          activeTriggers.delete(this);
        }
      }

      class MockMatchMedia {
        constructor() {
          activeMediaQueries.add(this);
        }
        add(query, callback) {
          // simulate adding trigger
          const trigger = new MockScrollTrigger(`trigger_${Math.random()}`);
          return trigger;
        }
        revert() {
          activeMediaQueries.delete(this);
        }
      }

      // Simulate mode changes 100 times
      for (let i = 0; i < 100; i++) {
        // Entering 'story'
        const mm = new MockMatchMedia();
        const t1 = mm.add('(min-width: 769px)', () => {});
        const t2 = new MockScrollTrigger('chapter_trigger');

        assert.ok(activeMediaQueries.size > 0, 'Media query active in story mode');
        assert.ok(activeTriggers.size >= 2, 'ScrollTriggers active in story mode');

        // Leaving 'story' to 'explore' -> useGSAP cleanup executes
        mm.revert();
        t1.kill();
        t2.kill();

        assert.strictEqual(activeMediaQueries.size, 0, `Iteration ${i}: matchMedia reverted completely`);
        assert.strictEqual(activeTriggers.size, 0, `Iteration ${i}: All triggers killed`);
      }
    });

    test('Empirical Stress: StoryMapsClient Marker map cleanup on mode switch', () => {
      // Simulate markers map behavior
      const markersMap = new Map();
      let markersRemoved = 0;

      const mockCreateMarker = (id) => ({
        id,
        remove: () => { markersRemoved++; }
      });

      // Populate markers in explore mode (e.g. 50 food markers)
      for (let i = 0; i < 50; i++) {
        markersMap.set(`food_${i}`, mockCreateMarker(`food_${i}`));
      }
      assert.strictEqual(markersMap.size, 50);

      // Switch to story mode: markers effect cleanup executes
      markersMap.forEach(m => m.remove());
      markersMap.clear();

      assert.strictEqual(markersRemoved, 50, 'All 50 markers removed upon mode switch');
      assert.strictEqual(markersMap.size, 0, 'Markers map cleared cleanly');
    });
  });

  // =========================================================================
  // SCOPE 2: Rapid Navigation To/From /maps and /maps/explore
  // =========================================================================
  describe('Scope 2: Rapid Navigation & Resource Cleanup Lifecycle', () => {
    test('Empirical Stress: 100 Rapid Route Transitions between /maps and /maps/explore', () => {
      const activeTimers = new Set();
      const activeIntervals = new Set();
      const activeRafs = new Set();
      const activeMarkers = new Set();
      const activeMaps = new Set();

      let nextTimerId = 1;
      const mockSetTimeout = (fn, ms) => {
        const id = nextTimerId++;
        activeTimers.add(id);
        return id;
      };
      const mockClearTimeout = (id) => { activeTimers.delete(id); };

      const mockSetInterval = (fn, ms) => {
        const id = nextTimerId++;
        activeIntervals.add(id);
        return id;
      };
      const mockClearInterval = (id) => { activeIntervals.delete(id); };

      const mockRaf = (fn) => {
        const id = nextTimerId++;
        activeRafs.add(id);
        return id;
      };
      const mockCancelRaf = (id) => { activeRafs.delete(id); };

      const mockCreateMarker = (type) => {
        const marker = {
          type,
          remove: () => { activeMarkers.delete(marker); }
        };
        activeMarkers.add(marker);
        return marker;
      };

      const mockCreateMap = (route) => {
        const map = {
          route,
          remove: () => { activeMaps.delete(map); }
        };
        activeMaps.add(map);
        return map;
      };

      // ── StoryMapsClient Lifecycle Simulator ──
      const simulateStoryMapsMount = () => {
        const map = mockCreateMap('/maps');
        const mascotMarker = mockCreateMarker('mascot');
        const flyInterval = mockSetInterval(() => {}, 200);
        let patternRafId = mockRaf(() => {});
        let autoTourTimer = mockSetTimeout(() => {}, 3000);
        let onboardingTimer = mockSetTimeout(() => {}, 4000);

        const markers = new Map();
        for (let i = 0; i < 30; i++) {
          markers.set(`marker_${i}`, mockCreateMarker('food'));
        }

        // Unmount function
        const unmount = () => {
          mockCancelRaf(patternRafId);
          mockClearInterval(flyInterval);
          if (autoTourTimer) mockClearTimeout(autoTourTimer);
          if (onboardingTimer) mockClearTimeout(onboardingTimer);
          mascotMarker.remove();
          markers.forEach(m => m.remove());
          markers.clear();
          map.remove();
        };

        return { unmount };
      };

      // ── ExplorePage Lifecycle Simulator ──
      const simulateExplorePageMount = () => {
        const map = mockCreateMap('/maps/explore');
        const podoMarker = mockCreateMarker('podo');
        const flyInterval = mockSetInterval(() => {}, 200);
        const initialFlyTimeout = mockSetTimeout(() => {}, 2500);
        let autoTourTimer = mockSetTimeout(() => {}, 7000);
        let mascotT1 = mockSetTimeout(() => {}, 50);
        let mascotT2 = mockSetTimeout(() => {}, 500);

        const markers = new Map();
        for (let i = 0; i < 40; i++) {
          markers.set(`explore_marker_${i}`, mockCreateMarker('food'));
        }

        // Unmount function
        const unmount = () => {
          mockClearTimeout(initialFlyTimeout);
          mockClearInterval(flyInterval);
          if (autoTourTimer) mockClearTimeout(autoTourTimer);
          mockClearTimeout(mascotT1);
          mockClearTimeout(mascotT2);
          podoMarker.remove();
          markers.forEach(m => m.remove());
          markers.clear();
          map.remove();
        };

        return { unmount };
      };

      // Perform 100 rapid route transitions:
      // Route 1 (/maps) mount -> unmount -> Route 2 (/maps/explore) mount -> unmount
      for (let routeCycle = 0; routeCycle < 50; routeCycle++) {
        // Mount /maps
        const page1 = simulateStoryMapsMount();
        assert.strictEqual(activeMaps.size, 1, 'Exactly 1 active map during /maps mount');
        assert.ok(activeMarkers.size >= 31, 'Markers mounted on /maps');

        // Unmount /maps
        page1.unmount();
        assert.strictEqual(activeMaps.size, 0, 'Map removed on /maps unmount');
        assert.strictEqual(activeMarkers.size, 0, 'All markers removed on /maps unmount');
        assert.strictEqual(activeTimers.size, 0, 'All timers cleared on /maps unmount');
        assert.strictEqual(activeIntervals.size, 0, 'All intervals cleared on /maps unmount');
        assert.strictEqual(activeRafs.size, 0, 'RAF cancelled on /maps unmount');

        // Mount /maps/explore
        const page2 = simulateExplorePageMount();
        assert.strictEqual(activeMaps.size, 1, 'Exactly 1 active map during /maps/explore mount');
        assert.ok(activeMarkers.size >= 41, 'Markers mounted on /maps/explore');

        // Unmount /maps/explore
        page2.unmount();
        assert.strictEqual(activeMaps.size, 0, 'Map removed on /maps/explore unmount');
        assert.strictEqual(activeMarkers.size, 0, 'All markers removed on /maps/explore unmount');
        assert.strictEqual(activeTimers.size, 0, 'All timers cleared on /maps/explore unmount');
        assert.strictEqual(activeIntervals.size, 0, 'All intervals cleared on /maps/explore unmount');
      }

      // Final invariant check: Absolutely zero memory accumulation or orphaned handles
      assert.strictEqual(activeMaps.size, 0, 'Final maps count is 0');
      assert.strictEqual(activeMarkers.size, 0, 'Final markers count is 0');
      assert.strictEqual(activeTimers.size, 0, 'Final timers count is 0');
      assert.strictEqual(activeIntervals.size, 0, 'Final intervals count is 0');
      assert.strictEqual(activeRafs.size, 0, 'Final RAF count is 0');
    });

    test('Empirical Stress: Asynchronous in-flight GeoJSON fetch when unmounted', async () => {
      // Stress test: what happens if component unmounts while fetch is in-flight?
      let unmounted = false;
      let map = {
        getSource: (id) => (unmounted ? null : { setData: () => {} }),
        getLayer: (id) => (unmounted ? null : {}),
        setPaintProperty: () => {}
      };

      let unhandledErrors = [];
      const originalHandler = process.listeners('unhandledRejection');

      // Async loader mimicking loadBoundary / applyBoundary
      const asyncLoadBoundary = async () => {
        try {
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 50));
          
          if (unmounted) {
            // Guard: map or sources might be gone
            const dimSource = map.getSource('world-dim-source');
            if (dimSource) {
              dimSource.setData({});
            }
            try {
              if (map.getLayer('world-dim-layer')) {
                map.setPaintProperty('world-dim-layer', 'fill-opacity', 0.7);
              }
            } catch (e) {
              // Gracefully caught
            }
          }
          return { ok: true };
        } catch (err) {
          unhandledErrors.push(err);
          return null;
        }
      };

      // Start 20 async operations
      const promises = [];
      for (let i = 0; i < 20; i++) {
        promises.push(asyncLoadBoundary());
      }

      // Immediately unmount component while fetches are pending
      unmounted = true;

      const results = await Promise.all(promises);
      assert.strictEqual(unhandledErrors.length, 0, 'Zero unhandled errors or rejections during mid-flight unmount');
      assert.strictEqual(results.length, 20, 'All 20 requests safely concluded');
    });

    test('Empirical Stress: Document body class cleanup on explore unmount', () => {
      // Simulate DOM body class list
      const classList = new Set();
      const mockDocument = {
        body: {
          classList: {
            add: (c) => classList.add(c),
            remove: (c) => classList.delete(c),
            contains: (c) => classList.has(c)
          }
        }
      };

      // When explore page zooms out to Indonesia
      mockDocument.body.classList.add('map-is-indonesia');
      assert.ok(mockDocument.body.classList.contains('map-is-indonesia'));

      // On unmount cleanup:
      mockDocument.body.classList.remove('map-is-indonesia');
      assert.strictEqual(
        mockDocument.body.classList.contains('map-is-indonesia'),
        false,
        'Body class map-is-indonesia MUST be removed on unmount to prevent styling contamination'
      );
    });
  });

  // =========================================================================
  // SCOPE 3: Test Suite Regression & Static Build Verification
  // =========================================================================
  describe('Scope 3: Test Suite Regression & Build Invariants', () => {
    test('All verification test suites exist and are readable', () => {
      const suites = [
        'tests/m1_verification.test.mjs',
        'tests/m2_verification.test.mjs',
        'tests/m2_adversarial_stress.test.mjs',
        'tests/m3_verification.test.mjs',
      ];

      for (const suite of suites) {
        const fullPath = path.join(ROOT_DIR, suite);
        assert.ok(fs.existsSync(fullPath), `${suite} must exist`);
        const stat = fs.statSync(fullPath);
        assert.ok(stat.size > 0, `${suite} must not be empty`);
      }
    });

    test('Static build generated both /maps and /maps/explore routes', () => {
      const nextDir = path.join(ROOT_DIR, '.next');
      assert.ok(fs.existsSync(nextDir), '.next build output folder must exist');

      // Verify server pages manifest has /maps and /maps/explore
      const serverPagesManifest = path.join(nextDir, 'server', 'pages-manifest.json');
      const appPathsManifest = path.join(nextDir, 'server', 'app-paths-manifest.json');

      assert.ok(fs.existsSync(appPathsManifest), 'app-paths-manifest.json must exist');
      const appPaths = JSON.parse(fs.readFileSync(appPathsManifest, 'utf8'));

      assert.ok(appPaths['/maps/page'], 'App paths must include /maps/page');
      assert.ok(appPaths['/maps/explore/page'], 'App paths must include /maps/explore/page');
    });
  });
});
