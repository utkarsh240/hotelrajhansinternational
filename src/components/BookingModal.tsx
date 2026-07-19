"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Users, Home, User, Phone, Mail, Award, CheckCircle } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoomDefault?: string;
}

export default function BookingModal({ isOpen, onClose, selectedRoomDefault = "executive" }: BookingModalProps) {
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "2",
    roomType: selectedRoomDefault,
    name: "",
    phone: "",
    email: "",
    specialRequests: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setBookingRef("HRJ-" + Math.floor(100000 + Math.random() * 900000));
    }, 350);
  };

  const handleClose = () => {
    onClose();
    // Reset state after transition completes
    setTimeout(() => {
      setIsSubmitted(false);
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-cream/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative z-10 w-full max-w-2xl max-h-[calc(100vh-2rem)] overflow-y-auto overflow-x-hidden rounded-lg border border-gold-400/20 bg-cream-soft shadow-2xl"
          >
            {/* Elegant Top Gold Accent Line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600" />

            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-gold-200/60 hover:text-gold-300 transition-colors rounded-full hover:bg-brown-900/5"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {!isSubmitted ? (
              <div className="p-6 md:p-8">
                <div className="mb-6 text-center">
                  <h3 className="font-serif text-2xl md:text-3xl text-gold-300 tracking-wide">
                    Book a room
                  </h3>
                  <p className="text-gold-200/60 text-xs tracking-widest uppercase mt-1">
                    We&apos;ll confirm by phone or email
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Reservation Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-widest text-gold-200/80 mb-1.5 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-gold-400" /> Check-In
                      </label>
                      <input
                        type="date"
                        name="checkIn"
                        required
                        value={formData.checkIn}
                        onChange={handleChange}
                        className="w-full bg-paper border border-gold-400/20 rounded-lg py-2.5 px-3 text-gold-100 focus:outline-none focus:border-gold-400/50 transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-widest text-gold-200/80 mb-1.5 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-gold-400" /> Check-Out
                      </label>
                      <input
                        type="date"
                        name="checkOut"
                        required
                        value={formData.checkOut}
                        onChange={handleChange}
                        className="w-full bg-paper border border-gold-400/20 rounded-lg py-2.5 px-3 text-gold-100 focus:outline-none focus:border-gold-400/50 transition-colors text-sm"
                      />
                    </div>
                  </div>

                  {/* Suite selection and Guests */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-widest text-gold-200/80 mb-1.5 flex items-center gap-1.5">
                        <Home className="h-3.5 w-3.5 text-gold-400" /> Room type
                      </label>
                      <select
                        name="roomType"
                        value={formData.roomType}
                        onChange={handleChange}
                        className="w-full bg-paper border border-gold-400/20 rounded-lg py-2.5 px-3 text-gold-100 focus:outline-none focus:border-gold-400/50 transition-colors text-sm"
                      >
                        <option value="executive">Executive Room (₹3,090 - ₹3,790)</option>
                        <option value="deluxe">Deluxe Room (₹3,790 - ₹4,490)</option>
                        <option value="royal">Royal Suite (₹5,190)</option>
                        <option value="dormitory">Dormitory (Group stay)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-widest text-gold-200/80 mb-1.5 flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-gold-400" /> Guests
                      </label>
                      <select
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        className="w-full bg-paper border border-gold-400/20 rounded-lg py-2.5 px-3 text-gold-100 focus:outline-none focus:border-gold-400/50 transition-colors text-sm"
                      >
                        <option value="1">1 Guest</option>
                        <option value="2">2 Guests</option>
                        <option value="3">3 Guests</option>
                        <option value="4">4 Guests</option>
                        <option value="5+">5+ Guests (Group)</option>
                      </select>
                    </div>
                  </div>

                  <hr className="border-gold-400/10 my-2" />

                  {/* Personal details */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-widest text-gold-200/80 mb-1.5 flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-gold-400" /> Full name
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Your name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-paper border border-gold-400/20 rounded-lg py-2.5 px-3 text-gold-100 placeholder-gold-200/20 focus:outline-none focus:border-gold-400/50 transition-colors text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-widest text-gold-200/80 mb-1.5 flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-gold-400" /> Contact Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="+91 98765 43210"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full bg-paper border border-gold-400/20 rounded-lg py-2.5 px-3 text-gold-100 placeholder-gold-200/20 focus:outline-none focus:border-gold-400/50 transition-colors text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-widest text-gold-200/80 mb-1.5 flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-gold-400" /> Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="you@email.com"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full bg-paper border border-gold-400/20 rounded-lg py-2.5 px-3 text-gold-100 placeholder-gold-200/20 focus:outline-none focus:border-gold-400/50 transition-colors text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-widest text-gold-200/80 mb-1.5">
                        Special requests
                      </label>
                      <textarea
                        name="specialRequests"
                        rows={2}
                        placeholder="Early check-in, extra bed, station pickup..."
                        value={formData.specialRequests}
                        onChange={handleChange}
                        className="w-full bg-paper border border-gold-400/20 rounded-lg py-2.5 px-3 text-gold-100 placeholder-gold-200/20 focus:outline-none focus:border-gold-400/50 transition-colors text-sm resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 hover:from-gold-700 hover:via-gold-500 hover:to-gold-700 text-brown-900 font-medium uppercase tracking-widest text-xs py-3.5 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-gold-400/10 active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-brown-900" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        "Submit booking request"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center"
              >
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="bg-gold-400/10 p-4 rounded-full border border-gold-400/30"
                    >
                      <CheckCircle className="h-12 w-12 text-gold-400" />
                    </motion.div>
                    <div className="absolute -inset-1 rounded-full bg-gold-400/20 blur-sm animate-pulse" />
                  </div>
                </div>

                <h3 className="font-serif text-3xl text-gold-300 tracking-wide mb-3">
                  Request received
                </h3>
                <p className="text-gold-200/80 max-w-md mx-auto text-sm leading-relaxed mb-6">
                  Thanks, <span className="text-gold-100 font-semibold">{formData.name}</span>. We&apos;ve noted your request for the{" "}
                  <span className="text-gold-100 font-semibold">
                    {formData.roomType === "royal"
                      ? "Royal Suite"
                      : formData.roomType === "deluxe"
                      ? "Deluxe Room"
                      : formData.roomType === "dormitory"
                      ? "Dormitory"
                      : "Executive Room"}
                  </span>.
                </p>

                <div className="bg-paper border border-gold-400/20 rounded-lg p-5 max-w-sm mx-auto mb-8 text-left space-y-2">
                  <div className="flex justify-between text-xs text-gold-200/60 uppercase tracking-wider">
                    <span>Reference ID:</span>
                    <span className="text-gold-400 font-mono font-semibold">{bookingRef}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gold-200/60 uppercase tracking-wider">
                    <span>Dates:</span>
                    <span className="text-gold-100 font-medium">{formData.checkIn} to {formData.checkOut}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gold-200/60 uppercase tracking-wider">
                    <span>Guests:</span>
                    <span className="text-gold-100 font-medium">{formData.guests} Guest(s)</span>
                  </div>
                </div>

                <div className="space-y-4 max-w-md mx-auto">
                  <p className="text-xs text-gold-200/50 leading-relaxed">
                    Our team will call <span className="text-gold-300">{formData.phone}</span> or email{" "}
                    <span className="text-gold-300">{formData.email}</span> to confirm availability and rates.
                  </p>
                  
                  <div className="pt-2">
                    <button
                      onClick={handleClose}
                      className="border border-gold-400/30 hover:border-gold-300 text-gold-300 hover:text-gold-200 font-medium uppercase tracking-widest text-xs py-3 px-8 rounded-lg transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Bottom Brand Bar */}
            <div className="bg-cream py-3 px-6 border-t border-gold-400/5 flex justify-between items-center text-[10px] text-gold-200/30 uppercase tracking-widest">
              <span className="flex items-center gap-1">
                <Award className="h-3 w-3 text-gold-400/50" /> Hotel Rajhans International
              </span>
              <span>Est. 2018</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
