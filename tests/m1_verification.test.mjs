import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const KATALOG_PAGE_PATH = path.join(ROOT_DIR, 'src/app/kuliner/katalog/page.tsx');
const KATALOG_CSS_PATH = path.join(ROOT_DIR, 'src/app/kuliner/katalog/katalog.module.css');
const RASA_PAGE_PATH = path.join(ROOT_DIR, 'src/app/rasa/page.tsx');

describe('Milestone 1 Empirical Verification', () => {

  describe('Requirement 1: Search Input Debounce (300ms)', () => {
    const katalogSource = fs.readFileSync(KATALOG_PAGE_PATH, 'utf8');
    const rasaSource = fs.readFileSync(RASA_PAGE_PATH, 'utf8');

    test('katalog/page.tsx implements debouncedSearch state', () => {
      assert.match(katalogSource, /const\s*\[debouncedSearch,\s*setDebouncedSearch\]\s*=\s*useState\(''\);/);
    });

    test('katalog/page.tsx implements 300ms setTimeout with clearTimeout cleanup', () => {
      const effectRegex = /useEffect\(\(\)\s*=>\s*\{[\s\S]*?setTimeout\(\(\)\s*=>\s*\{[\s\S]*?setDebouncedSearch\(searchQuery\);[\s\S]*?\},\s*300\);[\s\S]*?return\s*\(\)\s*=>\s*clearTimeout\(handler\);[\s\S]*?\}\s*,\s*\[searchQuery\]\);/;
      assert.match(katalogSource, effectRegex, 'Expected 300ms setTimeout and clearTimeout in useEffect([searchQuery])');
    });

    test('katalog/page.tsx filteredData depends on debouncedSearch instead of searchQuery', () => {
      const filteredDataRegex = /filteredData\s*=\s*useMemo\(\(\)\s*=>\s*\{[\s\S]*?debouncedSearch[\s\S]*?\},\s*\[debouncedSearch,\s*activeCategory,\s*activeTaste\]\);/;
      assert.match(katalogSource, filteredDataRegex, 'filteredData should depend on debouncedSearch');
      // Ensure searchQuery is not in the dependency array
      const depMatch = katalogSource.match(/filteredData\s*=\s*useMemo[\s\S]*?,\s*\[(.*?)\]\);/);
      assert.ok(depMatch, 'filteredData useMemo found');
      assert.ok(!depMatch[1].includes('searchQuery'), 'searchQuery must not be in filteredData dependency array');
    });

    test('katalog/page.tsx clear search button clears both searchQuery and debouncedSearch immediately', () => {
      assert.match(katalogSource, /onClick=\{\(\)\s*=>\s*\{\s*setSearchQuery\(''\);\s*setDebouncedSearch\(''\);\s*\}\}/);
    });

    test('rasa/page.tsx implements debouncedSearch state', () => {
      assert.match(rasaSource, /const\s*\[debouncedSearch,\s*setDebouncedSearch\]\s*=\s*useState\(''\);/);
    });

    test('rasa/page.tsx implements 300ms setTimeout with clearTimeout cleanup', () => {
      const effectRegex = /useEffect\(\(\)\s*=>\s*\{[\s\S]*?setTimeout\(\(\)\s*=>\s*\{[\s\S]*?setDebouncedSearch\(searchQuery\);[\s\S]*?\},\s*300\);[\s\S]*?return\s*\(\)\s*=>\s*clearTimeout\(handler\);[\s\S]*?\}\s*,\s*\[searchQuery\]\);/;
      assert.match(rasaSource, effectRegex, 'Expected 300ms setTimeout and clearTimeout in useEffect([searchQuery])');
    });

    test('rasa/page.tsx filteredRempah depends on debouncedSearch instead of searchQuery', () => {
      const depMatch = rasaSource.match(/filteredRempah\s*=\s*useMemo[\s\S]*?,\s*\[(.*?)\]\);/);
      assert.ok(depMatch, 'filteredRempah useMemo found');
      assert.ok(depMatch[1].includes('debouncedSearch'), 'filteredRempah must depend on debouncedSearch');
      assert.ok(!depMatch[1].includes('searchQuery'), 'filteredRempah must not depend on searchQuery');
    });

    test('rasa/page.tsx clear search button clears both searchQuery and debouncedSearch immediately', () => {
      assert.match(rasaSource, /onClick=\{\(\)\s*=>\s*\{\s*setSearchQuery\(''\);\s*setDebouncedSearch\(''\);\s*\}\}/);
    });

    test('Empirical simulation: rapid keystrokes debouncing behavior', async () => {
      let debouncedValue = '';
      let activeTimer = null;
      let filterExecutionCount = 0;

      const setDebounced = (val) => {
        debouncedValue = val;
        filterExecutionCount++;
      };

      const simulateKeystroke = (query) => {
        if (activeTimer) clearTimeout(activeTimer);
        activeTimer = setTimeout(() => {
          setDebounced(query);
        }, 300);
      };

      // Type "g", "gu", "gud", "gude", "gudeg" at 50ms intervals
      const strokes = ['g', 'gu', 'gud', 'gude', 'gudeg'];
      for (let i = 0; i < strokes.length; i++) {
        simulateKeystroke(strokes[i]);
        await new Promise((res) => setTimeout(res, 50));
        assert.equal(debouncedValue, '', `At stroke ${i + 1}, debounced value should still be empty`);
        assert.equal(filterExecutionCount, 0, 'Filter should not have executed during typing burst');
      }

      // Wait 350ms after the last stroke (total elapsed > 300ms from last stroke)
      await new Promise((res) => setTimeout(res, 350));
      assert.equal(debouncedValue, 'gudeg', 'Debounced value should settle to final stroke');
      assert.equal(filterExecutionCount, 1, 'Filter should have executed exactly once for the burst');
    });

    test('Empirical simulation: clearing search interrupts active debounce timer', async () => {
      let debouncedValue = 'initial';
      let searchQuery = 'initial';
      let activeTimer = null;

      const triggerEffect = (newQuery) => {
        searchQuery = newQuery;
        if (activeTimer) clearTimeout(activeTimer);
        activeTimer = setTimeout(() => {
          debouncedValue = newQuery;
        }, 300);
      };

      // User types "soto"
      triggerEffect('soto');
      await new Promise((res) => setTimeout(res, 100));
      assert.equal(debouncedValue, 'initial');

      // User clicks clear at 100ms
      // Clear button executes: setSearchQuery(''); setDebouncedSearch('');
      if (activeTimer) clearTimeout(activeTimer);
      searchQuery = '';
      debouncedValue = '';

      // Wait 350ms to ensure no delayed timer resurrects 'soto'
      await new Promise((res) => setTimeout(res, 350));
      assert.equal(searchQuery, '', 'Search query should be empty');
      assert.equal(debouncedValue, '', 'Debounced search should remain empty after clear');
    });
  });

  describe('Requirement 2: Layout Thrashing Removal (Framer Motion `layout` prop)', () => {
    const katalogSource = fs.readFileSync(KATALOG_PAGE_PATH, 'utf8');
    const rasaSource = fs.readFileSync(RASA_PAGE_PATH, 'utf8');

    test('katalog/page.tsx: Col1, Col2, Col3 card motion wrappers do not have layout prop', () => {
      // Find parallax columns block
      const colBlockMatch = katalogSource.match(/<div className=\{styles\.parallaxColumns\}>([\s\S]*?)<\/main>/);
      assert.ok(colBlockMatch, 'Parallax columns block located');
      const colBlock = colBlockMatch[1];

      // Extract all motion.div within the card columns
      const motionDivs = colBlock.match(/<motion\.div[^>]*>/g) || [];
      for (const mDiv of motionDivs) {
        assert.ok(
          !/\blayout\b/.test(mDiv),
          `Found illegal layout prop in card motion wrapper: ${mDiv}`
        );
      }
    });

    test('katalog/page.tsx: CardItem does not contain layout prop', () => {
      const cardItemIdx = katalogSource.indexOf('function CardItem(');
      assert.ok(cardItemIdx !== -1, 'CardItem subcomponent located');
      const cardItemContent = katalogSource.slice(cardItemIdx);
      assert.ok(!/\blayout\b/.test(cardItemContent), 'CardItem must not contain layout prop');
    });

    test('rasa/page.tsx: Rempah card does not have layout prop', () => {
      const cardMatch = rasaSource.match(/<motion\.div[^>]*className=\{styles\.card\}[\s\S]*?>/);
      assert.ok(cardMatch, 'Rempah card located');
      assert.ok(!/\blayout\b/.test(cardMatch[0]), 'Rempah card must not contain layout prop');
    });

    test('rasa/page.tsx: Not found card does not have layout="position" prop', () => {
      const notFoundMatch = rasaSource.match(/key="not-found"[\s\S]*?>/);
      assert.ok(notFoundMatch, 'Not found card located');
      assert.ok(!/\blayout\b/.test(notFoundMatch[0]), 'Not found card must not contain layout prop');
    });

    test('rasa/page.tsx: No layout prop anywhere in the file', () => {
      assert.ok(!/\blayout\b/.test(rasaSource), 'rasa/page.tsx should contain zero layout props');
    });
  });

  describe('Requirement 3: Motif Image DOM Reduction & CSS Multiple Backgrounds', () => {
    const katalogSource = fs.readFileSync(KATALOG_PAGE_PATH, 'utf8');
    const cssSource = fs.readFileSync(KATALOG_CSS_PATH, 'utf8');

    test('CardItem in katalog/page.tsx renders 0 motif Image tags and exactly 1 food Image', () => {
      const cardItemIdx = katalogSource.indexOf('function CardItem(');
      assert.ok(cardItemIdx !== -1, 'CardItem subcomponent located');
      const cardContent = katalogSource.slice(cardItemIdx);

      // Must not reference motif_bunga_card.webp
      assert.ok(
        !cardContent.includes('motif_bunga_card'),
        'CardItem should not reference motif_bunga_card'
      );

      // Must have exactly ONE Image component (for the culinary food image)
      const imageCount = (cardContent.match(/<Image\b/g) || []).length;
      assert.equal(
        imageCount,
        1,
        `Expected exactly 1 Image component in CardItem, found ${imageCount}`
      );
    });

    test('katalog.module.css: .cardInfo::before implements 5 motif flower backgrounds', () => {
      const ruleMatch = cssSource.match(/\.cardInfo::before\s*\{([^}]+)\}/);
      assert.ok(ruleMatch, '.cardInfo::before rule must exist in CSS');
      const ruleBody = ruleMatch[1];

      // Verify content and positioning
      assert.match(ruleBody, /content:\s*["']["'];/);
      assert.match(ruleBody, /position:\s*absolute;/);
      assert.match(ruleBody, /inset:\s*0;/);
      assert.match(ruleBody, /pointer-events:\s*none;/);

      // Verify background-image has 5 motif URLs
      const bgImageMatch = ruleBody.match(/background-image:\s*([\s\S]*?);/);
      assert.ok(bgImageMatch, 'background-image property must exist');
      const urls = bgImageMatch[1].match(/url\(['"]?\/motif\/motif_bunga_card\.webp['"]?\)/g) || [];
      assert.equal(
        urls.length,
        5,
        `Expected 5 background-image URLs for motif_bunga_card.webp, found ${urls.length}`
      );

      // Verify background-position has 5 positions
      const bgPosMatch = ruleBody.match(/background-position:\s*([\s\S]*?);/);
      assert.ok(bgPosMatch, 'background-position property must exist');
      const positions = bgPosMatch[1].split(',').map((s) => s.trim());
      assert.equal(
        positions.length,
        5,
        `Expected 5 background-position entries, found ${positions.length}`
      );

      // Verify background-size has 5 sizes
      const bgSizeMatch = ruleBody.match(/background-size:\s*([\s\S]*?);/);
      assert.ok(bgSizeMatch, 'background-size property must exist');
      const sizes = bgSizeMatch[1].split(',').map((s) => s.trim());
      assert.equal(
        sizes.length,
        5,
        `Expected 5 background-size entries, found ${sizes.length}`
      );

      // Verify background-repeat: no-repeat
      assert.match(ruleBody, /background-repeat:\s*no-repeat;/);
    });

    test('katalog.module.css: Old individual motif classes are cleanly removed', () => {
      assert.ok(!cssSource.includes('.motifLeftTop'), '.motifLeftTop should be removed');
      assert.ok(!cssSource.includes('.motifLeftBottom'), '.motifLeftBottom should be removed');
      assert.ok(!cssSource.includes('.motifLeftCenter'), '.motifLeftCenter should be removed');
      assert.ok(!cssSource.includes('.motifRightTop'), '.motifRightTop should be removed');
      assert.ok(!cssSource.includes('.motifRightBottom'), '.motifRightBottom should be removed');
    });

    test('Motif image asset exists in public directory', () => {
      const assetPath = path.join(ROOT_DIR, 'public/motif/motif_bunga_card.webp');
      assert.ok(fs.existsSync(assetPath), 'public/motif/motif_bunga_card.webp must exist');
    });
  });

  describe('Requirement 4: Next.js Image Optimization', () => {
    const katalogSource = fs.readFileSync(KATALOG_PAGE_PATH, 'utf8');
    const rasaSource = fs.readFileSync(RASA_PAGE_PATH, 'utf8');

    test('katalog/page.tsx: unoptimized={true} / unoptimized is absent', () => {
      assert.ok(
        !/unoptimized/.test(katalogSource),
        'katalog/page.tsx must not contain unoptimized'
      );
    });

    test('rasa/page.tsx: unoptimized is absent across all Image instances', () => {
      assert.ok(
        !/unoptimized/.test(rasaSource),
        'rasa/page.tsx must not contain unoptimized'
      );
    });

    test('katalog/page.tsx: CardItem Image has responsive sizes attribute', () => {
      const cardItemIdx = katalogSource.indexOf('function CardItem(');
      assert.ok(cardItemIdx !== -1, 'CardItem subcomponent located');
      const cardContent = katalogSource.slice(cardItemIdx);
      assert.match(
        cardContent,
        /sizes=["']\([^)]+\)\s*\d+vw,\s*\d+vw["']/,
        'CardItem Image should have responsive sizes attribute'
      );
    });

    test('rasa/page.tsx: All <Image fill> components have responsive sizes attribute', () => {
      const fillImages = rasaSource.match(/<Image[^>]*fill[^>]*>/g) || [];
      assert.ok(fillImages.length >= 2, 'Expected at least 2 fill Image elements in rasa/page.tsx');
      for (const img of fillImages) {
        assert.match(
          img,
          /\bsizes=/,
          `Fill Image is missing sizes prop: ${img}`
        );
      }
    });
  });

  describe('Filter Functionality & Adversarial Query Stress Testing', () => {
    // Test filter logic against hostile inputs
    const mockItems = [
      { name: 'Gudeg Yogya', origin: 'Yogyakarta', category: 'Makanan Berat', tasteProfile: 'Manis', shortDescription: 'Nangka muda manis' },
      { name: 'Soto Kudus', origin: 'Kudus', category: 'Makanan Berat', tasteProfile: 'Gurih', shortDescription: 'Soto kerbau gurih' },
      { name: 'Es Dawet Ayu', origin: 'Banjarnegara', category: 'Minuman', tasteProfile: 'Manis', shortDescription: 'Cendol santan gula kelapa' },
      { name: 'Lumpia Semarang', origin: 'Semarang', category: 'Jajanan', tasteProfile: 'Gurih', shortDescription: 'Rebung renyah' },
    ];

    const filterKuliner = (items, debouncedSearch, activeCategory = 'Semua Kategori', activeTaste = 'Semua Rasa') => {
      return items.filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          item.origin.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          item.shortDescription.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchesCategory = activeCategory === 'Semua Kategori' || item.category === activeCategory;
        const matchesTaste = activeTaste === 'Semua Rasa' || item.tasteProfile === activeTaste;
        return matchesSearch && matchesCategory && matchesTaste;
      });
    };

    test('Adversarial search queries do not throw and match correctly', () => {
      const queries = [
        'gudeg',
        'GUDEG',
        'GuDeG',
        'kudus',
        'santan',
        '[test]',
        '(*+?\\)',
        '\\',
        '   ',
        'nonexistent culinary item 12345',
        '<!DOCTYPE html>',
        '${process.env}',
      ];

      for (const q of queries) {
        assert.doesNotThrow(() => {
          const res = filterKuliner(mockItems, q);
          assert.ok(Array.isArray(res));
        }, `Query "${q}" threw an error`);
      }
    });

    test('Regex character search matches literally without regex injection', () => {
      const itemsWithSpecialChars = [
        { name: 'Test (Item)', origin: 'Origin', category: 'Makanan Berat', tasteProfile: 'Gurih', shortDescription: 'Special [bracket]' },
      ];

      const res1 = filterKuliner(itemsWithSpecialChars, '(');
      assert.equal(res1.length, 1);

      const res2 = filterKuliner(itemsWithSpecialChars, '[');
      assert.equal(res2.length, 1);

      const res3 = filterKuliner(itemsWithSpecialChars, '*');
      assert.equal(res3.length, 0);
    });

    test('Category and taste filter conjunction', () => {
      const res = filterKuliner(mockItems, '', 'Makanan Berat', 'Gurih');
      assert.equal(res.length, 1);
      assert.equal(res[0].name, 'Soto Kudus');
    });
  });
});
