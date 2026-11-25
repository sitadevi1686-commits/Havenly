import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight, AlertCircle } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import {
  modalBackdropVariants,
  modalPanelVariants,
  tabContentVariants,
  MICRO_SPRING,
  buttonHoverScale,
  buttonTapScale
} from '../lib/motion';

export default function BookingModal({ property, isOpen, onClose, onBookingSuccess }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Room & Dates, 2: Cost & Student Info, 3: Confirmation
  const [checkInDate, setCheckInDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [roomSharingType, setRoomSharingType] = useState('Single Studio');
  const [studentNotes, setStudentNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Reset modal flow whenever opened for a property
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setStudentNotes('');
      setErrorMessage('');
      setConfirmedBooking(null);
    }
  }, [isOpen, property?.id]);

  const monthlyRent = property?.monthlyRent || 950;
  const securityDeposit = property?.deposit || property?.security_deposit || 950;
  const cost = bookingService.calculateCostBreakdown(monthlyRent, securityDeposit, 0);

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    if (!user) {
      setErrorMessage("Please log in to submit a booking reservation.");
      setSubmitting(false);
      return;
    }

    try {
      const result = await bookingService.createBookingRequest({
        propertyId: property.id,
        propertyName: property.name,
        propertyImage: property.image,
        ownerId: property.owner_id || 'usr-owner-1',
        checkInDate,
        roomSharingType,
        monthlyRent: cost.monthlyRent,
        securityDeposit: cost.securityDeposit,
        utilityCharges: cost.utilityCharges,
        notes: studentNotes
      }, user);

      setConfirmedBooking(result);
      setStep(3);
      if (onBookingSuccess) onBookingSuccess(result);
    } catch (err) {
      setErrorMessage(err.message || "Failed to create booking request. Please retry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && property && (
        property.verification_status && property.verification_status !== 'approved' ? (
          <motion.div
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              variants={modalPanelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full bg-[#191D1C] border border-[#C6A36A]/40 p-6 rounded-2xl text-center space-y-4"
            >
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
              <h3 className="font-serif text-2xl text-white">Listing Under Verification</h3>
              <p className="text-xs text-[#A6AAA4]">
                This property is currently under physical inspection audit by Havenly and cannot accept booking reservations yet.
              </p>
              <motion.button
                whileHover={buttonHoverScale}
                whileTap={buttonTapScale}
                onClick={onClose}
                className="px-5 py-2 bg-[#C6A36A] text-[#101313] text-xs uppercase tracking-wider rounded-sm font-semibold"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
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
              className="relative w-full max-w-2xl rounded-2xl bg-[#191D1C] border border-[#C6A36A]/30 p-6 sm:p-8 lg:p-10 shadow-2xl text-white my-auto max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.08, transition: MICRO_SPRING }}
                whileTap={buttonTapScale}
                onClick={onClose}
                className="absolute top-5 right-5 p-2 rounded-full bg-[#101313] border border-white/10 text-[#A6AAA4] hover:text-white hover:border-[#C6A36A] transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>

              <AnimatePresence mode="wait">
                {/* STEP 1: Room & Dates Selection */}
                {step === 1 && (
                  <motion.div
                    key="booking-step-1"
                    variants={tabContentVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C6A36A] block mb-1">
                        STEP 1 OF 2 &bull; RESERVATION CONFIGURATION
                      </span>
                      <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">
                        Reserve Your Space at {property.name}
                      </h2>
                      <p className="text-xs text-[#A6AAA4] mt-1">
                        {property.location} &bull; {property.college_name || property.college}
                      </p>
                    </div>

                    {/* Property Preview Pill */}
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-[#101313] border border-white/10">
                      <img src={property.image} alt={property.name} className="w-20 h-16 rounded-lg object-cover" />
                      <div>
                        <span className="text-xs font-serif text-white block">{property.name}</span>
                        <span className="text-[11px] text-[#C6A36A]">{property.distanceDisplay || `${property.distanceKm} km from campus`}</span>
                        <span className="text-[10px] text-[#A6AAA4] block mt-0.5">${monthlyRent}/mo &bull; Dep: ${securityDeposit}</span>
                      </div>
                    </div>

                    {/* Check-In Date */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#C6A36A] mb-2 font-medium">
                        Anticipated Check-In Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          required
                          value={checkInDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setCheckInDate(e.target.value)}
                          className="w-full bg-[#101313] border border-white/10 text-xs text-white px-3.5 py-3 rounded focus:outline-none focus:border-[#C6A36A]"
                        />
                      </div>
                      <span className="text-[10px] text-[#A6AAA4] mt-1 block">Lease begins from selected date upon host approval.</span>
                    </div>

                    {/* Room Sharing Type Preference */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#C6A36A] mb-2 font-medium">
                        Room Sharing Preference
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {['Single Studio', 'Double Sharing', 'Triple Sharing'].map((type) => (
                          <motion.button
                            key={type}
                            type="button"
                            whileTap={buttonTapScale}
                            onClick={() => setRoomSharingType(type)}
                            className={`p-3 rounded-lg text-left border transition-colors ${
                              roomSharingType === type
                                ? 'bg-[#C6A36A]/20 border-[#C6A36A] text-white shadow-gold-subtle'
                                : 'bg-[#101313] border-white/5 text-[#A6AAA4] hover:border-white/20'
                            }`}
                          >
                            <span className="text-xs font-medium block">{type}</span>
                            <span className="text-[10px] text-[#C6A36A] mt-1 block">
                              {type === 'Single Studio' ? 'Private Suite' : type === 'Double Sharing' ? '1 Roommate' : '2 Roommates'}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <motion.button
                      whileHover={buttonHoverScale}
                      whileTap={buttonTapScale}
                      onClick={() => setStep(2)}
                      className="w-full py-3.5 bg-[#C6A36A] hover:bg-[#d8b57c] text-[#101313] font-semibold text-xs uppercase tracking-[0.2em] rounded-sm transition-colors shadow-luxury flex items-center justify-center gap-2"
                    >
                      <span>Continue to Cost Breakdown</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </motion.button>
                  </motion.div>
                )}

                {/* STEP 2: Transparent Cost Breakdown & Submission */}
                {step === 2 && (
                  <motion.form
                    key="booking-step-2"
                    variants={tabContentVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    onSubmit={handleSubmitBooking}
                    className="space-y-6"
                  >
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C6A36A] block mb-1">
                        STEP 2 OF 2 &bull; TRANSPARENT RENTAL BREAKDOWN
                      </span>
                      <h2 className="font-serif text-3xl text-white font-normal">
                        Review Lease Inclusions
                      </h2>
                      <p className="text-xs text-[#A6AAA4] mt-1">
                        No hidden brokerages. No surprise fees. Certified transparent pricing.
                      </p>
                    </div>

                    {/* Financial Ledger Table */}
                    <div className="rounded-xl bg-[#101313] border border-[#C6A36A]/30 p-5 space-y-3">
                      <div className="flex items-center justify-between text-xs text-[#A6AAA4]">
                        <span>1st Month Advance Rent ({roomSharingType})</span>
                        <span className="text-white font-medium">${cost.monthlyRent}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-[#A6AAA4]">
                        <span>100% Refundable Security Deposit</span>
                        <span className="text-white font-medium">${cost.securityDeposit}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-[#A6AAA4]">
                        <span>Platform Brokerage Fee</span>
                        <span className="text-[#C6A36A] font-semibold">$0 (Zero Brokerage Guarantee)</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-[#A6AAA4]">
                        <span>Move-in Deep Clean & Sanitation</span>
                        <span className="text-white font-medium">Included</span>
                      </div>
                      
                      <div className="pt-3 border-t border-white/10 flex items-baseline justify-between">
                        <div>
                          <span className="text-xs uppercase tracking-wider text-[#C6A36A] font-semibold block">Total Initial Commitment</span>
                          <span className="text-[10px] text-[#A6AAA4]">Due only upon owner approval of lease</span>
                        </div>
                        <div className="text-right">
                          <span className="font-serif text-3xl text-white font-normal">${cost.totalInitialAmount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Student Details Summary */}
                    <div className="p-4 rounded-xl bg-[#101313]/50 border border-white/10 text-xs text-[#A6AAA4] space-y-2">
                      <div className="flex justify-between">
                        <span>Tenant Name:</span>
                        <span className="text-white font-medium">{user?.full_name || 'Guest Scholar'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Verified Email:</span>
                        <span className="text-white font-medium">{user?.email || 'Not logged in'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-In Date:</span>
                        <span className="text-white font-medium">{checkInDate}</span>
                      </div>
                    </div>

                    {/* Special Instructions */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#A6AAA4] mb-1">
                        Notes for Property Owner (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={studentNotes}
                        onChange={(e) => setStudentNotes(e.target.value)}
                        placeholder="Share your major, dietary preferences, or quiet study habits..."
                        className="w-full bg-[#101313] border border-white/10 text-xs text-white p-3 rounded focus:outline-none focus:border-[#C6A36A] resize-none"
                      />
                    </div>

                    {errorMessage && (
                      <div className="p-3 rounded bg-red-950/40 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <motion.button
                        whileTap={buttonTapScale}
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-5 py-3.5 border border-white/20 text-[#A6AAA4] hover:text-white text-xs uppercase tracking-wider rounded-sm transition-colors"
                      >
                        Back
                      </motion.button>
                      <motion.button
                        whileHover={buttonHoverScale}
                        whileTap={buttonTapScale}
                        type="submit"
                        disabled={submitting}
                        className="flex-1 py-3.5 bg-[#C6A36A] hover:bg-[#d8b57c] text-[#101313] font-semibold text-xs uppercase tracking-[0.2em] rounded-sm transition-colors shadow-luxury flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <span>{submitting ? 'Submitting Reservation...' : 'Submit Booking Request'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </motion.form>
                )}

                {/* STEP 3: Booking Confirmation Receipt */}
                {step === 3 && confirmedBooking && (
                  <motion.div
                    key="booking-step-3"
                    variants={tabContentVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="text-center py-6 space-y-5"
                  >
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={MICRO_SPRING}
                      className="w-14 h-14 rounded-full bg-[#C6A36A] text-[#101313] flex items-center justify-center mx-auto shadow-gold-glow"
                    >
                      <Check className="w-7 h-7 stroke-[2.5]" />
                    </motion.div>

                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#C6A36A] font-semibold block mb-1">
                        RESERVATION REQUEST SUBMITTED
                      </span>
                      <h3 className="font-serif text-3xl text-white font-normal">
                        Reference: {confirmedBooking.booking_reference}
                      </h3>
                      <p className="text-xs text-[#A6AAA4] max-w-md mx-auto mt-2 leading-relaxed">
                        Your reservation for <strong className="text-white">{confirmedBooking.property_name}</strong> is currently <strong className="text-amber-400 uppercase">Pending Owner Review</strong>.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#101313] border border-white/10 max-w-md mx-auto text-left text-xs space-y-2 text-[#A6AAA4]">
                      <div className="flex justify-between">
                        <span>Room Configuration:</span>
                        <span className="text-white font-medium">{confirmedBooking.room_sharing_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-in Date:</span>
                        <span className="text-white font-medium">{confirmedBooking.check_in_date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Rent:</span>
                        <span className="text-white font-medium">${confirmedBooking.monthly_rent}/mo</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="text-amber-400 font-semibold uppercase">Pending Owner Approval</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#A6AAA4]">
                      You will receive an in-app and email notification as soon as the host confirms your stay.
                    </p>

                    <motion.button
                      whileHover={buttonHoverScale}
                      whileTap={buttonTapScale}
                      onClick={onClose}
                      className="px-8 py-3 bg-[#C6A36A] text-[#101313] text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-[#d8b57c] transition-colors"
                    >
                      View in My Student Dashboard
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          </motion.div>
        )
      )}
    </AnimatePresence>
  );
}
