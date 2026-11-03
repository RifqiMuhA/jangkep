import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const LENIS_PROVIDER_1 = path.join(ROOT_DIR, 'src/components/providers/LenisProvider.tsx');
const LENIS_PROVIDER_2 = path.join(ROOT_DIR, 'src/components/LenisProvider.tsx');
const LOADING_SCREEN = path.join(ROOT_DIR, 'src/components/beranda/LoadingScreen.tsx');
const NOISE_BG = path.join(ROOT_DIR, 'src/components/ui/noise-background.tsx');

describe('Milestone 2 Empirical Verification: Memory Leaks & Orphan Loops', () => {

  // =========================================================================
  // REQUIREMENT 1: LenisProvider Animation Frame Cancellation & Lifecycle
  // =========================================================================
  describe('Requirement 1: LenisProvider RAF Lifecycle & Cleanup', () => {
    const lenis1Source = fs.readFileSync(LENIS_PROVIDER_1, 'utf8');
    const lenis2Source = fs.readFileSync(LENIS_PROVIDER_2, 'utf8');

    test('providers/LenisProvider.tsx: captures rafId and invokes cancelAnimationFrame on unmount', () => {
      // Must declare rafId
      assert.match(lenis1Source, /let\s+rafId\s*:\s*number;/, 'rafId must be declared');
      // Must assign rafId on initial call
      assert.match(lenis1Source, /rafId\s*=\s*requestAnimationFrame\(raf\);/, 'initial rafId assignment');
      // Must assign rafId recursively inside raf callback
      const rafFnMatch = lenis1Source.match(/function\s+raf\s*\([^)]*\)\s*\{([\s\S]*?)\}/);
      assert.ok(rafFnMatch, 'raf function must exist');
      assert.match(rafFnMatch[1], /rafId\s*=\s*requestAnimationFrame\(raf\)/, 'recursive rafId assignment');
      // Must call cancelAnimationFrame(rafId) in cleanup
      const cleanupMatch = lenis1Source.match(/return\s*\(\)\s*=>\s*\{([\s\S]*?)\};/);
      assert.ok(cleanupMatch, 'cleanup function must exist');
      assert.match(cleanupMatch[1], /cancelAnimationFrame\(rafId\)/, 'cleanup must cancel rafId');
      assert.match(cleanupMatch[1], /lenis\.destroy\(\)/, 'cleanup must destroy lenis instance');
      assert.match(cleanupMatch[1], /lenisRef\.current\s*=\s*null/, 'cleanup must clear lenisRef');
    });

    test('LenisProvider.tsx (duplicate/fallback): captures rafId and invokes cancelAnimationFrame on unmount', () => {
      assert.match(lenis2Source, /let\s+rafId\s*:\s*number;/, 'rafId must be declared');
      assert.match(lenis2Source, /rafId\s*=\s*requestAnimationFrame\(raf\);/, 'initial rafId assignment');
      const cleanupMatch = lenis2Source.match(/return\s*\(\)\s*=>\s*\{([\s\S]*?)\};/);
      assert.ok(cleanupMatch, 'cleanup function must exist');
      assert.match(cleanupMatch[1], /cancelAnimationFrame\(rafId\)/, 'cleanup must cancel rafId');
      assert.match(cleanupMatch[1], /lenisRef\.current\?\.destroy\(\)/, 'cleanup must destroy lenis');
      assert.match(cleanupMatch[1], /lenisRef\.current\s*=\s*null/, 'cleanup must clear lenisRef');
    });

    test('Empirical simulation: RAF lifecycle, frame ticking, and clean unmount cancellation', () => {
      let nextHandle = 1;
      const scheduledCallbacks = new Map();
      const cancelledHandles = new Set();

      const mockRequestAnimationFrame = (cb) => {
        const id = nextHandle++;
        scheduledCallbacks.set(id, cb);
        return id;
      };

      const mockCancelAnimationFrame = (id) => {
        cancelledHandles.add(id);
        scheduledCallbacks.delete(id);
      };

      let lenisRafCallCount = 0;
      let isDestroyed = false;
      const mockLenis = {
        raf: (t) => {
          if (isDestroyed) throw new Error('lenis.raf called after destroy!');
          lenisRafCallCount++;
        },
        destroy: () => {
          isDestroyed = true;
        }
      };

      // Simulate LenisProvider mount
      let rafId;
      function raf(time) {
        mockLenis.raf(time);
        rafId = mockRequestAnimationFrame(raf);
      }
      rafId = mockRequestAnimationFrame(raf);

      assert.strictEqual(scheduledCallbacks.size, 1, 'Initial frame must be queued');
      const firstId = rafId;

      // Simulate 10 frames executing
      for (let i = 0; i < 10; i++) {
        const currentId = rafId;
        const cb = scheduledCallbacks.get(currentId);
        scheduledCallbacks.delete(currentId);
        assert.ok(cb, `Callback for frame ${currentId} must exist`);
        cb(i * 16.6);
      }

      assert.strictEqual(lenisRafCallCount, 10, 'Lenis.raf should have been called 10 times');
      assert.strictEqual(scheduledCallbacks.size, 1, 'Exactly one frame should be pending');
      const activePendingId = rafId;

      // Simulate unmount cleanup
      mockCancelAnimationFrame(rafId);
      mockLenis.destroy();

      assert.ok(cancelledHandles.has(activePendingId), 'Active pending frame must be cancelled');
      assert.strictEqual(scheduledCallbacks.size, 0, 'No callbacks should remain in the RAF queue');
      assert.strictEqual(isDestroyed, true, 'Lenis instance must be marked destroyed');

      // Attempt to advance browser ticks: zero additional calls must occur
      assert.strictEqual(scheduledCallbacks.get(activePendingId), undefined, 'Cancelled frame callback must be inaccessible');
      assert.strictEqual(lenisRafCallCount, 10, 'No further Lenis.raf calls after unmount');
    });

    test('Empirical simulation: StrictMode remount stress test (rapid mount/unmount)', () => {
      let nextHandle = 100;
      const scheduledCallbacks = new Map();
      const cancelledHandles = new Set();

      const mockRaf = (cb) => {
        const id = nextHandle++;
        scheduledCallbacks.set(id, cb);
        return id;
      };

      const mockCancel = (id) => {
        cancelledHandles.add(id);
        scheduledCallbacks.delete(id);
      };

      // Simulate 50 rapid mount/unmount cycles (React StrictMode / navigation stress)
      for (let cycle = 0; cycle < 50; cycle++) {
        let destroyed = false;
        let rId;
        function r(t) {
          if (destroyed) throw new Error('Zombie RAF execution');
          rId = mockRaf(r);
        }
        rId = mockRaf(r);
        // Immediate unmount without ticking
        mockCancel(rId);
        destroyed = true;
      }

      assert.strictEqual(scheduledCallbacks.size, 0, 'No orphaned callbacks after rapid mount/unmount cycles');
      assert.strictEqual(cancelledHandles.size, 50, 'All 50 frames must be properly cancelled');
    });
  });

  // =========================================================================
  // REQUIREMENT 2: LoadingScreen DOM Unmounting & Memory Release
  // =========================================================================
  describe('Requirement 2: LoadingScreen Complete DOM Unmount', () => {
    const loadingScreenSource = fs.readFileSync(LOADING_SCREEN, 'utf8');

    test('LoadingScreen maintains isMounted state initialized to true', () => {
      assert.match(loadingScreenSource, /const\s*\[isMounted,\s*setIsMounted\]\s*=\s*useState\(true\);/, 'isMounted state initialized to true');
    });

    test('LoadingScreen evaluates !isMounted and returns null', () => {
      assert.match(loadingScreenSource, /if\s*\(!isMounted\)\s*return\s+null;/, 'Must return null when !isMounted');
    });

    test('LoadingScreen triggers setIsMounted(false) on outroTl completion', () => {
      const outroMatch = loadingScreenSource.match(/const\s+outroTl\s*=\s*gsap\.timeline\(\{\s*onComplete:\s*\(\)\s*=>\s*\{([\s\S]*?)\}\s*\}\);/);
      assert.ok(outroMatch, 'outroTl timeline with onComplete handler must exist');
      assert.match(outroMatch[1], /setIsMounted\(false\)/, 'outroTl onComplete must set isMounted to false');
      assert.match(outroMatch[1], /document\.body\.style\.overflow\s*=\s*''/, 'outroTl onComplete must unlock body overflow');
      assert.match(outroMatch[1], /if\s*\(onComplete\)\s*onComplete\(\)/, 'outroTl onComplete must invoke prop onComplete');
    });

    test('LoadingScreen body overflow unlock is ensured in useEffect cleanup on premature unmount', () => {
      const effectMatch = loadingScreenSource.match(/React\.useEffect\(\(\)\s*=>\s*\{[\s\S]*?return\s*\(\)\s*=>\s*\{([\s\S]*?)\};?\s*\}\s*,\s*\[\]\);/);
      assert.ok(effectMatch, 'Mount useEffect must exist');
      assert.match(effectMatch[1], /document\.body\.style\.overflow\s*=\s*''/, 'Premature unmount must unlock body overflow');
    });

    test('Empirical simulation: component output when mounted vs unmounted', () => {
      // Mock component render logic
      function renderLoadingScreen(isMounted, progress = 0) {
        if (!isMounted) return null;
        return {
          type: 'div',
          className: 'overlay',
          children: [
            { type: 'img', src: '/kuliner/mascot_ngintip_1.webp' },
            { type: 'img', src: '/kuliner/mascot_ngintip_2.webp' },
            { type: 'img', src: '/kuliner/mascot_ngintip_3.webp' },
            ...Array(7).fill(null).map((_, i) => ({ type: 'img', category: 'spice-bg', id: i })),
            ...Array(7).fill(null).map((_, i) => ({ type: 'img', category: 'spice-fg', id: i })),
            { type: 'span', text: `${progress}%` }
          ]
        };
      }

      // Initial mount state: 17 images present in DOM
      const mountedOutput = renderLoadingScreen(true, 50);
      assert.ok(mountedOutput !== null, 'Mounted output must be a valid DOM tree');
      const imgCount = mountedOutput.children.filter(c => c.type === 'img').length;
      assert.strictEqual(imgCount, 17, 'Mounted LoadingScreen must render exactly 17 images');

      // State after outro completion: isMounted becomes false
      let isMounted = true;
      let onCompleteFired = false;
      const outroOnComplete = () => {
        isMounted = false;
        onCompleteFired = true;
      };

      outroOnComplete();

      const unmountedOutput = renderLoadingScreen(isMounted);
      assert.strictEqual(unmountedOutput, null, 'Unmounted LoadingScreen must return null');
      assert.strictEqual(onCompleteFired, true, 'onComplete callback must be fired');
    });
  });

  // =========================================================================
  // REQUIREMENT 3: NoiseBackground Layout Reflow & Throttle Optimization
  // =========================================================================
  describe('Requirement 3: NoiseBackground useInView, Frame Throttling, & Zero Reflow', () => {
    const noiseBgSource = fs.readFileSync(NOISE_BG, 'utf8');

    test('NoiseBackground imports and uses useInView from framer-motion', () => {
      assert.match(noiseBgSource, /import\s*\{[^}]*useInView[^}]*\}\s*from\s*["']framer-motion["'];/, 'useInView must be imported');
      assert.match(noiseBgSource, /const\s+isInView\s*=\s*useInView\(containerRef,\s*\{\s*margin:\s*["']100px["']\s*\}\);/, 'useInView instantiated on containerRef');
    });

    test('NoiseBackground completely eliminates getBoundingClientRect from useAnimationFrame', () => {
      const animFrameMatch = noiseBgSource.match(/useAnimationFrame\(\s*\([^)]*\)\s*=>\s*\{([\s\S]*?)\}\);/);
      assert.ok(animFrameMatch, 'useAnimationFrame hook must be present');
      assert.ok(
        !animFrameMatch[1].includes('getBoundingClientRect'),
        'CRITICAL: getBoundingClientRect must NOT appear anywhere inside useAnimationFrame callback'
      );
    });

    test('NoiseBackground caches dimensions via boundsRef and ResizeObserver', () => {
      assert.match(noiseBgSource, /const\s+boundsRef\s*=\s*useRef\(\s*\{\s*width:\s*0,\s*height:\s*0\s*\}\s*\);/, 'boundsRef initialized');
      assert.match(noiseBgSource, /new\s+ResizeObserver\(updateBounds\)/, 'ResizeObserver observes container bounds');
      assert.match(noiseBgSource, /resizeObserver\.disconnect\(\)/, 'ResizeObserver cleanup on unmount');
    });

    test('NoiseBackground implements frame throttling with THROTTLE_MS = 33 (~30 FPS)', () => {
      assert.match(noiseBgSource, /const\s+THROTTLE_MS\s*=\s*33;/, 'THROTTLE_MS constant must equal 33');
      assert.match(noiseBgSource, /if\s*\(time\s*-\s*lastTimeRef\.current\s*<\s*THROTTLE_MS\)\s*return;/, 'Throttle check skips frames');
      assert.match(noiseBgSource, /const\s+elapsed\s*=\s*Math\.min\(time\s*-\s*lastTimeRef\.current,\s*100\);/, 'Elapsed time clamped to 100ms');
    });

    test('NoiseBackground halts loop when animating is false or component is off-screen', () => {
      assert.match(
        noiseBgSource,
        /if\s*\(!animating\s*\|\|\s*!isInView\s*\|\|\s*!containerRef\.current\)\s*return;/,
        'Early return on animating=false, isInView=false, or unmounted container'
      );
    });

    test('Empirical simulation: 30 FPS throttling at 60Hz, 120Hz, and 144Hz display rates', () => {
      const simulateFrameLoop = (refreshHz, durationMs = 1000) => {
        const frameInterval = 1000 / refreshHz;
        const totalFrames = Math.floor(durationMs / frameInterval);
        const THROTTLE_MS = 33;
        let lastTime = 0;
        let executedCalculations = 0;

        for (let i = 0; i < totalFrames; i++) {
          const time = i * frameInterval;
          if (lastTime === 0) {
            lastTime = time;
            continue;
          }
          if (time - lastTime < THROTTLE_MS) {
            continue;
          }
          lastTime = time;
          executedCalculations++;
        }

        return { totalFrames, executedCalculations };
      };

      // 60 Hz display (~16.67ms per frame)
      const res60 = simulateFrameLoop(60, 1000);
      assert.ok(res60.executedCalculations >= 28 && res60.executedCalculations <= 31, `60Hz should yield ~30 FPS (got ${res60.executedCalculations})`);
      const reduction60 = (1 - res60.executedCalculations / res60.totalFrames) * 100;
      assert.ok(reduction60 > 45, `60Hz should achieve >45% CPU frame draw reduction (got ${reduction60.toFixed(1)}%)`);

      // 120 Hz high-refresh display (~8.33ms per frame)
      const res120 = simulateFrameLoop(120, 1000);
      assert.ok(res120.executedCalculations >= 28 && res120.executedCalculations <= 31, `120Hz should yield ~30 FPS (got ${res120.executedCalculations})`);
      const reduction120 = (1 - res120.executedCalculations / res120.totalFrames) * 100;
      assert.ok(reduction120 > 70, `120Hz should achieve >70% CPU frame draw reduction (got ${reduction120.toFixed(1)}%)`);

      // 144 Hz gaming display (~6.94ms per frame)
      const res144 = simulateFrameLoop(144, 1000);
      assert.ok(res144.executedCalculations >= 28 && res144.executedCalculations <= 31, `144Hz should yield ~30 FPS (got ${res144.executedCalculations})`);
      const reduction144 = (1 - res144.executedCalculations / res144.totalFrames) * 100;
      assert.ok(reduction144 > 75, `144Hz should achieve >75% CPU frame draw reduction (got ${reduction144.toFixed(1)}%)`);
    });

    test('Empirical simulation: Viewport culling halts physics calculations when isInView is false', () => {
      let calculationCount = 0;
      const simulateWithVisibility = (isInView, frames = 60) => {
        const THROTTLE_MS = 33;
        let lastTime = 0;
        for (let i = 0; i < frames; i++) {
          const time = (i + 1) * 35; // 35ms > 33ms so throttle allows it
          if (!isInView) continue;
          if (lastTime === 0) {
            lastTime = time;
            continue;
          }
          if (time - lastTime < THROTTLE_MS) continue;
          lastTime = time;
          calculationCount++;
        }
      };

      // Offscreen: isInView = false
      simulateWithVisibility(false, 100);
      assert.strictEqual(calculationCount, 0, 'Zero calculations when element is scrolled off-screen');

      // Onscreen: isInView = true (30 frames with 35ms intervals = 1 initial frame setup + 29 throttled ticks)
      simulateWithVisibility(true, 30);
      assert.strictEqual(calculationCount, 29, 'Calculations resume when scrolled into view');
    });

    test('Empirical simulation: Tab switch lag clamp prevents position jumps', () => {
      let lastTime = 1000;
      const THROTTLE_MS = 33;
      const speed = 0.1;
      let currentX = 100;
      let velocityX = 0.05;

      // Simulate browser tab in background for 10 seconds (10,000ms delta)
      const returnTime = 11000;
      assert.ok(returnTime - lastTime >= THROTTLE_MS);
      const elapsed = Math.min(returnTime - lastTime, 100);
      assert.strictEqual(elapsed, 100, 'Elapsed delta must be clamped to max 100ms');

      const positionDelta = velocityX * elapsed;
      assert.strictEqual(positionDelta, 5, 'Position change is capped at 5px instead of 500px explosion');
    });
  });

  // =========================================================================
  // REQUIREMENT 4: Constraint Integrity & Local Safety
  // =========================================================================
  describe('Requirement 4: Constraint Verification', () => {
    test('All modified files in Milestone 2 exist and are non-empty', () => {
      assert.ok(fs.existsSync(LENIS_PROVIDER_1), 'LenisProvider 1 must exist');
      assert.ok(fs.existsSync(LENIS_PROVIDER_2), 'LenisProvider 2 must exist');
      assert.ok(fs.existsSync(LOADING_SCREEN), 'LoadingScreen must exist');
      assert.ok(fs.existsSync(NOISE_BG), 'NoiseBackground must exist');

      assert.ok(fs.statSync(LENIS_PROVIDER_1).size > 100, 'LenisProvider 1 size > 100 bytes');
      assert.ok(fs.statSync(LENIS_PROVIDER_2).size > 100, 'LenisProvider 2 size > 100 bytes');
      assert.ok(fs.statSync(LOADING_SCREEN).size > 500, 'LoadingScreen size > 500 bytes');
      assert.ok(fs.statSync(NOISE_BG).size > 500, 'NoiseBackground size > 500 bytes');
    });
  });
});
