import { kulinerData } from '../../../data/kulinerData';

export interface Food {
  id: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  icon: string;
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
  'Semarang': { lat: -6.9667, lng: 110.4167 },
  'Banyumas': { lat: -7.5167, lng: 109.2833 },
  'Kudus': { lat: -6.8048, lng: 110.8405 },
  'Magelang': { lat: -7.4797, lng: 110.2177 },
  'Banjarnegara': { lat: -7.3970, lng: 109.6974 },
  'Demak': { lat: -6.8909, lng: 110.6397 },
  'Pati': { lat: -6.7481, lng: 111.0360 },
  'Jepara': { lat: -6.5898, lng: 110.6677 },
  'Wonosobo': { lat: -7.3621, lng: 109.9004 },
  'Pemalang': { lat: -6.8906, lng: 109.3804 }
};

const categoryIcon: Record<string, string> = {
  'Makanan Berat': '🍛',
  'Jajanan': '🍡',
  'Minuman': '🍹'
};

export const foodsData: Food[] = kulinerData.map((item, index) => {
  const coords = cityCoords[item.origin] || { lat: -7.0, lng: 110.0 };
  
  // Add a small deterministic offset so pins in the same city spread out
  // Offset radius ~ 3-5km (0.03 to 0.05 degrees)
  const angle = index * 137.5 * (Math.PI / 180); // golden angle
  const distance = 0.02 + (index % 3) * 0.015;
  const latOffset = Math.sin(angle) * distance;
  const lngOffset = Math.cos(angle) * distance;

  return {
    id: item.slug,
    name: item.name,
    city: item.origin,
    latitude: coords.lat + latOffset,
    longitude: coords.lng + lngOffset,
    icon: categoryIcon[item.category] || '📍',
    flavors: [item.tasteProfile],
    story: item.shortDescription,
    image: item.locationImage || (item.galleryImages && item.galleryImages.length > 0 ? item.galleryImages[0] : ''),
    relatedFoods: []
  };
});
