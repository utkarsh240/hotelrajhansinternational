"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Phone,
  Menu,
  MessageSquare,
  ArrowLeft,
  Maximize2,
  Sparkles,
  Award,
  Clock,
  MapPinHouse,
} from "lucide-react";
import BookingModal from "@/components/BookingModal";

interface GalleryImage {
  src: string;
  category: "rooms" | "restaurant" | "services" | "reception" | "icecream" | "dormitory";
  alt: string;
  size: "square" | "tall" | "wide";
  title?: string;
}

const galleryImages: GalleryImage[] = [
  {
    src: "/images/reception/Reception001.jpg",
    category: "reception",
    alt: "Hotel Lobby & Grand Reception",
    title: "Grand Lobby Lounge",
    size: "wide",
  },
  {
    src: "/images/reception/Reception003.jpg",
    category: "reception",
    alt: "Lobby Seating Area",
    title: "Lobby Seating Area",
    size: "square",
  },
  {
    src: "/images/reception/Reception005.jpg",
    category: "reception",
    alt: "Reception Desk",
    title: "24/7 Front Desk Counter",
    size: "tall",
  },
  {
    src: "/images/suite/SR001.jpg",
    category: "rooms",
    alt: "Royal Suite Living Room",
    title: "Royal Suite Master Living Area",
    size: "wide",
  },
  {
    src: "/images/suite/SR002.jpg",
    category: "rooms",
    alt: "Royal Suite Bedroom",
    title: "Royal Suite Luxury Bedroom",
    size: "tall",
  },
  {
    src: "/images/executive/Room-001.jpg",
    category: "rooms",
    alt: "Executive Room",
    title: "Executive Room Suite",
    size: "square",
  },
  {
    src: "/images/deluxe/Delux001.jpg",
    category: "rooms",
    alt: "Deluxe Room",
    title: "Deluxe Family Room",
    size: "square",
  },
  {
    src: "/images/suite/SR005.jpg",
    category: "rooms",
    alt: "Royal Suite Lounge",
    title: "Royal Suite Private Lounge",
    size: "wide",
  },
  {
    src: "/images/restaurant/R001.jpg",
    category: "restaurant",
    alt: "Takshshila Restaurant Dining",
    title: "Takshshila Fine Dining Hall",
    size: "wide",
  },
  {
    src: "/images/restaurant/R004.jpg",
    category: "restaurant",
    alt: "Takshshila Restaurant Buffet",
    title: "Buffet & Private Dining Tables",
    size: "square",
  },
  {
    src: "/images/restaurant/R005.jpg",
    category: "restaurant",
    alt: "Takshshila Restaurant Interior",
    title: "Restaurant Seating & Ambience",
    size: "tall",
  },
  {
    src: "/images/parlour/BP001.jpg",
    category: "services",
    alt: "Beauty Parlour & Saloon",
    title: "In-House Beauty Parlour",
    size: "tall",
  },
  {
    src: "/images/parlour/BP008.jpg",
    category: "services",
    alt: "Beauty Parlour Styling Chairs",
    title: "Saloon & Styling Station",
    size: "square",
  },
  {
    src: "/images/ice-cream/ICP001.jpg",
    category: "icecream",
    alt: "Ice Cream Parlour Counter",
    title: "Fresh Ice Cream Parlour Counter",
    size: "wide",
  },
  {
    src: "/images/ice-cream/ICP004.jpg",
    category: "icecream",
    alt: "Ice Cream Display",
    title: "Sundae & Frozen Dessert Station",
    size: "square",
  },
  {
    src: "/images/dormitory/DM001.jpg",
    category: "dormitory",
    alt: "Dormitory Hall",
    title: "Spacious Group Dormitory Hall",
    size: "wide",
  },
  {
    src: "/images/dormitory/DM004.jpg",
    category: "dormitory",
    alt: "Dormitory Lockers & Beds",
    title: "Secure Dormitory Beds & Storage",
    size: "tall",
  },
];

