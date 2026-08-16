/**
 * Centralized Location & Navigation Configuration
 * Hotel Rajhans International, Bhagalpur, Bihar
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationConfig {
  hotel: {
    name: string;
    address: string;
    coordinates: Coordinates;
    googleMapsUrl: string;
    googlePlaceId?: string;
  };
  railwayStation: {
    name: string;
    code: string;
    coordinates: Coordinates;
  };
}

export const LOCATION_CONFIG: LocationConfig = {
  hotel: {
    name: "Hotel Rajhans International",
    address: "Kachari Chowk, MG Road, Bhagalpur, Bihar – 812001, India",
    coordinates: {
      lat: 25.2505,
      lng: 86.9887,
    },
    googleMapsUrl: "https://maps.app.goo.gl/77AAPZ7hRje8Nrmk9",
    googlePlaceId: "ChIJ84kNtvdJ8DkRhUR2lrX4r3U",
  },
  railwayStation: {
    name: "Bhagalpur Junction Railway Station",
    code: "BGP",
    coordinates: {
      lat: 25.2435,
      lng: 86.9743,
    },
  },
};

/**
 * Generates a direct Google Maps navigation URL from origin to destination
 */
export function getGoogleMapsDirectionsUrl(
  origin?: Coordinates,
  destination?: Coordinates
): string {
  if (!origin && !destination) {
    return LOCATION_CONFIG.hotel.googleMapsUrl;
  }
  const orig = origin || LOCATION_CONFIG.hotel.coordinates;
  const dest = destination || LOCATION_CONFIG.railwayStation.coordinates;
  return `https://www.google.com/maps/dir/?api=1&origin=${orig.lat},${orig.lng}&destination=${dest.lat},${dest.lng}&travelmode=driving`;
}

/**
 * Calculates straight-line (Haversine) distance fallback in kilometers
 */
export function calculateHaversineDistanceKm(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const R = 6371; // Earth radius in KM
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLine = R * c;

  // Multiply by road factor ~1.3 to approximate actual road travel distance
  return Math.round(straightLine * 1.3 * 10) / 10;
}
