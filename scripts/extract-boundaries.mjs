/**
 * Script to download Indonesia ADM2 boundaries from geoBoundaries
 * and extract only the cities we need for Jangkep scrollytelling.
 *
 * Usage: node scripts/extract-boundaries.mjs
 */

const SIMPLIFIED_URL =
  'https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/IDN/ADM2/geoBoundaries-IDN-ADM2_simplified.geojson';

// Cities/regencies we need, mapped to chapter IDs
// shapeName in geoBoundaries uses BPS naming
const CITY_MAP = {
  // chapter id → possible shapeName matches (case-insensitive partial)
  semarang: ['Kota Semarang', 'KOTA SEMARANG', 'Semarang'],
  solo: ['Kota Surakarta', 'KOTA SURAKARTA', 'Surakarta'],
  kudus: ['Kabupaten Kudus', 'KABUPATEN KUDUS', 'Kudus'],
  banyumas: ['Kabupaten Banyumas', 'KABUPATEN BANYUMAS', 'Banyumas'],
  pantura: ['Kota Pekalongan', 'KOTA PEKALONGAN', 'Pekalongan'],
};

async function main() {
  console.log('⏳ Downloading Indonesia ADM2 simplified boundaries...');
  
  const response = await fetch(SIMPLIFIED_URL);
  if (!response.ok) {
    console.error(`❌ Failed to download: ${response.status} ${response.statusText}`);
    process.exit(1);
  }
  
  const geojson = await response.json();
  console.log(`✅ Downloaded ${geojson.features.length} features.`);
  
  // Print all unique shapeNames for debugging
  const allNames = [...new Set(geojson.features.map(f => f.properties.shapeName))].sort();
  console.log('\n📋 All shapeName values that contain "semarang", "surakarta", "kudus", "banyumas", or "pekalongan":');
  const keywords = ['semarang', 'surakarta', 'kudus', 'banyumas', 'pekalongan', 'solo'];
  allNames.forEach(name => {
    if (keywords.some(k => name.toLowerCase().includes(k))) {
      console.log(`  → ${name}`);
    }
  });
  
  // Extract each city
  const output = {};
  for (const [chapterId, possibleNames] of Object.entries(CITY_MAP)) {
    const feature = geojson.features.find(f => {
      const name = (f.properties.shapeName || '').toLowerCase();
      return possibleNames.some(p => name === p.toLowerCase() || name.includes(p.toLowerCase()));
    });
    
    if (feature) {
      output[chapterId] = {
        type: 'Feature',
        geometry: feature.geometry,
        properties: {
          name: feature.properties.shapeName,
          chapterId,
        }
      };
      console.log(`✅ Found ${chapterId}: ${feature.properties.shapeName} (${feature.geometry.type}, ${JSON.stringify(feature.geometry.coordinates).length} bytes)`);
    } else {
      console.warn(`⚠️ NOT FOUND: ${chapterId} (tried: ${possibleNames.join(', ')})`);
    }
  }
  
  // Write individual files + combined file
  const { writeFileSync } = await import('fs');
  const { resolve } = await import('path');
  
  const outDir = resolve(process.cwd(), 'public', 'geo');
  
  // Combined file with all boundaries
  const combined = {
    type: 'FeatureCollection',
    features: Object.values(output),
  };
  
  const combinedPath = resolve(outDir, 'jateng-boundaries.json');
  writeFileSync(combinedPath, JSON.stringify(combined));
  console.log(`\n📦 Combined file written to: ${combinedPath} (${(JSON.stringify(combined).length / 1024).toFixed(1)} KB)`);
  
  // Individual files for lazy loading
  for (const [id, feature] of Object.entries(output)) {
    const fc = { type: 'FeatureCollection', features: [feature] };
    const filePath = resolve(outDir, `${id}.json`);
    writeFileSync(filePath, JSON.stringify(fc));
    console.log(`📄 ${id}.json written (${(JSON.stringify(fc).length / 1024).toFixed(1)} KB)`);
  }
  
  console.log('\n🎉 Done! Boundary files are ready in public/geo/');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
