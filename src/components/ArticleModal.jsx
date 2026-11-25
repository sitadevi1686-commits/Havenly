import React from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock } from 'lucide-react';
import {
  modalBackdropVariants,
  modalPanelVariants,
  MICRO_SPRING,
  buttonHoverScale,
  buttonTapScale
} from '../lib/motion';

export default function ArticleModal({ article, onClose }) {
  if (!article) return null;

  return (
    <motion.div
      variants={modalBackdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md"
    >
      <motion.div
        variants={modalPanelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full max-w-3xl rounded-2xl bg-[#191D1C] border border-[#C6A36A]/30 p-6 sm:p-8 lg:p-10 shadow-2xl text-white my-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.button
          whileHover={{ scale: 1.08, transition: MICRO_SPRING }}
          whileTap={buttonTapScale}
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#101313] border border-white/10 text-[#A6AAA4] hover:text-white hover:border-[#C6A36A] transition-colors"
        >
          <X className="w-5 h-5" />
        </motion.button>

        {/* Article Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 text-xs text-[#A6AAA4] mb-3">
            <span className="px-2.5 py-1 rounded-sm bg-[#101313] text-[#C6A36A] border border-[#C6A36A]/30 text-[10px] uppercase tracking-widest font-semibold">
              {article.category}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#C6A36A]" />
              {article.date}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#C6A36A]" />
              {article.readTime}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-tight">
            {article.title}
          </h1>
        </div>

        {/* Feature Image */}
        <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden mb-8 border border-white/10">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#191D1C] via-transparent to-transparent"></div>
        </div>

        {/* Article Body */}
        <div className="prose prose-invert max-w-none text-sm sm:text-base text-[#F4F0E8]/90 font-light leading-relaxed space-y-5">
          {article.content.split('\n\n').map((paragraph, i) => (
            <p key={i} className="whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-[#A6AAA4]">
          <span className="font-serif italic text-[#C6A36A]">
            Published by Havenly Academic Editorial Board
          </span>
          <motion.button
            whileHover={buttonHoverScale}
            whileTap={buttonTapScale}
            onClick={onClose}
            className="px-5 py-2 bg-[#101313] border border-[#C6A36A] text-[#C6A36A] hover:bg-[#C6A36A] hover:text-[#101313] text-xs uppercase tracking-wider rounded-sm transition-colors"
          >
            Close Reader
          </motion.button>
        </div>

      </motion.div>
    </motion.div>
  );
}
