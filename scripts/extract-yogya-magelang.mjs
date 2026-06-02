/**
 * Download Yogyakarta & Magelang boundaries from geoBoundaries
 */

const SIMPLIFIED_URL_ADM2 =
  'https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/IDN/ADM2/geoBoundaries-IDN-ADM2_simplified.geojson';
const SIMPLIFIED_URL_ADM1 =
  'https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/IDN/ADM1/geoBoundaries-IDN-ADM1_simplified.geojson';

const CITY_MAP = {
  yogyakarta: ['Daerah Istimewa Yogyakarta', 'Yogyakarta', 'DI Yogyakarta'],
  magelang: ['Magelang', 'Kota Magelang', 'KOTA MAGELANG', 'Kabupaten Magelang'],
};

async function main() {
  console.log('⏳ Downloading Indonesia ADM2 simplified boundaries...');
  const response2 = await fetch(SIMPLIFIED_URL_ADM2);
  const geojson2 = await response2.json();
  
  console.log('⏳ Downloading Indonesia ADM1 simplified boundaries...');
  const response1 = await fetch(SIMPLIFIED_URL_ADM1);
  const geojson1 = await response1.json();
  
  const allFeatures = [...geojson1.features, ...geojson2.features];
  const geojson = { features: allFeatures };
  console.log(`✅ Downloaded ${geojson.features.length} features.`);

  // Debug: show all matching names
  const allNames = [...new Set(geojson.features.map(f => f.properties.shapeName))].sort();
  console.log('\n📋 Matches for yogyakarta/magelang:');
  allNames.forEach(name => {
    if (['yogyakarta', 'magelang'].some(k => name.toLowerCase().includes(k))) {
      console.log(`  → ${name}`);
    }
  });

  const { writeFileSync } = await import('fs');
  const { resolve } = await import('path');
  const outDir = resolve(process.cwd(), 'public', 'geo');

  for (const [chapterId, possibleNames] of Object.entries(CITY_MAP)) {
    const feature = geojson.features.find(f => {
      const name = (f.properties.shapeName || '').toLowerCase();
      return possibleNames.some(p => name === p.toLowerCase() || name.includes(p.toLowerCase()));
    });

    if (feature) {
      const fc = {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: feature.geometry,
          properties: { name: feature.properties.shapeName, chapterId }
        }]
      };
      const filePath = resolve(outDir, `${chapterId}.json`);
      writeFileSync(filePath, JSON.stringify(fc));
      console.log(`✅ ${chapterId}.json written (${(JSON.stringify(fc).length / 1024).toFixed(1)} KB) — ${feature.properties.shapeName}`);
    } else {
      console.warn(`⚠️ NOT FOUND: ${chapterId}`);
    }
  }

  // Also update combined file
  const existingFiles = ['semarang', 'solo', 'kudus', 'banyumas', 'pantura', 'yogyakarta', 'magelang'];
  const combined = { type: 'FeatureCollection', features: [] };
  for (const id of existingFiles) {
    try {
      const filePath = resolve(outDir, `${id}.json`);
      const { readFileSync } = await import('fs');
      const fc = JSON.parse(readFileSync(filePath, 'utf-8'));
      combined.features.push(...fc.features);
    } catch {}
  }
  writeFileSync(resolve(outDir, 'jateng-boundaries.json'), JSON.stringify(combined));
  console.log(`\n📦 Combined file updated (${(JSON.stringify(combined).length / 1024).toFixed(1)} KB)`);
  console.log('\n🎉 Done!');
}

main().catch(console.error);
