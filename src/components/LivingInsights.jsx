import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock, Calendar } from 'lucide-react';
import { INSIGHTS } from '../data/insightsData';
import {
  VIEWPORT_ONCE,
  VIEWPORT_CARD,
  sectionHeaderVariants,
  sectionHeaderItemVariants,
  createStaggerContainer,
  fadeUpCardVariants,
  cardHoverLift
} from '../lib/motion';

const insightsGridVariants = createStaggerContainer(0.09, 0.05);

export default function LivingInsights({ onReadArticle }) {
  return (
    <section
      id="insights-section"
      className="relative py-24 sm:py-32 bg-[#101313] text-[#FFFFFF] border-t border-white/5 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <motion.div
          variants={sectionHeaderVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-20"
        >
          <div>
            <motion.div variants={sectionHeaderItemVariants} className="inline-flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6A36A]"></span>
              <span className="text-[11px] uppercase tracking-[0.28em] font-semibold text-[#C6A36A]">
                STUDENT LIVING INSIGHTS
              </span>
            </motion.div>
            
            <motion.h2
              variants={sectionHeaderItemVariants}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#FFFFFF] tracking-tight leading-[1.12]"
            >
              Insights for Better <br />
              <span className="italic font-normal text-gold-gradient">Student Living.</span>
            </motion.h2>
          </div>

          <motion.p variants={sectionHeaderItemVariants} className="text-sm text-[#A6AAA4] max-w-sm">
            Curated editorial guides on budgeting, legal lease protections, and navigating campus accommodation.
          </motion.p>
        </motion.div>

        {/* Editorial Magazine Cards Grid */}
        <motion.div
          variants={insightsGridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CARD}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7"
        >
          {INSIGHTS.map((item) => (
            <motion.article
              key={item.id}
              variants={fadeUpCardVariants}
              whileHover={cardHoverLift}
              onClick={() => onReadArticle(item)}
              className="group cursor-pointer flex flex-col justify-between rounded-xl overflow-hidden bg-[#191D1C] border border-white/10 hover:border-[#C6A36A]/50 transition-colors duration-500 shadow-luxury"
            >
              <div>
                {/* Photo Header */}
                <div className="relative h-60 sm:h-64 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#191D1C] via-transparent to-black/30"></div>

                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-2.5 py-1 rounded-sm bg-[#101313]/90 text-[#C6A36A] border border-[#C6A36A]/30 text-[10px] uppercase tracking-widest font-semibold backdrop-blur-md">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6">
                  {/* Meta Information */}
                  <div className="flex items-center gap-4 text-xs text-[#A6AAA4] mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C6A36A]" />
                      {item.date}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C6A36A]" />
                      {item.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-2xl text-[#FFFFFF] font-normal leading-snug group-hover:text-[#F4F0E8] transition-colors mb-3">
                    {item.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs sm:text-[13px] text-[#A6AAA4] font-light leading-relaxed line-clamp-3">
                    {item.excerpt}
                  </p>
                </div>
              </div>

              {/* Read Action Footer */}
              <div className="p-6 pt-0 border-t border-white/5 mt-4">
                <div className="pt-4 flex items-center justify-between text-xs uppercase tracking-widest font-medium text-[#C6A36A] group-hover:text-white transition-colors">
                  <span>Read Article</span>
                  <div className="w-7 h-7 rounded-full bg-[#101313] border border-[#C6A36A]/40 flex items-center justify-center group-hover:bg-[#C6A36A] group-hover:text-[#101313] transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>

            </motion.article>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
