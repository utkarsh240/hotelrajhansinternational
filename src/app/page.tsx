"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Compass,
  ChevronDown,
  Award,
  ShieldCheck,
  Check,
  Star,
  Quote,
  Clock,
  Sparkles,
  Scissors,
  Coffee,
  Utensils,
  MapPinHouse,
  Menu,
  X
} from "lucide-react";
import BookingModal from "@/components/BookingModal";
import ImageGallery from "@/components/ImageGallery";
// Hero Slideshow images (reception, suite, restaurant)
const heroSlides = [
  {
    src: "/ranjhans/images/reception/Reception001.jpg",
    title: "Hotel Rajhans International",
    subtitle: "On MG Road, Kachari Chowk — rooms, dining, and parking on-site.",
  },
  {
    src: "/ranjhans/images/suite/SR001.jpg",
    title: "Rooms & Suites",
    subtitle: "Executive, Deluxe, and Royal Suite options for business and family stays.",
  },
  {
    src: "/ranjhans/images/restaurant/R001.jpg",
    title: "Takshshila Restaurant",
    subtitle: "Indian, Chinese, and continental food without leaving the hotel.",
  },
];

const todayIso = new Date().toISOString().split("T")[0];
const tomorrowIso = new Date(Date.now() + 86400000).toISOString().split("T")[0];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedRoomCategory, setSelectedRoomCategory] = useState("executive");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Quick contact form states
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSuccess, setContactSuccess] = useState(false);

  // Hero Carousel auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Navbar scroll background change
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsNavbarScrolled(true);
      } else {
        setIsNavbarScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openBooking = (category: string) => {
    setSelectedRoomCategory(category);
    setIsBookingOpen(true);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => {
      setContactForm({ name: "", email: "", message: "" });
      setContactSuccess(false);
    }, 3000);
  };

  const faqs = [
    {
      question: "Food & dining",
      answer: "Takshshila Restaurant serves Indian, Chinese, and continental dishes. Room service runs 24 hours. Ice & Spice is the in-house ice cream parlour.",
    },
    {
      question: "Parking",
      answer: "Free parking on-site, monitored around the clock.",
    },
    {
      question: "Railway station pickup",
      answer: "Pickup and drop can be arranged on request. Bhagalpur Railway Station is about 1.5 km away.",
    },
    {
      question: "Location",
      answer: "Kachari Chowk, MG Road — near markets, district courts, banks, and government offices.",
    },
    {
      question: "Pets",
      answer: "Pets are not allowed. Call ahead if you are travelling with a service animal.",
    },
    {
      question: "WiFi & business needs",
      answer: "WiFi in all rooms. Printing and scanning available at the front desk.",
    },
  ];

  return (
    <>
      {/* 1. Transparent Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 py-4 ${isNavbarScrolled ? "glass-nav shadow-lg" : "bg-gradient-to-b from-cream-soft/95 to-cream-soft/20"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <a href="#hero" className="flex flex-col">
            <span className="font-serif text-lg md:text-xl text-gold-300 tracking-[0.2em] font-medium uppercase leading-tight">
              Rajhans
            </span>
            <span className="text-[8px] md:text-[9px] text-gold-200/60 tracking-[0.25em] uppercase font-sans">
              International
            </span>
          </a>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="#about" className="text-xs uppercase tracking-widest text-gold-100 hover:text-gold-300 transition-colors font-medium">About</a>
            <a href="#rooms" className="text-xs uppercase tracking-widest text-gold-100 hover:text-gold-300 transition-colors font-medium">Suites</a>
            <a href="#services" className="text-xs uppercase tracking-widest text-gold-100 hover:text-gold-300 transition-colors font-medium">Services</a>
            <a href="#gallery" className="text-xs uppercase tracking-widest text-gold-100 hover:text-gold-300 transition-colors font-medium">Gallery</a>
            <a href="#testimonials" className="text-xs uppercase tracking-widest text-gold-100 hover:text-gold-300 transition-colors font-medium">Reviews</a>
            <a href="#faq" className="text-xs uppercase tracking-widest text-gold-100 hover:text-gold-300 transition-colors font-medium">FAQ</a>
            <a href="#contact" className="text-xs uppercase tracking-widest text-gold-100 hover:text-gold-300 transition-colors font-medium">Contact</a>
          </div>

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
              onClick={() => openBooking("executive")}
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
                { label: "About", href: "#about" },
                { label: "Rooms", href: "#rooms" },
                { label: "Services", href: "#services" },
                { label: "Gallery", href: "#gallery" },
                { label: "Reviews", href: "#testimonials" },
                { label: "FAQ", href: "#faq" },
                { label: "Contact", href: "#contact" }
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-serif text-xl tracking-widest text-gold-100 hover:text-gold-300 transition-colors uppercase py-2"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex flex-col items-center gap-4 border-t border-gold-400/10 pt-8">
              <a
                href="tel:+919308189201"
                className="flex items-center gap-2 text-gold-300 hover:text-gold-200 text-sm font-mono tracking-wider"
              >
                <Phone className="h-4 w-4" /> +91 93081 89201
              </a>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openBooking("executive");
                }}
                className="w-full bg-gradient-to-r from-gold-600 to-gold-400 text-brown-900 font-medium uppercase tracking-widest text-xs py-3.5 rounded-full text-center"
              >
                Book a Room
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Fullscreen Hero Section */}
      <section id="hero" className="relative h-screen w-full overflow-visible bg-cream flex flex-col justify-center">
        {/* Slideshow */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image
                src={heroSlides[currentSlide].src}
                alt={heroSlides[currentSlide].title}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cream/95 via-cream/68 to-cream/86" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full pt-16 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="space-y-4 max-w-3xl"
          >
            <span className="text-gold-400 text-xs md:text-sm tracking-[0.35em] uppercase font-medium">
              Bhagalpur · Est. 2018
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-gold-50 tracking-wide font-medium leading-tight drop-shadow-[0_1px_0_rgba(255,246,230,0.75)]">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-gold-100/85 text-sm md:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
              {heroSlides[currentSlide].subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.22 }}
            className="mt-8 flex flex-wrap gap-4 justify-center"
          >
            <button
              onClick={() => openBooking("executive")}
              className="bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-700 hover:to-gold-500 text-brown-900 font-medium uppercase tracking-widest text-xs py-3.5 px-8 rounded-full transition-all duration-300 shadow-xl shadow-gold-400/25 cursor-pointer"
            >
              Book a Room
            </button>
            <a
              href="#about"
              className="hidden sm:inline-flex border border-gold-200/30 hover:border-gold-300 text-gold-200 hover:text-gold-50 hover:bg-brown-900/5 font-medium uppercase tracking-widest text-xs py-3.5 px-8 rounded-full transition-all duration-300 cursor-pointer"
            >
              About the Hotel
            </a>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 text-gold-200/40 hover:text-gold-200/80 transition-colors">
          <span className="text-[9px] uppercase tracking-[0.3em] font-medium">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          >
            <ChevronDown className="h-4 w-4 text-gold-400" />
          </motion.div>
        </div>

        {/* 3. Luxury Booking Widget */}
        <div className="relative md:absolute bottom-0 left-0 right-0 z-20 w-full md:transform md:translate-y-1/2 px-4 md:px-6 mt-12 md:mt-0">
          <div className="max-w-6xl mx-auto glass-panel rounded-lg shadow-2xl p-5 border border-gold-400/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-widest text-gold-200/80 mb-2">Check-In</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full bg-paper border border-gold-400/20 rounded-lg py-2.5 px-3 text-gold-100 text-xs focus:outline-none focus:border-gold-400/40"
                  defaultValue={todayIso}
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-widest text-gold-200/80 mb-2">Check-Out</label>
              <input
                type="date"
                className="w-full bg-paper border border-gold-400/20 rounded-lg py-2.5 px-3 text-gold-100 text-xs focus:outline-none focus:border-gold-400/40"
                defaultValue={tomorrowIso}
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-widest text-gold-200/80 mb-2">Guests</label>
              <select defaultValue="2" className="w-full bg-paper border border-gold-400/20 rounded-lg py-2.5 px-3 text-gold-100 text-xs focus:outline-none focus:border-gold-400/40">
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
              </select>
            </div>
            <button
              onClick={() => openBooking("executive")}
              className="w-full bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-700 hover:to-gold-500 text-brown-900 font-medium uppercase tracking-widest text-xs py-3 px-4 rounded-lg transition-all duration-300 shadow-md shadow-gold-400/10 cursor-pointer h-[42px] flex items-center justify-center"
            >
              Check Availability
            </button>
          </div>
        </div>
      </section>

      {/* Spacer for Booking Widget overflow */}
      <div className="h-24 bg-cream" />

      {/* 4. About Hotel Section */}
      <section id="about" className="py-24 bg-cream relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 md:px-12 space-y-6">
            <div className="space-y-2">
              <span className="text-gold-400 text-xs uppercase tracking-[0.3em] font-medium block">
                Since 2018
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-gold-50 font-normal tracking-wide">
                About the Hotel
              </h2>
            </div>

            <p className="text-gold-200/85 text-sm md:text-base font-normal leading-relaxed">
              Hotel Rajhans International has been run by Takshshila Regency Pvt. Ltd. since 2018. We host business travellers, families, and groups passing through Bhagalpur.
            </p>

            <p className="text-gold-200/80 text-sm leading-relaxed">
              The property sits at Kachari Chowk on MG Road — walking distance to courts, markets, and the railway station.
            </p>

            <div className="pt-6 border-t border-gold-400/10 grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gold-400/5 rounded-full border border-gold-400/20">
                  <Award className="h-6 w-6 text-gold-400" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-gold-100 font-semibold font-sans">
                    ISO 9001:2015
                  </h4>
                  <p className="text-[10px] text-gold-200/50">Certified since 2018</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gold-400/5 rounded-full border border-gold-400/20">
                  <ShieldCheck className="h-6 w-6 text-gold-400" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-gold-100 font-semibold font-sans">
                    24/7 Security
                  </h4>
                  <p className="text-[10px] text-gold-200/50">CCTV & on-site staff</p>
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* 5. Why Choose Us Section */}
      <section className="py-24 bg-cream-soft/60 relative overflow-hidden border-t border-b border-gold-400/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-gold-400 text-xs uppercase tracking-[0.3em] font-medium">Why stay here</span>
            <h2 className="font-serif text-3xl md:text-5xl text-gold-50 font-normal tracking-wide">
              What guests count on
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                title: "Central location",
                description: "Kachari Chowk, MG Road.",
                icon: MapPin,
              },
              {
                title: "Clean rooms",
                description: "Work desk, A/C, and daily housekeeping.",
                icon: Award,
              },
              {
                title: "On-site dining",
                description: "Restaurant, parlour, saloon, and ice cream.",
                icon: Utensils,
              },
              {
                title: "Free parking",
                description: "Private parking with round-the-clock monitoring.",
                icon: ShieldCheck,
              },
              {
                title: "Station pickup",
                description: "Drop and pickup arranged on request.",
                icon: Compass,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="glass-card rounded-lg p-6 text-center hover:border-gold-400/30 transition-all duration-300 hover:-translate-y-1 flex flex-col items-center space-y-4"
              >
                <div className="p-3 bg-gold-400/5 rounded-full border border-gold-400/20 text-gold-400">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-base text-gold-100 font-medium tracking-wide">
                  {item.title}
                </h3>
                <p className="text-gold-200/50 text-xs leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Luxury Room Collection Section */}
      <section id="rooms" className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-2">
              <span className="text-gold-400 text-xs uppercase tracking-[0.3em] font-medium block">
                Accommodations
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-gold-50 font-normal tracking-wide">
                Rooms & Suites
              </h2>
            </div>
            <p className="text-gold-200/60 text-sm max-w-md font-normal leading-relaxed">
              Three room types. Prices below are per night before taxes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Executive Room */}
            <div className="glass-card rounded-lg overflow-hidden flex flex-col border border-gold-400/10 group">
              <div className="relative h-[280px] w-full overflow-hidden">
                <Image
                  src="/ranjhans/images/executive/Room-001.jpg"
                  alt="Executive Room"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  loading="lazy"
                />
              </div>

              <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-serif text-xl md:text-2xl text-gold-50 font-medium tracking-wide">
                      Executive Room
                    </h3>
                    <div className="text-right">
                      <p className="text-gold-300 font-sans text-lg font-semibold">₹3,090 <span className="text-[10px] text-gold-200/50 font-sans font-normal">/ Single</span></p>
                      <p className="text-gold-200/60 font-sans text-xs">₹3,790 <span className="text-[9px] text-gold-200/40 font-sans font-normal">/ Double</span></p>
                    </div>
                  </div>

                  <p className="text-gold-200/60 text-xs leading-relaxed">
                    Good for solo travellers and short business trips.
                  </p>

                  <div className="pt-2">
                    <p className="text-[10px] text-gold-200/40 uppercase tracking-widest mb-2 font-semibold">Includes</p>
                    <div className="flex flex-wrap gap-2">
                      {["Standard Bed", "Study Table", "Fruit Basket", "TV", "Large Wardrobe", "A/C"].map((tag) => (
                        <span key={tag} className="text-[9px] bg-brown-900/5 border border-gold-400/5 text-gold-200/70 py-1 px-2.5 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    onClick={() => openBooking("executive")}
                    className="flex-grow bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-700 hover:to-gold-500 text-brown-900 font-medium uppercase tracking-widest text-[10px] py-3 px-4 rounded-lg transition-all duration-300 cursor-pointer"
                  >
                    Book Room
                  </button>
                </div>
              </div>
            </div>

            {/* Deluxe Room */}
            <div className="glass-card rounded-lg overflow-hidden flex flex-col border border-gold-400/10 group">
              <div className="relative h-[280px] w-full overflow-hidden">
                <Image
                  src="/ranjhans/images/deluxe/Delux001.jpg"
                  alt="Deluxe Room"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  loading="lazy"
                />
              </div>

              <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-serif text-xl md:text-2xl text-gold-50 font-medium tracking-wide">
                      Deluxe Room
                    </h3>
                    <div className="text-right">
                      <p className="text-gold-300 font-sans text-lg font-semibold">₹3,790 <span className="text-[10px] text-gold-200/50 font-sans font-normal">/ Single</span></p>
                      <p className="text-gold-200/60 font-sans text-xs">₹4,490 <span className="text-[9px] text-gold-200/40 font-sans font-normal">/ Double</span></p>
                    </div>
                  </div>

                  <p className="text-gold-200/60 text-xs leading-relaxed">
                    More space and a pocket-spring bed.
                  </p>

                  <div className="pt-2">
                    <p className="text-[10px] text-gold-200/40 uppercase tracking-widest mb-2 font-semibold">Includes</p>
                    <div className="flex flex-wrap gap-2">
                      {["Pocket Spring Bed", "Study Table", "Fruit Basket", "TV", "Large Wardrobe", "A/C"].map((tag) => (
                        <span key={tag} className="text-[9px] bg-brown-900/5 border border-gold-400/5 text-gold-200/70 py-1 px-2.5 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    onClick={() => openBooking("deluxe")}
                    className="flex-grow bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-700 hover:to-gold-500 text-brown-900 font-medium uppercase tracking-widest text-[10px] py-3 px-4 rounded-lg transition-all duration-300 cursor-pointer"
                  >
                    Book Room
                  </button>
                </div>
              </div>
            </div>

            {/* Royal Suite */}
            <div className="glass-card rounded-lg overflow-hidden flex flex-col border border-gold-400/15 group shadow-xl">
              <div className="relative h-[280px] w-full overflow-hidden">
                <Image
                  src="/ranjhans/images/suite/SR001.jpg"
                  alt="Royal Suite Room"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  loading="lazy"
                />
              </div>

              <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-serif text-xl md:text-2xl text-gold-50 font-medium tracking-wide">
                      Royal Suite
                    </h3>
                    <div className="text-right">
                      <p className="text-gold-300 font-sans text-xl font-semibold">₹5,190 <span className="text-[10px] text-gold-200/50 font-sans font-normal">/ Suite</span></p>
                    </div>
                  </div>

                  <p className="text-gold-200/60 text-xs leading-relaxed">
                    Separate bedroom and living room with two washrooms.
                  </p>

                  <div className="pt-2">
                    <p className="text-[10px] text-gold-200/40 uppercase tracking-widest mb-2 font-semibold">Includes</p>
                    <div className="flex flex-wrap gap-2">
                      {["Bedroom + Living Room", "Double Washroom", "Mini Fridge", "Study Table", "Sofa Seating Area", "Fruit Basket", "A/C"].map((tag) => (
                        <span key={tag} className="text-[9px] bg-brown-900/5 border border-gold-400/5 text-gold-200/70 py-1 px-2.5 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    onClick={() => openBooking("royal")}
                    className="flex-grow bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-700 hover:to-gold-500 text-brown-900 font-medium uppercase tracking-widest text-[10px] py-3 px-4 rounded-lg transition-all duration-300 cursor-pointer"
                  >
                    Book Suite
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Hotel Amenities Section */}
      <section className="py-24 bg-cream-soft/40 border-t border-b border-gold-400/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-gold-400 text-xs uppercase tracking-[0.3em] font-medium">In every room</span>
            <h2 className="font-serif text-3xl md:text-5xl text-gold-50 font-normal tracking-wide">
              Room amenities
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              "Air conditioning",
              "WiFi",
              "TV",
              "Wardrobe",
              "Work desk",
              "Room service",
            ].map((amenity) => (
              <div
                key={amenity}
                className="flex items-center gap-3 px-4 py-3.5 rounded-lg border border-gold-400/15 bg-cream/70 min-h-[56px]"
              >
                <Check className="h-4 w-4 text-gold-400 shrink-0" />
                <span className="text-sm text-gold-100 font-medium leading-snug">{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Hotel Services Section */}
      <section id="services" className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-gold-400 text-xs uppercase tracking-[0.3em] font-medium">On the property</span>
            <h2 className="font-serif text-3xl md:text-5xl text-gold-50 font-normal tracking-wide">
              Services
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Service 1: Beauty Parlour */}
            <div className="glass-card rounded-lg overflow-hidden border border-gold-400/10 flex flex-col md:flex-row group">
              <div className="relative h-[280px] md:h-[350px] md:w-1/2 overflow-hidden">
                <Image
                  src="/ranjhans/images/parlour/BP001.jpg"
                  alt="Rajhans Ladies Beauty Parlour"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 25vw"
                  loading="lazy"
                />
              </div>
              <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gold-400">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-[9px] uppercase tracking-widest font-mono">Beauty</span>
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl text-gold-50 font-medium tracking-wide">
                    Rajhans Ladies Beauty Parlour
                  </h3>
                  <p className="text-gold-200/60 text-xs leading-relaxed">
                    Hair, skincare, and beauty treatments without leaving the hotel.
                  </p>
                </div>
              </div>
            </div>

            {/* Service 2: Saloon */}
            <div className="glass-card rounded-lg overflow-hidden border border-gold-400/10 flex flex-col md:flex-row group">
              <div className="relative h-[280px] md:h-[350px] md:w-1/2 overflow-hidden bg-paper">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 border-b md:border-b-0 md:border-r border-gold-400/10 text-gold-300">
                  <Scissors className="h-10 w-10" />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Saloon</span>
                </div>
              </div>
              <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gold-400">
                    <Scissors className="h-4 w-4" />
                    <span className="text-[9px] uppercase tracking-widest font-mono">Grooming</span>
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl text-gold-50 font-medium tracking-wide">
                    Rajhans Grooming Saloon
                  </h3>
                  <p className="text-gold-200/60 text-xs leading-relaxed">
                    Haircuts and grooming for men, open to hotel guests.
                  </p>
                </div>
              </div>
            </div>

            {/* Service 3: Takshshila Restaurant */}
            <div className="glass-card rounded-lg overflow-hidden border border-gold-400/10 flex flex-col md:flex-row group">
              <div className="relative h-[280px] md:h-[350px] md:w-1/2 overflow-hidden">
                <Image
                  src="/ranjhans/images/restaurant/R001.jpg"
                  alt="Takshshila Restaurant"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 25vw"
                  loading="lazy"
                />
              </div>
              <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gold-400">
                    <Utensils className="h-4 w-4" />
                    <span className="text-[9px] uppercase tracking-widest font-mono">Dining</span>
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl text-gold-50 font-medium tracking-wide">
                    Takshshila Restaurant
                  </h3>
                  <p className="text-gold-200/60 text-xs leading-relaxed">
                    Indian, Chinese, and continental meals. Room service available.
                  </p>
                </div>
              </div>
            </div>

            {/* Service 4: Ice Cream Parlour */}
            <div className="glass-card rounded-lg overflow-hidden border border-gold-400/10 flex flex-col md:flex-row group">
              <div className="relative h-[280px] md:h-[350px] md:w-1/2 overflow-hidden">
                <Image
                  src="/ranjhans/images/ice-cream/ICP001.jpg"
                  alt="Ice Cream Parlour"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 25vw"
                  loading="lazy"
                />
              </div>
              <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gold-400">
                    <Coffee className="h-4 w-4" />
                    <span className="text-[9px] uppercase tracking-widest font-mono">Desserts</span>
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl text-gold-50 font-medium tracking-wide">
                    Ice & Spice
                  </h3>
                  <p className="text-gold-200/60 text-xs leading-relaxed">
                    Ice cream, sundaes, and shakes in the lobby area.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Image Gallery Section */}
      <section id="gallery" className="py-24 bg-cream-soft/60 border-t border-b border-gold-400/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-gold-400 text-xs uppercase tracking-[0.3em] font-medium">Photos</span>
            <h2 className="font-serif text-3xl md:text-5xl text-gold-50 font-normal tracking-wide">
              Gallery
            </h2>
          </div>

          <ImageGallery />
        </div>
      </section>

      {/* 10. Testimonials Section */}
      <section id="testimonials" className="py-24 bg-cream relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.03),transparent_60%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-gold-400 text-xs uppercase tracking-[0.3em] font-medium">Reviews</span>
            <h2 className="font-serif text-3xl md:text-5xl text-gold-50 font-normal tracking-wide">
              What guests say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {/* Review 1 */}
            <div className="glass-card rounded-lg p-8 relative flex flex-col justify-between space-y-6">
              <Quote className="absolute top-6 right-8 h-12 w-12 text-gold-400/5 pointer-events-none" />
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <p className="text-gold-100/90 font-normal text-base leading-relaxed italic">
                  &ldquo;Very well maintained. Support staff was extremely friendly. Even though it is located in the middle of the city, the hotel is peaceful and exceptionally maintained. The food is excellent, and cleanliness and guest service are outstanding.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-6 border-t border-gold-400/10">
                <div className="h-10 w-10 bg-gold-400/10 rounded-full flex items-center justify-center border border-gold-400/25">
                  <span className="text-gold-400 font-serif font-bold text-sm">AK</span>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-gold-100 font-semibold font-sans">
                    Amit K
                  </h4>
                  <p className="text-[10px] text-gold-200/50">Google review</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="glass-card rounded-lg p-8 relative flex flex-col justify-between space-y-6">
              <Quote className="absolute top-6 right-8 h-12 w-12 text-gold-400/5 pointer-events-none" />
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <p className="text-gold-100/90 font-normal text-base leading-relaxed italic">
                  &ldquo;I stayed for two days. The ambience was wonderful, the staff were courteous, the rooms were clean, and the food was delicious. The tea served in an earthen pot was especially memorable.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-6 border-t border-gold-400/10">
                <div className="h-10 w-10 bg-gold-400/10 rounded-full flex items-center justify-center border border-gold-400/25">
                  <span className="text-gold-400 font-serif font-bold text-sm">RR</span>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-gold-100 font-semibold font-sans">
                    Rituraj Rathore
                  </h4>
                  <p className="text-[10px] text-gold-200/50">Google review</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FAQ Section */}
      <section id="faq" className="py-24 bg-cream-soft/60 border-t border-b border-gold-400/10">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16 space-y-2">
            <h2 className="font-serif text-3xl md:text-5xl text-gold-50 font-normal tracking-wide">
              Common questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gold-400/10 rounded-lg overflow-hidden bg-cream/40"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full py-5 px-6 flex items-center justify-between text-left hover:bg-brown-900/5 transition-colors cursor-pointer"
                >
                  <span className="font-serif text-sm md:text-base text-gold-100 tracking-wide font-medium">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: activeFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4 text-gold-400" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-5 text-xs md:text-sm text-gold-200/70 leading-relaxed border-t border-gold-400/5 pt-3">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Contact & Map Section */}
      <section id="contact" className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2">
              <span className="text-gold-400 text-xs uppercase tracking-[0.3em] font-medium block">
                Contact
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-gold-50 font-normal tracking-wide">
                Reach us
              </h2>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-gold-400/5 rounded-lg border border-gold-400/20 text-gold-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-gold-200/50 mb-1 font-semibold">Address</h4>
                  <p className="text-sm text-gold-100 font-normal leading-relaxed">
                    Kachari Chowk, MG Road,<br />
                    Bhagalpur, Bihar – 812001, India
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-gold-400/5 rounded-lg border border-gold-400/20 text-gold-400">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-gold-200/50 mb-1 font-semibold">Phones</h4>
                  <p className="text-sm text-gold-100 font-mono">
                    <a href="tel:+919308189201" className="hover:text-gold-300">+91 93081 89201</a>
                  </p>
                  <p className="text-xs text-gold-200/60 font-mono mt-1">
                    +91 641 240 9411 / 12 / 13 / 14 / 15
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-gold-400/5 rounded-lg border border-gold-400/20 text-gold-400">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-gold-200/50 mb-1 font-semibold">Email</h4>
                  <p className="text-sm text-gold-100">
                    <a href="mailto:info@hotelrajhansinternational.com" className="hover:text-gold-300">
                      info@hotelrajhansinternational.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Enquiry Form */}
            <div className="glass-card rounded-lg p-6 border border-gold-400/10">
              <h3 className="font-serif text-lg text-gold-100 font-medium mb-4">Send a message</h3>
              {contactSuccess ? (
                <div className="text-center py-6 text-gold-400 flex flex-col items-center gap-2">
                  <Check className="h-8 w-8 bg-gold-400/10 p-1.5 rounded-full border border-gold-400/20" />
                  <p className="text-sm font-medium">Message sent</p>
                  <p className="text-[10px] text-gold-200/50">We&apos;ll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="bg-paper border border-gold-400/20 rounded-lg p-2.5 text-xs text-gold-100 focus:outline-none focus:border-gold-400/40 placeholder-gold-200/25"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="bg-paper border border-gold-400/20 rounded-lg p-2.5 text-xs text-gold-100 focus:outline-none focus:border-gold-400/40 placeholder-gold-200/25"
                    />
                  </div>
                  <textarea
                    placeholder="Your message — booking question, pickup request, etc."
                    rows={3}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full bg-paper border border-gold-400/20 rounded-lg p-2.5 text-xs text-gold-100 focus:outline-none focus:border-gold-400/40 placeholder-gold-200/25 resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full bg-gold-400 hover:bg-gold-500 text-brown-900 text-[10px] uppercase font-semibold tracking-widest py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Send message
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Interactive Map Embed */}
          <div className="lg:col-span-7 h-[450px] lg:h-auto min-h-[350px] relative rounded-lg overflow-hidden border border-gold-400/10 shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.113031023773!2d87.0052345!3d25.2499692!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f04be66a0df017%3A0xe9f79b6999a9a38!2sHotel%20Rajhans%20International!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(35%) contrast(95%) saturate(85%)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Hotel Rajhans International Google Map"
              id="google-maps-iframe"
            />
          </div>
        </div>
      </section>

      {/* 13. Elegant Footer */}
      <footer className="bg-cream border-t border-gold-400/10 text-gold-200/60 text-xs py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Certifications */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <h3 className="font-serif text-lg text-gold-300 font-medium uppercase tracking-[0.2em] leading-none">
              Hotel Rajhans International
            </h3>
            <p className="text-gold-200/50 max-w-sm text-xs leading-relaxed font-normal">
              A unit of <span className="text-gold-100 font-medium">Takshshila Regency Pvt. Ltd.</span> · Kachari Chowk, MG Road, Bhagalpur.
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
              <li><a href="#about" className="hover:text-gold-300 transition-colors">About</a></li>
              <li><a href="#rooms" className="hover:text-gold-300 transition-colors">Rooms</a></li>
              <li><a href="#services" className="hover:text-gold-300 transition-colors">Services</a></li>
              <li><a href="#gallery" className="hover:text-gold-300 transition-colors">Gallery</a></li>
              <li><a href="#faq" className="hover:text-gold-300 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact Summary */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-gold-100 font-bold font-sans">
              Address & Contact
            </h4>
            <p className="text-xs leading-relaxed font-normal">
              Kachari Chowk, MG Road,<br />
              Bhagalpur, Bihar 812001
            </p>
            <p className="font-mono text-xs">
              P: +91 93081 89201<br />
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

      {/* Booking Form Modal Overlay */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedRoomDefault={selectedRoomCategory}
      />
    </>
  );
}
