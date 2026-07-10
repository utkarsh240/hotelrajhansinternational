"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface GalleryImage {
  src: string;
  category: "rooms" | "restaurant" | "services" | "reception" | "icecream" | "dormitory";
  title: string;
  description: string;
  size: "square" | "tall" | "wide";
}

// Curated selection of high-quality images for the gallery
const galleryImages: GalleryImage[] = [
  // Reception
  {
    src: "/images/reception/Reception001.jpg",
    category: "reception",
    title: "Grand Reception Lobby",
    description: "Welcome to a world of luxury and dedicated service.",
    size: "wide",
  },
  {
    src: "/images/reception/Reception003.jpg",
    category: "reception",
    title: "Lobby Seating Area",
    description: "Elegant and comfortable waiting lounge for our guests.",
    size: "square",
  },
  {
    src: "/images/reception/Reception005.jpg",
    category: "reception",
    title: "Reception Concierge",
    description: "Our professional hosts available 24/7.",
    size: "tall",
  },

  // Rooms
  {
    src: "/images/suite/SR001.jpg",
    category: "rooms",
    title: "Royal Suite Living Room",
    description: "Spacious luxury with premium furnishings and ambient lighting.",
    size: "wide",
  },
  {
    src: "/images/suite/SR002.jpg",
    category: "rooms",
    title: "Royal Suite Master Bedroom",
    description: "Pocket spring king bed with exquisite fine linen.",
    size: "tall",
  },
  {
    src: "/images/executive/Room-001.jpg",
    category: "rooms",
    title: "Executive Suite",
    description: "Tailored for the modern corporate traveler.",
    size: "square",
  },
  {
    src: "/images/deluxe/Delux001.jpg",
    category: "rooms",
    title: "Deluxe Twin Room",
    description: "Comfort and sophistication combined in a serene space.",
    size: "square",
  },
  {
    src: "/images/suite/SR005.jpg",
    category: "rooms",
    title: "Royal Suite Lounge",
    description: "An elegant space to entertain guests or unwind.",
    size: "wide",
  },

  // Restaurant
  {
    src: "/images/restaurant/R001.jpg",
    category: "restaurant",
    title: "The Regent Dining Room",
    description: "Fine dining ambiance with international and local cuisines.",
    size: "wide",
  },
  {
    src: "/images/restaurant/R004.jpg",
    category: "restaurant",
    title: "Culinary Masterpieces",
    description: "Expertly crafted gourmet cuisines by our signature chefs.",
    size: "square",
  },
  {
    src: "/images/restaurant/R005.jpg",
    category: "restaurant",
    title: "Exquisite Table Settings",
    description: "Attention to every detail for a memorable dining experience.",
    size: "tall",
  },

  // Parlour / Salon
  {
    src: "/images/parlour/BP001.jpg",
    category: "services",
    title: "Rajhans Ladies Beauty Parlour",
    description: "Premium beauty treatments and styling in a serene setting.",
    size: "tall",
  },
  {
    src: "/images/parlour/BP006.jpg",
    category: "services",
    title: "Grooming & Styling Station",
    description: "State-of-the-art facilities for hair care and styling.",
    size: "wide",
  },
  {
    src: "/images/parlour/BP008.jpg",
    category: "services",
    title: "Manicure & Treatment Suite",
    description: "Dedicated pampering and therapy services.",
    size: "square",
  },

  // Ice Cream Parlour
  {
    src: "/images/ice-cream/ICP001.jpg",
    category: "icecream",
    title: "The Ice Cream Parlour",
    description: "Delightful dessert destination for families and guests.",
    size: "wide",
  },
  {
    src: "/images/ice-cream/ICP004.jpg",
    category: "icecream",
    title: "Artisanal Ice Creams",
    description: "Vibrant flavors and delicious sundaes crafted daily.",
    size: "square",
  },

  // Dormitory
  {
    src: "/images/dormitory/DM001.jpg",
    category: "dormitory",
    title: "Imperial Dormitory Hall",
    description: "High-end corporate group accommodations.",
    size: "wide",
  },
  {
    src: "/images/dormitory/DM004.jpg",
    category: "dormitory",
    title: "Personal Storage & Lockers",
    description: "Safe and spacious storage for group travel needs.",
    size: "tall",
  },
  {
    src: "/images/dormitory/DM005.jpg",
    category: "dormitory",
    title: "Clean Grooming Lavatories",
    description: "Pristine, hygienic washrooms for group sections.",
    size: "square",
  },
];

