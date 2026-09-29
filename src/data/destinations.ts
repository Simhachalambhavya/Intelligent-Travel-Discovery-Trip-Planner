import { Destination, Attraction, Hotel, Restaurant, TourExperience, TransportOption, FlightOption, TrainOption, DayItinerary } from '../types/travel';

export const POPULAR_DESTINATIONS: Destination[] = [
  {
    id: 'rio-de-janeiro',
    name: 'Rio de Janeiro',
    country: 'Brazil',
    region: 'South America',
    tagline: 'Where dramatic granite mountains meet the golden Atlantic',
    description: 'A vibrant metropolis cradled between dramatic emerald peaks, white-sand urban beaches, and the rhythm of bossa nova and samba.',
    image: '/src/assets/images/dest_rio_scenic_1790693195838.jpg',
    estimatedCost: {
      min: 85000,
      max: 115000,
      currency: 'INR',
      breakdown: {
        flights: 42000,
        hotel: 28000,
        food: 14000,
        transport: 6000,
        activities: 9000,
      },
    },
    recommendedDays: 6,
    weatherSummary: 'Tropical savanna climate with sunny beach days and warm evenings year-round.',
    bestMonths: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    mainAttractions: ['Christ the Redeemer', 'Sugarloaf Mountain', 'Copacabana Beach', 'Ipanema Beach', 'Selarón Steps', 'Santa Teresa'],
    foodSpecialties: ['Feijoada', 'Moqueca Carioca', 'Pão de Queijo', 'Brigadeiro', 'Açaí na Tigela'],
    travelStyleTags: ['Beach', 'Culture', 'Photography', 'Food', 'Adventure'],
    matchScore: 94,
    whyMatchExplanation: 'Rio de Janeiro perfectly aligns with desires for iconic world landmarks, tropical beach relaxation, dramatic photography vistas, and energetic culinary scenes within budget.',
    coordinates: {
      lat: -22.9068,
      lng: -43.1729,
    },
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    region: 'East Asia',
    tagline: 'The cultural soul of Japan with thousands of serene temples',
    description: 'Ancient imperial capital lined with bamboo groves, thousand-year-old wooden shrines, tranquil zen rock gardens, and refined kaiseki dining.',
    image: '/src/assets/images/dest_kyoto_pagoda_1790693206976.jpg',
    estimatedCost: {
      min: 92000,
      max: 130000,
      currency: 'INR',
      breakdown: {
        flights: 38000,
        hotel: 32000,
        food: 18000,
        transport: 12000,
        activities: 10000,
      },
    },
    recommendedDays: 5,
    weatherSummary: 'Temperate with breathtaking spring cherry blossoms and fiery autumn foliage.',
    bestMonths: ['Mar', 'Apr', 'May', 'Oct', 'Nov'],
    mainAttractions: ['Fushimi Inari Shrine', 'Kinkaku-ji (Golden Pavilion)', 'Arashiyama Bamboo Grove', 'Gion Historic District', 'Kiyomizu-dera'],
    foodSpecialties: ['Kaiseki Ryori', 'Matcha Parfaits', 'Yudofu (Simmered Tofu)', 'Kyoto Ramen', 'Kyo-Wagashi'],
    travelStyleTags: ['History', 'Culture', 'Spiritual', 'Photography', 'Food'],
    matchScore: 96,
    whyMatchExplanation: 'Kyoto offers an unmatched blend of spiritual depth, historic wooden architecture, safe family exploration, and world-class culinary mastery.',
    coordinates: {
      lat: 35.0116,
      lng: 135.7681,
    },
  },
  {
    id: 'amalfi-coast',
    name: 'Amalfi Coast',
    country: 'Italy',
    region: 'Southern Europe',
    tagline: 'Dramatic pastel cliffside villages above the sapphire Tyrrhenian Sea',
    description: 'A fifty-kilometer stretch of coastal paradise featuring cliff-hugging pastel villas, terraced lemon orchards, and legendary coastal drives.',
    image: '/src/assets/images/dest_amalfi_coast_1790693217541.jpg',
    estimatedCost: {
      min: 110000,
      max: 165000,
      currency: 'INR',
      breakdown: {
        flights: 45000,
        hotel: 45000,
        food: 24000,
        transport: 12000,
        activities: 14000,
      },
    },
    recommendedDays: 5,
    weatherSummary: 'Mediterranean sunshine, warm sea breezes, and mild fragrant evenings.',
    bestMonths: ['Apr', 'May', 'Jun', 'Sep', 'Oct'],
    mainAttractions: ['Positano Cliffside', 'Amalfi Cathedral', 'Ravello Villa Rufolo', 'Path of the Gods Hike', 'Capri Day Boat'],
    foodSpecialties: ['Scialatielli ai Frutti di Mare', 'Delizia al Limone', 'Limoncello', 'Neapolitan Pizza', 'Fresh Buffalo Mozzarella'],
    travelStyleTags: ['Romantic', 'Architecture', 'Food', 'Beaches', 'Photography'],
    matchScore: 91,
    whyMatchExplanation: 'World-renowned for romantic getaways, scenic cliff hikes, and Mediterranean dining overlooking turquoise coves.',
    coordinates: {
      lat: 40.6340,
      lng: 14.6027,
    },
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Southeast Asia',
    tagline: 'The Island of the Gods with emerald rice terraces and sacred temples',
    description: 'Tropical sanctuary famous for ancient volcanic landscapes, surf-friendly beaches, lush Ubud spiritual retreats, and vibrant artisan villages.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    estimatedCost: {
      min: 52000,
      max: 78000,
      currency: 'INR',
      breakdown: {
        flights: 26000,
        hotel: 18000,
        food: 10000,
        transport: 5000,
        activities: 7000,
      },
    },
    recommendedDays: 7,
    weatherSummary: 'Warm tropical temperatures year-round with clear sunny skies during the dry season.',
    bestMonths: ['May', 'Jun', 'Jul', 'Aug', 'Sep'],
    mainAttractions: ['Uluwatu Cliff Temple', 'Tegallalang Rice Terraces', 'Ubud Sacred Monkey Forest', 'Tanah Lot Sunset Temple', 'Mount Batur Sunrise'],
    foodSpecialties: ['Nasi Goreng', 'Babi Guling', 'Sate Lilit', 'Bebek Betutu', 'Fresh Coconut Water'],
    travelStyleTags: ['Nature', 'Spiritual', 'Beaches', 'Budget travel', 'Romantic'],
    matchScore: 95,
    whyMatchExplanation: 'Remarkably high value for your budget with luxury villas at affordable prices, rich spiritual traditions, and outdoor adventures.',
    coordinates: {
      lat: -8.4095,
      lng: 115.1889,
    },
  },
  {
    id: 'swiss-alps',
    name: 'Swiss Alps (Zermatt & Jungfrau)',
    country: 'Switzerland',
    region: 'Central Europe',
    tagline: 'Glacial peaks, cogwheel mountain trains, and pristine alpine meadows',
    description: 'Postcard alpine paradise dominated by the iconic Matterhorn, scenic glacier express railways, crystalline lakes, and cozy chalets.',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
    estimatedCost: {
      min: 135000,
      max: 195000,
      currency: 'INR',
      breakdown: {
        flights: 48000,
        hotel: 55000,
        food: 28000,
        transport: 22000,
        activities: 18000,
      },
    },
    recommendedDays: 6,
    weatherSummary: 'Crisp mountain air, wildflower summers, and world-class powder winters.',
    bestMonths: ['Jun', 'Jul', 'Aug', 'Sep', 'Dec', 'Jan', 'Feb'],
    mainAttractions: ['Matterhorn Viewpoint', 'Gornergrat Railway', 'Jungfraujoch Top of Europe', 'Lauterbrunnen Valley', 'Lake Geneva'],
    foodSpecialties: ['Cheese Fondue', 'Raclette', 'Rösti', 'Swiss Chocolate', 'Zürcher Geschnetzeltes'],
    travelStyleTags: ['Mountains', 'Adventure', 'Nature', 'Photography', 'Luxury'],
    matchScore: 89,
    whyMatchExplanation: 'Unmatched alpine scenery, pristine rail infrastructure, and dramatic mountain hikes for nature and outdoor lovers.',
    coordinates: {
      lat: 45.9763,
      lng: 7.7491,
    },
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    tagline: 'Futuristic architectural wonders and golden desert adventures',
    description: 'A dazzling oasis of record-breaking skyscrapers, luxury shopping, pristine Arabian Gulf coastline, and authentic Bedouin desert safaris.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    estimatedCost: {
      min: 68000,
      max: 98000,
      currency: 'INR',
      breakdown: {
        flights: 24000,
        hotel: 26000,
        food: 16000,
        transport: 7000,
        activities: 12000,
      },
    },
    recommendedDays: 5,
    weatherSummary: 'Warm sunny weather in winter months with pleasant evening temperatures.',
    bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    mainAttractions: ['Burj Khalifa Observation Deck', 'The Dubai Mall & Fountain Show', 'Desert Safari & Dune Bashing', 'Museum of the Future', 'Palm Jumeirah'],
    foodSpecialties: ['Shawarma', 'Al Machboos', 'Luqaimat', 'Arabic Mezze', 'Karak Chai'],
    travelStyleTags: ['Luxury', 'Shopping', 'Architecture', 'Family activities', 'Adventure'],
    matchScore: 92,
    whyMatchExplanation: 'Superb short-flight getaway from India, seamless metro navigation, incredible entertainment for families, and futuristic architecture.',
    coordinates: {
      lat: 25.2048,
      lng: 55.2708,
    },
  },
  {
    id: 'goa',
    name: 'Goa',
    country: 'India',
    region: 'South Asia',
    tagline: 'Sun-drenched beaches, Portuguese heritage, and coastal tranquility',
    description: 'A beloved domestic seaside haven blending Portuguese colonial architecture, serene palm-fringed coastlines, spice plantations, and vibrant beach shacks.',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    estimatedCost: {
      min: 28000,
      max: 45000,
      currency: 'INR',
      breakdown: {
        flights: 10000,
        hotel: 14000,
        food: 9000,
        transport: 4000,
        activities: 5000,
      },
    },
    recommendedDays: 5,
    weatherSummary: 'Tropical coastal breezes, clear sunny winters, and lush green monsoon landscapes.',
    bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    mainAttractions: ['Palolem & Agonda Beaches', 'Basilica of Bom Jesus', 'Fontainhas Latin Quarter', 'Dudhsagar Waterfalls', 'Anjuna Flea Market'],
    foodSpecialties: ['Goan Fish Curry Thali', 'Pork Vindaloo', 'Bebinca', 'Prawn Balchão', 'Poi Bread'],
    travelStyleTags: ['Beaches', 'Food', 'Culture', 'Budget travel', 'Romantic'],
    matchScore: 97,
    whyMatchExplanation: 'Outstanding value for a budget-friendly beach getaway with minimal domestic flight times, rich heritage, and world-class seafood.',
    coordinates: {
      lat: 15.2993,
      lng: 74.1240,
    },
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    region: 'Western Europe',
    tagline: 'The City of Light, world-defining art, and timeless romance',
    description: 'Iconic European capital adorned with Haussmannian boulevards, world-class museums, sidewalk bistro terraces, and legendary landmarks along the Seine.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    estimatedCost: {
      min: 105000,
      max: 155000,
      currency: 'INR',
      breakdown: {
        flights: 44000,
        hotel: 42000,
        food: 22000,
        transport: 9000,
        activities: 13000,
      },
    },
    recommendedDays: 6,
    weatherSummary: 'Pleasant springs and autumns with mild temperatures perfect for walking along the Seine.',
    bestMonths: ['Apr', 'May', 'Jun', 'Sep', 'Oct'],
    mainAttractions: ['Eiffel Tower', 'Louvre Museum', 'Musée d’Orsay', 'Montmartre & Sacré-Cœur', 'Seine River Sunset Cruise'],
    foodSpecialties: ['Fresh Croissants & Baguettes', 'Steak Frites', 'Duck Confit', 'Macarons', 'French Cheese Platters'],
    travelStyleTags: ['Museums', 'Architecture', 'Culture', 'Food', 'Romantic'],
    matchScore: 93,
    whyMatchExplanation: 'The gold standard for lovers of art, world history, classical architecture, and unforgettable romantic walks.',
    coordinates: {
      lat: 48.8566,
      lng: 2.3522,
    },
  }
];

