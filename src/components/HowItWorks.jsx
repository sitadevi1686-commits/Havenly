import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { TIMELINE_STEPS } from '../data/timelineData';
import {
  VIEWPORT_ONCE,
  VIEWPORT_CARD,
  MICRO_SPRING,
  sectionHeaderVariants,
  sectionHeaderItemVariants,
  createStaggerContainer,
  timelineLineVariants,
  timelineStepVariants,
  fadeUpCardVariants,
  buttonHoverScale,
  buttonTapScale
} from '../lib/motion';

const timelineContainerVariants = createStaggerContainer(0.11, 0.15);

export default function HowItWorks({ onStartJourney }) {
  return (
    <section
      id="how-it-works"
      className="relative py-24 sm:py-32 bg-[#F4F0E8] text-[#101313] overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Heading & Subtitle */}
        <motion.div
          variants={sectionHeaderVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-20"
        >
          <div>
            <motion.div variants={sectionHeaderItemVariants} className="inline-flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9C8052]"></span>
              <span className="text-[11px] uppercase tracking-[0.28em] font-semibold text-[#9C8052]">
                OUR PROCESS
              </span>
            </motion.div>
            
            <motion.h2
              variants={sectionHeaderItemVariants}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#101313] tracking-tight leading-[1.12]"
            >
              A Seamless Journey <br />
              <span className="italic font-normal text-[#9C8052]">From Search to Move-In.</span>
            </motion.h2>
          </div>

          <motion.button
            variants={sectionHeaderItemVariants}
            whileHover={buttonHoverScale}
            whileTap={buttonTapScale}
            onClick={onStartJourney}
            className="group inline-flex items-center gap-2 px-6 py-3 border border-[#101313] hover:border-[#9C8052] rounded-sm text-xs uppercase tracking-[0.2em] font-semibold text-[#101313] hover:text-[#9C8052] transition-colors self-start md:self-end"
          >
            <span>Start Your Search</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </motion.div>

        {/* Horizontal Timeline */}
        <div className="relative">
          
          {/* Subtle Horizontal Connecting Line draws smoothly left-to-right on scroll */}
          <motion.div
            variants={timelineLineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_CARD}
            className="hidden lg:block absolute top-7 left-[5%] right-[5%] h-[1.5px] bg-[#D8D0C0] z-0 origin-left"
          />

          {/* 5 Circular Steps Grid */}
          <motion.div
            variants={timelineContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_CARD}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-6 relative z-10"
          >
            {TIMELINE_STEPS.map((step) => (
              <motion.div
                key={step.number}
                variants={timelineStepVariants}
                className="group flex flex-col items-start lg:items-center text-left lg:text-center"
              >
                {/* Gold Circular Number Badge */}
                <motion.div
                  whileHover={{ scale: 1.1, transition: MICRO_SPRING }}
                  className="relative w-14 h-14 rounded-full bg-[#F4F0E8] border-2 border-[#9C8052] flex items-center justify-center mb-6 shadow-md transition-colors duration-300 group-hover:bg-[#9C8052] group-hover:text-white"
                >
                  <span className="font-serif text-base font-semibold text-[#9C8052] group-hover:text-white transition-colors">
                    {step.number}
                  </span>
                </motion.div>

                {/* Subtitle tag */}
                <span className="text-[10px] uppercase tracking-widest text-[#9C8052] font-semibold mb-1">
                  {step.subtitle}
                </span>

                {/* Step Title */}
                <h3 className="font-serif text-2xl text-[#101313] font-normal mb-2">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-xs sm:text-[13px] text-[#101313]/75 font-light leading-relaxed max-w-[240px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

        </div>

        {/* Assurance Quote Banner */}
        <motion.div
          variants={fadeUpCardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="mt-16 pt-8 border-t border-[#D8D0C0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#101313]/70"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#9C8052]" />
            <span>Average student match time: Under 48 hours</span>
          </div>
          <span className="font-serif italic text-sm text-[#101313]">
            "Academic focus begins in a quiet, well-crafted sanctuary."
          </span>
        </motion.div>

      </div>
    </section>
  );
}
