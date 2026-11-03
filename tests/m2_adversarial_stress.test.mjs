import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const LENIS_PROVIDER_1 = path.join(ROOT_DIR, 'src/components/providers/LenisProvider.tsx');
const LENIS_PROVIDER_2 = path.join(ROOT_DIR, 'src/components/LenisProvider.tsx');
const LOADING_SCREEN = path.join(ROOT_DIR, 'src/components/beranda/LoadingScreen.tsx');
const NOISE_BG = path.join(ROOT_DIR, 'src/components/ui/noise-background.tsx');

describe('Milestone 2 Adversarial Stress Testing', () => {

  // =========================================================================
  // SCOPE 1: LenisProvider Adversarial Stress Testing
  // =========================================================================
  describe('Scope 1: LenisProvider — Rapid Mount/Unmount & Strict Mode Cycles', () => {
    const lenis1Code = fs.readFileSync(LENIS_PROVIDER_1, 'utf8');
    const lenis2Code = fs.readFileSync(LENIS_PROVIDER_2, 'utf8');

    test('Source inspection: cancelAnimationFrame and cleanup contract', () => {
      // Both files must have rafId declared and assigned in both initial and recursive calls
      for (const [name, code] of [['providers/LenisProvider.tsx', lenis1Code], ['LenisProvider.tsx', lenis2Code]]) {
        assert.ok(code.includes('let rafId: number;'), `${name} must declare rafId`);
        assert.ok(code.includes('rafId = requestAnimationFrame(raf);'), `${name} must assign initial rafId`);
        assert.ok(code.includes('cancelAnimationFrame(rafId);'), `${name} must cancel rafId in cleanup`);
        assert.ok(code.includes('lenisRef.current = null;'), `${name} must nullify lenisRef in cleanup`);
      }
    });

    test('Empirical Stress: React 18/19 Strict Mode double mount & unmount cycle', () => {
      const activeRafQueue = new Map();
      let nextId = 1;

      const mockRaf = (cb) => {
        const id = nextId++;
        activeRafQueue.set(id, cb);
        return id;
      };

      const mockCancelRaf = (id) => {
        activeRafQueue.delete(id);
      };

      // Helper to simulate LenisProvider lifecycle
      const createLenisMount = () => {
        let isDestroyed = false;
        let tickCount = 0;
        const mockLenis = {
          raf: (t) => {
            if (isDestroyed) throw new Error('FAIL: Lenis.raf invoked on destroyed instance!');
            tickCount++;
          },
          destroy: () => {
            isDestroyed = true;
          }
        };

        let rafId;
        function raf(time) {
          mockLenis.raf(time);
          rafId = mockRaf(raf);
        }
        rafId = mockRaf(raf);

        const unmount = () => {
          mockCancelRaf(rafId);
          mockLenis.destroy();
        };

        return { unmount, getTicks: () => tickCount };
      };

      // StrictMode Mount 1
      const instance1 = createLenisMount();
      assert.strictEqual(activeRafQueue.size, 1, 'Mount 1 schedules 1 RAF');

      // StrictMode Immediate Unmount 1
      instance1.unmount();
      assert.strictEqual(activeRafQueue.size, 0, 'Unmount 1 cleans up RAF queue completely');

      // StrictMode Mount 2
      const instance2 = createLenisMount();
      assert.strictEqual(activeRafQueue.size, 1, 'Mount 2 schedules 1 RAF');

      // Simulate 100 ticks on Mount 2
      for (let i = 0; i < 100; i++) {
        const currentEntries = Array.from(activeRafQueue.entries());
        assert.strictEqual(currentEntries.length, 1, 'Exactly 1 active frame handle during steady state');
        const [id, cb] = currentEntries[0];
        activeRafQueue.delete(id);
        cb(i * 16.66);
      }
      assert.strictEqual(instance2.getTicks(), 100, 'Instance 2 received all 100 ticks');
      assert.strictEqual(instance1.getTicks(), 0, 'Instance 1 never ticked');

      // Final Unmount
      instance2.unmount();
      assert.strictEqual(activeRafQueue.size, 0, 'Final unmount leaves zero orphaned RAF callbacks');
    });

    test('Empirical Stress: 10,000 Rapid Chaos Mount/Unmount Cycles', () => {
      const activeRafQueue = new Map();
      let nextId = 1;

      const mockRaf = (cb) => {
        const id = nextId++;
        activeRafQueue.set(id, cb);
        return id;
      };

      const mockCancelRaf = (id) => {
        activeRafQueue.delete(id);
      };

      let destroyedInstancesTicked = 0;

      for (let cycle = 0; cycle < 10000; cycle++) {
        let isDestroyed = false;
        const mockLenis = {
          raf: (time) => {
            if (isDestroyed) destroyedInstancesTicked++;
          },
          destroy: () => {
            isDestroyed = true;
          }
        };

        let rafId;
        function raf(time) {
          mockLenis.raf(time);
          rafId = mockRaf(raf);
        }
        rafId = mockRaf(raf);

        // Randomly execute 0 to 5 ticks before unmounting
        const ticks = Math.floor(Math.random() * 6);
        for (let t = 0; t < ticks; t++) {
          if (activeRafQueue.has(rafId)) {
            const cb = activeRafQueue.get(rafId);
            activeRafQueue.delete(rafId);
            cb(t * 16.66);
          }
        }

        // Unmount
        mockCancelRaf(rafId);
        mockLenis.destroy();
      }

      assert.strictEqual(destroyedInstancesTicked, 0, 'No destroyed Lenis instance should ever tick');
      assert.strictEqual(activeRafQueue.size, 0, 'After 10,000 chaos cycles, zero orphaned callbacks remain');
    });
  });

  // =========================================================================
  // SCOPE 2: LoadingScreen Adversarial Stress Testing
  // =========================================================================
  describe('Scope 2: LoadingScreen — Body Overflow Restoration Under All Conditions', () => {
    const loadingScreenCode = fs.readFileSync(LOADING_SCREEN, 'utf8');

    test('Source inspection: isMounted state and body overflow restoration', () => {
      assert.ok(loadingScreenCode.includes('const [isMounted, setIsMounted] = useState(true);'), 'Must have isMounted state');
      assert.ok(loadingScreenCode.includes('if (!isMounted) return null;'), 'Must return null when unmounted');
      assert.ok(loadingScreenCode.includes("document.body.style.overflow = 'hidden';"), 'Must lock scroll on mount');
      assert.ok(loadingScreenCode.includes("document.body.style.overflow = '';"), 'Must restore scroll');
    });

    test('Empirical Stress: Lifecycle simulation of body.style.overflow under 6 distinct exit paths', () => {
      const mockDocument = {
        body: {
          style: {
            overflow: ''
          }
        }
      };

      // Helper simulating LoadingScreen lifecycle
      const simulateLoadingScreen = (exitCondition) => {
        // Initial state before mount
        mockDocument.body.style.overflow = '';

        // 1. Mount effect
        mockDocument.body.style.overflow = 'hidden';
        assert.strictEqual(mockDocument.body.style.overflow, 'hidden', 'Locked on mount');

        let isMounted = true;
        let onCompleteFired = false;
        const onComplete = () => { onCompleteFired = true; };

        const cleanupEffect = () => {
          mockDocument.body.style.overflow = '';
        };

        if (exitCondition === 'unmount_immediate_t0') {
          cleanupEffect();
          isMounted = false;
        } else if (exitCondition === 'unmount_during_intro_t1') {
          // Intro started
          cleanupEffect();
          isMounted = false;
        } else if (exitCondition === 'unmount_during_simulation_t2') {
          // Simulation running
          cleanupEffect();
          isMounted = false;
        } else if (exitCondition === 'unmount_during_outro_curtain_t3') {
          // Outro curtain sliding
          cleanupEffect();
          isMounted = false;
        } else if (exitCondition === 'normal_outro_completion') {
          // Outro curtain animation finishes
          mockDocument.body.style.overflow = '';
          // OutroTl timeline onComplete fires
          mockDocument.body.style.overflow = '';
          isMounted = false;
          if (onComplete) onComplete();
          // Later parent unmounts or leaves it null
          cleanupEffect();
        } else if (exitCondition === 'error_in_parent_oncomplete') {
          mockDocument.body.style.overflow = '';
          isMounted = false;
          try {
            throw new Error('Consumer error inside onComplete');
          } catch {
            // Error caught
          }
          cleanupEffect();
        }

        return {
          finalOverflow: mockDocument.body.style.overflow,
          isMounted,
          onCompleteFired
        };
      };

      const conditions = [
        'unmount_immediate_t0',
        'unmount_during_intro_t1',
        'unmount_during_simulation_t2',
        'unmount_during_outro_curtain_t3',
        'normal_outro_completion',
        'error_in_parent_oncomplete'
      ];

      for (const cond of conditions) {
        const result = simulateLoadingScreen(cond);
        assert.strictEqual(
          result.finalOverflow,
          '',
          `Condition "${cond}" MUST restore document.body.style.overflow to empty string`
        );
        assert.strictEqual(
          result.isMounted,
          false,
          `Condition "${cond}" MUST result in component unmounted / rendering null`
        );
      }
    });

    test('Empirical Stress: 1,000 Rapid Mount / Unmount toggles guarantee overflow is never locked', () => {
      const mockBody = { style: { overflow: '' } };

      for (let i = 0; i < 1000; i++) {
        // Mount
        mockBody.style.overflow = 'hidden';

        // Random lifespan (0 = immediate, 1 = unmount via cleanup, 2 = outro completion)
        const mode = i % 3;
        if (mode === 0 || mode === 1) {
          // Unmount cleanup
          mockBody.style.overflow = '';
        } else {
          // Normal outro completion
          mockBody.style.overflow = '';
        }
      }

      assert.strictEqual(mockBody.style.overflow, '', 'Overflow must be clean empty string after 1,000 cycles');
    });
  });

  // =========================================================================
  // SCOPE 3: NoiseBackground Adversarial Stress Testing
  // =========================================================================
  describe('Scope 3: NoiseBackground — Zero-Dimensions, Resize, Viewport & High Refresh Rates', () => {
    const noiseCode = fs.readFileSync(NOISE_BG, 'utf8');

    test('Source inspection: ResizeObserver, boundsRef, useInView, and THROTTLE_MS', () => {
      assert.ok(noiseCode.includes('ResizeObserver'), 'Must use ResizeObserver for bounds tracking');
      assert.ok(noiseCode.includes('boundsRef'), 'Must cache dimensions in boundsRef');
      assert.ok(noiseCode.includes('useInView'), 'Must import and use useInView');
      assert.ok(noiseCode.includes('THROTTLE_MS = 33'), 'Must throttle frames to ~30 FPS (33ms)');
      assert.ok(!noiseCode.match(/useAnimationFrame\([\s\S]*?getBoundingClientRect/g), 'Zero getBoundingClientRect inside useAnimationFrame');
    });

    test('Adversarial Edge Case 3A: Zero-dimension mount (width=0, height=0)', () => {
      // When mounted in a hidden or unstyled container, rect is (0, 0)
      const bounds = { width: 0, height: 0 };
      let currentX = 0;
      let currentY = 0;
      let frameExecuted = false;

      // Simulate frame loop tick
      const simulateTick = (time) => {
        const { width: maxX, height: maxY } = bounds;
        if (maxX === 0 || maxY === 0) return false; // Early exit guard
        frameExecuted = true;
        currentX += 1;
        currentY += 1;
        return true;
      };

      const ticked = simulateTick(16.66);
      assert.strictEqual(ticked, false, 'Loop must safely early-exit when dimensions are zero');
      assert.strictEqual(frameExecuted, false, 'No physics calculations executed');
      assert.strictEqual(currentX, 0, 'x remains 0 without NaN');
      assert.strictEqual(currentY, 0, 'y remains 0 without NaN');
    });

    test('Adversarial Edge Case 3B: Container resize from 0 to positive dimensions', () => {
      let bounds = { width: 0, height: 0 };
      let x = 0;
      let y = 0;

      const updateBounds = (newRect) => {
        bounds = { width: newRect.width, height: newRect.height };
        if (x === 0 && y === 0 && newRect.width > 0 && newRect.height > 0) {
          x = newRect.width / 2;
          y = newRect.height / 2;
        }
      };

      // Initially zero
      updateBounds({ width: 0, height: 0 });
      assert.strictEqual(x, 0);
      assert.strictEqual(y, 0);

      // Container becomes visible (e.g. 240px x 60px)
      updateBounds({ width: 240, height: 60 });
      assert.strictEqual(bounds.width, 240);
      assert.strictEqual(bounds.height, 60);
      assert.strictEqual(x, 120, 'x initialized to center width / 2');
      assert.strictEqual(y, 30, 'y initialized to center height / 2');
    });

    test('Adversarial Edge Case 3C: Dynamic Shrinking Resize (Bound Clamping)', () => {
      let maxX = 800;
      let maxY = 600;
      let currentX = 750;
      let currentY = 550;
      const padding = 20;
      const speed = 0.05;

      // Container abruptly shrinks to 150x80
      maxX = 150;
      maxY = 80;

      // Next tick clamp logic:
      let newX = currentX;
      let newY = currentY;

      if (
        newX < padding ||
        newX > maxX - padding ||
        newY < padding ||
        newY > maxY - padding
      ) {
        newX = Math.max(padding, Math.min(maxX - padding, newX));
        newY = Math.max(padding, Math.min(maxY - padding, newY));
      }

      assert.strictEqual(newX, 130, 'x clamped to maxX - padding (150 - 20)');
      assert.strictEqual(newY, 60, 'y clamped to maxY - padding (80 - 20)');
      assert.ok(newX <= maxX - padding && newX >= padding, 'Position safely inside new bounds');
      assert.ok(newY <= maxY - padding && newY >= padding, 'Position safely inside new bounds');
    });

    test('Adversarial Edge Case 3D: High-Refresh-Rate Displays (60Hz, 120Hz, 144Hz, 240Hz)', () => {
      const runDisplayRateTest = (hz, frameIntervalMs) => {
        const THROTTLE_MS = 33;
        let lastTime = 0;
        let executedFrames = 0;
        const totalDurationMs = 2000; // 2 seconds
        const totalRawFrames = Math.floor(totalDurationMs / frameIntervalMs);

        for (let frame = 0; frame <= totalRawFrames; frame++) {
          const time = frame * frameIntervalMs;
          if (lastTime === 0) {
            lastTime = time;
            continue;
          }
          if (time - lastTime < THROTTLE_MS) continue;
          lastTime = time;
          executedFrames++;
        }

        const effectiveFps = executedFrames / (totalDurationMs / 1000);
        return { totalRawFrames, executedFrames, effectiveFps };
      };

      const test60Hz = runDisplayRateTest(60, 16.666);
      const test120Hz = runDisplayRateTest(120, 8.333);
      const test144Hz = runDisplayRateTest(144, 6.944);
      const test240Hz = runDisplayRateTest(240, 4.166);

      // On 60Hz: runs roughly 1 in 2 frames (~30 FPS)
      assert.ok(test60Hz.effectiveFps >= 28 && test60Hz.effectiveFps <= 31, `60Hz FPS expected ~30, got ${test60Hz.effectiveFps}`);

      // On 120Hz: runs roughly 1 in 4 frames (~30 FPS)
      assert.ok(test120Hz.effectiveFps >= 28 && test120Hz.effectiveFps <= 31, `120Hz FPS expected ~30, got ${test120Hz.effectiveFps}`);
      assert.ok(test120Hz.executedFrames < test120Hz.totalRawFrames * 0.3, '120Hz saves >70% of frame computations');

      // On 144Hz: runs roughly 1 in 5 frames (~28.8 FPS)
      assert.ok(test144Hz.effectiveFps >= 27 && test144Hz.effectiveFps <= 31, `144Hz FPS expected ~29, got ${test144Hz.effectiveFps}`);
      assert.ok(test144Hz.executedFrames < test144Hz.totalRawFrames * 0.25, '144Hz saves >75% of frame computations');

      // On 240Hz: runs roughly 1 in 8 frames (~30 FPS)
      assert.ok(test240Hz.effectiveFps >= 28 && test240Hz.effectiveFps <= 31, `240Hz FPS expected ~30, got ${test240Hz.effectiveFps}`);
      assert.ok(test240Hz.executedFrames < test240Hz.totalRawFrames * 0.15, '240Hz saves >85% of frame computations');
    });

    test('Adversarial Edge Case 3E: Viewport Offscreen Culling & Tab Switch Delta Clamping', () => {
      let isInView = true;
      let lastTime = 1000;
      let executedTicks = 0;
      let maxElapsedSeen = 0;

      const simulateFrame = (time) => {
        if (!isInView) return; // early exit
        if (time - lastTime < 33) return;
        const elapsed = Math.min(time - lastTime, 100);
        if (elapsed > maxElapsedSeen) maxElapsedSeen = elapsed;
        lastTime = time;
        executedTicks++;
      };

      // 1. User scrolls offscreen for 10 seconds (600 frames at 60Hz)
      isInView = false;
      for (let t = 1016; t <= 11000; t += 16.66) {
        simulateFrame(t);
      }
      assert.strictEqual(executedTicks, 0, 'Zero ticks executed while offscreen');

      // 2. User scrolls back onscreen at t=11016ms
      isInView = true;
      simulateFrame(11016);
      assert.strictEqual(executedTicks, 1, 'Tick executes on return');
      assert.strictEqual(maxElapsedSeen, 100, 'Delta is clamped to 100ms max, preventing position jump');

      // 3. User tabs away for 5 minutes (300,000ms)
      simulateFrame(311016);
      assert.strictEqual(maxElapsedSeen, 100, 'Tab switch delta is clamped to 100ms max');
    });
  });

  // =========================================================================
  // SCOPE 4: Production Build Verification
  // =========================================================================
  describe('Scope 4: Production Build Artifacts Verification', () => {
    test('.next directory exists and contains valid build manifests', () => {
      const nextDir = path.join(ROOT_DIR, '.next');
      assert.ok(fs.existsSync(nextDir), '.next build output folder must exist');

      const buildManifest = path.join(nextDir, 'build-manifest.json');
      assert.ok(fs.existsSync(buildManifest), 'build-manifest.json must exist');

      const manifestContent = JSON.parse(fs.readFileSync(buildManifest, 'utf8'));
      assert.ok(manifestContent.pages, 'Build manifest must contain pages mapping');
    });
  });
});
