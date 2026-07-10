"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
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
    src: "/images/reception/Reception001.jpg",
    title: "A Sanctuary of Refined Luxury",
    subtitle: "Experience unparalleled 5-star service in the heart of Bhagalpur.",
  },
  {
    src: "/images/suite/SR001.jpg",
    title: "Elegant Spaces. Majestic Stays.",
    subtitle: "Immerse yourself in our beautifully crafted suites designed for ultimate comfort.",
  },
  {
    src: "/images/restaurant/R001.jpg",
    title: "A Culinary Journey Awaits",
    subtitle: "Savor exquisite delicacies prepared by our master chefs at The Regent.",
  },
];

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
      question: "Food & Drink Options",
      answer: "Our signature Regent Restaurant serves an extensive menu of gourmet Indian, Chinese, and continental cuisines. Room service is available 24/7. Additionally, enjoy our premium Ice Cream Parlour for artisanal desserts, and don't miss our highly-acclaimed traditional tea served in authentic earthen pots.",
    },
    {
      question: "Parking Availability",
      answer: "Complimentary, secure private parking is available on-site for all staying guests. Our parking facility features 24-hour CCTV monitoring and physical security to ensure absolute peace of mind.",
    },
    {
      question: "Airport & Railway Station Transportation",
      answer: "We offer luxury transfers and shuttles upon request. The hotel is located exceptionally close to the Bhagalpur Railway Station (just 1.5 km or a 5-minute drive). Airport transfers can be coordinated through our concierge desk with 24 hours prior notice.",
    },
    {
      question: "Distance from City Centre & Attractions",
      answer: "Hotel Rajhans International is situated right in the center of Bhagalpur at the prestigious Kachari Chowk, MG Road. We offer walk-in convenience to premium shopping markets, administrative offices, and district courts, while providing a peaceful oasis inside.",
    },
    {
      question: "Pet Policy",
      answer: "In order to maintain a serene environment for all our residents, pets are generally not permitted on the premises. For special accommodations regarding service animals, please contact our management team prior to booking.",
    },
    {
      question: "Business Services & Corporate Amenities",
      answer: "We provide fully equipped executive services, including high-speed corporate WiFi, copy, scanning, and printing facilities. We also offer quiet corners and executive lounges ideal for business discussions.",
    },
    {
      question: "Family Friendly Stay",
      answer: "Yes, we are highly family-friendly. We offer spacious interconnected rooms, kid-friendly culinary options at The Regent, delightful desserts at the Ice Cream Parlour, and a highly secure, peaceful environment suitable for multi-generational families.",
    },
    {
      question: "Business Traveller Friendly",
      answer: "Absolutely. We are the preferred choice for corporate executives and professionals. We offer fast express check-in/check-out, high-speed WiFi, dedicated workspace desks in all rooms, and close proximity to corporate hubs and court chambers.",
    },
    {
      question: "Hotel Safety & Security Standards",
      answer: "Guest safety is our highest priority. The hotel is equipped with comprehensive 24/7 CCTV surveillance, manned checkpoints, electronic secure locks, fire safety systems, and strict visitor screening protocols.",
    },
    {
      question: "Nearby Markets & Administrative Offices",
      answer: "Our prime location on MG Road places you within walking distance of government administrative offices, the Bhagalpur District Courts, financial centers, major bank branches, and key retail markets.",
    },
    {
      question: "Cleanliness, Sanitation & Hygiene",
      answer: "Adhering to strict international luxury standards, we ensure that every room undergoes a comprehensive deep-sanitization process prior to check-in, and all public areas are continuously sanitized by our professional housekeeping team.",
    },
  ];

  return (
    <>
      {/* 1. Transparent Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 py-4 ${
          isNavbarScrolled ? "glass-nav shadow-lg" : "bg-gradient-to-b from-charcoal-950/80 to-transparent"
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
              className="text-gold-200/80 hover:text-gold-300 p-2 border border-gold-400/10 rounded-full hover:bg-white/5 transition-all text-xs flex items-center gap-2"
              aria-label="Call concierge"
            >
              <Phone className="h-4 w-4 text-gold-400" />
              <span className="hidden sm:inline font-mono text-[10px] tracking-wider">+91 93081 89201</span>
            </a>
            <button
              onClick={() => openBooking("executive")}
              className="hidden sm:block bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-700 hover:to-gold-500 text-charcoal-950 font-medium uppercase tracking-widest text-[10px] py-2.5 px-5 rounded-full transition-all duration-300 shadow-md shadow-gold-400/10 active:scale-95 cursor-pointer"
            >
              Book Stay
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gold-200 hover:text-gold-300 transition-colors rounded-full hover:bg-white/5 cursor-pointer"
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
            className="fixed inset-0 z-30 bg-charcoal-950/95 backdrop-blur-lg pt-24 px-6 pb-8 flex flex-col justify-between"
          >
            <div className="flex flex-col gap-6 text-center pt-8">
              {[
                { label: "About Us", href: "#about" },
                { label: "Suites & Rooms", href: "#rooms" },
                { label: "Services Portfolio", href: "#services" },
                { label: "Visual Gallery", href: "#gallery" },
                { label: "Reviews", href: "#testimonials" },
                { label: "FAQ", href: "#faq" },
                { label: "Get in Touch", href: "#contact" }
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
                className="w-full bg-gradient-to-r from-gold-600 to-gold-400 text-charcoal-950 font-medium uppercase tracking-widest text-xs py-3.5 rounded-full text-center"
              >
                Reserve A Room
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Fullscreen Hero Section */}
      <section id="hero" className="relative h-screen w-full overflow-hidden bg-charcoal-950 flex flex-col justify-center">
        {/* Slideshow */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
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
              {/* Luxury dark vignetting overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-charcoal-950/70" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full pt-16 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="space-y-4 max-w-3xl"
          >
            <span className="text-gold-400 text-xs md:text-sm tracking-[0.35em] uppercase font-medium flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-gold-400" /> Luxurious 5 Star Service
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-gold-50 tracking-wide font-normal leading-tight">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-gold-100/70 text-sm md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
              {heroSlides[currentSlide].subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-8 flex flex-wrap gap-4 justify-center"
          >
            <button
              onClick={() => openBooking("executive")}
              className="bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-700 hover:to-gold-500 text-charcoal-950 font-medium uppercase tracking-widest text-xs py-3.5 px-8 rounded-full transition-all duration-300 shadow-xl shadow-gold-400/25 cursor-pointer"
            >
              Reserve A Suite
            </button>
            <a
              href="#about"
              className="border border-gold-200/30 hover:border-gold-300 text-gold-200 hover:text-gold-50 hover:bg-white/5 font-medium uppercase tracking-widest text-xs py-3.5 px-8 rounded-full transition-all duration-300 cursor-pointer"
            >
              Explore Hotel
            </a>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-gold-200/40 hover:text-gold-200/80 transition-colors">
          <span className="text-[9px] uppercase tracking-[0.3em] font-medium">Scroll Down</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          >
            <ChevronDown className="h-4 w-4 text-gold-400" />
          </motion.div>
        </div>

        {/* 3. Luxury Booking Widget */}
        <div className="relative md:absolute bottom-0 left-0 right-0 z-20 w-full md:transform md:translate-y-1/2 px-4 md:px-6 mt-12 md:mt-0">
          <div className="max-w-6xl mx-auto glass-panel rounded-2xl shadow-2xl p-5 border border-gold-400/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-widest text-gold-200/80 mb-2">Check-In</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full bg-charcoal-950 border border-gold-400/10 rounded-lg py-2.5 px-3 text-gold-100 text-xs focus:outline-none focus:border-gold-400/40"
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-widest text-gold-200/80 mb-2">Check-Out</label>
              <input
                type="date"
                className="w-full bg-charcoal-950 border border-gold-400/10 rounded-lg py-2.5 px-3 text-gold-100 text-xs focus:outline-none focus:border-gold-400/40"
                defaultValue={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-widest text-gold-200/80 mb-2">Guests</label>
              <select defaultValue="2" className="w-full bg-charcoal-950 border border-gold-400/10 rounded-lg py-2.5 px-3 text-gold-100 text-xs focus:outline-none focus:border-gold-400/40">
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
              </select>
            </div>
            <button
              onClick={() => openBooking("executive")}
              className="w-full bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-700 hover:to-gold-500 text-charcoal-950 font-medium uppercase tracking-widest text-xs py-3 px-4 rounded-lg transition-all duration-300 shadow-md shadow-gold-400/10 cursor-pointer h-[42px] flex items-center justify-center"
            >
              Check Availability
            </button>
          </div>
        </div>
      </section>

      {/* Spacer for Booking Widget overflow */}
      <div className="h-20 bg-charcoal-950" />

      {/* 4. About Hotel Section */}
      <section id="about" className="py-24 bg-charcoal-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-gold-400 text-xs uppercase tracking-[0.3em] font-medium block">
                Since 2018
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-gold-50 font-normal tracking-wide">
                A Legacy of Impeccable Hospitality
              </h2>
            </div>

            <p className="text-gold-200/85 text-sm md:text-base font-light leading-relaxed">
              A sanctuary of sophisticated elegance in the heart of Bhagalpur, Hotel Rajhans International has been the region's premier destination for discerning travelers. Under the prestigious stewardship of Takshshila Regency Pvt. Ltd., this exquisite establishment represents the pinnacle of modern luxury.
            </p>

            <p className="text-gold-200/80 text-sm leading-relaxed">
              Perfectly situated at the prestigious intersection of Kachari Chowk and MG Road, our residence offers an oasis of tranquility amidst the vibrant energy of the city. Whether visiting for executive affairs, judicial pursuits, grand family celebrations, academic endeavors, or refined leisure, our guests experience a level of bespoke hospitality that is both warm and impeccably professional.
            </p>

            {/* Certifications and Badges */}
            <div className="pt-6 border-t border-gold-400/10 grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gold-400/5 rounded-full border border-gold-400/20">
                  <Award className="h-6 w-6 text-gold-400" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-gold-100 font-semibold font-sans">
                    Five-Star Comfort
                  </h4>
                  <p className="text-[10px] text-gold-200/50">Uncompromising Quality</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gold-400/5 rounded-full border border-gold-400/20">
                  <ShieldCheck className="h-6 w-6 text-gold-400" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-gold-100 font-semibold font-sans">
                    Trusted Safety
                  </h4>
                  <p className="text-[10px] text-gold-200/50">24/7 Monitored</p>
                </div>
              </div>
            </div>
          </div>

          {/* Asymmetrical Photo Layout */}
          <div className="lg:col-span-6 grid grid-cols-12 gap-4">
            <div className="col-span-8 relative h-[380px] rounded-2xl overflow-hidden border border-gold-400/10">
              <Image
                src="/images/reception/Reception002.jpg"
                alt="Hotel Rajhans Reception"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
              />
            </div>
            <div className="col-span-4 relative h-[180px] self-end rounded-2xl overflow-hidden border border-gold-400/10">
              <Image
                src="/images/restaurant/R003.jpg"
                alt="Fine Dining R003"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 50vw, 25vw"
                loading="lazy"
              />
            </div>
            <div className="col-span-4 relative h-[180px] -mt-36 rounded-2xl overflow-hidden border border-gold-400/10">
              <Image
                src="/images/suite/SR003.jpg"
                alt="Royal Suite Room View"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 50vw, 25vw"
                loading="lazy"
              />
            </div>
            <div className="col-span-8 relative h-[250px] mt-4 rounded-2xl overflow-hidden border border-gold-400/10">
              <Image
                src="/images/executive/Room-002.jpg"
                alt="Executive Room Bedroom View"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us Section */}
      <section className="py-24 bg-charcoal-900/60 relative overflow-hidden border-t border-b border-gold-400/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-gold-400 text-xs uppercase tracking-[0.3em] font-medium">Why Choose Us</span>
            <h2 className="font-serif text-3xl md:text-5xl text-gold-50 font-normal tracking-wide">
              An Elevated Level of Comfort
            </h2>
            <p className="text-gold-200/60 text-sm font-light">
              Crafted to provide business leaders, families, and global tourists with an unmatched experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                title: "Uncompromised Safety",
                description: "Deep secure measures, 24/7 monitoring, secure verification, and certified safety grids.",
                icon: ShieldCheck,
              },
              {
                title: "Bespoke Comfort",
                description: "Tailored spaces and study tables designed for both business focus and family relaxation.",
                icon: Award,
              },
              {
                title: "Central Location",
                description: "Right at Kachari Chowk, MG Road. Easy access to main courts, markets, and rail station.",
                icon: MapPin,
              },
              {
                title: "Bespoke Hospitality",
                description: "Catering to business events, judicial duties, or leisure with professional custom service.",
                icon: Compass,
              },
              {
                title: "Quiet Oasis",
                description: "Set in the heart of the city, yet perfectly isolated from street noise for peaceful rests.",
                icon: Clock,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-6 text-center hover:border-gold-400/30 transition-all duration-300 hover:-translate-y-1 flex flex-col items-center space-y-4"
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
      <section id="rooms" className="py-24 bg-charcoal-950">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-2">
              <span className="text-gold-400 text-xs uppercase tracking-[0.3em] font-medium block">
                Accommodations
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-gold-50 font-normal tracking-wide">
                Luxury Room Collection
              </h2>
            </div>
            <p className="text-gold-200/60 text-sm max-w-md font-light leading-relaxed">
              Every room is meticulously designed with rich textures, soft warm illumination, and custom amenities to ensure a comfortable stay.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Executive Room */}
            <div className="glass-card rounded-2xl overflow-hidden flex flex-col border border-gold-400/10 group">
              <div className="relative h-[280px] w-full overflow-hidden">
                <Image
                  src="/images/executive/Room-001.jpg"
                  alt="Executive Room"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-charcoal-950/80 backdrop-blur-md border border-gold-400/20 py-1.5 px-3 rounded-full">
                  <span className="text-[10px] text-gold-300 font-mono uppercase tracking-widest">Starting from</span>
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-serif text-xl md:text-2xl text-gold-50 font-medium tracking-wide">
                      Executive Room
                    </h3>
                    <div className="text-right">
                      <p className="text-gold-300 font-serif text-lg font-bold">₹3,090 <span className="text-[10px] text-gold-200/50 font-sans font-light">/ Single</span></p>
                      <p className="text-gold-200/60 font-serif text-xs">₹3,790 <span className="text-[9px] text-gold-200/40 font-sans font-light">/ Double</span></p>
                    </div>
                  </div>

                  <p className="text-gold-200/60 text-xs leading-relaxed">
                    Specially optimized for corporate executives and court-related professionals. Features a refined working workspace and luxury bedding.
                  </p>

                  <div className="pt-2">
                    <p className="text-[10px] text-gold-200/40 uppercase tracking-widest mb-2 font-semibold">Premium Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {["Standard Bed", "Study Table", "Tea Kettle", "Fruit Basket", "TV", "Large Wardrobe", "A/C"].map((tag) => (
                        <span key={tag} className="text-[9px] bg-white/5 border border-gold-400/5 text-gold-200/70 py-1 px-2.5 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    onClick={() => openBooking("executive")}
                    className="flex-grow bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-700 hover:to-gold-500 text-charcoal-950 font-medium uppercase tracking-widest text-[10px] py-3 px-4 rounded-lg transition-all duration-300 cursor-pointer"
                  >
                    Reserve Room
                  </button>
                </div>
              </div>
            </div>

            {/* Deluxe Room */}
            <div className="glass-card rounded-2xl overflow-hidden flex flex-col border border-gold-400/10 group">
              <div className="relative h-[280px] w-full overflow-hidden">
                <Image
                  src="/images/deluxe/Delux001.jpg"
                  alt="Deluxe Room"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-charcoal-950/80 backdrop-blur-md border border-gold-400/20 py-1.5 px-3 rounded-full">
                  <span className="text-[10px] text-gold-300 font-mono uppercase tracking-widest">Premium Choice</span>
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-serif text-xl md:text-2xl text-gold-50 font-medium tracking-wide">
                      Deluxe Room
                    </h3>
                    <div className="text-right">
                      <p className="text-gold-300 font-serif text-lg font-bold">₹3,790 <span className="text-[10px] text-gold-200/50 font-sans font-light">/ Single</span></p>
                      <p className="text-gold-200/60 font-serif text-xs">₹4,490 <span className="text-[9px] text-gold-200/40 font-sans font-light">/ Double</span></p>
                    </div>
                  </div>

                  <p className="text-gold-200/60 text-xs leading-relaxed">
                    Designed for families and senior travelers desiring enhanced space. Features custom orthopaedic pocket spring bedding and plush seating.
                  </p>

                  <div className="pt-2">
                    <p className="text-[10px] text-gold-200/40 uppercase tracking-widest mb-2 font-semibold">Premium Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {["Pocket Spring Bed", "Study Table", "Tea Kettle", "Fruit Basket", "TV", "Large Wardrobe", "A/C"].map((tag) => (
                        <span key={tag} className="text-[9px] bg-white/5 border border-gold-400/5 text-gold-200/70 py-1 px-2.5 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    onClick={() => openBooking("deluxe")}
                    className="flex-grow bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-700 hover:to-gold-500 text-charcoal-950 font-medium uppercase tracking-widest text-[10px] py-3 px-4 rounded-lg transition-all duration-300 cursor-pointer"
                  >
                    Reserve Room
                  </button>
                </div>
              </div>
            </div>

            {/* Royal Suite */}
            <div className="glass-card rounded-2xl overflow-hidden flex flex-col border border-gold-400/15 group shadow-xl">
              <div className="relative h-[280px] w-full overflow-hidden">
                <Image
                  src="/images/suite/SR001.jpg"
                  alt="Royal Suite Room"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-gradient-to-r from-gold-600 to-gold-400 border border-gold-400/25 py-1 px-3.5 rounded-full">
                  <span className="text-[9px] text-charcoal-950 font-semibold uppercase tracking-widest">Ultimate Luxury</span>
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-serif text-xl md:text-2xl text-gold-50 font-medium tracking-wide">
                      Royal Suite
                    </h3>
                    <div className="text-right">
                      <p className="text-gold-300 font-serif text-xl font-bold">₹5,190 <span className="text-[10px] text-gold-200/50 font-sans font-light">/ Suite</span></p>
                    </div>
                  </div>

                  <p className="text-gold-200/60 text-xs leading-relaxed">
                    Our flagship accommodation. Features a separate master bedroom, private sofa seating lounge, double premium washrooms, and luxury mini-fridge.
                  </p>

                  <div className="pt-2">
                    <p className="text-[10px] text-gold-200/40 uppercase tracking-widest mb-2 font-semibold">Premium Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {["Bedroom + Living Room", "Double Washroom", "Mini Fridge", "Study Table", "Sofa Seating Area", "Fruit Basket", "A/C"].map((tag) => (
                        <span key={tag} className="text-[9px] bg-white/5 border border-gold-400/5 text-gold-200/70 py-1 px-2.5 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    onClick={() => openBooking("royal")}
                    className="flex-grow bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-700 hover:to-gold-500 text-charcoal-950 font-medium uppercase tracking-widest text-[10px] py-3 px-4 rounded-lg transition-all duration-300 cursor-pointer"
                  >
                    Reserve Suite
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Hotel Amenities Section */}
      <section className="py-24 bg-charcoal-900/40 border-t border-b border-gold-400/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-gold-400 text-xs uppercase tracking-[0.3em] font-medium">Elevated Stay</span>
            <h2 className="font-serif text-3xl md:text-5xl text-gold-50 font-normal tracking-wide">
              The Suite Conveniences
            </h2>
            <p className="text-gold-200/60 text-sm font-light">
              Meticulous details to ensure you have a dependable, luxurious, and peaceful environment.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Fully Air Conditioned", detail: "Individually controlled climate" },
              { label: "High-Speed WiFi", detail: "Complimentary access throughout" },
              { label: "In-Room Tea Kettle", detail: "Premium coffee & tea selection" },
              { label: "Fresh Fruit Basket", detail: "Restocked daily for wellness" },
              { label: "Executive Study Desk", detail: "Designed for business focus" },
              { label: "Spacious Wardrobes", detail: "Sleek, double-door wardrobes" },
              { label: "24/7 Security & CCTV", detail: "Supreme guest safety protocols" },
              { label: "24-Hour Room Service", detail: "Dining delivered to your door" },
            ].map((amenity, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="p-1 bg-gold-400/10 rounded-full border border-gold-400/20 text-gold-400 mt-0.5">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm text-gold-100 font-medium">{amenity.label}</h4>
                  <p className="text-[11px] text-gold-200/40 mt-0.5">{amenity.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Hotel Services Section */}
      <section id="services" className="py-24 bg-charcoal-950">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-gold-400 text-xs uppercase tracking-[0.3em] font-medium">Bespoke Wellness & Dining</span>
            <h2 className="font-serif text-3xl md:text-5xl text-gold-50 font-normal tracking-wide">
              Exclusive Hotel Services
            </h2>
            <p className="text-gold-200/60 text-sm font-light">
              We offer curated grooming, dining, and sweet delights directly inside our premises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Service 1: Beauty Parlour */}
            <div className="glass-card rounded-2xl overflow-hidden border border-gold-400/10 flex flex-col md:flex-row group">
              <div className="relative h-[280px] md:h-[350px] md:w-1/2 overflow-hidden">
                <Image
                  src="/images/parlour/BP001.jpg"
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
                    <span className="text-[9px] uppercase tracking-widest font-mono">Wellness & Styling</span>
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl text-gold-50 font-medium tracking-wide">
                    Rajhans Ladies Beauty Parlour
                  </h3>
                  <p className="text-gold-200/60 text-xs leading-relaxed">
                    A peaceful sanctuary of beauty and rejuvenation, offering bespoke haircuts, luxury facials, wedding skincare rituals, and premium grooming by certified styling specialists.
                  </p>
                </div>
                <div className="pt-6 border-t border-gold-400/5 mt-4">
                  <a
                    href="tel:+919308189201"
                    className="text-gold-300 hover:text-gold-200 text-xs font-semibold tracking-widest uppercase flex items-center gap-2"
                  >
                    Book Treatment <ChevronDown className="h-3 w-3 -rotate-90" />
                  </a>
                </div>
              </div>
            </div>

            {/* Service 2: Saloon */}
            <div className="glass-card rounded-2xl overflow-hidden border border-gold-400/10 flex flex-col md:flex-row group">
              <div className="relative h-[280px] md:h-[350px] md:w-1/2 overflow-hidden">
                <Image
                  src="/images/parlour/BP006.jpg"
                  alt="Rajhans Saloon"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 25vw"
                  loading="lazy"
                />
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
                    An upscale, sophisticated grooming experience for gentlemen. Featuring hot towel precision shaves, master haircuts, head massages, and deep grooming care in a relaxed atmosphere.
                  </p>
                </div>
                <div className="pt-6 border-t border-gold-400/5 mt-4">
                  <a
                    href="tel:+919308189201"
                    className="text-gold-300 hover:text-gold-200 text-xs font-semibold tracking-widest uppercase flex items-center gap-2"
                  >
                    Book Grooming <ChevronDown className="h-3 w-3 -rotate-90" />
                  </a>
                </div>
              </div>
            </div>

            {/* Service 3: The Regent Restaurant */}
            <div className="glass-card rounded-2xl overflow-hidden border border-gold-400/10 flex flex-col md:flex-row group">
              <div className="relative h-[280px] md:h-[350px] md:w-1/2 overflow-hidden">
                <Image
                  src="/images/restaurant/R001.jpg"
                  alt="The Regent Restaurant"
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
                    <span className="text-[9px] uppercase tracking-widest font-mono">Signature Dining</span>
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl text-gold-50 font-medium tracking-wide">
                    The Regent Restaurant
                  </h3>
                  <p className="text-gold-200/60 text-xs leading-relaxed">
                    Indulge in high-quality culinary creations. Enjoy authentic local tastes, classic Indian dishes, and international menu choices. Our traditional clay-pot earthen tea is highly acclaimed.
                  </p>
                </div>
                <div className="pt-6 border-t border-gold-400/5 mt-4">
                  <a
                    href="#contact"
                    className="text-gold-300 hover:text-gold-200 text-xs font-semibold tracking-widest uppercase flex items-center gap-2"
                  >
                    Reserve Table <ChevronDown className="h-3 w-3 -rotate-90" />
                  </a>
                </div>
              </div>
            </div>

            {/* Service 4: Ice Cream Parlour */}
            <div className="glass-card rounded-2xl overflow-hidden border border-gold-400/10 flex flex-col md:flex-row group">
              <div className="relative h-[280px] md:h-[350px] md:w-1/2 overflow-hidden">
                <Image
                  src="/images/ice-cream/ICP001.jpg"
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
                    <span className="text-[9px] uppercase tracking-widest font-mono">Dessert Parlour</span>
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl text-gold-50 font-medium tracking-wide">
                    The Rajhans Dessert Parlour
                  </h3>
                  <p className="text-gold-200/60 text-xs leading-relaxed">
                    Delight in artisanal ice creams, creative sundaes, and fresh shakes. A sweet culinary retreat designed for families and desserts lovers staying at our premier hotel.
                  </p>
                </div>
                <div className="pt-6 border-t border-gold-400/5 mt-4">
                  <a
                    href="#contact"
                    className="text-gold-300 hover:text-gold-200 text-xs font-semibold tracking-widest uppercase flex items-center gap-2"
                  >
                    Explore Flavors <ChevronDown className="h-3 w-3 -rotate-90" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Image Gallery Section */}
      <section id="gallery" className="py-24 bg-charcoal-900/60 border-t border-b border-gold-400/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-gold-400 text-xs uppercase tracking-[0.3em] font-medium">Visual Gallery</span>
            <h2 className="font-serif text-3xl md:text-5xl text-gold-50 font-normal tracking-wide">
              The Rajhans Experience
            </h2>
            <p className="text-gold-200/60 text-sm font-light">
              An immersive view into the elegant rooms, luxury lobbies, wellness parlour, and signature dining locations.
            </p>
          </div>

          <ImageGallery />
        </div>
      </section>

      {/* 10. Testimonials Section */}
      <section id="testimonials" className="py-24 bg-charcoal-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.03),transparent_60%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-gold-400 text-xs uppercase tracking-[0.3em] font-medium">Guest Endorsements</span>
            <h2 className="font-serif text-3xl md:text-5xl text-gold-50 font-normal tracking-wide">
              Stories from our Guests
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {/* Review 1 */}
            <div className="glass-card rounded-2xl p-8 relative flex flex-col justify-between space-y-6">
              <Quote className="absolute top-6 right-8 h-12 w-12 text-gold-400/5 pointer-events-none" />
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <p className="text-gold-100/90 font-light text-base leading-relaxed italic">
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
                  <p className="text-[10px] text-gold-200/50">Verified Corporate Traveler</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="glass-card rounded-2xl p-8 relative flex flex-col justify-between space-y-6">
              <Quote className="absolute top-6 right-8 h-12 w-12 text-gold-400/5 pointer-events-none" />
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <p className="text-gold-100/90 font-light text-base leading-relaxed italic">
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
                  <p className="text-[10px] text-gold-200/50">Verified Family Traveler</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FAQ Section */}
      <section id="faq" className="py-24 bg-charcoal-900/60 border-t border-b border-gold-400/10">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16 space-y-2">
            <span className="text-gold-400 text-xs uppercase tracking-[0.3em] font-medium">Faq Accordion</span>
            <h2 className="font-serif text-3xl md:text-5xl text-gold-50 font-normal tracking-wide">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gold-400/10 rounded-xl overflow-hidden bg-charcoal-950/40"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full py-5 px-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer"
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
      <section id="contact" className="py-24 bg-charcoal-950">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2">
              <span className="text-gold-400 text-xs uppercase tracking-[0.3em] font-medium block">
                Concierge Desk
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-gold-50 font-normal tracking-wide">
                Get in Touch
              </h2>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-gold-400/5 rounded-xl border border-gold-400/20 text-gold-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-gold-200/50 mb-1 font-semibold">Address</h4>
                  <p className="text-sm text-gold-100 font-light leading-relaxed">
                    Kachari Chowk, MG Road,<br />
                    Bhagalpur, Bihar – 812001, India
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-gold-400/5 rounded-xl border border-gold-400/20 text-gold-400">
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
                <div className="p-3 bg-gold-400/5 rounded-xl border border-gold-400/20 text-gold-400">
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
            <div className="glass-card rounded-2xl p-6 border border-gold-400/10">
              <h3 className="font-serif text-lg text-gold-100 font-medium mb-4">Send a Concierge Request</h3>
              {contactSuccess ? (
                <div className="text-center py-6 text-gold-400 flex flex-col items-center gap-2">
                  <Check className="h-8 w-8 bg-gold-400/10 p-1.5 rounded-full border border-gold-400/20" />
                  <p className="text-sm font-medium">Message sent successfully!</p>
                  <p className="text-[10px] text-gold-200/50">We will respond shortly.</p>
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
                      className="bg-charcoal-950 border border-gold-400/10 rounded-lg p-2.5 text-xs text-gold-100 focus:outline-none focus:border-gold-400/40 placeholder-gold-200/25"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="bg-charcoal-950 border border-gold-400/10 rounded-lg p-2.5 text-xs text-gold-100 focus:outline-none focus:border-gold-400/40 placeholder-gold-200/25"
                    />
                  </div>
                  <textarea
                    placeholder="Describe your inquiry (e.g. airport taxi, event space, corporate rates)"
                    rows={3}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full bg-charcoal-950 border border-gold-400/10 rounded-lg p-2.5 text-xs text-gold-100 focus:outline-none focus:border-gold-400/40 placeholder-gold-200/25 resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full bg-gold-400 hover:bg-gold-500 text-charcoal-950 text-[10px] uppercase font-semibold tracking-widest py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Send Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Interactive Map Embed */}
          <div className="lg:col-span-7 h-[450px] lg:h-auto min-h-[350px] relative rounded-2xl overflow-hidden border border-gold-400/10 shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.113031023773!2d87.0052345!3d25.2499692!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f04be66a0df017%3A0xe9f79b6999a9a38!2sHotel%20Rajhans%20International!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(100%) invert(90%) contrast(95%)" }}
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
      <footer className="bg-charcoal-950 border-t border-gold-400/10 text-gold-200/60 text-xs py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Certifications */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <h3 className="font-serif text-lg text-gold-300 font-medium uppercase tracking-[0.2em] leading-none">
              Hotel Rajhans International
            </h3>
            <p className="text-[10px] tracking-[0.2em] text-gold-200/40 uppercase font-sans">
              Luxurious 5 Star Service
            </p>
            <p className="text-gold-200/50 max-w-sm text-xs leading-relaxed font-light">
              Representing a unit of <span className="text-gold-100 font-medium">Takshshila Regency Pvt. Ltd.</span> Since 2018, delivering unmatched services for executive stays, family events, and business travelers.
            </p>
            <div className="flex gap-4 pt-2">
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-gold-300 font-semibold font-mono border border-gold-400/10 bg-white/5 py-1 px-3 rounded">
                <Award className="h-3 w-3 text-gold-400" /> ISO 9001:2015
              </span>
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-gold-300 font-semibold font-mono border border-gold-400/10 bg-white/5 py-1 px-3 rounded">
                <Clock className="h-3 w-3 text-gold-400" /> Est. 2018
              </span>
            </div>
          </div>

          {/* Quick Sitemap Links */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-gold-100 font-bold font-sans">
              Sitemap
            </h4>
            <ul className="space-y-2 font-light">
              <li><a href="#about" className="hover:text-gold-300 transition-colors">About Us</a></li>
              <li><a href="#rooms" className="hover:text-gold-300 transition-colors">Suites & Rooms</a></li>
              <li><a href="#services" className="hover:text-gold-300 transition-colors">Premium Services</a></li>
              <li><a href="#gallery" className="hover:text-gold-300 transition-colors">Visual Gallery</a></li>
              <li><a href="#faq" className="hover:text-gold-300 transition-colors">FAQ accordion</a></li>
            </ul>
          </div>

          {/* Contact Summary */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-gold-100 font-bold font-sans">
              Address & Contact
            </h4>
            <p className="text-xs leading-relaxed font-light">
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
