import React from 'react';
import { motion } from 'framer-motion';
import { Home, Building2, Scale, Compass, ShieldCheck, ArrowRight } from 'lucide-react';
import { SERVICES } from '../data/servicesData';
import {
  VIEWPORT_ONCE,
  VIEWPORT_CARD,
  sectionHeaderVariants,
  sectionHeaderItemVariants,
  createStaggerContainer,
  fadeUpCardVariants,
  cardHoverLift,
  buttonHoverScale,
  buttonTapScale
} from '../lib/motion';

const servicesGridVariants = createStaggerContainer(0.08, 0.05);

export default function OurServices({ onConsultClick }) {
  const iconMap = {
    Home,
    Building2,
    Scale,
    Compass,
    ShieldCheck
  };

  return (
    <section
      id="services-section"
      className="relative py-24 sm:py-32 bg-[#101313] text-[#FFFFFF] border-t border-b border-white/5 overflow-hidden"
    >
      {/* Background Subtle Architectural Line Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(198,163,106,0.06),transparent_70%)] pointer-events-none"></div>

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
                OUR SERVICES
              </span>
            </motion.div>
            
            <motion.h2
              variants={sectionHeaderItemVariants}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#FFFFFF] tracking-tight leading-[1.12]"
            >
              Everything You Need <br />
              <span className="italic font-normal text-gold-gradient">for Student Living.</span>
            </motion.h2>
          </div>

          <motion.p
            variants={sectionHeaderItemVariants}
            className="text-sm sm:text-base text-[#A6AAA4] font-light max-w-md leading-relaxed"
          >
            Integrated student housing hospitality designed to liberate your energy for academic distinction and campus life.
          </motion.p>
        </motion.div>

        {/* 5 Premium Cards Row */}
        <motion.div
          variants={servicesGridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CARD}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6"
        >
          {SERVICES.map((service, index) => {
            const Icon = iconMap[service.iconName] || Home;
            return (
              <motion.div
                key={service.id}
                variants={fadeUpCardVariants}
                whileHover={cardHoverLift}
                className="group relative rounded-xl bg-[#191D1C]/80 hover:bg-[#191D1C] border border-white/10 hover:border-[#C6A36A]/60 p-7 flex flex-col justify-between transition-colors duration-500 shadow-luxury"
              >
                {/* Top subtle highlight on hover */}
                <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-[#C6A36A]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div>
                  {/* Gold Line Icon */}
                  <div className="w-12 h-12 rounded-xl bg-[#101313] border border-[#C6A36A]/25 flex items-center justify-center mb-6 group-hover:border-[#C6A36A] group-hover:shadow-[0_0_20px_rgba(198,163,106,0.2)] transition-all duration-300">
                    <Icon className="w-6 h-6 text-[#C6A36A]" strokeWidth={1.5} />
                  </div>

                  {/* Service Badge / Type */}
                  <span className="text-[10px] uppercase tracking-widest text-[#C6A36A]/80 font-medium block mb-2">
                    {service.badge}
                  </span>

                  {/* Heading */}
                  <h3 className="font-serif text-xl sm:text-2xl text-[#FFFFFF] font-normal mb-3 group-hover:text-[#F4F0E8] transition-colors">
                    {service.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs sm:text-[13px] text-[#A6AAA4] font-light leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Subtle Step Number in Bottom Corner */}
                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-[#A6AAA4]">
                  <span className="text-[#C6A36A]/60 font-serif font-light">0{index + 1}</span>
                  <span className="text-[10px] uppercase tracking-widest group-hover:text-[#C6A36A] transition-colors">
                    Verified Standard
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Advisory Bar */}
        <motion.div
          variants={fadeUpCardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="mt-14 p-6 sm:p-8 rounded-2xl bg-[#191D1C]/50 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#C6A36A] animate-pulse"></div>
            <p className="text-sm text-[#F4F0E8] font-light">
              Need personalized campus advisory for group booking or semester leasing?
            </p>
          </div>

          <motion.button
            whileHover={buttonHoverScale}
            whileTap={buttonTapScale}
            onClick={onConsultClick}
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-[#C6A36A] hover:bg-[#C6A36A] text-[#C6A36A] hover:text-[#101313] text-xs uppercase tracking-widest font-medium rounded-sm transition-colors"
          >
            <span>Consult Housing Advisor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
}