export const DESTINATION_DETAILS_MAP: Record<string, {
  whyVisit: string[];
  famousFor: { label: string; icon: string }[];
  attractions: Attraction[];
  hotels: Hotel[];
  restaurants: Restaurant[];
  tours: TourExperience[];
  transportation: TransportOption[];
  flights: FlightOption[];
  trains?: TrainOption[];
  itinerary: DayItinerary[];
  bestTimeInfo: {
    highSeason: string;
    shoulderSeason: string;
    lowSeason: string;
    monthlyGuide: Array<{ month: string; temp: string; rain: string; crowd: string; recommendation: string }>;
  };
}> = {
  'rio-de-janeiro': {
    whyVisit: [
      'Dramatic geological collision where sheer granite towers jut straight from Atlantic surf.',
      'Samba and Bossa Nova birthplace with an infectious, sun-warmed street culture.',
      'One of the New Seven Wonders of the World watching over a UNESCO-recognized urban biosphere.',
      'Culinary fusion celebrating coastal seafood, Brazilian barbecue (Churrascaria), and tropical fruits.',
      'Unrivaled golden hour photography vantage points from Corcovado and Sugarloaf peaks.'
    ],
    famousFor: [
      { label: 'Iconic Beaches', icon: 'Beach' },
      { label: 'Granite Mountains', icon: 'Mountain' },
      { label: 'Carnival & Samba', icon: 'Music' },
      { label: 'Brazilian Barbecue', icon: 'Utensils' },
      { label: 'Sunset Photography', icon: 'Camera' },
      { label: 'Tijuca Rainforest', icon: 'Trees' }
    ],
    attractions: [
      {
        id: 'christ-the-redeemer',
        name: 'Christ the Redeemer (Cristo Redentor)',
        image: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=800&q=80',
        shortDescription: 'The 38-meter Art Deco statue crowning the 710m peak of Corcovado mountain, offering 360-degree vistas across Rio.',
        visitDuration: '2.5 to 3 hours',
        estTicketPrice: 2200,
        currency: 'INR',
        distanceFromHotel: '7.2 km (from Copacabana)',
        openingHours: '08:00 - 19:00 daily',
        aiRecommendationReason: 'Must-visit global wonder; early morning cog train tickets minimize crowds and mid-day haze.',
        historyAndSignificance: 'Constructed between 1922 and 1931 from reinforced concrete and soapstone tiles, designed by Heitor da Silva Costa and Paul Landowski.',
        googleQuery: 'Christ the Redeemer Corcovado Rio de Janeiro official tickets',
        coordinates: { lat: -22.9519, lng: -43.2105 }
      },
      {
        id: 'sugarloaf-mountain',
        name: 'Sugarloaf Mountain (Pão de Açúcar)',
        image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80',
        shortDescription: 'Iconic 396-meter monolithic granite peak accessible via two sweeping aerial cable cars overlooking Guanabara Bay.',
        visitDuration: '2 to 3 hours',
        estTicketPrice: 2600,
        currency: 'INR',
        distanceFromHotel: '5.8 km',
        openingHours: '08:30 - 20:00 daily',
        aiRecommendationReason: 'The absolute best spot in Rio to witness the sunset as city lights begin to sparkle.',
        googleQuery: 'Sugarloaf Mountain cable car tickets Rio de Janeiro',
        coordinates: { lat: -22.9492, lng: -43.1545 }
      },
      {
        id: 'copacabana-beach',
        name: 'Copacabana Beach',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        shortDescription: 'Famed 4-kilometer crescent beach backed by wave-patterned black and white Portuguese mosaic promenade.',
        visitDuration: '2 to 4 hours',
        estTicketPrice: 0,
        currency: 'INR',
        distanceFromHotel: '0.2 km',
        openingHours: 'Open 24 hours (Quiosques open till midnight)',
        aiRecommendationReason: 'Great for people watching, fresh chilled coconut water, and beach volleyball energy.',
        googleQuery: 'Copacabana Beach Rio de Janeiro kiosks and safety tips',
        coordinates: { lat: -22.9711, lng: -43.1825 }
      },
      {
        id: 'selaron-steps',
        name: 'Escadaria Selarón (Selarón Steps)',
        image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=800&q=80',
        shortDescription: 'World-famous 215-step staircase covered in over 2,000 brightly colored tiles from over 60 countries created by Jorge Selarón.',
        visitDuration: '45 mins to 1 hour',
        estTicketPrice: 0,
        currency: 'INR',
        distanceFromHotel: '8.4 km',
        openingHours: 'Open 24 hours (Recommended daytime)',
        aiRecommendationReason: 'Connects the bohemian hill neighborhood of Santa Teresa with Lapa; exceptional vibrant street art photography.',
        googleQuery: 'Escadaria Selaron steps Rio de Janeiro Lapa',
        coordinates: { lat: -22.9155, lng: -43.1793 }
      }
    ],
    hotels: [
      {
        id: 'windsor-california',
        name: 'Windsor California Hotel',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        rating: 4.6,
        reviewCount: 1420,
        pricePerNight: 5800,
        currency: 'INR',
        totalStayPrice: 34800,
        location: 'Copacabana beachfront, Rio de Janeiro',
        distanceToAttractions: 'Direct beach access, 15 mins to Sugarloaf',
        roomType: 'Superior Ocean View Queen',
        amenities: ['Rooftop Pool', 'Free Breakfast Buffet', 'Fitness Center', 'Beach Service', 'Free High-speed Wi-Fi'],
        cancellationPolicy: 'Free cancellation up to 48 hours before check-in',
        bookingQuery: 'Windsor California Hotel Copacabana booking',
        suitability: 'Ideal for couples and balanced travelers seeking prime sea view convenience.'
      },
      {
        id: 'arena-leme-hotel',
        name: 'Arena Leme Hotel',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        rating: 4.5,
        reviewCount: 980,
        pricePerNight: 4600,
        currency: 'INR',
        totalStayPrice: 27600,
        location: 'Leme Beach, quiet north end of Copacabana',
        distanceToAttractions: '100m to Leme Beach, 20 mins to Corcovado',
        roomType: 'Standard King Room',
        amenities: ['Rooftop Bar', 'Pool', 'Breakfast Included', 'Oceanfront', 'Airport Shuttle'],
        cancellationPolicy: 'Free cancellation up to 24 hours prior',
        bookingQuery: 'Arena Leme Hotel Rio de Janeiro booking',
        suitability: 'Budget-friendly comfort in a calmer, safer pocket of the beach.'
      },
      {
        id: 'belmond-copacabana-palace',
        name: 'Copacabana Palace, A Belmond Hotel',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        reviewCount: 2150,
        pricePerNight: 24500,
        currency: 'INR',
        totalStayPrice: 147000,
        location: 'Avenida Atlântica, Copacabana',
        distanceToAttractions: 'Legendary 1923 landmark address',
        roomType: 'Deluxe City/Ocean Suite',
        amenities: ['Michelin-starred dining', 'Semi-Olympic Pool', 'Luxury Spa', 'Butler Service', 'Tennis Court'],
        cancellationPolicy: 'Flexible options available',
        bookingQuery: 'Belmond Copacabana Palace Rio de Janeiro official reservation',
        suitability: 'For premium travelers seeking legendary historic glamour.'
      }
    ],
    restaurants: [
      {
        id: 'churrascaria-palace',
        name: 'Churrascaria Palace',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Traditional Brazilian Rodizio Barbecue',
        rating: 4.7,
        priceRange: '₹₹₹',
        estCostPerPerson: 2200,
        distance: '0.4 km from Copacabana',
        openingHours: '12:00 - 23:30 daily',
        popularDishes: ['Picanha Nobre (Prime Rump Cap)', 'Amazonian Pirarucu Fish', 'Grilled Coalho Cheese', 'Juliette Papaya Cream'],
        vegetarianFriendly: true,
        ambienceTags: ['Historic 1951', 'Bossa Nova vibe', 'Family friendly'],
        officialQuery: 'Churrascaria Palace Copacabana Rio official website reservations'
      },
      {
        id: 'bar-do-mineiro',
        name: 'Bar do Mineiro',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Authentic Mineiro & Traditional Carioca',
        rating: 4.6,
        priceRange: '₹₹',
        estCostPerPerson: 950,
        distance: '7.8 km (Santa Teresa hilltop)',
        openingHours: '11:00 - 23:00 (Closed Mondays)',
        popularDishes: ['Traditional Saturday Feijoada', 'Pastéis de Feijão Preto', 'Torresmo (Crispy Pork Belly)', 'Caipirinha de Lima'],
        vegetarianFriendly: true,
        ambienceTags: ['Artistic', 'Lively', 'Outdoor seating'],
        officialQuery: 'Bar do Mineiro Santa Teresa Rio de Janeiro'
      },
      {
        id: 'confeitaria-colombo',
        name: 'Confeitaria Colombo',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Belle Époque Historic Bakery & Cafe',
        rating: 4.8,
        priceRange: '₹₹',
        estCostPerPerson: 800,
        distance: '8.5 km (Centro Histórico)',
        openingHours: '10:00 - 18:00 (Mon-Sat)',
        popularDishes: ['Pastel de Nata', 'Coxinha de Galinha', 'Café Imperial', 'Quindim'],
        vegetarianFriendly: true,
        ambienceTags: ['1894 Belgian mirrors', 'Grand architecture', 'High tea'],
        officialQuery: 'Confeitaria Colombo Centro Rio de Janeiro'
      }
    ],
    tours: [
      {
        id: 'corcovado-sugarloaf-combo',
        title: 'Full-Day Wonders of Rio: Corcovado, Sugarloaf & Selarón',
        image: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=800&q=80',
        description: 'Comprehensive guided small-group tour including skip-the-line cog railway access, cable cars, and lunch at a local rodizio.',
        languages: ['English', 'Spanish', 'Portuguese'],
        duration: '8 hours',
        price: 4900,
        currency: 'INR',
        rating: 4.9,
        meetingLocation: 'Copacabana / Ipanema hotel pick-up',
        category: 'City & Landmarks Tour',
        bookingQuery: 'Rio full day tour Corcovado Sugarloaf Selaron booking'
      },
      {
        id: 'santa-teresa-food-walk',
        title: 'Santa Teresa Bohemian Food & Heritage Walking Tour',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
        description: 'Stroll cobblestone streets, ride the vintage yellow tram, sample tropical cachaça craft drinks and indigenous street snacks with an expert resident.',
        languages: ['English', 'Portuguese'],
        duration: '3.5 hours',
        price: 2400,
        currency: 'INR',
        rating: 4.8,
        meetingLocation: 'Largo dos Guimarães, Santa Teresa',
        category: 'Food & Culture',
        bookingQuery: 'Santa Teresa food walking tour Rio de Janeiro'
      }
    ],
    transportation: [
      {
        mode: 'metro',
        title: 'Rio Metro (MetrôRio)',
        description: 'Clean, air-conditioned, fast, and safe subway connecting Copacabana, Ipanema, Botafogo, and Centro.',
        estCostRange: '₹110 per single ride (R$ 6.90)',
        typicalDuration: '10-25 mins between main tourist hubs',
        tip: 'Tap your contactless credit card directly at turnstiles; no paper ticket purchase required.'
      },
      {
        mode: 'ride_hailing',
        title: 'Uber / 99 Taxi',
        description: 'Ubiquitous, affordable, and safe door-to-door transportation throughout Rio, especially late evenings.',
        estCostRange: '₹250 - ₹500 across southern zone (Zona Sul)',
        typicalDuration: '15-30 mins depending on coastal traffic',
        tip: 'Uber Black or Comfort is recommended from airport transfers (GIG / SDU).'
      },
      {
        mode: 'walking',
        title: 'Oceanfront Boardwalks',
        description: 'Copacabana and Ipanema promenades are pedestrianized on Sundays and holidays with zero motor traffic.',
        estCostRange: 'Free',
        typicalDuration: 'Gentle 30-60 min morning strolls',
        tip: 'Stay on the main lighted avenues after dark; keep expensive jewelry in the hotel safe.'
      }
    ],
    flights: [
      {
        id: 'fl-rio-1',
        airline: 'Emirates / Qatar / LATAM',
        flightNumber: 'QR 773 + LA 8004',
        departureAirport: 'BOM / DEL / HYD',
        arrivalAirport: 'GIG (Rio de Janeiro Galeão)',
        departureTime: '04:15 AM',
        arrivalTime: '19:40 PM (Same day)',
        duration: '21h 25m',
        stops: '1 stop (Doha / Dubai)',
        baggage: '2 x 23kg checked bags included',
        price: 43500,
        currency: 'INR',
        isRoundTrip: true,
        searchQuery: 'Flights from India to Rio de Janeiro GIG Google Flights'
      },
      {
        id: 'fl-rio-2',
        airline: 'Air France / KLM',
        flightNumber: 'AF 217 + AF 442',
        departureAirport: 'DEL / BOM',
        arrivalAirport: 'GIG (Rio de Janeiro)',
        departureTime: '01:30 AM',
        arrivalTime: '17:15 PM',
        duration: '22h 45m',
        stops: '1 stop (Paris CDG)',
        baggage: 'Checked bag included',
        price: 46200,
        currency: 'INR',
        isRoundTrip: true,
        searchQuery: 'Flights to Rio de Janeiro Air France Google Flights'
      }
    ],
    itinerary: [
      {
        day: 1,
        theme: 'Arrival, Ocean Breeze & Copacabana Sunset',
        activities: [
          {
            time: '10:00 AM',
            period: 'morning',
            title: 'Galeão Airport Transfer & Hotel Check-in',
            description: 'Arrive at Rio Galeão (GIG), transfer via pre-arranged private shuttle along the coast to your Copacabana hotel, unpack and freshen up.',
            duration: '2 hours',
            location: 'Copacabana, Rio de Janeiro',
            estCost: 1500,
            bookingType: 'transport',
            tips: 'Use official airport taxis or registered Uber from the terminal.'
          },
          {
            time: '01:00 PM',
            period: 'afternoon',
            title: 'Welcome Seafood Lunch by the Boardwalk',
            description: 'Settle in at Quiosque Praia Skol or Quiosque Espaço Ox for cold water, grilled prawns, and warm pão de queijo.',
            duration: '1.5 hours',
            location: 'Avenida Atlântica Promenade',
            estCost: 1200,
            bookingType: 'meal'
          },
          {
            time: '04:00 PM',
            period: 'afternoon',
            title: 'Arpoador Rock Sunset Walk',
            description: 'Walk to the rocky promontory separating Copacabana and Ipanema. Join locals applauding as the sun dips behind the Two Brothers (Dois Irmãos) peaks.',
            duration: '2 hours',
            location: 'Pedra do Arpoador',
            estCost: 0,
            bookingType: 'leisure',
            tips: 'Arrive 45 minutes before sunset to claim a comfortable rock perch.'
          },
          {
            time: '08:00 PM',
            period: 'evening',
            title: 'Casual Carioca Dinner & Caipirinhas',
            description: 'Relaxed dinner at Belmonte bar in Copacabana, famous for savory empadas and cold draft chopp.',
            duration: '2 hours',
            location: 'Boteco Belmonte Copacabana',
            estCost: 1100,
            bookingType: 'meal'
          }
        ]
      },
      {
        day: 2,
        theme: 'Christ the Redeemer & Bohemian Santa Teresa',
        activities: [
          {
            time: '08:30 AM',
            period: 'morning',
            title: 'Corcovado Cog Railway to Christ the Redeemer',
            description: 'Board the historic electric rack railway winding through the dense Tijuca Rainforest up to the foot of Christ the Redeemer.',
            duration: '3 hours',
            location: 'Corcovado Mountain Summit',
            estCost: 2200,
            bookingType: 'attraction',
            tips: 'Sit on the right side of the ascending train for the finest forest and ocean glimpses.'
          },
          {
            time: '01:00 PM',
            period: 'afternoon',
            title: 'Lunch in Santa Teresa at Bar do Mineiro',
            description: 'Sample rich feijoada, black bean croquettes, and tropical maracujá juice on the artistic cobblestone hillside.',
            duration: '1.5 hours',
            location: 'Rua Paschoal Carlos Magno, Santa Teresa',
            estCost: 1000,
            bookingType: 'meal'
          },
          {
            time: '03:30 PM',
            period: 'afternoon',
            title: 'Escadaria Selarón Exploration',
            description: 'Walk down through the vibrant mosaics of Jorge Selarón toward Lapa, finding tiles from your own country.',
            duration: '1.5 hours',
            location: 'Manuel Carneiro, Lapa',
            estCost: 0,
            bookingType: 'attraction'
          },
          {
            time: '07:30 PM',
            period: 'evening',
            title: 'Churrascaria Palace Rodizio Dinner',
            description: 'Enjoy Rio’s finest traditional barbecue rodizio with 30+ skewered cuts carved tableside and live bossa nova piano.',
            duration: '2.5 hours',
            location: 'Rua Rodolfo Dantas, Copacabana',
            estCost: 2300,
            bookingType: 'meal',
            tips: 'Go with a healthy appetite; pace yourself with the salad bar.'
          }
        ]
      },
      {
        day: 3,
        theme: 'Sugarloaf Cable Car, Botanic Gardens & Ipanema',
        activities: [
          {
            time: '09:00 AM',
            period: 'morning',
            title: 'Rio Botanical Garden (Jardim Botânico)',
            description: 'Walk down the majestic 700m avenue of royal palms, spotting toucans, tiny marmosets, and giant Amazon water lilies.',
            duration: '2.5 hours',
            location: 'Rua Jardim Botânico',
            estCost: 600,
            bookingType: 'attraction'
          },
          {
            time: '12:30 PM',
            period: 'afternoon',
            title: 'Lunch at Garota de Ipanema',
            description: 'The historic cafe where Vinicius de Moraes and Tom Jobim penned the song "The Girl from Ipanema".',
            duration: '1.5 hours',
            location: 'Rua Vinícius de Moraes, Ipanema',
            estCost: 1200,
            bookingType: 'meal'
          },
          {
            time: '03:30 PM',
            period: 'afternoon',
            title: 'Sugarloaf Mountain Sunset Ascent',
            description: 'Ascend Morro da Urca then Sugarloaf peak via glass cable cars. Watch the golden sky illuminate Botafogo bay.',
            duration: '3 hours',
            location: 'Praia Vermelha, Urca',
            estCost: 2600,
            bookingType: 'attraction',
            tips: 'Dress in light layers as sea breezes pick up briskly after sundown.'
          },
          {
            time: '08:00 PM',
            period: 'evening',
            title: 'Evening in Leblon & Craft Tapas',
            description: 'Explore upscale Leblon neighborhood with craft acai bowls, tapioca crepes, or fresh sushi fusion.',
            duration: '2 hours',
            location: 'Dias Ferreira Street, Leblon',
            estCost: 1400,
            bookingType: 'meal'
          }
        ]
      },
      {
        day: 4,
        theme: 'Tijuca Rainforest Jeep Adventure & São Conrado',
        activities: [
          {
            time: '09:00 AM',
            period: 'morning',
            title: 'Tijuca National Park Canopy & Waterfalls',
            description: 'Open-top safari through the largest urban rainforest in the world, visiting Taunay Waterfall and Chinese View pavilion.',
            duration: '3.5 hours',
            location: 'Vista Chinesa, Tijuca Park',
            estCost: 1800,
            bookingType: 'attraction'
          },
          {
            time: '01:30 PM',
            period: 'afternoon',
            title: 'São Conrado Beach & Glider Landing Watch',
            description: 'Casual beach lunch watching hang gliders float down from Pedra Bonita onto the golden sands.',
            duration: '2 hours',
            location: 'Praia de São Conrado',
            estCost: 900,
            bookingType: 'leisure'
          },
          {
            time: '05:00 PM',
            period: 'afternoon',
            title: 'Ipanema Beach Relax & Sunset Shopping',
            description: 'Browse Brazilian linen boutiques, beachwear, and artisanal jewelry along Visconde de Pirajá.',
            duration: '2 hours',
            location: 'Ipanema Posto 9',
            estCost: 500,
            bookingType: 'leisure'
          },
          {
            time: '08:00 PM',
            period: 'evening',
            title: 'Authentic Live Samba at Rio Scenarium',
            description: 'A multi-level antique pavilion in Lapa with vibrant live traditional samba bands and dancing.',
            duration: '3 hours',
            location: 'Rua do Lavradio, Lapa',
            estCost: 1600,
            bookingType: 'attraction',
            tips: 'Safe taxi directly to the front entrance is recommended.'
          }
        ]
      },
      {
        day: 5,
        theme: 'Historic Downtown, Colombo High Tea & Departure Prep',
        activities: [
          {
            time: '09:30 AM',
            period: 'morning',
            title: 'Metropolitan Cathedral & Real Gabinete Português',
            description: 'Visit the dramatic cone-shaped modern cathedral with stained glass, followed by the breathtaking 19th-century royal library.',
            duration: '2.5 hours',
            location: 'Centro Histórico',
            estCost: 200,
            bookingType: 'attraction'
          },
          {
            time: '12:30 PM',
            period: 'afternoon',
            title: 'High Tea Lunch at Confeitaria Colombo',
            description: 'Dine in Belle Époque luxury surrounded by oversized crystal chandeliers and ornate brass mirrors.',
            duration: '2 hours',
            location: 'Rua Gonçalves Dias, Centro',
            estCost: 1100,
            bookingType: 'meal'
          },
          {
            time: '03:30 PM',
            period: 'afternoon',
            title: 'Museum of Tomorrow (Museu do Amanhã)',
            description: 'Santiago Calatrava designed futuristic architectural jewel at the revamped Porto Maravilha waterfront.',
            duration: '2 hours',
            location: 'Praça Mauá, Centro',
            estCost: 650,
            bookingType: 'attraction'
          },
          {
            time: '07:30 PM',
            period: 'evening',
            title: 'Farewell Dinner Overlooking Guanabara Bay',
            description: 'Celebrate your journey at Terra Brasilis or Urca Bar with fresh moqueca stew and sunset views of Sugarloaf.',
            duration: '2.5 hours',
            location: 'Praça General Tibúrcio, Urca',
            estCost: 1800,
            bookingType: 'meal'
          }
        ]
      }
    ],
    bestTimeInfo: {
      highSeason: 'December to March (Carnival, Summer beach weather, lively nightlife, higher hotel rates)',
      shoulderSeason: 'April to May & September to November (Mild 24-28°C weather, lower crowds, excellent deals)',
      lowSeason: 'June to August (Slightly cooler 20-25°C, occasional winter showers, budget-friendly rates)',
      monthlyGuide: [
        { month: 'Jan', temp: '29°C / 23°C', rain: '115 mm', crowd: 'High', recommendation: 'Peak summer beach season; early hotel reservations required.' },
        { month: 'Feb', temp: '30°C / 24°C', rain: '105 mm', crowd: 'Peak (Carnival)', recommendation: 'Carnival energy; vibrant street blocos and parades.' },
        { month: 'Mar', temp: '29°C / 23°C', rain: '130 mm', crowd: 'High', recommendation: 'Warm seas, occasional afternoon tropical showers.' },
        { month: 'Apr', temp: '28°C / 21°C', rain: '95 mm', crowd: 'Moderate', recommendation: 'Superb shoulder month: pleasant humidity and calm beaches.' },
        { month: 'May', temp: '26°C / 19°C', rain: '70 mm', crowd: 'Moderate', recommendation: 'Clear blue skies; ideal for hiking Corcovado and Sugarloaf.' },
        { month: 'Jun', temp: '25°C / 18°C', rain: '50 mm', crowd: 'Low', recommendation: 'Mild pleasant winter; best hotel pricing and zero humidity.' },
        { month: 'Jul', temp: '25°C / 18°C', rain: '45 mm', crowd: 'Low', recommendation: 'Driest month of the year; crisp mountain views.' },
        { month: 'Aug', temp: '25°C / 18°C', rain: '40 mm', crowd: 'Low', recommendation: 'Clear sunny days, great budget savings on accommodations.' },
        { month: 'Sep', temp: '26°C / 19°C', rain: '60 mm', crowd: 'Moderate', recommendation: 'Spring flowers bloom in Tijuca forest; mild beach days.' },
        { month: 'Oct', temp: '27°C / 20°C', rain: '85 mm', crowd: 'Moderate', recommendation: 'Warming up with great balance of weather and value.' },
        { month: 'Nov', temp: '28°C / 22°C', rain: '110 mm', crowd: 'Moderate', recommendation: 'Warm summer approach; pleasant swimming temperatures.' },
        { month: 'Dec', temp: '29°C / 23°C', rain: '135 mm', crowd: 'High (New Year)', recommendation: 'Famous Reveillon New Year fireworks on Copacabana.' }
      ]
    }
  },
  'kyoto': {
    whyVisit: [
      'Heart of traditional Japanese culture with over 1,600 historic Buddhist temples and 400 Shinto shrines.',
      'Unspoiled wooden machiya townhouses and cobblestone alleys where geisha still walk in Gion.',
      'World capital of matcha green tea ceremony and multi-course kaiseki gastronomy.',
      'Serene natural wonders including the towering Arashiyama bamboo forest and Sagano romantic train.',
      'Exceptional high-speed Shinkansen bullet train connectivity and spotless public transport.'
    ],
    famousFor: [
      { label: 'Ancient Temples', icon: 'Landmark' },
      { label: 'Matcha & Tea Ceremonies', icon: 'Coffee' },
      { label: 'Bamboo Forest', icon: 'Trees' },
      { label: 'Kaiseki Dining', icon: 'Utensils' },
      { label: 'Cherry Blossoms & Foliage', icon: 'Flower' },
      { label: 'Gion Geisha District', icon: 'Sparkles' }
    ],
    attractions: [
      {
        id: 'fushimi-inari',
        name: 'Fushimi Inari Taisha',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
        shortDescription: 'Mesmerizing path of over 10,000 vibrant vermilion torii gates winding up the sacred Mount Inari.',
        visitDuration: '2.5 to 3 hours',
        estTicketPrice: 0,
        currency: 'INR',
        distanceFromHotel: '3.8 km from Kyoto Station',
        openingHours: 'Open 24 hours',
        aiRecommendationReason: 'Visit at dawn (06:30 AM) or twilight for an ethereal, crowd-free spiritual walk.',
        googleQuery: 'Fushimi Inari Taisha Kyoto opening hours and route map',
        coordinates: { lat: 34.9671, lng: 135.7727 }
      },
      {
        id: 'kinkaku-ji',
        name: 'Kinkaku-ji (The Golden Pavilion)',
        image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80',
        shortDescription: 'Zen Buddhist temple whose top two floors are completely covered in pure gold leaf, reflecting across a mirror pond.',
        visitDuration: '1.5 hours',
        estTicketPrice: 320,
        currency: 'INR',
        distanceFromHotel: '6.5 km',
        openingHours: '09:00 - 17:00 daily',
        aiRecommendationReason: 'One of the most striking architectural sights in Asia; morning sunlight illuminates the gold leaf brilliantly.',
        googleQuery: 'Kinkaku ji Golden Pavilion tickets Kyoto',
        coordinates: { lat: 35.0394, lng: 135.7292 }
      },
      {
        id: 'arashiyama-bamboo',
        name: 'Arashiyama Bamboo Grove & Tenryu-ji',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        shortDescription: 'Towering green bamboo stalks creating rustling acoustic music in the wind, adjacent to a 14th-century UNESCO zen garden.',
        visitDuration: '3 hours',
        estTicketPrice: 350,
        currency: 'INR',
        distanceFromHotel: '8.2 km',
        openingHours: 'Grove open 24h, Temple 08:30 - 17:00',
        aiRecommendationReason: 'Combine with the scenic Sagano Romantic Train and monkey park across the Togetsukyo bridge.',
        googleQuery: 'Arashiyama Bamboo Grove Tenryuji temple Kyoto',
        coordinates: { lat: 35.0165, lng: 135.6713 }
      }
    ],
    hotels: [
      {
        id: 'hotel-granvia-kyoto',
        name: 'Hotel Granvia Kyoto',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        rating: 4.7,
        reviewCount: 3100,
        pricePerNight: 8500,
        currency: 'INR',
        totalStayPrice: 42500,
        location: 'Directly inside JR Kyoto Station Complex',
        distanceToAttractions: 'Zero-step access to bullet trains & subway',
        roomType: 'Deluxe Twin Room',
        amenities: ['Indoor Pool', 'Direct Shinkansen Connection', '10 On-site Restaurants', 'Concierge Service'],
        cancellationPolicy: 'Free cancellation up to 48 hours prior',
        bookingQuery: 'Hotel Granvia Kyoto direct booking',
        suitability: 'Unrivaled transport convenience for day trips across Kansai.'
      },
      {
        id: 'cross-hotel-kyoto',
        name: 'Cross Hotel Kyoto (Kawaramachi)',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        reviewCount: 1850,
        pricePerNight: 6200,
        currency: 'INR',
        totalStayPrice: 31000,
        location: 'Sanjo Kawaramachi, downtown Kyoto',
        distanceToAttractions: '5 min walk to Gion & Pontocho alley',
        roomType: 'Standard King with Japanese modern bath',
        amenities: ['Artisan Breakfast', 'Lounge Bar', 'Walking distance to night food alleys'],
        cancellationPolicy: 'Free cancellation up to 24 hours prior',
        bookingQuery: 'Cross Hotel Kyoto Kawaramachi reservation',
        suitability: 'Best location for nightlife, dining, and walking to historic Gion.'
      }
    ],
    restaurants: [
      {
        id: 'pontocho-robin',
        name: 'Pontocho Robin (Historic Machiya)',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Traditional Seasonal Kaiseki & Wagyu',
        rating: 4.8,
        priceRange: '₹₹₹',
        estCostPerPerson: 3200,
        distance: 'Pontocho alleyway along Kamo River',
        openingHours: '17:00 - 22:30',
        popularDishes: ['Kamameshi Claypot Rice', 'A5 Wagyu Beef Sukiyaki', 'Seasonal Kyoto Sashimi Platter'],
        vegetarianFriendly: true,
        ambienceTags: ['150-year-old wooden house', 'Riverside Kawayuka deck'],
        officialQuery: 'Pontocho Robin Kyoto Kaiseki official reservation'
      },
      {
        id: 'ippudo-nishiki',
        name: 'Ippudo Ramen Nishiki',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Hakata Style Tonkotsu & Veggie Ramen',
        rating: 4.6,
        priceRange: '₹',
        estCostPerPerson: 650,
        distance: 'Nishiki Market district',
        openingHours: '11:00 - 22:00',
        popularDishes: ['Shiromaru Classic Ramen', 'Spicy Akamaru Karaka', 'Crispy Gyoza Dumplings'],
        vegetarianFriendly: true,
        ambienceTags: ['Casual', 'Fast counter service', 'Delicious broth'],
        officialQuery: 'Ippudo Ramen Kyoto Nishiki'
      }
    ],
    tours: [
      {
        id: 'kyoto-zen-tea-walking',
        title: 'Hidden Gion Twilight Geisha District & Tea Ceremony',
        image: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=800&q=80',
        description: 'Authentic 400-year-old tea master ceremony followed by guided evening walk through lantern-lit preserved geisha alleys.',
        languages: ['English', 'Japanese'],
        duration: '3 hours',
        price: 3600,
        currency: 'INR',
        rating: 4.9,
        meetingLocation: 'Gion-Shijo Station Exit 4',
        category: 'Cultural & Heritage Tour',
        bookingQuery: 'Kyoto Gion evening walking tour tea ceremony booking'
      }
    ],
    transportation: [
      {
        mode: 'metro',
        title: 'Kyoto Municipal Subway & Hankyu Line',
        description: 'Punctual, spotless rail system connecting north-south and east-west Kyoto plus Osaka.',
        estCostRange: '₹140 - ₹220 per ride',
        typicalDuration: '10-20 mins',
        tip: 'Load an ICOCA card on your smartphone wallet for tap-and-go across trains, buses, and 7-Eleven shops.'
      },
      {
        mode: 'train',
        title: 'Shinkansen Bullet Train (Tokaido Line)',
        description: 'Connects Tokyo to Kyoto in just 2 hours 15 minutes at 300 km/h with scenic views of Mt. Fuji.',
        estCostRange: '₹7,500 one-way from Tokyo',
        typicalDuration: '2h 15m',
        tip: 'Reserve seats on the right side (Seats D/E) going from Tokyo to Kyoto to catch sight of Mount Fuji.'
      }
    ],
    flights: [
      {
        id: 'fl-kyo-1',
        airline: 'Singapore Airlines / ANA / Japan Airlines',
        flightNumber: 'SQ 401 + SQ 618',
        departureAirport: 'DEL / BOM / BLR',
        arrivalAirport: 'KIX (Kansai International - Osaka/Kyoto)',
        departureTime: '08:45 AM',
        arrivalTime: '21:30 PM',
        duration: '9h 15m',
        stops: '1 stop (Singapore Changi)',
        baggage: '25kg included',
        price: 38200,
        currency: 'INR',
        isRoundTrip: true,
        searchQuery: 'Flights from India to Kansai KIX Kyoto Google Flights'
      }
    ],
    itinerary: [
      {
        day: 1,
        theme: 'Arrival via Kansai Haruka & Evening Lanterns in Gion',
        activities: [
          {
            time: '11:00 AM',
            period: 'morning',
            title: 'Haruka Airport Express Train to Kyoto',
            description: 'Board the direct Hello Kitty-themed Haruka Express from Kansai Airport into central Kyoto Station.',
            duration: '1.2 hours',
            location: 'Kyoto Station',
            estCost: 1600,
            bookingType: 'transport'
          },
          {
            time: '02:00 PM',
            period: 'afternoon',
            title: 'Kiyomizu-dera Wooden Stage & Ninenzaka Slope',
            description: 'Climb the historic preserved flagstone stairs to Kiyomizu-dera temple overlooking Kyoto city.',
            duration: '2.5 hours',
            location: 'Higashiyama Ward',
            estCost: 350,
            bookingType: 'attraction'
          },
          {
            time: '06:30 PM',
            period: 'evening',
            title: 'Gion Hanami-koji Lantern Stroll & Pontocho Dining',
            description: 'Walk past preserved wooden tea houses, spotting maiko on their way to appointments, followed by a cozy dinner.',
            duration: '2.5 hours',
            location: 'Pontocho Alley',
            estCost: 2400,
            bookingType: 'meal'
          }
        ]
      },
      {
        day: 2,
        theme: 'Sacred Torii Gates of Fushimi & Uji Green Tea',
        activities: [
          {
            time: '07:00 AM',
            period: 'morning',
            title: 'Early Morning Fushimi Inari Torii Gate Hike',
            description: 'Hike beneath thousands of vermilion shrine gates in peaceful mountain silence before daytime tour buses arrive.',
            duration: '3 hours',
            location: 'Fushimi Inari',
            estCost: 0,
            bookingType: 'attraction'
          },
          {
            time: '12:00 PM',
            period: 'afternoon',
            title: 'Kitsune Udon Lunch at Nezameya',
            description: 'Savor traditional sweet fried tofu udon noodles and grilled unagi eel at a 400-year-old landmark eatery.',
            duration: '1 hour',
            location: 'Fushimi Inari Approach',
            estCost: 750,
            bookingType: 'meal'
          },
          {
            time: '03:00 PM',
            period: 'afternoon',
            title: 'Nijo Castle & Nightingale Floors',
            description: 'Tour the shogun’s palace with squeaking wooden floors designed to alert guards to ninjas.',
            duration: '2 hours',
            location: 'Nijo-jo, Nakagyo',
            estCost: 550,
            bookingType: 'attraction'
          },
          {
            time: '07:30 PM',
            period: 'evening',
            title: 'Ramen & Gyoza Feast at Nishiki Market District',
            description: 'Warm up with piping hot bowls of artisanal ramen broth and crispy dumplings.',
            duration: '1.5 hours',
            location: 'Nishiki Market',
            estCost: 800,
            bookingType: 'meal'
          }
        ]
      }
    ],
    bestTimeInfo: {
      highSeason: 'Late March to mid-April (Cherry Blossoms / Sakura) & November (Autumn Foliage / Koyo)',
      shoulderSeason: 'May, September, October (Delightful mild weather, green gardens, pleasant walking temperatures)',
      lowSeason: 'January to February (Crisp winter, occasional dusting of snow on golden temples, quietest crowds)',
      monthlyGuide: [
        { month: 'Jan', temp: '9°C / 1°C', rain: '50 mm', crowd: 'Low', recommendation: 'Quiet temples, beautiful snow at Kinkaku-ji.' },
        { month: 'Feb', temp: '10°C / 1°C', rain: '65 mm', crowd: 'Low', recommendation: 'Plum blossoms begin at Kitano Tenmangu shrine.' },
        { month: 'Mar', temp: '14°C / 4°C', rain: '110 mm', crowd: 'High', recommendation: 'Late March welcomes iconic cherry blossoms.' },
        { month: 'Apr', temp: '20°C / 9°C', rain: '115 mm', crowd: 'Peak (Sakura)', recommendation: 'Peak sakura season; book hotels 6 months ahead.' },
        { month: 'May', temp: '25°C / 14°C', rain: '150 mm', crowd: 'Moderate', recommendation: 'Lush fresh green maple leaves (Aomomiji).' },
        { month: 'Jun', temp: '28°C / 19°C', rain: '230 mm', crowd: 'Moderate', recommendation: 'Tsuyu rainy season; magical misty moss gardens.' },
        { month: 'Jul', temp: '32°C / 23°C', rain: '220 mm', crowd: 'High (Gion Matsuri)', recommendation: 'Famous month-long Gion festival float parades.' },
        { month: 'Aug', temp: '33°C / 24°C', rain: '150 mm', crowd: 'Moderate', recommendation: 'Summer bonfires (Daimonji Gozan Okuribi).' },
        { month: 'Sep', temp: '29°C / 20°C', rain: '180 mm', crowd: 'Moderate', recommendation: 'Clearer autumn skies and pleasant evenings.' },
        { month: 'Oct', temp: '23°C / 13°C', rain: '120 mm', crowd: 'High', recommendation: 'Jidai Matsuri historical parade; perfect walking weather.' },
        { month: 'Nov', temp: '17°C / 7°C', rain: '70 mm', crowd: 'Peak (Foliage)', recommendation: 'Spectacular red maple illuminations at night.' },
        { month: 'Dec', temp: '12°C / 3°C', rain: '50 mm', crowd: 'Moderate', recommendation: 'Crisp festive illumination in Arashiyama.' }
      ]
    }
  }
};

