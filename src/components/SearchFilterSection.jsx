import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, MapPin,
  X, RotateCcw, Check, ChevronDown, Bookmark
} from 'lucide-react';
import { COLLEGE_LIST, CATEGORIES } from '../data/propertiesData';
import {
  VIEWPORT_ONCE,
  MICRO_SPRING,
  sectionHeaderVariants,
  sectionHeaderItemVariants,
  fadeUpCardVariants,
  drawerVariants,
  buttonHoverScale,
  buttonTapScale
} from '../lib/motion';

export default function SearchFilterSection({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedCollege,
  setSelectedCollege,
  maxDistance,
  setMaxDistance,
  selectedSharing,
  setSelectedSharing,
  maxBudget,
  setMaxBudget,
  curfewFilter,
  setCurfewFilter,
  selectedAmenities,
  toggleAmenity,
  sortBy,
  setSortBy,
  showFavoritesOnly,
  setShowFavoritesOnly,
  favoriteCount,
  onResetFilters,
  totalResults
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const ALL_AMENITIES = [
    "High-Speed Fiber WiFi",
    "Dedicated Study Pods",
    "Private En-Suite Bath",
    "Meal Plan",
    "Housekeeping",
    "24/7 Security",
    "Gym",
    "Laundry Studio"
  ];

  const SHARING_OPTIONS = ["All", "Single", "Double", "Triple"];
  const DISTANCE_OPTIONS = [
    { label: "Any Distance", val: 999 },
    { label: "Within 1 km", val: 1.0 },
    { label: "Within 2 km", val: 2.0 },
    { label: "Within 5 km", val: 5.0 }
  ];
  const CURFEW_OPTIONS = [
    { label: "All Policies", val: "All" },
    { label: "Flexible 24/7", val: "Flexible" },
    { label: "11:00 PM Access", val: "11 PM" },
    { label: "10:30 PM Access", val: "10 PM" }
  ];

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All Properties' ||
    selectedCollege !== 'All Colleges' ||
    maxDistance !== 999 ||
    selectedSharing !== 'All' ||
    maxBudget < 2000 ||
    curfewFilter !== 'All' ||
    selectedAmenities.length > 0 ||
    showFavoritesOnly;

  return (
    <section id="search-section" className="relative z-20 pt-16 pb-8 bg-[#101313] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Title & Subheading */}
        <motion.div
          variants={sectionHeaderVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8"
        >
          <div>
            <motion.span
              variants={sectionHeaderItemVariants}
              className="text-[10px] uppercase tracking-[0.3em] font-medium text-[#C6A36A] inline-block"
            >
              PRECISION SEARCH
            </motion.span>
            <motion.h2
              variants={sectionHeaderItemVariants}
              className="font-serif text-3xl sm:text-4xl text-[#FFFFFF] mt-1 font-light"
            >
              Find Accommodation Near Your Campus
            </motion.h2>
            <motion.p
              variants={sectionHeaderItemVariants}
              className="text-sm text-[#A6AAA4] mt-1"
            >
              Filter by walking distance, room sharing, budget, and curfew policies.
            </motion.p>
          </div>

          <motion.div variants={sectionHeaderItemVariants} className="flex items-center gap-3">
            {/* Saved items quick filter */}
            <motion.button
              whileHover={buttonHoverScale}
              whileTap={buttonTapScale}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs uppercase tracking-wider font-medium border transition-colors ${
                showFavoritesOnly
                  ? 'bg-[#C6A36A] text-[#101313] border-[#C6A36A]'
                  : 'bg-[#191D1C] text-[#A6AAA4] border-white/10 hover:border-[#C6A36A]/50 hover:text-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-[#101313]' : favoriteCount > 0 ? 'fill-[#C6A36A] text-[#C6A36A]' : ''}`} />
              <span>Saved Only ({favoriteCount})</span>
            </motion.button>

            {/* Reset button */}
            <AnimatePresence>
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileTap={buttonTapScale}
                  onClick={onResetFilters}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs uppercase tracking-wider text-[#C6A36A] hover:text-[#FFFFFF] transition-colors"
                  title="Reset all search parameters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Primary Search Console (Dark Glass Architectural Bar) */}
        <motion.div
          variants={fadeUpCardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="rounded-xl bg-[#191D1C] border border-white/10 p-4 sm:p-5 shadow-2xl"
        >
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Search Input: College / Location / Property Name */}
            <div className="md:col-span-5 relative">
              <label className="block text-[10px] uppercase tracking-widest text-[#C6A36A] mb-1.5 font-medium">
                Keyword & Campus Search
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#A6AAA4] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search college, neighborhood, PG name..."
                  className="w-full bg-[#101313] border border-white/10 text-sm text-[#FFFFFF] placeholder:text-[#A6AAA4]/60 pl-10 pr-9 py-3 rounded-sm focus:outline-none focus:border-[#C6A36A] transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A6AAA4] hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* College Dropdown */}
            <div className="md:col-span-4 relative">
              <label className="block text-[10px] uppercase tracking-widest text-[#C6A36A] mb-1.5 font-medium">
                Target University Hub
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#A6AAA4] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                  className="w-full bg-[#101313] border border-white/10 text-sm text-[#FFFFFF] pl-10 pr-8 py-3 rounded-sm focus:outline-none focus:border-[#C6A36A] appearance-none cursor-pointer transition-colors"
                >
                  {COLLEGE_LIST.map((col) => (
                    <option key={col} value={col} className="bg-[#101313] text-white">
                      {col}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#A6AAA4] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3 relative">
              <label className="block text-[10px] uppercase tracking-widest text-[#C6A36A] mb-1.5 font-medium">
                Sort Properties By
              </label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-[#101313] border border-white/10 text-sm text-[#FFFFFF] px-4 py-3 rounded-sm focus:outline-none focus:border-[#C6A36A] appearance-none cursor-pointer transition-colors"
                >
                  <option value="featured" className="bg-[#101313] text-white">Editorial Featured</option>
                  <option value="price-asc" className="bg-[#101313] text-white">Rent: Low to High</option>
                  <option value="price-desc" className="bg-[#101313] text-white">Rent: High to Low</option>
                  <option value="distance" className="bg-[#101313] text-white">Proximity: Closest First</option>
                  <option value="rating" className="bg-[#101313] text-white">Highest Student Rating</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#A6AAA4] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* Category Chips Bar with Animated Active Pill */}
          <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-[#A6AAA4] mr-1 hidden sm:inline">
                Type:
              </span>
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <motion.button
                    key={cat}
                    whileTap={buttonTapScale}
                    onClick={() => setSelectedCategory(cat)}
                    className={`relative px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                      isSelected
                        ? 'text-[#101313] font-semibold'
                        : 'bg-[#101313] text-[#A6AAA4] hover:text-[#FFFFFF] border border-white/5 hover:border-white/20'
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="activeCategoryPill"
                        transition={MICRO_SPRING}
                        className="absolute inset-0 bg-[#C6A36A] rounded-sm shadow-sm z-0"
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Toggle Advanced Filters Button */}
            <motion.button
              whileTap={buttonTapScale}
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#C6A36A] hover:text-[#FFFFFF] transition-colors py-1"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showAdvanced ? 'Hide Extended Filters' : 'More Filters (Distance, Sharing, Curfew)'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} />
            </motion.button>
          </div>

          {/* Smooth Expandable Advanced Filter Drawer */}
          <AnimatePresence initial={false}>
            {showAdvanced && (
              <motion.div
                variants={drawerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="mt-5 pt-5 border-t border-[#C6A36A]/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Max Distance from College */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#C6A36A] mb-2 font-medium">
                      Distance from College
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {DISTANCE_OPTIONS.map((opt) => (
                        <motion.button
                          key={opt.label}
                          whileTap={buttonTapScale}
                          onClick={() => setMaxDistance(opt.val)}
                          className={`px-2.5 py-2 text-xs text-center rounded-sm transition-colors border ${
                            maxDistance === opt.val
                              ? 'bg-[#C6A36A]/20 border-[#C6A36A] text-[#FFFFFF] font-medium'
                              : 'bg-[#101313] border-white/5 text-[#A6AAA4] hover:border-white/20'
                          }`}
                        >
                          {opt.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Room Sharing Filter */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#C6A36A] mb-2 font-medium">
                      Room Sharing Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {SHARING_OPTIONS.map((share) => (
                        <motion.button
                          key={share}
                          whileTap={buttonTapScale}
                          onClick={() => setSelectedSharing(share)}
                          className={`px-2.5 py-2 text-xs text-center rounded-sm transition-colors border ${
                            selectedSharing === share
                              ? 'bg-[#C6A36A]/20 border-[#C6A36A] text-[#FFFFFF] font-medium'
                              : 'bg-[#101313] border-white/5 text-[#A6AAA4] hover:border-white/20'
                          }`}
                        >
                          {share === 'All' ? 'All Sharing' : `${share} Sharing`}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Curfew Rules */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#C6A36A] mb-2 font-medium">
                      Curfew Policy
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {CURFEW_OPTIONS.map((curf) => (
                        <motion.button
                          key={curf.label}
                          whileTap={buttonTapScale}
                          onClick={() => setCurfewFilter(curf.val)}
                          className={`px-2.5 py-2 text-xs text-center rounded-sm transition-colors border ${
                            curfewFilter === curf.val
                              ? 'bg-[#C6A36A]/20 border-[#C6A36A] text-[#FFFFFF] font-medium'
                              : 'bg-[#101313] border-white/5 text-[#A6AAA4] hover:border-white/20'
                          }`}
                        >
                          {curf.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Monthly Rental Budget Range */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#C6A36A] font-medium">
                        Max Monthly Rent
                      </label>
                      <span className="text-xs font-serif font-medium text-[#FFFFFF]">
                        ${maxBudget}/mo
                      </span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="2000"
                      step="50"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(Number(e.target.value))}
                      className="w-full accent-[#C6A36A] bg-[#101313] h-1.5 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[#A6AAA4] mt-1.5">
                      <span>$500/mo</span>
                      <span>$1,250/mo</span>
                      <span>$2,000+/mo</span>
                    </div>
                  </div>

                  {/* Amenities Checklist (Full row) */}
                  <div className="sm:col-span-2 lg:col-span-4 pt-2">
                    <label className="block text-[10px] uppercase tracking-widest text-[#C6A36A] mb-2 font-medium">
                      Must-Have Amenities
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {ALL_AMENITIES.map((amenity) => {
                        const isSelected = selectedAmenities.includes(amenity);
                        return (
                          <motion.button
                            key={amenity}
                            whileTap={buttonTapScale}
                            onClick={() => toggleAmenity(amenity)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors border ${
                              isSelected
                                ? 'bg-[#C6A36A] text-[#101313] border-[#C6A36A] font-medium'
                                : 'bg-[#101313] text-[#A6AAA4] border-white/5 hover:border-white/20'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-[#101313]" />}
                            <span>{amenity}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>

        {/* Live Filter Results Count Bar */}
        <div className="mt-4 flex items-center justify-between text-xs text-[#A6AAA4] px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C6A36A]"></span>
            <span>
              Showing <strong className="text-white font-medium">{totalResults}</strong> curated student residences
            </span>
            {showFavoritesOnly && (
              <span className="text-[#C6A36A] bg-[#C6A36A]/10 px-2 py-0.5 rounded-sm">
                (Filtered by Saved)
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <span className="text-[11px] text-[#C6A36A]">
              Filters active &bull; Live updated
            </span>
          )}
        </div>

      </div>
    </section>
  );
}
