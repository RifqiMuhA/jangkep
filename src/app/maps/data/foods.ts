import { kulinerData } from '../../../data/kulinerData';

export interface Food {
  id: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  icon: string;
  category: string;
  flavors: string[];
  story: string;
  image: string;
  relatedFoods?: string[];
}

export const regions = ['Semua', 'Semarang Raya', 'Solo Raya', 'Banyumas & Kedu', 'Pantura', 'Muria & Pati'];

export const regionCityMap: Record<string, string[]> = {
  'Semua': [],
  'Semarang Raya': ['Semarang', 'Salatiga'],
  'Solo Raya': ['Solo', 'Wonogiri'],
  'Banyumas & Kedu': ['Banyumas', 'Magelang', 'Wonosobo', 'Banjarnegara'],
  'Pantura': ['Pekalongan', 'Demak', 'Pemalang'],
  'Muria & Pati': ['Kudus', 'Rembang', 'Blora', 'Pati', 'Jepara']
};

const cityCoords: Record<string, { lat: number, lng: number }> = {
  'Wonogiri': { lat: -7.8080, lng: 110.9234 },
  'Solo': { lat: -7.5667, lng: 110.8167 },
  'Blora': { lat: -6.9667, lng: 111.4167 },
  'Semarang': { lat: -7.0056, lng: 110.4381 }, // Moved south, inland
  'Banyumas': { lat: -7.5167, lng: 109.2833 },
  'Kudus': { lat: -6.8048, lng: 110.8405 },
  'Magelang': { lat: -7.4797, lng: 110.2177 },
  'Banjarnegara': { lat: -7.3970, lng: 109.6974 },
  'Demak': { lat: -6.9100, lng: 110.6400 }, // Moved south, inland
  'Pati': { lat: -6.7481, lng: 111.0360 },
  'Jepara': { lat: -6.6200, lng: 110.7000 }, // Moved inland to prevent floating in the sea
  'Wonosobo': { lat: -7.3621, lng: 109.9004 },
  'Pemalang': { lat: -6.9200, lng: 109.3800 }, // Moved south, inland
  'Salatiga': { lat: -7.3305, lng: 110.5084 }, // Added missing Salatiga
  'Pekalongan': { lat: -6.9200, lng: 109.6800 }, // Added missing Pekalongan, moved inland
  'Rembang': { lat: -6.7099, lng: 111.3385 } // Added missing Rembang
};

const categoryIcon: Record<string, string> = {
  'Makanan Berat': '🍛',
  'Jajanan': '🍡',
  'Minuman': '🍹'
};

export const foodsData: Food[] = kulinerData.map((item, index) => {
  const coords = cityCoords[item.origin] || { lat: -7.0, lng: 110.0 };

  // Define small administrative regions (Kota/small Kabupaten) to prevent pins from spilling outside borders
  const smallRegions = ['Solo', 'Magelang', 'Salatiga', 'Pekalongan', 'Kudus', 'Semarang'];
  
  const angle = index * 137.5 * (Math.PI / 180);
  
  // Use a smaller radius for small regions (~200m - 800m) vs large regions (~1.5km - 10km)
  const isSmall = smallRegions.includes(item.origin);
  const minRadius = isSmall ? 0.002 : 0.012;
  const maxRadius = isSmall ? 0.006 : 0.025;
  
  const distance = minRadius + (index % 5) * ((maxRadius - minRadius) / 4);
  let latOffset = Math.sin(angle) * distance;
  let lngOffset = Math.cos(angle) * distance;

  // Prevent Northern coastal cities from spilling into the Java Sea
  // Mapbox latitude: positive offset moves North (towards sea). Force it South (negative).
  const coastalCities = ['Semarang', 'Demak', 'Jepara', 'Pati', 'Rembang', 'Pekalongan', 'Pemalang', 'Kudus'];
  if (coastalCities.includes(item.origin) && latOffset > 0) {
    latOffset = -latOffset; 
  }

  return {
    id: item.slug,
    name: item.name,
    city: item.origin,
    latitude: coords.lat + latOffset,
    longitude: coords.lng + lngOffset,
    icon: categoryIcon[item.category] || '🍽️',
    category: item.category,
    flavors: [item.tasteProfile],
    story: item.shortDescription,
    image: item.galleryImages[0] || item.locationImage || '/batik/pattern_background.webp',
    relatedFoods: item.ingredients.map(ing => ing.name).slice(0, 3)
  };
});
