import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Mail, Phone, MapPin } from 'lucide-react';
import {
  VIEWPORT_ONCE,
  LUXURY_EASE,
  MICRO_SPRING,
  fadeUpCardVariants,
  createStaggerContainer,
  buttonHoverScale,
  buttonTapScale
} from '../lib/motion';

const footerColumnsVariants = createStaggerContainer(0.08, 0.05);

export default function Footer({ onOpenListProperty }) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="relative bg-[#101313] text-[#FFFFFF] border-t border-white/10 pt-20 pb-12 overflow-hidden">
      
      {/* Decorative Top Ambient Glow */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={VIEWPORT_ONCE}
        transition={{ duration: 0.9, ease: LUXURY_EASE }}
        className="absolute top-0 left-1/3 right-1/3 h-[1px] bg-gradient-to-r from-transparent via-[#C6A36A]/50 to-transparent origin-center"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Top Callout & Newsletter */}
        <motion.div
          variants={fadeUpCardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="pb-16 border-b border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          
          <div className="lg:col-span-7">
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-[#C6A36A] block mb-2">
              ACADEMIC RESIDENTIAL NETWORK
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#FFFFFF] font-light leading-snug">
              Elevate Your University Experience with Havenly.
            </h3>
            <p className="text-xs sm:text-sm text-[#A6AAA4] mt-2 max-w-lg">
              Receive newly certified student accommodations, lease releases, and off-campus housing guides before general enrollment.
            </p>
          </div>

          <div className="lg:col-span-5">
            <form onSubmit={(e) => { e.preventDefault(); alert("Thank you for subscribing to Havenly Campus Insights!"); }} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                placeholder="Enter your university email..."
                className="flex-1 bg-[#191D1C] border border-white/10 text-xs text-white px-4 py-3 rounded-sm focus:outline-none focus:border-[#C6A36A] transition-colors"
              />
              <motion.button
                whileHover={buttonHoverScale}
                whileTap={buttonTapScale}
                type="submit"
                className="px-6 py-3 bg-[#C6A36A] hover:bg-[#d8b57c] text-[#101313] text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors shrink-0"
              >
                Join Roster
              </motion.button>
            </form>
          </div>

        </motion.div>

        {/* Main Footer Links Columns */}
        <motion.div
          variants={footerColumnsVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10"
        >
          
          {/* Brand Column (Spans 2 on lg) */}
          <motion.div variants={fadeUpCardVariants} className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-[#191D1C] border border-[#C6A36A] flex items-center justify-center">
                <span className="font-serif text-[#C6A36A] text-lg font-bold">H</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-normal tracking-[0.2em] text-[#FFFFFF]">
                  HAVENLY
                </span>
                <span className="text-[9px] uppercase tracking-[0.28em] text-[#C6A36A] -mt-1">
                  Student Housing, Simplified
                </span>
              </div>
            </div>

            <p className="text-xs text-[#A6AAA4] leading-relaxed max-w-sm font-light">
              Architecturally curated student housing tailored to academic focus and personal sanctuary. Zero hidden brokerages, physical audits on every property, and guaranteed campus proximity.
            </p>

            <div className="pt-2 flex items-center gap-3 text-[#A6AAA4]">
              {/* Instagram */}
              <motion.a whileHover={{ y: -2, transition: MICRO_SPRING }} whileTap={buttonTapScale} href="#social" className="w-8 h-8 rounded-full bg-[#191D1C] border border-white/5 flex items-center justify-center hover:border-[#C6A36A] hover:text-[#C6A36A] transition-colors" aria-label="Instagram">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </motion.a>
              {/* LinkedIn */}
              <motion.a whileHover={{ y: -2, transition: MICRO_SPRING }} whileTap={buttonTapScale} href="#social" className="w-8 h-8 rounded-full bg-[#191D1C] border border-white/5 flex items-center justify-center hover:border-[#C6A36A] hover:text-[#C6A36A] transition-colors" aria-label="LinkedIn">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </motion.a>
              {/* X / Twitter */}
              <motion.a whileHover={{ y: -2, transition: MICRO_SPRING }} whileTap={buttonTapScale} href="#social" className="w-8 h-8 rounded-full bg-[#191D1C] border border-white/5 flex items-center justify-center hover:border-[#C6A36A] hover:text-[#C6A36A] transition-colors" aria-label="X (Twitter)">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </motion.a>
              {/* YouTube */}
              <motion.a whileHover={{ y: -2, transition: MICRO_SPRING }} whileTap={buttonTapScale} href="#social" className="w-8 h-8 rounded-full bg-[#191D1C] border border-white/5 flex items-center justify-center hover:border-[#C6A36A] hover:text-[#C6A36A] transition-colors" aria-label="YouTube">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </motion.a>
            </div>
          </motion.div>

          {/* Nav Links */}
          <motion.div variants={fadeUpCardVariants}>
            <h4 className="font-serif text-lg text-white mb-4">Explore Havenly</h4>
            <ul className="space-y-2.5 text-xs text-[#A6AAA4]">
              <li><a href="#hero" className="hover:text-white transition-colors">About Havenly</a></li>
              <li><a href="#search-section" className="hover:text-white transition-colors">Explore Properties</a></li>
              <li><a href="#properties-section" className="hover:text-white transition-colors">Featured Residences</a></li>
              <li><a href="#services-section" className="hover:text-white transition-colors">Our Living Services</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#insights-section" className="hover:text-white transition-colors">Student Living Insights</a></li>
            </ul>
          </motion.div>

          {/* Campus Hubs */}
          <motion.div variants={fadeUpCardVariants}>
            <h4 className="font-serif text-lg text-white mb-4">University Hubs</h4>
            <ul className="space-y-2.5 text-xs text-[#A6AAA4]">
              <li><span className="hover:text-white cursor-pointer transition-colors">Stanford & Silicon Valley</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Columbia & Pratt Design Hub</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">UW & Seattle Medical Centers</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">NYU & Manhattan Campuses</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Berkeley University Corridor</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Boston Academic District</span></li>
            </ul>
          </motion.div>

          {/* Contact / Property Lister */}
          <motion.div variants={fadeUpCardVariants} className="space-y-4">
            <h4 className="font-serif text-lg text-white mb-4">Advisory & Support</h4>
            <div className="space-y-2.5 text-xs text-[#A6AAA4]">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C6A36A]" />
                <span>+1 (800) 428-3659</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C6A36A]" />
                <span>concierge@havenly-living.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C6A36A]" />
                <span>742 Evergreen Scholar Way</span>
              </div>
            </div>

            <div className="pt-2">
              <motion.button
                whileHover={buttonHoverScale}
                whileTap={buttonTapScale}
                onClick={onOpenListProperty}
                className="w-full py-2.5 bg-[#191D1C] hover:bg-[#C6A36A] text-white hover:text-[#101313] border border-white/10 hover:border-[#C6A36A] text-[11px] uppercase tracking-wider rounded-sm transition-colors"
              >
                List Your Property
              </motion.button>
            </div>
          </motion.div>

        </motion.div>

        {/* Bottom Copyright & Back to Top Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A6AAA4]/70">
          <div>
            &copy; {new Date().getFullYear()} HAVENLY Inc. All rights reserved. Architectural Student Housing.
          </div>

          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms and Conditions</a>
            <a href="#fair-housing" className="hover:text-white transition-colors">Fair Housing Act</a>

            <motion.button
              whileHover={{ y: -2, transition: MICRO_SPRING }}
              whileTap={buttonTapScale}
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-[#C6A36A] hover:text-white transition-colors ml-2"
              title="Return to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>

      </div>
    </footer>
  );
}