// Generic generator for other destinations to ensure rich complete data across the world
export function getOrCreateDestinationDetails(destId: string, destName: string, country: string) {
  if (DESTINATION_DETAILS_MAP[destId]) {
    return DESTINATION_DETAILS_MAP[destId];
  }

  // Fallback enriched data generator
  return {
    whyVisit: [
      `World-renowned cultural highlights and historic landmarks unique to ${destName}.`,
      `Vibrant local food culture celebrating fresh ingredients and traditional recipes.`,
      `Diverse accommodation options ranging from boutique heritage stays to scenic retreats.`,
      `Convenient local transit making exploration seamless and enjoyable for all travelers.`,
      `Exceptional photography opportunities and memorable local hospitality.`
    ],
    famousFor: [
      { label: 'Historic Architecture', icon: 'Landmark' },
      { label: 'Local Gastronomy', icon: 'Utensils' },
      { label: 'Scenic Vistas', icon: 'Camera' },
      { label: 'Vibrant Markets', icon: 'ShoppingBag' }
    ],
    attractions: [
      {
        id: `${destId}-attr-1`,
        name: `${destName} Historic Center & Old Town`,
        image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80',
        shortDescription: `The historic heart of ${destName} featuring pedestrianized squares, preserved architecture, and lively cafes.`,
        visitDuration: '2 to 3 hours',
        estTicketPrice: 0,
        currency: 'INR',
        distanceFromHotel: 'Central district',
        openingHours: 'Open daily',
        aiRecommendationReason: 'Essential starting point to understand the rhythm and history of the destination.',
        googleQuery: `${destName} ${country} old town walking tour`,
        coordinates: { lat: 20.0, lng: 77.0 }
      },
      {
        id: `${destId}-attr-2`,
        name: `${destName} Panoramic Overlook`,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        shortDescription: `Elevated vantage point providing sweeping 360-degree views across ${destName}.`,
        visitDuration: '1.5 to 2 hours',
        estTicketPrice: 500,
        currency: 'INR',
        distanceFromHotel: '3.5 km from center',
        openingHours: '08:00 - 20:00',
        aiRecommendationReason: 'Best photography spot during sunset as golden light sweeps across the landscape.',
        googleQuery: `${destName} viewpoint tickets and directions`
      }
    ],
    hotels: [
      {
        id: `${destId}-hotel-1`,
        name: `Grand Central Hotel ${destName}`,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        rating: 4.6,
        reviewCount: 840,
        pricePerNight: 5500,
        currency: 'INR',
        totalStayPrice: 27500,
        location: `Central ${destName}`,
        distanceToAttractions: 'Walking distance to major sights',
        roomType: 'Deluxe City View Room',
        amenities: ['Breakfast Buffet', 'High-speed Wi-Fi', 'Gym', '24/7 Concierge'],
        cancellationPolicy: 'Free cancellation up to 48 hours prior',
        bookingQuery: `Grand Central Hotel ${destName} booking`,
        suitability: 'Balanced comfort and prime location for first-time visitors.'
      }
    ],
    restaurants: [
      {
        id: `${destId}-rest-1`,
        name: `Osteria Traditional ${destName}`,
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        cuisine: 'Authentic Regional Specialties',
        rating: 4.7,
        priceRange: '₹₹',
        estCostPerPerson: 1100,
        distance: 'Central square',
        openingHours: '12:00 - 22:30',
        popularDishes: ['Chef Special Tasting Plate', 'Regional House Stew', 'Artisan Dessert'],
        vegetarianFriendly: true,
        ambienceTags: ['Warm & Cosy', 'Outdoor seating', 'Authentic'],
        officialQuery: `Osteria Traditional ${destName} restaurant`
      }
    ],
    tours: [
      {
        id: `${destId}-tour-1`,
        title: `${destName} Essential Cultural & Food Discovery Tour`,
        image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',
        description: `Explore top sights, historic alleys, and hidden food stalls with an expert certified local guide.`,
        languages: ['English'],
        duration: '4 hours',
        price: 2500,
        currency: 'INR',
        rating: 4.8,
        meetingLocation: 'Central Plaza',
        category: 'Walking & Food Tour',
        bookingQuery: `${destName} guided tour booking`
      }
    ],
    transportation: [
      {
        mode: 'metro' as const,
        title: 'Local Metro & Bus Network',
        description: 'Comprehensive public transit system covering all major tourist attractions and outer districts.',
        estCostRange: '₹80 - ₹180 per ticket',
        typicalDuration: '15-30 mins',
        tip: 'Purchase a day pass for unlimited travel.'
      },
      {
        mode: 'taxi' as const,
        title: 'Taxis & Ride-Hailing',
        description: 'Convenient option available via local app or official taxi stands.',
        estCostRange: '₹200 - ₹500 per short trip',
        typicalDuration: '10-25 mins',
        tip: 'Ensure the meter is turned on or agree on price upfront.'
      }
    ],
    flights: [
      {
        id: `${destId}-fl-1`,
        airline: 'Major International Carrier',
        flightNumber: 'AI / 6E / EK',
        departureAirport: 'DEL / BOM / BLR',
        arrivalAirport: `${destName} International`,
        departureTime: '06:00 AM',
        arrivalTime: '15:30 PM',
        duration: '7h 30m',
        stops: '1 stop',
        baggage: '20kg included',
        price: 32000,
        currency: 'INR',
        isRoundTrip: true,
        searchQuery: `Flights to ${destName} Google Flights`
      }
    ],
    itinerary: [
      {
        day: 1,
        theme: 'Arrival, Orientation & Historic Center',
        activities: [
          {
            time: '11:00 AM',
            period: 'morning' as const,
            title: 'Hotel Check-in & Freshen Up',
            description: `Arrive in ${destName}, check in to your accommodation and get situated.`,
            duration: '2 hours',
            location: 'Hotel Central',
            estCost: 1000,
            bookingType: 'transport' as const
          },
          {
            time: '01:30 PM',
            period: 'afternoon' as const,
            title: 'Old Town Heritage Walk & Welcome Lunch',
            description: `Explore historic town squares, charming alleys, and enjoy regional lunch.`,
            duration: '3 hours',
            location: 'Historic District',
            estCost: 1200,
            bookingType: 'meal' as const
          },
          {
            time: '06:30 PM',
            period: 'evening' as const,
            title: 'Sunset Viewpoint & Welcome Dinner',
            description: `Watch the sunset over ${destName} followed by a relaxed dinner.`,
            duration: '2.5 hours',
            location: 'Central Plaza',
            estCost: 1500,
            bookingType: 'meal' as const
          }
        ]
      },
      {
        day: 2,
        theme: 'Iconic Landmarks & Local Culture',
        activities: [
          {
            time: '09:00 AM',
            period: 'morning' as const,
            title: `Key Landmark & Museum Visit`,
            description: `Tour the most celebrated historical landmark of ${destName}.`,
            duration: '3 hours',
            location: 'Main Cultural Site',
            estCost: 800,
            bookingType: 'attraction' as const
          },
          {
            time: '01:00 PM',
            period: 'afternoon' as const,
            title: 'Artisan Market & Street Food Tasting',
            description: `Sample regional snacks and browse handicrafts.`,
            duration: '2.5 hours',
            location: 'Central Market',
            estCost: 900,
            bookingType: 'meal' as const
          },
          {
            time: '07:00 PM',
            period: 'evening' as const,
            title: 'Evening Cultural Experience & Fine Dining',
            description: `Enjoy local musical or cultural presentation followed by chef tasting menu.`,
            duration: '3 hours',
            location: 'Old Town',
            estCost: 1800,
            bookingType: 'meal' as const
          }
        ]
      }
    ],
    bestTimeInfo: {
      highSeason: 'Peak holiday months with optimal weather and lively atmosphere.',
      shoulderSeason: 'Spring and Autumn months offering great weather with fewer crowds.',
      lowSeason: 'Off-peak season with maximum accommodation savings.',
      monthlyGuide: [
        { month: 'Jan', temp: 'Varies', rain: 'Moderate', crowd: 'Moderate', recommendation: 'Check local weather before packing.' },
        { month: 'Apr', temp: 'Pleasant', rain: 'Low', crowd: 'Moderate', recommendation: 'Great shoulder season for sightseeing.' },
        { month: 'Oct', temp: 'Pleasant', rain: 'Low', crowd: 'Moderate', recommendation: 'Comfortable temperatures and lower crowds.' }
      ]
    }
  };
}
