import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight } from 'lucide-react';
import {
  modalBackdropVariants,
  modalPanelVariants,
  tabContentVariants,
  MICRO_SPRING,
  buttonHoverScale,
  buttonTapScale
} from '../lib/motion';

export default function ListPropertyModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
    }
  }, [isOpen]);
  const [formData, setFormData] = useState({
    propertyName: '',
    category: 'Premium PG',
    collegeNearby: '',
    monthlyRent: '',
    deposit: '',
    roomType: 'Single Studio',
    curfew: 'Flexible 24/7',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    address: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="relative w-full max-w-2xl rounded-2xl bg-[#191D1C] border border-[#C6A36A]/30 p-6 sm:p-8 lg:p-10 shadow-2xl text-white my-auto max-h-[90vh] overflow-y-auto"
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

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="list-submitted"
                  variants={tabContentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="text-center py-12 space-y-4"
                >
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={MICRO_SPRING}
                    className="w-14 h-14 rounded-full bg-[#C6A36A] text-[#101313] flex items-center justify-center mx-auto shadow-gold-glow"
                  >
                    <Check className="w-7 h-7 stroke-[2.5]" />
                  </motion.div>
                  <h3 className="font-serif text-3xl text-white">Listing Application Received</h3>
                  <p className="text-sm text-[#A6AAA4] max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-white">{formData.ownerName}</strong>. Our architectural inspection team will contact you at <strong className="text-white">{formData.ownerEmail}</strong> within 24 hours to schedule the 42-point safety & quality audit.
                  </p>
                  <div className="pt-4">
                    <motion.button
                      whileHover={buttonHoverScale}
                      whileTap={buttonTapScale}
                      onClick={() => { setSubmitted(false); onClose(); }}
                      className="px-6 py-2.5 bg-[#C6A36A] text-[#101313] text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-[#d8b57c] transition-colors"
                    >
                      Back to Havenly
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="list-form"
                  variants={tabContentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <div className="mb-6">
                    <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C6A36A] block mb-1">
                      HOST WITH HAVENLY
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">
                      List Your Student Residence
                    </h2>
                    <p className="text-xs sm:text-sm text-[#A6AAA4] mt-1.5">
                      Join our curated directory. High-intent scholar tenants, guaranteed leases, zero brokerage hassle.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">
                          Property Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.propertyName}
                          onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                          placeholder="e.g. Cambridge Court Lofts"
                          className="w-full bg-[#101313] border border-white/10 text-xs text-white px-3.5 py-2.5 rounded focus:outline-none focus:border-[#C6A36A]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">
                          Property Category
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full bg-[#101313] border border-white/10 text-xs text-white px-3.5 py-2.5 rounded focus:outline-none focus:border-[#C6A36A]"
                        >
                          <option value="Premium PG">Premium PG</option>
                          <option value="Student Apartments">Student Apartments</option>
                          <option value="Shared Accommodation">Shared Accommodation</option>
                          <option value="Independent Flats">Independent Flats</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">
                          Nearby Campus / College
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.collegeNearby}
                          onChange={(e) => setFormData({ ...formData, collegeNearby: e.target.value })}
                          placeholder="e.g. Stanford University (West Quad)"
                          className="w-full bg-[#101313] border border-white/10 text-xs text-white px-3.5 py-2.5 rounded focus:outline-none focus:border-[#C6A36A]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">
                          Full Property Address
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="Street, District, City"
                          className="w-full bg-[#101313] border border-white/10 text-xs text-white px-3.5 py-2.5 rounded focus:outline-none focus:border-[#C6A36A]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">
                          Target Rent ($/mo)
                        </label>
                        <input
                          type="number"
                          required
                          value={formData.monthlyRent}
                          onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                          placeholder="e.g. 950"
                          className="w-full bg-[#101313] border border-white/10 text-xs text-white px-3.5 py-2.5 rounded focus:outline-none focus:border-[#C6A36A]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">
                          Security Deposit ($)
                        </label>
                        <input
                          type="number"
                          required
                          value={formData.deposit}
                          onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                          placeholder="e.g. 950"
                          className="w-full bg-[#101313] border border-white/10 text-xs text-white px-3.5 py-2.5 rounded focus:outline-none focus:border-[#C6A36A]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">
                          Curfew Policy
                        </label>
                        <select
                          value={formData.curfew}
                          onChange={(e) => setFormData({ ...formData, curfew: e.target.value })}
                          className="w-full bg-[#101313] border border-white/10 text-xs text-white px-3.5 py-2.5 rounded focus:outline-none focus:border-[#C6A36A]"
                        >
                          <option value="Flexible 24/7">Flexible 24/7 Access</option>
                          <option value="11:00 PM">11:00 PM Access</option>
                          <option value="10:30 PM">10:30 PM Access</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <span className="block text-[10px] uppercase tracking-wider text-[#C6A36A] mb-3 font-semibold">
                        Host Contact Information
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <input
                            type="text"
                            required
                            value={formData.ownerName}
                            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                            placeholder="Your Full Name"
                            className="w-full bg-[#101313] border border-white/10 text-xs text-white px-3 py-2.5 rounded focus:outline-none focus:border-[#C6A36A]"
                          />
                        </div>
                        <div>
                          <input
                            type="email"
                            required
                            value={formData.ownerEmail}
                            onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                            placeholder="Email Address"
                            className="w-full bg-[#101313] border border-white/10 text-xs text-white px-3 py-2.5 rounded focus:outline-none focus:border-[#C6A36A]"
                          />
                        </div>
                        <div>
                          <input
                            type="tel"
                            required
                            value={formData.ownerPhone}
                            onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                            placeholder="Phone Number"
                            className="w-full bg-[#101313] border border-white/10 text-xs text-white px-3 py-2.5 rounded focus:outline-none focus:border-[#C6A36A]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <motion.button
                        whileHover={buttonHoverScale}
                        whileTap={buttonTapScale}
                        type="submit"
                        className="w-full py-3.5 bg-[#C6A36A] hover:bg-[#d8b57c] text-[#101313] font-semibold text-xs uppercase tracking-[0.2em] rounded-sm transition-colors shadow-luxury flex items-center justify-center gap-2"
                      >
                        <span>Submit Property for Havenly Verification</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
