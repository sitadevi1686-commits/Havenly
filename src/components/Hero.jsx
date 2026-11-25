import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import {
  heroContainerVariants,
  heroItemVariants,
  heroImageVariants,
  LUXURY_EASE,
  buttonHoverScale,
  buttonTapScale
} from '../lib/motion';

export default function Hero({ onExploreClick, onListPropertyClick }) {
  const heroRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Subtle vertical parallax on hero photograph; disabled when reduced-motion is preferred
  const imageParallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-start overflow-hidden bg-[#101313] pt-24 pb-28 lg:pb-36"
    >
      {/* Background Architectural Dusk Photograph with Subtle Parallax & Layered Vignette */}
      <motion.div
        style={{ y: shouldReduceMotion ? 0 : imageParallaxY }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <motion.img
          variants={heroImageVariants}
          initial="hidden"
          animate="visible"
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85"
          alt="Modern Architectural Student Residence at Twilight"
          className="w-full h-full object-cover object-center"
        />
        {/* Cinematic dark gradients matching the Arcova reference */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#101313] via-[#101313]/85 to-[#101313]/35"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#101313] via-transparent to-[#101313]/70"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(198,163,106,0.12),transparent_60%)]"></div>
      </motion.div>

      {/* Left Vertical Architectural Accent Line */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ duration: 0.9, delay: 0.6, ease: LUXURY_EASE }}
        className="hidden lg:flex flex-col items-center gap-3 absolute left-6 top-1/2 -translate-y-1/2 z-20"
      >
        <div className="w-1 h-1 rounded-full bg-[#C6A36A]"></div>
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 0.7, ease: LUXURY_EASE }}
          className="w-[1px] h-12 bg-gradient-to-b from-[#C6A36A] to-transparent origin-top"
        />
        <span className="[writing-mode:vertical-lr] text-[9px] uppercase tracking-[0.35em] text-[#A6AAA4] rotate-180">
          HAVENLY &bull; ARCHITECTURAL LIVING
        </span>
      </motion.div>

      {/* Main Hero Content with Staggered Entrance */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
        <motion.div
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >

          {/* Subtitle tag */}
          <motion.div
            variants={heroItemVariants}
            className="inline-flex items-center gap-2.5 mb-6 px-3.5 py-1.5 rounded-full bg-[#191D1C]/80 border border-[#C6A36A]/30 backdrop-blur-md"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6A36A] animate-pulse"></span>
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.28em] font-medium text-[#C6A36A]">
              Architecture That Inspires Academic Excellence
            </span>
          </motion.div>

          {/* Editorial Display Heading */}
          <motion.h1
            variants={heroItemVariants}
            className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-light text-[#FFFFFF] leading-[1.08] tracking-[-0.015em] mb-7"
          >
            Find Your <span className="italic font-normal text-gold-gradient underline decoration-[#C6A36A]/40 decoration-1 underline-offset-8">Space.</span>
            <br />
            Build Your <span className="font-normal text-[#F4F0E8]">Future.</span>
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            variants={heroItemVariants}
            className="text-base sm:text-lg md:text-xl text-[#A6AAA4] font-light max-w-xl leading-relaxed mb-10"
          >
            Discover thoughtfully selected student accommodation designed around your campus life. Premium residences, quiet study sanctuaries, and zero brokerages.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            variants={heroItemVariants}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5"
          >
            {/* Primary Action Button (Champagne Gold Fill) */}
            <motion.button
              whileHover={buttonHoverScale}
              whileTap={buttonTapScale}
              onClick={onExploreClick}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#C6A36A] hover:bg-[#d8b57c] text-[#101313] font-medium text-xs sm:text-sm uppercase tracking-[0.22em] transition-colors duration-300 shadow-luxury hover:shadow-gold-glow rounded-sm"
            >
              <span>Explore Properties</span>
              <div className="w-6 h-6 rounded-full bg-[#101313]/10 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight className="w-3.5 h-3.5 text-[#101313]" />
              </div>
            </motion.button>

            {/* Secondary Action Button (Dark Glass Border) */}
            <motion.button
              whileHover={buttonHoverScale}
              whileTap={buttonTapScale}
              onClick={onListPropertyClick}
              className="group inline-flex items-center justify-center gap-3 px-7 py-4 bg-[#191D1C]/60 hover:bg-[#191D1C] text-[#F4F0E8] hover:text-[#FFFFFF] border border-white/15 hover:border-[#C6A36A]/60 font-medium text-xs sm:text-sm uppercase tracking-[0.22em] backdrop-blur-md transition-colors duration-300 rounded-sm"
            >
              <span>List Your Property</span>
              <span className="text-[#C6A36A] text-xs transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
            </motion.button>
          </motion.div>

          {/* Trust Micro-Badges */}
          <motion.div
            variants={heroItemVariants}
            className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center gap-6 sm:gap-10 text-xs text-[#A6AAA4]"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C6A36A]" />
              <span>100% Physically Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#C6A36A]" />
              <span>&lt; 15 min Campus Proximity</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C6A36A]" />
              <span>Zero Brokerage Guaranteed</span>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
