"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Compass,
  Car,
  ExternalLink,
  Phone,
  Sparkles,
  Landmark,
  Trees,
  Milestone,
  ArrowLeft,
  Menu,
  X,
  Clock,
  Navigation,
  Award,
  MapPinHouse,
} from "lucide-react";
import BookingModal from "@/components/BookingModal";

export interface TouristAttraction {
  id: string;
  name: string;
  category: "heritage" | "nature" | "mythology" | "sacred";
  categoryLabel: string;
  categoryColor: string;
  distanceText: string;
  travelTime: string;
  highlights: string;
  description: string;
  imageSrc: string;
  mapsUrl: string;
  icon: any;
}

const ATTRACTIONS: TouristAttraction[] = [
  {
    id: "vikramshila-university",
    name: "Vikramshila Ancient University Ruins",
    category: "heritage",
    categoryLabel: "Ancient Heritage",
    categoryColor: "bg-amber-500/10 text-amber-300 border-amber-500/25",
    distanceText: "44 km from Hotel",
    travelTime: "~55 mins drive",
    highlights: "8th Century Pala Empire Buddhist Monastery & Learning Center",
    description:
      "Founded by King Dharmapala, Vikramshila was one of the two premier Buddhist universities of ancient India alongside Nalanda. Explore the magnificent central stupa, monastery cells, and archaeological museum containing rare stone statues and terracotta plaques.",
    imageSrc: "/images/attractions/vikramshila.jpg",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Vikramshila+Ancient+University+Ruins+Kahalgaon+Bhagalpur",
    icon: Landmark,
  },
  {
    id: "dolphin-sanctuary",
    name: "Vikramshila Gangetic Dolphin Sanctuary",
    category: "nature",
    categoryLabel: "Nature & Wildlife",
    categoryColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
    distanceText: "15 km from Hotel",
    travelTime: "~20 mins drive",
    highlights: "India's Only Protected Gangetic River Dolphin Reserve",
    description:
      "Spanning 60 km along the Ganges River, this sanctuary protects the endangered freshwater Gangetic Dolphin (Platanista gangetica), river turtles, and migratory waterfowl. Guided riverboat tours can be arranged at local ghats for wildlife sighting.",
    imageSrc: "/images/attractions/dolphin_sanctuary.jpg",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Vikramshila+Gangetic+Dolphin+Sanctuary+Bhagalpur",
    icon: Trees,
  },
  {
    id: "mandar-hill",
    name: "Historic Mandar Hill (Mandar Parvat)",
    category: "mythology",
    categoryLabel: "Mythology & Pilgrimage",
    categoryColor: "bg-purple-500/10 text-purple-300 border-purple-500/25",
    distanceText: "48 km from Hotel",
    travelTime: "~1 hr 10 mins drive",
    highlights: "Mythological Samudra Manthan Site & Jain Tirthankara Shrine",
    description:
      "Celebrated in Hindu epics as the churning rod used during Samudra Manthan (ocean churning). Features a scenic ropeway cable car, the sacred Papaharini Lake, ancient rock carvings, and the holy 12th Jain Tirthankara Lord Vasupujya shrine at the summit.",
    imageSrc: "/images/attractions/mandar_hill.jpg",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Mandar+Hill+Banka+Bhagalpur",
    icon: Milestone,
  },
  {
    id: "ajgaivinath-temple",
    name: "Sacred Ajgaivinath Temple, Sultanganj",
    category: "sacred",
    categoryLabel: "Sacred Pilgrimage",
    categoryColor: "bg-gold-400/10 text-gold-300 border-gold-400/25",
    distanceText: "28 km from Hotel",
    travelTime: "~40 mins drive",
    highlights: "Historic Island Shiva Temple on the Holy Ganges",
    description:
      "Perched atop a natural rock island in the flowing Ganges river at Sultanganj. Famous worldwide as the starting point for millions of pilgrims taking Uttarvahini Gangajal during Shravani Mela to Baidyanath Dham (Deoghar).",
    imageSrc: "/images/attractions/ajgaivinath_temple.jpg",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Ajgaivinath+Temple+Sultanganj+Bhagalpur",
    icon: Landmark,
  },
];

const CATEGORIES = [
  { id: "all", label: "All Attractions" },
  { id: "heritage", label: "Ancient Heritage" },
  { id: "nature", label: "Nature & Wildlife" },
  { id: "mythology", label: "Mythology" },
  { id: "sacred", label: "Sacred Pilgrimage" },
];

