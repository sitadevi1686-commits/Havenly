import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, ArrowUpRight, MapPin, Compass, ShieldCheck, Clock, Users } from 'lucide-react';
import {
  fadeUpCardVariants,
  cardHoverLift,
  MICRO_SPRING,
  buttonTapScale
} from '../lib/motion';

export default function PropertyCard({
  property,
  onViewDetails,
  isFavorite,
  onToggleFavorite,
  layoutMode = "standard"
}) {
  return (
    <motion.div
      variants={fadeUpCardVariants}
      whileHover={cardHoverLift}
      className={`group relative rounded-xl overflow-hidden bg-[#191D1C] border border-white/10 hover:border-[#C6A36A]/50 transition-colors duration-500 flex flex-col shadow-luxury ${
        layoutMode === 'large' ? 'h-full min-h-[480px]' : 'h-full'
      }`}
    >
      {/* Property Image Container */}
      <div className={`relative overflow-hidden ${
        layoutMode === 'large' ? 'h-[320px] sm:h-[380px] lg:h-[400px]' :
        layoutMode === 'stacked' ? 'h-[200px] sm:h-[220px]' : 'h-[240px] sm:h-[260px]'
      }`}>
        <img
          src={property.image}
          alt={property.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Ambient Dark Gradient Over Image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#191D1C] via-[#191D1C]/20 to-black/40"></div>

        {/* Top Badges Bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-sm bg-[#101313]/85 backdrop-blur-md text-[#C6A36A] border border-[#C6A36A]/30 text-[10px] uppercase tracking-widest font-medium">
              {property.category}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-sm bg-[#101313]/70 backdrop-blur-md text-[#FFFFFF] text-[10px] font-light">
              <ShieldCheck className="w-3 h-3 text-[#C6A36A]" />
              Verified
            </span>
          </div>

          {/* Bookmark / Favourite Button */}
          <motion.button
            whileHover={{ scale: 1.08, transition: MICRO_SPRING }}
            whileTap={{ scale: 0.86, transition: MICRO_SPRING }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(property.id);
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-colors duration-300 border ${
              isFavorite
                ? 'bg-[#C6A36A] text-[#101313] border-[#C6A36A] shadow-gold-glow'
                : 'bg-[#101313]/60 text-white/80 hover:text-white border-white/15 hover:border-[#C6A36A]/50'
            }`}
            title={isFavorite ? "Remove from saved" : "Save property"}
            aria-label="Save property"
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-[#101313]' : ''}`} />
          </motion.button>
        </div>

        {/* Rent Tag Floating on Image Bottom-Left */}
        <div className="absolute bottom-3 left-4 z-10 flex items-baseline gap-1 bg-[#101313]/90 backdrop-blur-md px-3 py-1.5 rounded-sm border border-white/10">
          <span className="text-[10px] uppercase tracking-wider text-[#A6AAA4]">Rent</span>
          <span className="font-serif text-lg sm:text-xl font-medium text-[#FFFFFF] ml-1">
            ${property.monthlyRent}
          </span>
          <span className="text-[11px] text-[#A6AAA4]">/mo</span>
        </div>

        {/* Proximity Pill Floating Bottom-Right */}
        <div className="absolute bottom-3 right-4 z-10 flex items-center gap-1.5 text-[11px] text-[#C6A36A] bg-[#101313]/80 backdrop-blur-md px-2.5 py-1.5 rounded-sm border border-[#C6A36A]/20">
          <Compass className="w-3.5 h-3.5" />
          <span>{property.distanceKm} km to Campus</span>
        </div>
      </div>

      {/* Property Details Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Property Name */}
          <h3 className="font-serif text-xl sm:text-2xl text-[#FFFFFF] font-normal tracking-tight group-hover:text-[#F4F0E8] transition-colors">
            {property.name}
          </h3>

          {/* College & Location */}
          <div className="flex items-center gap-1.5 text-xs text-[#A6AAA4] mt-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#C6A36A] shrink-0" />
            <span className="truncate">{property.location} &bull; {property.college.split('&')[0]}</span>
          </div>

          {/* Key Specs Pills */}
          <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center gap-2 text-[11px] text-[#A6AAA4]">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm bg-[#101313] border border-white/5 text-white/90">
              <Users className="w-3 h-3 text-[#C6A36A]" />
              {property.roomType}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm bg-[#101313] border border-white/5 text-white/90">
              <Clock className="w-3 h-3 text-[#C6A36A]" />
              {property.curfewCategory}
            </span>
            <span className="px-2 py-1 text-[10px] text-[#C6A36A] font-light">
              Dep: ${property.deposit}
            </span>
          </div>
        </div>

        {/* View Details Action Bar */}
        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-[#A6AAA4] group-hover:text-white transition-colors">
            {property.specs.furnishing}
          </span>

          <motion.button
            whileTap={buttonTapScale}
            onClick={() => onViewDetails(property)}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-medium text-[#C6A36A] group-hover:text-white transition-colors py-1"
          >
            <span>View Details</span>
            <div className="w-7 h-7 rounded-full bg-[#101313] border border-[#C6A36A]/40 flex items-center justify-center group-hover:border-[#C6A36A] group-hover:bg-[#C6A36A] group-hover:text-[#101313] transition-all duration-300">
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </motion.button>
        </div>

      </div>

    </motion.div>
  );
}
