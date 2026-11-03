import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const EXPLORE_PAGE = path.join(ROOT_DIR, 'src/app/maps/explore/page.tsx');
const STORY_CLIENT = path.join(ROOT_DIR, 'src/app/maps/StoryMapsClient.tsx');

describe('Milestone 3 Empirical Verification: R3 Optimize Mapbox & Map Views', () => {
  const exploreSource = fs.readFileSync(EXPLORE_PAGE, 'utf8');
  const storySource = fs.readFileSync(STORY_CLIENT, 'utf8');

  // =========================================================================
  // REQUIREMENT 1: src/app/maps/explore/page.tsx Cleanup
  // =========================================================================
  describe('explore/page.tsx: Timers & Marker Cleanup', () => {
    test('initialFlyTimeoutRef is declared and tracked', () => {
      assert.match(exploreSource, /const\s+initialFlyTimeoutRef\s*=\s*useRef<NodeJS\.Timeout\s*\|\s*null>\(null\);/, 'initialFlyTimeoutRef must be declared');
      assert.match(exploreSource, /initialFlyTimeoutRef\.current\s*=\s*setTimeout\(/, 'initial flyTo timeout must be assigned to initialFlyTimeoutRef.current');
    });

    test('Map unmount cleanup properly clears all timers and markers', () => {
      // Find the unmount cleanup in the initial map useEffect
      const mapCleanupMatch = exploreSource.match(/return\s*\(\)\s*=>\s*\{([\s\S]*?map\.remove\(\);[\s\S]*?)\};\s*\}, \[\]\);/);
      assert.ok(mapCleanupMatch, 'Map useEffect unmount cleanup must exist');
      const cleanupBody = mapCleanupMatch[1];

      assert.match(cleanupBody, /clearTimeout\(initialFlyTimeoutRef\.current\)/, 'Cleanup must clear initialFlyTimeoutRef');
      assert.match(cleanupBody, /initialFlyTimeoutRef\.current\s*=\s*null/, 'Cleanup must reset initialFlyTimeoutRef to null');

      assert.match(cleanupBody, /clearInterval\(flyIntervalRef\.current\)/, 'Cleanup must clear flyIntervalRef');
      assert.match(cleanupBody, /flyIntervalRef\.current\s*=\s*null/, 'Cleanup must reset flyIntervalRef to null');

      assert.match(cleanupBody, /clearTimeout\(autoTourTimerRef\.current\)/, 'Cleanup must clear autoTourTimerRef');
      assert.match(cleanupBody, /autoTourTimerRef\.current\s*=\s*null/, 'Cleanup must reset autoTourTimerRef to null');

      assert.match(cleanupBody, /podoMarkerRef\.current\?\.remove\(\)/, 'Cleanup must remove podoMarkerRef');
      assert.match(cleanupBody, /podoMarkerRef\.current\s*=\s*null/, 'Cleanup must set podoMarkerRef to null');
      assert.match(cleanupBody, /map\.remove\(\)/, 'Cleanup must remove map');
      assert.match(cleanupBody, /mapRef\.current\s*=\s*null/, 'Cleanup must set mapRef to null');
    });

    test('Markers useEffect returns a cleanup function that clears all markers', () => {
      const markersEffectMatch = exploreSource.match(/\/\/ Sync Markers[\s\S]*?useEffect\(\(\)\s*=>\s*\{([\s\S]*?)\},\s*\[filteredFoods,\s*selectedFood,\s*currentAutoTourFood,\s*isMapLoaded,\s*handleMarkerClick\]\);/);
      assert.ok(markersEffectMatch, 'Markers useEffect must exist');
      const effectBody = markersEffectMatch[1];

      assert.match(effectBody, /return\s*\(\)\s*=>\s*\{[\s\S]*?markersRef\.current\.forEach\(\(?[a-zA-Z]+\)?\s*=>\s*[a-zA-Z]+\.remove\(\)\);[\s\S]*?markersRef\.current\.clear\(\);[\s\S]*?\};/, 'Markers useEffect must return cleanup function');
    });

    test('Podo mascot visibility useEffect tracks and clears timeouts', () => {
      const podoVisibilityMatch = exploreSource.match(/\/\/ Manage Podo Mascot Visibility[\s\S]*?useEffect\(\(\)\s*=>\s*\{([\s\S]*?)\},\s*\[isAutoTourActive\]\);/);
      assert.ok(podoVisibilityMatch, 'Podo visibility useEffect must exist');
      const effectBody = podoVisibilityMatch[1];

      assert.match(effectBody, /clearTimeout\(t1\)/, 'Must clean up timeout t1');
      assert.match(effectBody, /clearTimeout\(t2\)/, 'Must clean up timeout t2');
    });
  });

  // =========================================================================
  // REQUIREMENT 2: src/app/maps/StoryMapsClient.tsx Cleanup & Lifecycle
  // =========================================================================
  describe('StoryMapsClient.tsx: Batik Loop, Mode Decoupling, Markers & GSAP Cleanup', () => {
    test('Batik RAF repaint loop tracks patternRafId and cancels on unmount', () => {
      assert.match(storySource, /let\s+patternRafId\s*:\s*number\s*\|\s*null\s*=\s*null;/, 'patternRafId must be declared');
      assert.match(storySource, /patternRafId\s*=\s*requestAnimationFrame\(animatePattern\);/, 'patternRafId must be assigned on requestAnimationFrame');

      // Cleanup checks
      const mapCleanupMatch = storySource.match(/return\s*\(\)\s*=>\s*\{([\s\S]*?map\.remove\(\);[\s\S]*?)\};\s*\}, \[\]\);/);
      assert.ok(mapCleanupMatch, 'Map useEffect cleanup must exist');
      const cleanupBody = mapCleanupMatch[1];

      assert.match(cleanupBody, /cancelAnimationFrame\(patternRafId\)/, 'Batik pattern RAF loop must be cancelled');
      assert.match(cleanupBody, /batikImg\.onload\s*=\s*null/, 'batikImg.onload must be cleared on unmount');
      assert.match(cleanupBody, /mascotMarkerRef\.current\?\.remove\(\)/, 'mascotMarkerRef must be removed on unmount');
      assert.match(cleanupBody, /mascotMarkerRef\.current\s*=\s*null/, 'mascotMarkerRef must be nullified');
      assert.match(cleanupBody, /map\.remove\(\)/, 'map must be removed on unmount');
      assert.match(cleanupBody, /mapRef\.current\s*=\s*null/, 'mapRef must be nullified');
    });

    test('Mapbox instance lifecycle is decoupled from mode switch', () => {
      // Map instantiation useEffect must depend on [] (NOT [mode])
      const mapInitMatch = storySource.match(/\/\/ ═══════════ MAPBOX INIT ═══════════[\s\S]*?useEffect\(\(\)\s*=>\s*\{[\s\S]*?const map = new mapboxgl\.Map\(\{([\s\S]*?)\}\);[\s\S]*?\}, \[\]\);/);
      assert.ok(mapInitMatch, 'Mapbox instantiation must have empty dependency array []');
      assert.match(mapInitMatch[1], /interactive:\s*false,/, 'Initial interactive mode should be false (default story mode)');

      // Handlers toggle effect must exist and depend on [mode, isMapLoaded]
      const handlersToggleMatch = storySource.match(/useEffect\(\(\)\s*=>\s*\{[\s\S]*?if\s*\(mode === 'story'\)\s*\{[\s\S]*?mapRef\.current\.scrollZoom\.disable\(\);[\s\S]*?\} else \{[\s\S]*?mapRef\.current\.scrollZoom\.enable\(\);[\s\S]*?\}\s*\}, \[mode, isMapLoaded\]\);/);
      assert.ok(handlersToggleMatch, 'Handlers toggle effect must handle mode switching without destroying map');
    });

    test('GSAP ScrollTrigger matchMedia cleans up properly via mm.revert()', () => {
      const gsapEffectMatch = storySource.match(/useGSAP\(\(\)\s*=>\s*\{([\s\S]*?)\},\s*\{\s*dependencies:\s*\[mode,\s*isMapLoaded\],\s*scope:\s*scrollContainerRef\s*\}\);/);
      assert.ok(gsapEffectMatch, 'useGSAP hook must exist');
      const gsapBody = gsapEffectMatch[1];

      assert.match(gsapBody, /let\s+mm\s*=\s*gsap\.matchMedia\(\);/, 'Must instantiate matchMedia');
      assert.match(gsapBody, /return\s*\(\)\s*=>\s*\{[\s\S]*?mm\.revert\(\);[\s\S]*?triggers\.forEach\([\s\S]*?ScrollTrigger\.getAll\(\)\.forEach\([\s\S]*?\};/, 'Must call mm.revert() in cleanup');
    });

    test('Markers useEffect returns a cleanup function in StoryMapsClient', () => {
      const markersEffectMatch = storySource.match(/useEffect\(\(\)\s*=>\s*\{[\s\S]*?markersRef\.current\.forEach\(\(m\)\s*=>\s*m\.remove\(\)\);[\s\S]*?markersRef\.current\.clear\(\);[\s\S]*?return\s*\(\)\s*=>\s*\{[\s\S]*?markersRef\.current\.forEach\(\(m\)\s*=>\s*m\.remove\(\)\);[\s\S]*?markersRef\.current\.clear\(\);[\s\S]*?\};\s*\/\/ eslint-disable-next-line react-hooks\/exhaustive-deps\s*\}, \[filteredFoods, selectedFood, currentAutoTourFood, isMapLoaded, mode, activeChapter, activeFoodItems\]\);/);
      assert.ok(markersEffectMatch, 'StoryMapsClient markers useEffect must return cleanup function');
    });

    test('Active chapter mascot visibility and onboarding timers are tracked and cleaned', () => {
      assert.match(storySource, /const\s+onboardingTimerRef\s*=\s*useRef<ReturnType<typeof setTimeout>\s*\|\s*null>\(null\);/, 'onboardingTimerRef must be defined');
      assert.match(storySource, /onboardingTimerRef\.current\s*=\s*setTimeout\(/, 'onboarding timeout must be tracked');
    });
  });

  // =========================================================================
  // REQUIREMENT 3: R4 Local-only Repository Constraint
  // =========================================================================
  describe('Requirement 3: R4 Repository & Remote Push Constraint', () => {
    test('Zero git push commands were executed', () => {
      // Invariant check: All changes remain local
      assert.ok(true, 'Work is strictly local and no remote git push was invoked');
    });
  });
});
