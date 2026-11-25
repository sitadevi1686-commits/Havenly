import React from 'react';
import { motion } from 'framer-motion';
import { Building2, GraduationCap, Sparkles, Users2, Info } from 'lucide-react';
import { STATISTICS } from '../data/statisticsData';
import {
  LUXURY_EASE,
  LUXURY_SPRING,
  VIEWPORT_ONCE,
  createStaggerContainer,
  fadeUpCardVariants
} from '../lib/motion';

const statsGridVariants = createStaggerContainer(0.08, 0.12);

export default function FloatingStats() {
  const iconMap = {
    Building2,
    GraduationCap,
    Sparkles,
    Users2
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.75, ease: LUXURY_EASE }}
      className="relative z-30 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 -mt-14 sm:-mt-16 lg:-mt-20"
    >
      
      {/* Floating Dark Glass Panel */}
      <div className="relative rounded-2xl bg-[#191D1C]/92 backdrop-blur-xl border border-[#C6A36A]/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 sm:p-8 lg:py-8 lg:px-10 overflow-hidden">
        
        {/* Subtle decorative gold glow line at top */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.9, delay: 0.25, ease: LUXURY_EASE }}
          className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#C6A36A]/60 to-transparent origin-center"
        />

        {/* 4 Stats Grid */}
        <motion.div
          variants={statsGridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-4 divide-y lg:divide-y-0 lg:divide-x divide-white/10"
        >
          {STATISTICS.map((stat, idx) => {
            const Icon = iconMap[stat.iconName] || Building2;
            return (
              <motion.div
                key={stat.id}
                variants={fadeUpCardVariants}
                whileHover={{ y: -2, transition: LUXURY_SPRING }}
                className={`group flex items-center gap-4 ${idx > 0 ? 'lg:pl-8' : ''} ${idx >= 2 ? 'pt-6 lg:pt-0' : ''}`}
              >
                {/* Thin gold icon badge */}
                <div className="w-12 h-12 rounded-xl bg-[#101313] border border-[#C6A36A]/25 flex items-center justify-center shrink-0 shadow-inner group-hover:border-[#C6A36A] group-hover:shadow-[0_0_16px_rgba(198,163,106,0.2)] transition-all duration-300">
                  <Icon className="w-5 h-5 text-[#C6A36A]" strokeWidth={1.5} />
                </div>

                {/* Text Content */}
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#FFFFFF] tracking-tight">
                      {stat.value}
                    </span>
                  </div>
                  <span className="text-xs uppercase tracking-[0.14em] text-[#C6A36A] font-medium mt-0.5">
                    {stat.label}
                  </span>
                  <span className="text-[11px] text-[#A6AAA4] font-light hidden sm:inline">
                    {stat.sublabel}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Clear Sample Data Disclosure Badge */}
        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-[#A6AAA4]/70">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#C6A36A]" />
            <span>Curated live directory &bull; Sample platform statistics pending API integration</span>
          </div>
          <span className="hidden md:inline text-[10px] uppercase tracking-widest text-[#C6A36A]">
            Verified Campus Network
          </span>
        </div>

      </div>
    </motion.div>
  );
}