export default function AttractionPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredAttractions = ATTRACTIONS.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-paper text-gold-100 font-sans selection:bg-gold-400 selection:text-brown-950">
      {/* 1. Header / Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-cream/95 backdrop-blur-md border-b border-gold-400/20 shadow-sm transition-all duration-300 py-4">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex flex-col group">
            <span className="font-serif text-lg md:text-xl text-gold-300 tracking-[0.2em] font-medium uppercase leading-tight group-hover:text-gold-400 transition-colors">
              Rajhans
            </span>
            <span className="text-[8px] md:text-[9px] text-gold-200/60 tracking-[0.25em] uppercase font-sans">
              International
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/#about" className="text-xs uppercase tracking-widest text-gold-100 hover:text-gold-300 transition-colors font-medium">About</Link>
            <Link href="/#rooms" className="text-xs uppercase tracking-widest text-gold-100 hover:text-gold-300 transition-colors font-medium">Suites</Link>
            <Link href="/#services" className="text-xs uppercase tracking-widest text-gold-100 hover:text-gold-300 transition-colors font-medium">Services</Link>
            <Link href="/gallery" className="text-xs uppercase tracking-widest text-gold-100 hover:text-gold-300 transition-colors font-medium">Gallery</Link>
            <Link href="/attraction" className="text-xs uppercase tracking-widest text-gold-400 font-bold border-b border-gold-400 pb-0.5">Attractions</Link>
            <Link href="/#testimonials" className="text-xs uppercase tracking-widest text-gold-100 hover:text-gold-300 transition-colors font-medium">Reviews</Link>
            <Link href="/#faq" className="text-xs uppercase tracking-widest text-gold-100 hover:text-gold-300 transition-colors font-medium">FAQ</Link>
            <Link href="/#contact" className="text-xs uppercase tracking-widest text-gold-100 hover:text-gold-300 transition-colors font-medium">Contact</Link>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-4">
            <a
              href="tel:+919308189201"
              className="text-gold-200/80 hover:text-gold-300 p-2 border border-gold-400/10 rounded-full hover:bg-brown-900/5 transition-all text-xs flex items-center gap-2"
              aria-label="Call hotel"
            >
              <Phone className="h-4 w-4 text-gold-400" />
              <span className="hidden sm:inline font-mono text-[10px] tracking-wider">+91 93081 89201</span>
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

      {/* Mobile Drawer Navigation */}
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
            <div className="pt-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsBookingOpen(true);
                }}
                className="w-full bg-gold-400 text-brown-950 font-bold uppercase tracking-widest py-3 rounded-xl text-xs"
              >
                Book Your Stay
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Hero Header Banner */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-brown-950 via-paper to-paper border-b border-gold-400/15">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(197,160,89,0.08),transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-6 text-center">
          <div className="inline-flex items-center gap-2 bg-gold-400/10 border border-gold-400/25 px-4 py-1.5 rounded-full text-gold-300 text-xs font-mono uppercase tracking-widest">
            <Compass className="h-4 w-4 text-gold-400" />
            <span>Bhagalpur Tourism Guide</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-gold-50 font-normal tracking-wide max-w-4xl mx-auto leading-tight">
            Tourist Attractions & Sightseeing Excursions
          </h1>

          <p className="text-gold-200/70 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-light">
            Hotel Rajhans International is located centrally at Kachari Chowk, MG Road, Bhagalpur — giving you seamless access to 8th-century Pala Empire Buddhist ruins, Gangetic Dolphin river reserves, and holy island temples.
          </p>

          <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
            <a
              href="#attractions-list"
              className="bg-gold-400 hover:bg-gold-500 text-brown-950 font-semibold text-xs uppercase tracking-widest px-6 py-3 rounded-full transition-all flex items-center gap-2 shadow-lg"
            >
              <span>Explore Places Below</span>
              <Navigation className="h-4 w-4" />
            </a>
            <a
              href="https://wa.me/919308189201?text=Hello%2C%20I%20am%20planning%20a%20stay%20at%20Hotel%20Rajhans%20International%20and%20would%20like%20information%20about%20tourist%20cabs%2Fsightseeing."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brown-900/60 hover:bg-brown-900 border border-gold-400/30 text-gold-200 text-xs uppercase tracking-widest px-6 py-3 rounded-full transition-all flex items-center gap-2"
            >
              <span>Inquire Sightseeing Cab</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3. Category Filter Tabs */}
      <section id="attractions-list" className="py-12 bg-cream/20 border-b border-gold-400/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-5 py-2.5 text-xs uppercase tracking-widest transition-all duration-300 rounded-full cursor-pointer ${
                  activeCategory === cat.id
                    ? "text-brown-950 font-semibold"
                    : "text-gold-200/70 hover:text-gold-300 bg-brown-950/40 border border-gold-400/10"
                }`}
              >
                {activeCategory === cat.id && (
                  <motion.div
                    layoutId="activeTabIndicatorAttraction"
                    className="absolute inset-0 bg-gold-400 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            ))}
          </div>

          {/* 4. Attractions Grid */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            <AnimatePresence mode="popLayout">
              {filteredAttractions.map((spot) => {
                const Icon = spot.icon || Compass;
                return (
                  <motion.div
                    key={spot.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="group rounded-2xl bg-paper/90 border border-gold-400/20 overflow-hidden shadow-2xl hover:border-gold-400/40 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Image Header with Badges */}
                    <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                      <Image
                        src={spot.imageSrc}
                        alt={spot.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.9] group-hover:brightness-100"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/20 to-transparent" />

                      {/* Top Category Badge */}
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span
                          className={`text-[10px] uppercase tracking-wider font-mono px-3.5 py-1 rounded-full border backdrop-blur-md font-semibold ${spot.categoryColor}`}
                        >
                          {spot.categoryLabel}
                        </span>
                      </div>

                      {/* Distance & Travel Time Badges */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-gold-100 font-mono">
                        <span className="flex items-center gap-1.5 bg-paper/95 backdrop-blur-md border border-gold-400/30 px-3 py-1 rounded-lg shadow">
                          <MapPin className="h-3.5 w-3.5 text-gold-400" /> {spot.distanceText}
                        </span>
                        <span className="flex items-center gap-1.5 bg-paper/95 backdrop-blur-md border border-gold-400/30 px-3 py-1 rounded-lg shadow text-gold-300">
                          <Car className="h-3.5 w-3.5 text-gold-400" /> {spot.travelTime}
                        </span>
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-6 sm:p-8 space-y-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <h2 className="font-serif text-2xl sm:text-3xl text-gold-100 font-medium group-hover:text-gold-300 transition-colors">
                            {spot.name}
                          </h2>
                          <div className="p-2 rounded-xl bg-gold-400/10 border border-gold-400/20 text-gold-400 shrink-0">
                            <Icon className="h-5 w-5" />
                          </div>
                        </div>

                        <p className="text-xs text-gold-300/90 font-medium tracking-wide flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-gold-400 shrink-0" />
                          {spot.highlights}
                        </p>

                        <p className="text-xs sm:text-sm text-gold-200/70 leading-relaxed font-light pt-1">
                          {spot.description}
                        </p>
                      </div>

                      {/* Action Links */}
                      <div className="pt-4 border-t border-gold-400/15 flex items-center justify-between">
                        <a
                          href={spot.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors uppercase tracking-wider font-sans group/link"
                        >
                          <span>Directions on Google Maps</span>
                          <ExternalLink className="h-3.5 w-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* 5. Concierge & Travel Assistance Banner */}
      <section className="py-16 bg-cream/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-cream-soft via-cream to-cream-soft border border-gold-400/30 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="space-y-3 text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 text-gold-300 font-mono text-xs uppercase tracking-widest bg-brown-950/90 border border-gold-400/30 px-4 py-1.5 rounded-full shadow-md font-semibold">
                <Car className="h-4 w-4 text-gold-400" /> 24/7 Front Desk Travel Desk
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-brown-950 font-semibold">
                Need Sightseeing Taxis or Local Travel Guidance?
              </h3>
              <p className="text-xs sm:text-sm text-brown-800/80 leading-relaxed font-normal">
                Our 24-hour reception desk arranges private air-conditioned cars, station pickups, and experienced local guides for Kahalgaon, Sultanganj, Mandar Hill, and Ganges riverboat tours.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
              <a
                href="tel:+919308189201"
                className="bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-700 hover:to-gold-500 text-brown-950 font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-full transition-all flex items-center gap-2.5 shadow-md"
              >
                <Phone className="h-4 w-4" /> Call Front Desk
              </a>
              <a
                href="https://wa.me/919308189201?text=Hello%2C%20I%20am%20staying%20at%20Hotel%20Rajhans%20International%20and%20would%20like%20to%20inquire%20about%20a%20tourist%20cab%2Fsightseeing."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-full transition-all flex items-center gap-2.5 shadow-md"
              >
                WhatsApp Assistance
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Elegant Footer */}
      <footer className="bg-cream border-t border-gold-400/10 text-gold-200/60 text-xs py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Certifications */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <h3 className="font-serif text-lg text-gold-300 font-medium uppercase tracking-[0.2em] leading-none">
              Hotel Rajhans International
            </h3>
            <p className="text-gold-200/50 max-w-sm text-xs leading-relaxed font-normal">
              A unit of <span className="text-gold-100 font-medium">Takshshila Regency Pvt. Ltd.</span> · Kachari Chowk, MG Road, Bhagalpur, Bihar – 812001, India.
            </p>
            <div className="flex gap-4 pt-2">
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-gold-300 font-semibold font-mono border border-gold-400/10 bg-brown-900/5 py-1 px-3 rounded">
                <Award className="h-3 w-3 text-gold-400" /> ISO 9001:2015
              </span>
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-gold-300 font-semibold font-mono border border-gold-400/10 bg-brown-900/5 py-1 px-3 rounded">
                <Clock className="h-3 w-3 text-gold-400" /> Est. 2018
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
              Kachari Chowk, MG Road, Bhagalpur, Bihar 812001, India
            </p>
            <p className="font-mono text-xs">
              P: +91 93081 89201<br />
              WA: <a href="https://wa.me/919308189201?text=Hello%20Hotel%20Rajhans%20International" target="_blank" rel="noopener noreferrer" className="hover:text-gold-300 text-emerald-400">+91 93081 89201</a><br />
              E: <a href="mailto:info@hotelrajhansinternational.com" className="hover:text-gold-300">info@hotelrajhansinternational.com</a>
            </p>
          </div>
        </div>

        {/* Bottom Credits Bar */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-gold-400/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gold-200/30 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Hotel Rajhans International. All Rights Reserved.</p>
          <p className="flex items-center gap-1.5">
            <MapPinHouse className="h-3 w-3 text-gold-400/50" /> A Unit of Takshshila Regency Pvt. Ltd.
          </p>
        </div>
      </footer>

      {/* 7. Floating WhatsApp Action Button */}
      <a
        href="https://wa.me/919308189201?text=Hello%20Hotel%20Rajhans%20International%2C%20I%20would%20like%20to%20inquire%20about%20tourist%20attractions%20and%20cabs."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-2xl shadow-emerald-950/40 hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-110 active:scale-95 border border-emerald-400/40 cursor-pointer"
        aria-label="Chat with us on WhatsApp"
      >
        <svg className="w-8 h-8 fill-current text-white" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M18.403 5.633A8.919 8.919 0 0 0 12.053 3c-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.127 1.2 4.488L3 21l4.604-1.208a8.947 8.947 0 0 0 4.447 1.185h.004c4.947 0 8.975-4.027 8.977-8.977a8.922 8.922 0 0 0-2.629-6.367zM12.053 19.444h-.003a7.453 7.453 0 0 1-3.799-1.042l-.272-.162-2.824.741.753-2.753-.177-.282a7.457 7.457 0 0 1-1.144-4.01c.002-4.114 3.35-7.461 7.466-7.461a7.417 7.417 0 0 1 5.275 2.187 7.42 7.42 0 0 1 2.183 5.277c-.002 4.114-3.35 7.462-7.458 7.462zm4.091-5.584c-.225-.113-1.327-.655-1.533-.73-.205-.075-.354-.112-.504.112-.15.224-.58.73-.711.879-.13.15-.262.168-.486.056-.225-.113-.949-.349-1.808-1.115-.668-.596-1.119-1.332-1.25-1.557-.13-.225-.014-.347.099-.459.102-.101.225-.262.337-.393.113-.131.15-.225.225-.375.075-.15.038-.281-.019-.394-.056-.112-.504-1.216-.69-1.666-.182-.439-.367-.379-.504-.386l-.43-.008c-.15 0-.393.056-.599.281-.206.225-.786.768-.786 1.873 0 1.104.804 2.17 0.916 2.32.113.15 1.582 2.416 3.833 3.387.536.231.954.369 1.28.473.538.171 1.027.147 1.414.089.431-.065 1.327-.542 1.514-1.066.187-.524.187-.973.131-1.067-.056-.093-.206-.15-.431-.262z" />
        </svg>
      </a>

      {/* Booking Modal */}
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
}
