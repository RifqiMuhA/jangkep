import fs from 'fs';
import path from 'path';

const SIMPLIFIED_URL = 'https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/IDN/ADM2/geoBoundaries-IDN-ADM2_simplified.geojson';

const CITY_MAP = {
  'solo_wonogiri': ['Surakarta', 'Wonogiri'],
  'semarang': ['Semarang', 'Demak'],
  'wonosobo_magelang': ['Wonosobo', 'Magelang'],
  'banyumas': ['Banyumas', 'Banjarnegara'],
  'kudus_jepara': ['Kudus', 'Jepara'],
  'pati_blora': ['Pati', 'Blora'],
  'pemalang': ['Pemalang']
};

async function main() {
  const response = await fetch(SIMPLIFIED_URL);
  const geojson = await response.json();
  
  const output = {};
  for (const [chapterId, possibleNames] of Object.entries(CITY_MAP)) {
    const features = geojson.features.filter(f => {
      const name = (f.properties.shapeName || '').toLowerCase();
      return possibleNames.some(p => name.includes(p.toLowerCase()));
    });
    output[chapterId] = features;
  }
  
  const outDir = path.resolve(process.cwd(), 'public', 'geo');
  if(!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive: true});
  
  for (const [id, features] of Object.entries(output)) {
    const fc = { type: 'FeatureCollection', features };
    fs.writeFileSync(path.resolve(outDir, id + '.json'), JSON.stringify(fc));
  }
  console.log('done');
}
main();
