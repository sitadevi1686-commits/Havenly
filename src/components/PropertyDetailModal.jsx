import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Bookmark, MapPin, Compass, ShieldCheck,
  Check, ArrowRight, Sparkles, Award
} from 'lucide-react';
import {
  modalBackdropVariants,
  modalPanelVariants,
  LUXURY_EASE,
  MICRO_SPRING,
  buttonHoverScale,
  buttonTapScale
} from '../lib/motion';

export default function PropertyDetailModal({
  property,
  onClose,
  isFavorite,
  onToggleFavorite,
  onBookNow,
  onReportProperty
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    phone: '',
    university: property?.college || '',
    preferredDate: '',
    message: ''
  });

  if (!property) return null;

  const images = property.gallery && property.gallery.length > 0
    ? property.gallery
    : [property.image];

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSubmitted(true);
  };

  return (
    <motion.div
      variants={modalBackdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-y-auto bg-black/80 backdrop-blur-md"
    >
      
      {/* Modal Dialog Container */}
      <motion.div
        variants={modalPanelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#191D1C] border border-[#C6A36A]/30 shadow-2xl text-white my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Close & Action Header */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-[#191D1C]/95 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-sm bg-[#101313] text-[#C6A36A] border border-[#C6A36A]/30 text-[10px] uppercase tracking-widest font-semibold">
              {property.category}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-[#A6AAA4]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C6A36A]" />
              Verified Inspection Pass
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Bookmark button */}
            <motion.button
              whileHover={{ scale: 1.08, transition: MICRO_SPRING }}
              whileTap={{ scale: 0.86, transition: MICRO_SPRING }}
              onClick={() => onToggleFavorite(property.id)}
              className={`p-2 rounded-full border transition-colors ${
                isFavorite
                  ? 'bg-[#C6A36A] text-[#101313] border-[#C6A36A]'
                  : 'bg-[#101313] text-white/80 border-white/10 hover:border-[#C6A36A]'
              }`}
              title={isFavorite ? "Saved" : "Save Property"}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-[#101313]' : ''}`} />
            </motion.button>

            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.08, transition: MICRO_SPRING }}
              whileTap={buttonTapScale}
              onClick={onClose}
              className="p-2 rounded-full bg-[#101313] border border-white/10 text-[#A6AAA4] hover:text-white hover:border-[#C6A36A] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 sm:p-8 lg:p-10 space-y-10">
          
          {/* Gallery Section with Crossfade */}
          <div className="space-y-4">
            <div className="relative h-[280px] sm:h-[400px] lg:h-[460px] rounded-xl overflow-hidden bg-[#101313] border border-white/5">
              <AnimatePresence mode="wait">
                <motion.img
                  key={images[activeImageIndex]}
                  src={images[activeImageIndex]}
                  alt={property.name}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: LUXURY_EASE }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {/* Photo Indicator */}
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs text-[#FFFFFF]">
                {activeImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.04 }}
                    whileTap={buttonTapScale}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-16 sm:w-24 sm:h-18 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx ? 'border-[#C6A36A] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Title, Pricing & Proximity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Info Column (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#FFFFFF] font-normal leading-tight">
                  {property.name}
                </h2>
                
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#A6AAA4] mt-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C6A36A]" />
                    <span>{property.location}</span>
                  </div>
                  <span>&bull;</span>
                  <div className="flex items-center gap-1.5 text-[#C6A36A]">
                    <Compass className="w-3.5 h-3.5" />
                    <span>{property.distanceDisplay}</span>
                  </div>
                  <span>&bull;</span>
                  <div className="flex items-center gap-1 text-white">
                    <Award className="w-3.5 h-3.5 text-[#C6A36A]" />
                    <span>{property.rating} ({property.reviewsCount} reviews)</span>
                  </div>
                </div>

                <p className="text-sm text-[#A6AAA4] font-light mt-3 italic">
                  "{property.tagline}"
                </p>
              </div>

              {/* Specs Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-[#101313] border border-white/5">
                  <span className="text-[10px] uppercase tracking-wider text-[#A6AAA4] block">Room Type</span>
                  <span className="text-xs text-white font-medium mt-0.5 block">{property.roomType}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#101313] border border-white/5">
                  <span className="text-[10px] uppercase tracking-wider text-[#A6AAA4] block">Curfew Rule</span>
                  <span className="text-xs text-[#C6A36A] font-medium mt-0.5 block">{property.curfewCategory}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#101313] border border-white/5">
                  <span className="text-[10px] uppercase tracking-wider text-[#A6AAA4] block">Unit Area</span>
                  <span className="text-xs text-white font-medium mt-0.5 block">{property.specs.sqft} sq.ft</span>
                </div>
                <div className="p-3 rounded-lg bg-[#101313] border border-white/5">
                  <span className="text-[10px] uppercase tracking-wider text-[#A6AAA4] block">Availability</span>
                  <span className="text-xs text-white font-medium mt-0.5 block">{property.specs.availableFrom}</span>
                </div>
              </div>

              {/* Description */}
              <div className="pt-4 border-t border-white/10">
                <h4 className="font-serif text-xl text-white mb-2">Architectural Description</h4>
                <p className="text-sm text-[#A6AAA4] font-light leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Amenities Grid */}
              <div className="pt-4 border-t border-white/10">
                <h4 className="font-serif text-xl text-white mb-3">Included Services & Amenities</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-[#F4F0E8] p-2 rounded bg-[#101313]/60 border border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C6A36A]"></div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Booking / Inquiry Column (5 Cols) */}
            <div className="lg:col-span-5 bg-[#101313] border border-[#C6A36A]/30 rounded-xl p-6 sm:p-7 shadow-luxury sticky top-24">
              
              {/* Rent & Deposit Headline */}
              <div className="pb-6 border-b border-white/10">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-widest text-[#A6AAA4]">Monthly Rent</span>
                  <div className="text-right">
                    <span className="font-serif text-3xl sm:text-4xl text-[#FFFFFF] font-normal">
                      ${property.monthlyRent}
                    </span>
                    <span className="text-xs text-[#A6AAA4]"> / month</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#A6AAA4] mt-2 pt-2 border-t border-white/5">
                  <span>Refundable Deposit:</span>
                  <span className="text-white font-medium">${property.deposit}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#A6AAA4] mt-1">
                  <span>Brokerage:</span>
                  <span className="text-[#C6A36A] font-medium">$0 (Zero Fee)</span>
                </div>

                {/* Primary BOOK NOW Action */}
                <div className="mt-5">
                  <motion.button
                    whileHover={buttonHoverScale}
                    whileTap={buttonTapScale}
                    onClick={() => onBookNow(property)}
                    className="w-full py-4 bg-[#C6A36A] hover:bg-[#d8b57c] text-[#101313] font-bold text-xs uppercase tracking-[0.25em] rounded-sm transition-colors shadow-luxury hover:shadow-gold-glow flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-[#101313]" />
                    <span>BOOK NOW &bull; RESERVE BED</span>
                    <ArrowRight className="w-4 h-4 text-[#101313]" />
                  </motion.button>
                  <span className="text-[10px] text-center text-[#A6AAA4] block mt-1.5">
                    Transparent reservation request &bull; Landlord review required
                  </span>
                </div>
              </div>

              {/* Booking / Tour Form */}
              <div className="mt-6">
                <h4 className="font-serif text-lg text-white mb-1">
                  Schedule Private Tour or Reserve
                </h4>
                <p className="text-xs text-[#A6AAA4] mb-4">
                  Connect directly with the verified Havenly campus concierge.
                </p>

                <AnimatePresence mode="wait">
                  {bookingSubmitted ? (
                    <motion.div
                      key="tour-confirmed"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: LUXURY_EASE }}
                      className="p-6 rounded-lg bg-[#191D1C] border border-[#C6A36A] text-center space-y-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#C6A36A] text-[#101313] flex items-center justify-center mx-auto">
                        <Check className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <h5 className="font-serif text-xl text-white">Viewing Scheduled!</h5>
                      <p className="text-xs text-[#A6AAA4]">
                        A confirmation email and WhatsApp tour pass have been dispatched to <strong className="text-white">{formData.email}</strong>.
                      </p>
                      <button
                        onClick={() => setBookingSubmitted(false)}
                        className="text-xs text-[#C6A36A] hover:underline uppercase tracking-wider"
                      >
                        Book Another Slot
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="tour-form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleBookingSubmit}
                      className="space-y-3.5"
                    >
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.studentName}
                          onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                          placeholder="e.g. Alex Morgan"
                          className="w-full bg-[#191D1C] border border-white/10 text-xs text-white px-3 py-2.5 rounded focus:outline-none focus:border-[#C6A36A]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="alex@stanford.edu"
                            className="w-full bg-[#191D1C] border border-white/10 text-xs text-white px-3 py-2.5 rounded focus:outline-none focus:border-[#C6A36A]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+1 (555) 019-2834"
                            className="w-full bg-[#191D1C] border border-white/10 text-xs text-white px-3 py-2.5 rounded focus:outline-none focus:border-[#C6A36A]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">
                          Preferred Tour Date
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.preferredDate}
                          onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                          className="w-full bg-[#191D1C] border border-white/10 text-xs text-white px-3 py-2.5 rounded focus:outline-none focus:border-[#C6A36A]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">
                          Special Requests (Optional)
                        </label>
                        <textarea
                          rows={2}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Mention roommate preferences or dietary needs..."
                          className="w-full bg-[#191D1C] border border-white/10 text-xs text-white px-3 py-2 rounded focus:outline-none focus:border-[#C6A36A] resize-none"
                        />
                      </div>

                      <motion.button
                        whileHover={buttonHoverScale}
                        whileTap={buttonTapScale}
                        type="submit"
                        className="w-full py-3.5 bg-[#C6A36A] hover:bg-[#d8b57c] text-[#101313] font-medium text-xs uppercase tracking-[0.2em] rounded-sm transition-colors shadow-md flex items-center justify-center gap-2 mt-2"
                      >
                        <span>Request Free Campus Tour</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

              {/* Concierge Micro Contact */}
              <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-[#A6AAA4]">
                <span>Concierge Desk: 9am - 8pm</span>
                <span className="text-[#C6A36A]">Direct Line: +1 (800) HAVENLY</span>
              </div>

              {/* Report Integrity Action */}
              <div className="mt-3 pt-2 text-center">
                <button
                  onClick={() => onReportProperty(property)}
                  className="text-[11px] text-[#A6AAA4] hover:text-red-400 transition-colors underline"
                >
                  Report incorrect information or suspicious listing
                </button>
              </div>

            </div>

          </div>

        </div>

      </motion.div>
    </motion.div>
  );
}
