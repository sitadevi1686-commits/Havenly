import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Compass, Bookmark, SlidersHorizontal } from 'lucide-react';
import PropertyCard from './PropertyCard';
import {
  VIEWPORT_ONCE,
  VIEWPORT_CARD,
  MICRO_SPRING,
  LUXURY_EASE,
  sectionHeaderVariants,
  sectionHeaderItemVariants,
  createStaggerContainer,
  slideFadeVariants,
  cardHoverLift,
  buttonHoverScale,
  buttonTapScale
} from '../lib/motion';

const catalogGridVariants = createStaggerContainer(0.07, 0.04);
const editorialContainerVariants = createStaggerContainer(0.1, 0.05);

export default function FeaturedProperties({
  properties,
  onViewDetails,
  favorites,
  onToggleFavorite,
  isFilterActive,
  onResetFilters
}) {
  const [viewMode, setViewMode] = useState('editorial'); // 'editorial' | 'grid'

  // Extract properties for asymmetric layout
  const largeCard = properties.find(p => p.gridType === 'large') || properties[0];
  const stackedTop = properties.find(p => p.gridType === 'stacked-top') || properties[1];
  const stackedBottom = properties.find(p => p.gridType === 'stacked-bottom') || properties[2];
  const tallCard = properties.find(p => p.gridType === 'tall') || properties[3];

  return (
    <section
      id="properties-section"
      className="relative py-24 sm:py-32 bg-[#F4F0E8] text-[#101313] transition-colors duration-500 overflow-hidden"
    >
      {/* Background Architectural Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E8E2D5_1px,transparent_1px),linear-gradient(to_bottom,#E8E2D5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Section Header */}
        <motion.div
          variants={sectionHeaderVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16"
        >
          <div>
            <motion.div variants={sectionHeaderItemVariants} className="inline-flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9C8052]"></span>
              <span className="text-[11px] uppercase tracking-[0.28em] font-semibold text-[#9C8052]">
                FEATURED RESIDENCES
              </span>
            </motion.div>

            <motion.h2
              variants={sectionHeaderItemVariants}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#101313] tracking-tight leading-[1.12]"
            >
              Spaces That <span className="italic font-normal text-[#9C8052]">Feel Like Home.</span>
            </motion.h2>
          </div>

          <motion.div variants={sectionHeaderItemVariants} className="flex items-center gap-4">
            {/* View Mode Toggle: Editorial vs Full Catalog Grid */}
            {!isFilterActive && (
              <div className="inline-flex rounded-sm bg-[#E8E2D5] p-1 border border-[#D8D0C0]">
                {[
                  { id: 'editorial', label: 'Asymmetric Showcase' },
                  { id: 'grid', label: 'All Grid' }
                ].map((tab) => {
                  const isActive = viewMode === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setViewMode(tab.id)}
                      className={`relative px-3 py-1.5 text-xs uppercase tracking-wider font-medium rounded-sm transition-colors ${isActive ? 'text-[#FFFFFF]' : 'text-[#101313]/70 hover:text-[#101313]'
                        }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="featuredViewPill"
                          transition={MICRO_SPRING}
                          className="absolute inset-0 bg-[#101313] rounded-sm shadow-sm z-0"
                        />
                      )}
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* View All / Explore Button with Arrow */}
            <motion.button
              whileHover={buttonHoverScale}
              whileTap={buttonTapScale}
              onClick={() => {
                const searchEl = document.querySelector('#search-section');
                if (searchEl) searchEl.scrollIntoView({ behavior: 'smooth' });
                setViewMode('grid');
              }}
              className="group inline-flex items-center gap-2 px-5 py-3 border border-[#101313] hover:border-[#9C8052] rounded-sm text-xs uppercase tracking-[0.2em] font-semibold text-[#101313] hover:text-[#9C8052] transition-colors duration-300"
            >
              <span>View All Properties</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
          </motion.div>

        </motion.div>

        <AnimatePresence mode="wait">
          {/* If no properties match filters */}
          {properties.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: LUXURY_EASE }}
              className="py-20 text-center rounded-2xl bg-white/70 border border-[#D8D0C0] p-10 max-w-xl mx-auto shadow-sm"
            >
              <SlidersHorizontal className="w-10 h-10 text-[#9C8052] mx-auto mb-4 stroke-1" />
              <h3 className="font-serif text-2xl text-[#101313] font-medium mb-2">No Matching Accommodations</h3>
              <p className="text-sm text-[#101313]/70 mb-6">
                No student residences matched your exact combination of distance, sharing, and budget filters.
              </p>
              <motion.button
                whileHover={buttonHoverScale}
                whileTap={buttonTapScale}
                onClick={onResetFilters}
                className="px-6 py-2.5 bg-[#101313] text-[#F4F0E8] text-xs uppercase tracking-widest font-medium rounded-sm hover:bg-[#9C8052] transition-colors"
              >
                Reset Filters
              </motion.button>
            </motion.div>
          ) : isFilterActive || viewMode === 'grid' ? (
            /* Full Responsive Grid View */
            <motion.div
              key="grid-view"
              variants={catalogGridVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {properties.map((prop) => (
                <PropertyCard
                  key={prop.id}
                  property={prop}
                  onViewDetails={onViewDetails}
                  isFavorite={favorites.includes(prop.id)}
                  onToggleFavorite={onToggleFavorite}
                  layoutMode="standard"
                />
              ))}
            </motion.div>
          ) : (
            /* Asymmetric Editorial Grid (Mirroring reference layout) */
            <motion.div
              key="editorial-view"
              variants={editorialContainerVariants}
              initial="hidden"
              whileInView="visible"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              viewport={VIEWPORT_CARD}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch"
            >

              {/* Column 1: Large Featured Card (spans 5 cols) */}
              {largeCard && (
                <motion.div
                  variants={slideFadeVariants('left')}
                  className="lg:col-span-5 flex flex-col"
                >
                  <motion.div
                    whileHover={cardHoverLift}
                    className="group relative h-full rounded-2xl overflow-hidden bg-[#101313] text-white shadow-2xl border border-[#101313]/20 flex flex-col justify-end min-h-[480px] lg:min-h-[580px]"
                  >
                    <img
                      src={largeCard.image}
                      alt={largeCard.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101313] via-[#101313]/40 to-transparent"></div>

                    {/* Top Badges */}
                    <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
                      <span className="px-3 py-1 rounded-sm bg-[#101313]/85 text-[#C6A36A] border border-[#C6A36A]/40 text-[10px] uppercase tracking-widest font-semibold backdrop-blur-md">
                        {largeCard.category}
                      </span>

                      <motion.button
                        whileHover={{ scale: 1.08, transition: MICRO_SPRING }}
                        whileTap={{ scale: 0.86, transition: MICRO_SPRING }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(largeCard.id);
                        }}
                        className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${favorites.includes(largeCard.id)
                            ? 'bg-[#C6A36A] text-[#101313]'
                            : 'bg-[#101313]/70 text-white hover:text-[#C6A36A]'
                          }`}
                        aria-label="Save"
                      >
                        <Bookmark className={`w-4 h-4 ${favorites.includes(largeCard.id) ? 'fill-[#101313]' : ''}`} />
                      </motion.button>
                    </div>

                    {/* Bottom Editorial Card Information */}
                    <div className="relative z-10 p-6 sm:p-8 bg-gradient-to-t from-[#101313] to-transparent">
                      <div className="flex items-center gap-2 text-xs text-[#C6A36A] mb-1">
                        <Compass className="w-3.5 h-3.5" />
                        <span>{largeCard.distanceDisplay}</span>
                      </div>

                      <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-1">
                        {largeCard.name}
                      </h3>
                      <p className="text-xs text-[#A6AAA4] mb-4">
                        {largeCard.location} &bull; {largeCard.roomType}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#A6AAA4] block">Monthly Rent</span>
                          <span className="font-serif text-2xl text-white font-medium">${largeCard.monthlyRent}</span>
                          <span className="text-xs text-[#A6AAA4]">/month</span>
                        </div>

                        <motion.button
                          whileTap={buttonTapScale}
                          onClick={() => onViewDetails(largeCard)}
                          className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C6A36A] hover:text-white font-medium group/btn"
                        >
                          <span>View Details</span>
                          <div className="w-9 h-9 rounded-full bg-[#191D1C] border border-[#C6A36A]/40 flex items-center justify-center group-hover/btn:bg-[#C6A36A] group-hover/btn:text-[#101313] transition-all">
                            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                          </div>
                        </motion.button>
                      </div>
                    </div>

                  </motion.div>
                </motion.div>
              )}

              {/* Column 2: Stacked Middle Cards (spans 4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-6 sm:gap-8 justify-between">
                {stackedTop && (
                  <motion.div
                    variants={slideFadeVariants('up')}
                    whileHover={cardHoverLift}
                    className="group relative rounded-2xl overflow-hidden bg-[#101313] text-white shadow-xl min-h-[270px] flex flex-col justify-end border border-black/10"
                  >
                    <img
                      src={stackedTop.image}
                      alt={stackedTop.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101313] via-[#101313]/50 to-transparent"></div>

                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-2.5 py-1 rounded-sm bg-[#101313]/85 text-[#C6A36A] text-[9px] uppercase tracking-widest font-semibold backdrop-blur-md">
                        {stackedTop.category}
                      </span>
                    </div>

                    <div className="relative z-10 p-5 bg-gradient-to-t from-[#101313] to-transparent">
                      <h3 className="font-serif text-xl text-white font-normal mb-0.5">
                        {stackedTop.name}
                      </h3>
                      <p className="text-xs text-[#A6AAA4] mb-3">
                        {stackedTop.location} &bull; ${stackedTop.monthlyRent}/mo
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-[11px] text-[#C6A36A]">
                          {stackedTop.distanceKm} km from campus
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={buttonTapScale}
                          onClick={() => onViewDetails(stackedTop)}
                          className="w-8 h-8 rounded-full bg-[#191D1C] border border-[#C6A36A]/40 flex items-center justify-center text-[#C6A36A] hover:bg-[#C6A36A] hover:text-[#101313] transition-colors"
                          title="View Details"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {stackedBottom && (
                  <motion.div
                    variants={slideFadeVariants('up')}
                    whileHover={cardHoverLift}
                    className="group relative rounded-2xl overflow-hidden bg-[#101313] text-white shadow-xl min-h-[270px] flex flex-col justify-end border border-black/10"
                  >
                    <img
                      src={stackedBottom.image}
                      alt={stackedBottom.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101313] via-[#101313]/50 to-transparent"></div>

                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-2.5 py-1 rounded-sm bg-[#101313]/85 text-[#C6A36A] text-[9px] uppercase tracking-widest font-semibold backdrop-blur-md">
                        {stackedBottom.category}
                      </span>
                    </div>

                    <div className="relative z-10 p-5 bg-gradient-to-t from-[#101313] to-transparent">
                      <h3 className="font-serif text-xl text-white font-normal mb-0.5">
                        {stackedBottom.name}
                      </h3>
                      <p className="text-xs text-[#A6AAA4] mb-3">
                        {stackedBottom.location} &bull; ${stackedBottom.monthlyRent}/mo
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-[11px] text-[#C6A36A]">
                          {stackedBottom.distanceKm} km from campus
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={buttonTapScale}
                          onClick={() => onViewDetails(stackedBottom)}
                          className="w-8 h-8 rounded-full bg-[#191D1C] border border-[#C6A36A]/40 flex items-center justify-center text-[#C6A36A] hover:bg-[#C6A36A] hover:text-[#101313] transition-colors"
                          title="View Details"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Column 3: Tall Card (spans 3 cols) */}
              {tallCard && (
                <motion.div
                  variants={slideFadeVariants('right')}
                  className="lg:col-span-3 flex flex-col"
                >
                  <motion.div
                    whileHover={cardHoverLift}
                    className="group relative h-full rounded-2xl overflow-hidden bg-[#101313] text-white shadow-2xl flex flex-col justify-end min-h-[480px] lg:min-h-[580px] border border-black/10"
                  >
                    <img
                      src={tallCard.image}
                      alt={tallCard.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101313] via-[#101313]/40 to-transparent"></div>

                    <div className="absolute top-6 left-6 z-10">
                      <span className="px-3 py-1 rounded-sm bg-[#101313]/85 text-[#C6A36A] border border-[#C6A36A]/40 text-[10px] uppercase tracking-widest font-semibold backdrop-blur-md">
                        {tallCard.category}
                      </span>
                    </div>

                    <div className="relative z-10 p-6 bg-gradient-to-t from-[#101313] to-transparent">
                      <span className="text-xs text-[#C6A36A] block mb-1">
                        {tallCard.specs.floor}
                      </span>
                      <h3 className="font-serif text-2xl text-white font-normal mb-1">
                        {tallCard.name}
                      </h3>
                      <p className="text-xs text-[#A6AAA4] mb-4">
                        {tallCard.location} &bull; ${tallCard.monthlyRent}/mo
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div>
                          <span className="text-[10px] uppercase text-[#A6AAA4] block">Deposit</span>
                          <span className="text-xs text-white">${tallCard.deposit}</span>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={buttonTapScale}
                          onClick={() => onViewDetails(tallCard)}
                          className="w-9 h-9 rounded-full bg-[#191D1C] border border-[#C6A36A]/40 flex items-center justify-center text-[#C6A36A] hover:bg-[#C6A36A] hover:text-[#101313] transition-colors"
                          title="View Details"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
