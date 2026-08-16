"use client";

import { useEffect, useState } from "react";
import { LOCATION_CONFIG, getGoogleMapsDirectionsUrl } from "@/lib/location";
import { Navigation, Train, Clock, MapPin, ExternalLink, RefreshCw } from "lucide-react";

interface DistanceData {
  distanceText: string;
  durationText: string;
  distanceKm: number;
  durationMinutes: number;
  directionsUrl: string;
}

export default function LocationSection() {
  const [distanceInfo, setDistanceInfo] = useState<DistanceData>({
    distanceText: "2.8 km",
    durationText: "12 minutes",
    distanceKm: 2.8,
    durationMinutes: 12,
    directionsUrl: getGoogleMapsDirectionsUrl(),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/location/distance", { cache: "no-store", headers: { "Cache-Control": "no-cache" } })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDistanceInfo({
            distanceText: data.distanceText,
            durationText: data.durationText,
            distanceKm: data.distanceKm,
            durationMinutes: data.durationMinutes,
            directionsUrl: data.directionsUrl,
          });
        }
      })
      .catch((err) => console.error("Failed to fetch location distance:", err))
      .finally(() => setLoading(false));
  }, []);

  const hotelCoords = LOCATION_CONFIG.hotel.coordinates;
  const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.019561011854!2d${hotelCoords.lng}!3d${hotelCoords.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f049fdb60d89f3%3A0x75aff8b59676e485!2sHotel%20Rajhans%20International!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin`;

  return (
    <div className="space-y-8 font-sans">
      {/* Section Header */}
      <div className="space-y-2">
        <span className="text-gold-400 text-xs uppercase tracking-[0.3em] font-medium block">
          Map & Connectivity
        </span>
        <h2 className="font-serif text-3xl md:text-5xl text-gold-50 font-normal tracking-wide">
          Hotel Location
        </h2>
        <p className="text-gold-200/70 text-xs md:text-sm max-w-xl leading-relaxed">
          {LOCATION_CONFIG.hotel.address}
        </p>
      </div>

      {/* Interactive Responsive Map Container */}
      <div className="relative w-full h-[380px] md:h-[450px] rounded-xl overflow-hidden border border-gold-400/20 shadow-2xl bg-cream-soft">
        <iframe
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{
            border: 0,
            filter: "grayscale(25%) contrast(98%) saturate(90%)",
          }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Hotel Rajhans International Interactive Map"
          className="w-full h-full"
        />

        {/* Map Coordinates & Direct Link Badge Overlay */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap justify-between items-center gap-2 pointer-events-none">
          <div className="bg-cream/90 backdrop-blur-md border border-gold-400/30 px-3 py-1.5 rounded-lg text-[10px] text-gold-200 font-mono flex items-center gap-2 shadow-lg pointer-events-auto">
            <MapPin className="h-3.5 w-3.5 text-gold-400" />
            <span>
              {hotelCoords.lat}° N, {hotelCoords.lng}° E
            </span>
          </div>
          <a
            href={LOCATION_CONFIG.hotel.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-gold-400 hover:bg-gold-300 text-brown-900 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 transition-all pointer-events-auto"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Transport & Distance Details Box */}
      <div className="p-6 md:p-8 rounded-xl bg-gradient-to-r from-cream-soft to-cream border border-gold-400/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gold-400 font-medium text-xs uppercase tracking-widest">
            <Train className="h-4 w-4" />
            <span>Bhagalpur Junction</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-gold-400/10 border border-gold-400/20 text-gold-300">
                <Navigation className="h-4 w-4" />
              </div>
              <div>
                <span className="text-gold-200/60 uppercase font-mono text-[9px] block font-bold">
                  Distance
                </span>
                <span className="font-mono text-sm font-bold text-gold-100">
                  {loading ? (
                    <RefreshCw className="h-3 w-3 animate-spin inline" />
                  ) : (
                    distanceInfo.distanceText
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-gold-400/10 border border-gold-400/20 text-gold-300">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <span className="text-gold-200/60 uppercase font-mono text-[9px] block font-bold">
                  Approx. travel time
                </span>
                <span className="font-mono text-sm font-bold text-gold-100">
                  {loading ? (
                    <RefreshCw className="h-3 w-3 animate-spin inline" />
                  ) : (
                    distanceInfo.durationText
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Get Directions Button */}
        <a
          href={distanceInfo.directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full md:w-auto bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-700 hover:to-gold-500 text-brown-900 font-semibold uppercase tracking-widest text-xs py-3.5 px-6 rounded-lg transition-all duration-300 shadow-md shadow-gold-400/10 cursor-pointer flex items-center justify-center gap-2 shrink-0"
        >
          <Navigation className="h-4 w-4" /> Get Directions
          <ExternalLink className="h-3.5 w-3.5 opacity-80" />
        </a>
      </div>
    </div>
  );
}