const categories = [
  { id: "all", label: "All Works" },
  { id: "reception", label: "Lobby & Lobby" },
  { id: "rooms", label: "Rooms & Suites" },
  { id: "restaurant", label: "Dining" },
  { id: "services", label: "Wellness & Saloon" },
  { id: "icecream", label: "Ice Cream Parlour" },
  { id: "dormitory", label: "Dormitory" },
] as const;

export default function ImageGallery() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages = galleryImages.filter(
    (img) => activeFilter === "all" || img.category === activeFilter
  );

  const openLightbox = (src: string) => {
    const index = filteredImages.findIndex((img) => img.src === src);
    if (index !== -1) setLightboxIndex(index);
  };

  const closeLightbox = () => setLightboxIndex(null);

  const navigateLightbox = (direction: "prev" | "next") => {
    if (lightboxIndex === null) return;
    let newIndex = direction === "prev" ? lightboxIndex - 1 : lightboxIndex + 1;
    if (newIndex < 0) newIndex = filteredImages.length - 1;
    if (newIndex >= filteredImages.length) newIndex = 0;
    setLightboxIndex(newIndex);
  };

  return (
    <div className="space-y-12">
      {/* Elegant Categories Selector */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 border-b border-gold-400/10 pb-6 max-w-4xl mx-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveFilter(cat.id)}
            className={`relative px-4 py-2 text-xs uppercase tracking-widest transition-all duration-300 rounded-full cursor-pointer ${
              activeFilter === cat.id
                ? "text-charcoal-950 font-medium"
                : "text-gold-200/60 hover:text-gold-300"
            }`}
          >
            {activeFilter === cat.id && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute inset-0 bg-gold-400 rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]"
      >
        <AnimatePresence mode="popLayout">
          {filteredImages.map((img) => (
            <motion.div
              key={img.src}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              onClick={() => openLightbox(img.src)}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer border border-gold-400/10 ${
                img.size === "tall"
                  ? "row-span-2"
                  : img.size === "wide"
                  ? "col-span-1 sm:col-span-2"
                  : "col-span-1"
              }`}
            >
              <Image
                src={img.src}
                alt={img.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />

              {/* Gold Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

              {/* Reveal details on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 flex flex-col justify-end h-1/2">
                <div className="flex items-center justify-between text-gold-300 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                  <span className="text-[10px] uppercase tracking-widest font-mono">
                    {img.category === "reception"
                      ? "Lobby"
                      : img.category === "rooms"
                      ? "Suites"
                      : img.category === "restaurant"
                      ? "Dining"
                      : img.category === "services"
                      ? "Wellness"
                      : img.category === "icecream"
                      ? "Desserts"
                      : "Dormitory"}
                  </span>
                  <Maximize2 className="h-4 w-4" />
                </div>
                <h4 className="font-serif text-lg text-gold-50 tracking-wide font-medium leading-snug">
                  {img.title}
                </h4>
                <p className="text-gold-200/60 text-xs mt-1.5 line-clamp-2 max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {img.description}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-950/95 backdrop-blur-md p-4">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 text-gold-200/60 hover:text-gold-300 rounded-full hover:bg-white/5 cursor-pointer z-50"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Left Nav */}
            <button
              onClick={() => navigateLightbox("prev")}
              className="absolute left-4 p-3 text-gold-200/60 hover:text-gold-300 hover:bg-white/5 rounded-full cursor-pointer z-40 transition-colors"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            {/* Right Nav */}
            <button
              onClick={() => navigateLightbox("next")}
              className="absolute right-4 p-3 text-gold-200/60 hover:text-gold-300 hover:bg-white/5 rounded-full cursor-pointer z-40 transition-colors"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            {/* Main Lightbox Content */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl w-full h-[70vh] flex flex-col items-center justify-center"
            >
              <div className="relative w-full h-full">
                <Image
                  src={filteredImages[lightboxIndex].src}
                  alt={filteredImages[lightboxIndex].title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                />
              </div>

              {/* Caption */}
              <div className="text-center mt-6 max-w-2xl px-4 space-y-1">
                <p className="text-[10px] text-gold-400 uppercase tracking-widest font-mono">
                  Image {lightboxIndex + 1} of {filteredImages.length}
                </p>
                <h4 className="font-serif text-xl text-gold-100">
                  {filteredImages[lightboxIndex].title}
                </h4>
                <p className="text-gold-200/60 text-sm">
                  {filteredImages[lightboxIndex].description}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
