import { NextResponse } from "next/server";
import {
  LOCATION_CONFIG,
  getGoogleMapsDirectionsUrl,
  calculateHaversineDistanceKm,
} from "@/lib/location";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const GOOGLE_MAPS_API_KEY =
  process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export async function GET() {
  try {
    const origin = LOCATION_CONFIG.hotel.coordinates;
    const destination = LOCATION_CONFIG.railwayStation.coordinates;

    let distanceText = "";
    let durationText = "";
    let distanceKm = 0;
    let durationMinutes = 0;

    if (GOOGLE_MAPS_API_KEY) {
      try {
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&mode=driving&key=${GOOGLE_MAPS_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (
          data.status === "OK" &&
          data.rows?.[0]?.elements?.[0]?.status === "OK"
        ) {
          const element = data.rows[0].elements[0];
          distanceText = element.distance.text;
          durationText = element.duration.text;
          distanceKm = Math.round((element.distance.value / 1000) * 10) / 10;
          durationMinutes = Math.round(element.duration.value / 60);
        }
      } catch (apiErr) {
        console.warn("Google Maps Distance Matrix API call warning:", apiErr);
      }
    }

    // Fallback calculation if API key is not configured or network call fails
    if (!distanceText || !durationText) {
      const fallbackKm = calculateHaversineDistanceKm(origin, destination);
      const estimatedMins = Math.max(8, Math.round((fallbackKm / 15) * 60)); // ~15 km/h city speed
      distanceKm = fallbackKm;
      durationMinutes = estimatedMins;
      distanceText = `${fallbackKm} km`;
      durationText = `${estimatedMins} minutes`;
    }

    return NextResponse.json({
      success: true,
      hotelName: LOCATION_CONFIG.hotel.name,
      hotelCoordinates: origin,
      stationName: LOCATION_CONFIG.railwayStation.name,
      stationCoordinates: destination,
      distanceText,
      durationText,
      distanceKm,
      durationMinutes,
      directionsUrl: getGoogleMapsDirectionsUrl(origin, destination),
    });
  } catch (error) {
    console.error("Location Distance API Error:", error);
    return NextResponse.json(
      { error: "Failed to calculate road distance" },
      { status: 500 }
    );
  }
}
