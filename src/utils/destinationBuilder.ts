import { Destination } from '../types/travel';

export interface RawPlaceData {
  placeId: string;
  name: string;
  formattedAddress?: string;
  country?: string;
  region?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  types?: string[];
  photoUrl?: string;
  userRatingsTotal?: number;
  rating?: number;
}

/**
 * Returns a high-quality relevant Unsplash image based on location name and place types
 */
export function getContextualPlaceImage(name: string, country: string = '', types: string[] = []): string {
  const lowerName = name.toLowerCase();
  const lowerCountry = country.toLowerCase();
  const typesStr = types.join(' ').toLowerCase();

  // Specific landmarks & famous destinations
  if (lowerName.includes('fuji')) {
    return 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=1200&q=80';
  }
  if (lowerName.includes('eiffel') || lowerName.includes('paris')) {
    return 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80';
  }
  if (lowerName.includes('tokyo') || lowerName.includes('shibuya') || lowerName.includes('shinjuku')) {
    return 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80';
  }
  if (lowerName.includes('kyoto')) {
    return 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80';
  }
  if (lowerName.includes('seoul')) {
    return 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=80';
  }
  if (lowerName.includes('disneyland')) {
    return 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=1200&q=80';
  }
  if (lowerName.includes('london')) {
    return 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80';
  }
  if (lowerName.includes('new york') || lowerName.includes('manhattan')) {
    return 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80';
  }
  if (lowerName.includes('hyderabad')) {
    return 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=1200&q=80';
  }
  if (lowerName.includes('visakhapatnam') || lowerName.includes('vizag')) {
    return 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80';
  }
  if (lowerName.includes('switzerland') || lowerName.includes('alps') || typesStr.includes('mountain') || typesStr.includes('ski')) {
    return 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80';
  }
  if (lowerName.includes('maldives') || lowerName.includes('beach') || lowerName.includes('island') || typesStr.includes('beach')) {
    return 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80';
  }
  if (lowerName.includes('bali') || lowerName.includes('indonesia')) {
    return 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80';
  }
  if (lowerName.includes('thailand') || lowerName.includes('bangkok') || lowerName.includes('phuket')) {
    return 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=1200&q=80';
  }

  // Type-based fallback categories
  if (typesStr.includes('natural_feature') || typesStr.includes('park')) {
    return 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80';
  }
  if (typesStr.includes('tourist_attraction') || typesStr.includes('historical_landmark')) {
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';
  }

  // General beautiful city landscape
  return 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80';
}

/**
 * Builds dynamic travel style tags based on Google Place types
 */
function deriveTravelStyleTags(types: string[] = []): string[] {
  const tags = new Set<string>();
  const typesStr = types.join(' ').toLowerCase();

  if (typesStr.includes('natural_feature') || typesStr.includes('mountain') || typesStr.includes('park')) {
    tags.add('Nature');
    tags.add('Scenic');
  }
  if (typesStr.includes('tourist_attraction') || typesStr.includes('landmark') || typesStr.includes('monument')) {
    tags.add('Sightseeing');
    tags.add('Photography');
  }
  if (typesStr.includes('museum') || typesStr.includes('church') || typesStr.includes('place_of_worship') || typesStr.includes('historical')) {
    tags.add('Culture');
    tags.add('History');
  }
  if (typesStr.includes('amusement_park') || typesStr.includes('entertainment')) {
    tags.add('Family');
    tags.add('Adventure');
  }
  if (typesStr.includes('locality') || typesStr.includes('administrative_area') || typesStr.includes('political')) {
    tags.add('City Walk');
    tags.add('Food');
  }

  if (tags.size === 0) {
    tags.add('Culture');
    tags.add('Sightseeing');
    tags.add('Food');
  }

  return Array.from(tags).slice(0, 5);
}

/**
 * Builds a dynamic, comprehensive Destination object from Place data
 */
export function buildDestinationFromPlace(place: RawPlaceData): Destination {
  const cleanId = place.placeId || place.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const types = place.types || [];
  const typesStr = types.join(' ').toLowerCase();

  const isLandmarkOrAttraction =
    typesStr.includes('tourist_attraction') ||
    typesStr.includes('landmark') ||
    typesStr.includes('natural_feature') ||
    typesStr.includes('mountain_peak') ||
    typesStr.includes('amusement_park') ||
    typesStr.includes('museum');

  const isCountryOrRegion =
    typesStr.includes('country') ||
    typesStr.includes('administrative_area_level_1');

  // Country derivation
  let country = place.country || '';
  if (!country && place.formattedAddress) {
    const parts = place.formattedAddress.split(',').map((p) => p.trim());
    if (parts.length > 0) {
      country = parts[parts.length - 1];
    }
  }
  if (!country) country = 'Global Landmark';

  // Recommended duration
  let recommendedDays = 5;
  if (isLandmarkOrAttraction) {
    recommendedDays = 3;
  } else if (isCountryOrRegion) {
    recommendedDays = 7;
  }

  // Tagline & Description
  const tagline = isLandmarkOrAttraction
    ? `Iconic landmark and world-class destination in ${country}`
    : `Experience the vibrant culture, scenery, and gastronomy of ${place.name}`;

  const description = isLandmarkOrAttraction
    ? `${place.name} is a renowned global point of interest in ${country}. Visitors come from around the world to marvel at its unique architecture, historical significance, and scenic surroundings.`
    : `Discover ${place.name}, ${country}. From historic landmarks and local markets to scenic walking routes and regional culinary specialties, this destination offers an unforgettable travel adventure.`;

  // Realistic estimated cost in INR
  const baseCost = isLandmarkOrAttraction ? 55000 : 78000;
  const flights = Math.round(baseCost * 0.42);
  const hotel = Math.round(baseCost * 0.28);
  const food = Math.round(baseCost * 0.16);
  const transport = Math.round(baseCost * 0.08);
  const activities = Math.round(baseCost * 0.06);

  const mainAttractions = [
    `${place.name} Main Viewpoint`,
    `${place.name} Historic Tour`,
    `${place.name} Local Dining & Markets`,
    `Scenic Walks around ${place.name}`,
  ];

  return {
    id: cleanId,
    placeId: place.placeId,
    name: place.name,
    country,
    region: place.region || country,
    formattedAddress: place.formattedAddress,
    types,
    tagline,
    description,
    image: place.photoUrl || getContextualPlaceImage(place.name, country, types),
    estimatedCost: {
      min: baseCost,
      max: Math.round(baseCost * 1.35),
      currency: 'INR',
      breakdown: {
        flights,
        hotel,
        food,
        transport,
        activities,
      },
    },
    recommendedDays,
    weatherSummary: `Pleasant travel weather with scenic seasonal panoramas.`,
    bestMonths: ['Mar', 'Apr', 'May', 'Sep', 'Oct', 'Nov'],
    mainAttractions,
    foodSpecialties: ['Regional Specialties', 'Artisan Street Food', 'Authentic Local Dishes'],
    travelStyleTags: deriveTravelStyleTags(types),
    matchScore: 96,
    whyMatchExplanation: `${place.name} offers exceptional travel experiences, convenient transit connectivity, and outstanding sightseeing value.`,
    coordinates: place.coordinates,
  };
}
