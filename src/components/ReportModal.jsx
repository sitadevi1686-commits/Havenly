import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Check } from 'lucide-react';
import { mockDb } from '../services/mockDatabase';
import { useAuth } from '../context/AuthContext';
import {
  modalBackdropVariants,
  modalPanelVariants,
  tabContentVariants,
  MICRO_SPRING,
  buttonHoverScale,
  buttonTapScale
} from '../lib/motion';

export default function ReportModal({ property, isOpen, onClose }) {
  const { user } = useAuth();
  const [category, setCategory] = useState('Incorrect rental information');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setDescription('');
    }
  }, [isOpen, property?.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const reports = mockDb.getReports();
    const newReport = {
      id: `rep-${Date.now()}`,
      property_id: property.id,
      property_name: property.name,
      reporter_id: user?.id || 'usr-anonymous',
      reporter_name: user?.full_name || 'Concerned Scholar',
      category,
      description,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    mockDb.saveReports([newReport, ...reports]);
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && property && (
        <motion.div
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        >
          <motion.div
            variants={modalPanelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-lg rounded-2xl bg-[#191D1C] border border-red-500/40 p-6 sm:p-8 shadow-2xl text-white my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              whileHover={{ scale: 1.08, transition: MICRO_SPRING }}
              whileTap={buttonTapScale}
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#101313] border border-white/10 text-[#A6AAA4] hover:text-white"
            >
              <X className="w-5 h-5" />
            </motion.button>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="report-submitted"
                  variants={tabContentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="text-center py-6 space-y-4"
                >
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={MICRO_SPRING}
                    className="w-12 h-12 rounded-full bg-emerald-500 text-black flex items-center justify-center mx-auto"
                  >
                    <Check className="w-6 h-6 stroke-[2.5]" />
                  </motion.div>
                  <h3 className="font-serif text-2xl text-white">Report Submitted to Administration</h3>
                  <p className="text-xs text-[#A6AAA4]">
                    Thank you for keeping Havenly safe. Our compliance officers will audit <strong className="text-white">{property.name}</strong> within 12 hours.
                  </p>
                  <motion.button
                    whileHover={buttonHoverScale}
                    whileTap={buttonTapScale}
                    onClick={() => { setSubmitted(false); onClose(); }}
                    className="px-6 py-2 bg-[#C6A36A] text-[#101313] text-xs uppercase tracking-widest font-semibold rounded"
                  >
                    Close
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  key="report-form"
                  variants={tabContentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">REPORT LISTING INTEGRITY</span>
                  </div>

                  <h3 className="font-serif text-2xl text-white font-normal">
                    Report Discrepancy for {property.name}
                  </h3>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">
                      Concern Classification
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#101313] border border-white/10 text-xs text-white p-3 rounded focus:outline-none focus:border-[#C6A36A]"
                    >
                      <option value="Incorrect rental information">Incorrect rental information or hidden charges</option>
                      <option value="Misleading photographs">Misleading or inaccurate photographs</option>
                      <option value="Suspicious property">Suspicious landlord or potential fraud</option>
                      <option value="Incorrect location">Incorrect campus proximity / distance</option>
                      <option value="Other concerns">Other safety / lease concern</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">
                      Explanation & Evidence
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the discrepancy you encountered..."
                      className="w-full bg-[#101313] border border-white/10 text-xs text-white p-3 rounded focus:outline-none focus:border-[#C6A36A] resize-none"
                    />
                  </div>

                  <motion.button
                    whileHover={buttonHoverScale}
                    whileTap={buttonTapScale}
                    type="submit"
                    className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold text-xs uppercase tracking-widest rounded transition-colors"
                  >
                    Submit Report to Administrator
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