const categories = [
  { id: "all", label: "All Photos" },
  { id: "reception", label: "Lobby & Reception" },
  { id: "rooms", label: "Suites & Rooms" },
  { id: "restaurant", label: "Takshshila Restaurant" },
  { id: "services", label: "Beauty Parlour & Saloon" },
  { id: "icecream", label: "Ice Cream Parlour" },
  { id: "dormitory", label: "Group Dormitory" },
] as const;

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cmsSettings, setCmsSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/cms", { cache: "no-store", headers: { "Cache-Control": "no-cache" } })
      .then((res) => res.json())
      .then((d) => {
        if (d.success && d.settings) setCmsSettings(d.settings);
      })
      .catch(console.error);
  }, []);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigateLightbox("prev");
      if (e.key === "ArrowRight") navigateLightbox("next");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredImages]);

  return (
    <div className="min-h-screen bg-cream text-brown-900 font-sans selection:bg-gold-400 selection:text-brown-900">
      {/* 1. Header Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-cream/95 backdrop-blur-md border-b border-gold-400/20 shadow-sm transition-all duration-300 py-4">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex flex-col group">
            <span className="font-serif text-lg md:text-xl text-gold-300 tracking-[0.2em] font-medium uppercase leading-tight group-hover:text-gold-400 transition-colors">
              {cmsSettings.hotel_name ? cmsSettings.hotel_name.split(" ")[1] || "Rajhans" : "Rajhans"}
            </span>
            <span className="text-[8px] md:text-[9px] text-gold-200/60 tracking-[0.25em] uppercase font-sans">
              International
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/#about" className="text-xs uppercase tracking-widest text-gold-100 hover:text-gold-300 transition-colors font-medium">About</Link>
            <Link href="/#rooms" className="text-xs uppercase tracking-widest text-gold-100 hover:text-gold-300 transition-colors font-medium">Suites</Link>
            <Link href="/#services" className="text-xs uppercase tracking-widest text-gold-100 hover:text-gold-300 transition-colors font-medium">Services</Link>
            <Link href="/gallery" className="text-xs uppercase tracking-widest text-gold-400 font-bold border-b border-gold-400 pb-0.5">Gallery</Link>
            <Link href="/attraction" className="text-xs uppercase tracking-widest text-gold-100 hover:text-gold-300 transition-colors font-medium">Attractions</Link>
            <Link href="/#testimonials" className="text-xs uppercase tracking-widest text-gold-100 hover:text-gold-300 transition-colors font-medium">Reviews</Link>
            <Link href="/#faq" className="text-xs uppercase tracking-widest text-gold-100 hover:text-gold-300 transition-colors font-medium">FAQ</Link>
            <Link href="/#contact" className="text-xs uppercase tracking-widest text-gold-100 hover:text-gold-300 transition-colors font-medium">Contact</Link>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${cmsSettings.phone_primary || "+919308189201"}`}
              className="text-gold-200/80 hover:text-gold-300 p-2 border border-gold-400/10 rounded-full hover:bg-brown-900/5 transition-all text-xs flex items-center gap-2"
              aria-label="Call hotel"
            >
              <Phone className="h-4 w-4 text-gold-400" />
              <span className="hidden sm:inline font-mono text-[10px] tracking-wider">{cmsSettings.phone_primary || "+91 93081 89201"}</span>
            </a>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="hidden sm:block bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-700 hover:to-gold-500 text-brown-900 font-medium uppercase tracking-widest text-[10px] py-2.5 px-5 rounded-full transition-all duration-300 shadow-md shadow-gold-400/10 active:scale-95 cursor-pointer"
            >
              Book Stay
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gold-200 hover:text-gold-300 transition-colors rounded-full hover:bg-brown-900/5 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 bg-cream/95 backdrop-blur-lg pt-24 px-6 pb-8 flex flex-col justify-between"
          >
            <div className="flex flex-col gap-6 text-center pt-8">
              {[
                { label: "About", href: "/#about" },
                { label: "Suites", href: "/#rooms" },
                { label: "Services", href: "/#services" },
                { label: "Gallery", href: "/gallery" },
                { label: "Attractions", href: "/attraction" },
                { label: "Reviews", href: "/#testimonials" },
                { label: "FAQ", href: "/#faq" },
                { label: "Contact", href: "/#contact" }
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-serif text-lg text-brown-900 hover:text-gold-400 transition-colors tracking-wider"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-6 border-t border-gold-400/20 text-center space-y-4">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsBookingOpen(true);
                }}
                className="w-full bg-gold-400 text-brown-900 font-bold uppercase tracking-widest text-xs py-3 rounded-full shadow-lg"
              >
                Book Your Stay Now
              </button>
              <p className="text-[10px] text-gold-200/60 uppercase tracking-widest font-mono">
                MG Road, Kachari Chowk, Bhagalpur
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Hero Header Banner */}
      <div className="pt-32 pb-16 bg-gradient-to-b from-cream-soft via-cream to-cream border-b border-gold-400/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/20 text-[10px] uppercase tracking-widest text-gold-400 font-mono">
            <Sparkles className="h-3 w-3" />
            <span>Virtual Tour & Property Album</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-brown-900 font-bold tracking-tight">
            Photo Gallery
          </h1>
          <p className="text-sm md:text-base text-brown-800/80 max-w-2xl mx-auto font-light leading-relaxed">
            Take a visual tour through our luxury accommodation suites, fine dining halls, grand reception, in-house beauty parlour, ice cream parlour, and dormitory spaces.
          </p>

          <div className="pt-4 flex items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-200/80 hover:text-gold-400 font-mono transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Homepage</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Gallery Grid Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 border-b border-gold-400/10 pb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`relative px-4 py-2 text-xs uppercase tracking-widest transition-all duration-300 rounded-full cursor-pointer ${
                activeFilter === cat.id
                  ? "text-brown-900 font-semibold"
                  : "text-gold-200/60 hover:text-gold-300"
              }`}
            >
              {activeFilter === cat.id && (
                <motion.div
                  layoutId="galleryTabIndicator"
                  className="absolute inset-0 bg-gold-400 rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[280px]"
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
                className={`group relative overflow-hidden rounded-2xl cursor-pointer border border-gold-400/20 bg-cream-soft shadow-md hover:shadow-2xl transition-all duration-500 ${
                  img.size === "tall"
                    ? "row-span-2"
                    : img.size === "wide"
                    ? "col-span-1 sm:col-span-2"
                    : "col-span-1"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-brown-950/80 via-brown-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="flex items-center justify-between text-cream">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-gold-400 font-bold block">
                        {img.category}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-white drop-shadow">
                        {img.title || img.alt}
                      </h3>
                    </div>
                    <div className="p-2.5 rounded-full bg-gold-400/20 border border-gold-400/40 text-gold-300 backdrop-blur-sm">
                      <Maximize2 className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* 4. Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-brown-950/95 backdrop-blur-xl p-4 sm:p-8">
            {/* Top Bar */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-cream z-50 px-2">
              <div className="text-xs font-mono tracking-widest text-gold-400">
                Image {lightboxIndex + 1} of {filteredImages.length}
              </div>

              <button
                onClick={closeLightbox}
                className="p-2.5 text-gold-200/80 hover:text-gold-300 rounded-full hover:bg-gold-400/10 cursor-pointer transition-colors"
                aria-label="Close Lightbox"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Left Nav */}
            <button
              onClick={() => navigateLightbox("prev")}
              className="absolute left-4 sm:left-8 p-3 text-gold-200/80 hover:text-gold-300 hover:bg-gold-400/10 rounded-full cursor-pointer z-50 transition-all border border-gold-400/20 bg-brown-900/40 backdrop-blur-sm"
              aria-label="Previous Image"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            {/* Right Nav */}
            <button
              onClick={() => navigateLightbox("next")}
              className="absolute right-4 sm:right-8 p-3 text-gold-200/80 hover:text-gold-300 hover:bg-gold-400/10 rounded-full cursor-pointer z-50 transition-all border border-gold-400/20 bg-brown-900/40 backdrop-blur-sm"
              aria-label="Next Image"
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
              className="relative max-w-6xl w-full h-[75vh] flex flex-col items-center justify-center space-y-4"
            >
              <div className="relative w-full h-full">
                <Image
                  src={filteredImages[lightboxIndex].src}
                  alt={filteredImages[lightboxIndex].alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                />
              </div>

              {/* Caption */}
              <div className="text-center space-y-1">
                <h4 className="font-serif text-lg text-cream font-bold">
                  {filteredImages[lightboxIndex].title || filteredImages[lightboxIndex].alt}
                </h4>
                <p className="text-xs font-mono uppercase tracking-widest text-gold-400">
                  {filteredImages[lightboxIndex].category} Collection
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Elegant Footer */}
      <footer className="bg-cream border-t border-gold-400/10 text-gold-200/60 text-xs py-12 md:py-16 mt-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Certifications */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <h3 className="font-serif text-lg text-gold-300 font-medium uppercase tracking-[0.2em] leading-none">
              {cmsSettings.hotel_name || "Hotel Rajhans International"}
            </h3>
            <p className="text-gold-200/50 max-w-sm text-xs leading-relaxed font-normal">
              A unit of <span className="text-gold-100 font-medium">{cmsSettings.company_name || "Takshshila Regency Pvt. Ltd."}</span> · {cmsSettings.address_full || "Kachari Chowk, MG Road, Bhagalpur"}.
            </p>
            <div className="flex gap-4 pt-2">
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-gold-300 font-semibold font-mono border border-gold-400/10 bg-brown-900/5 py-1 px-3 rounded">
                <Award className="h-3 w-3 text-gold-400" /> ISO 9001:2015
              </span>
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-gold-300 font-semibold font-mono border border-gold-400/10 bg-brown-900/5 py-1 px-3 rounded">
                <Clock className="h-3 w-3 text-gold-400" /> Est. 1986
              </span>
            </div>
          </div>

          {/* Quick Sitemap Links */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-gold-100 font-bold font-sans">
              Sitemap
            </h4>
            <ul className="space-y-2 font-normal">
              <li><Link href="/#about" className="hover:text-gold-300 transition-colors">About</Link></li>
              <li><Link href="/#rooms" className="hover:text-gold-300 transition-colors">Rooms</Link></li>
              <li><Link href="/#services" className="hover:text-gold-300 transition-colors">Services</Link></li>
              <li><Link href="/gallery" className="hover:text-gold-300 transition-colors">Gallery</Link></li>
              <li><Link href="/attraction" className="hover:text-gold-300 transition-colors">Tourist Attractions</Link></li>
              <li><Link href="/#faq" className="hover:text-gold-300 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Summary */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-gold-100 font-bold font-sans">
              Address & Contact
            </h4>
            <p className="text-xs leading-relaxed font-normal">
              {cmsSettings.address_full || "Kachari Chowk, MG Road, Bhagalpur, Bihar 812001"}
            </p>
            <p className="font-mono text-xs">
              P: {cmsSettings.phone_primary || "+91 93081 89201"}<br />
              WA: <a href="https://wa.me/919308189201?text=Hello%20Hotel%20Rajhans%20International" target="_blank" rel="noopener noreferrer" className="hover:text-gold-300 text-emerald-400">+91 93081 89201</a><br />
              E: <a href={`mailto:${cmsSettings.email_official || "info@hotelrajhansinternational.com"}`} className="hover:text-gold-300">{cmsSettings.email_official || "info@hotelrajhansinternational.com"}</a>
            </p>
          </div>
        </div>

        {/* Bottom Credits Bar */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-gold-400/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gold-200/30 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Hotel Rajhans International. All Rights Reserved.</p>
          <p className="flex items-center gap-1.5">
            <MapPinHouse className="h-3 w-3 text-gold-400/50" /> A Unit of {cmsSettings.company_name || "Takshshila Regency Pvt. Ltd."}
          </p>
        </div>
      </footer>

      {/* WhatsApp Fixed Button */}
      <a
        href="https://wa.me/919308189201"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center group border border-emerald-400/40 cursor-pointer"
        aria-label="Chat on WhatsApp"
      >
        <MessageSquare className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
      </a>

      {/* Booking Modal */}
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
}
