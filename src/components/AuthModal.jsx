import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Lock, Mail, ArrowRight, ShieldCheck, Building, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  modalBackdropVariants,
  modalPanelVariants,
  tabContentVariants,
  MICRO_SPRING,
  buttonHoverScale,
  buttonTapScale
} from '../lib/motion';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const { login, register, loading, authError } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [roleSelection, setRoleSelection] = useState('student'); // 'student' | 'owner' (SECURITY: Admin is never publicly selectable!)
  const [submitted, setSubmitted] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('Stanford University & Tech Campus');
  const [ownerType, setOwnerType] = useState('individual');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    setMode(initialMode);
    if (isOpen) {
      setSubmitted(false);
      setValidationError('');
    }
  }, [initialMode, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setValidationError('Password must be at least 6 characters.');
        return;
      }

      const res = await register({
        full_name: fullName,
        email,
        password,
        phone,
        role: roleSelection,
        college,
        owner_type: ownerType
      });

      if (res.success) {
        setSubmitted(true);
      }
    } else {
      const res = await login(email, password);
      if (res.success) {
        setSubmitted(true);
      }
    }
  };

  const handleDemoFill = (targetRole) => {
    if (targetRole === 'student') {
      setEmail('student@havenly.edu');
      setPassword('havenly123');
    } else if (targetRole === 'owner') {
      setEmail('owner@havenly.com');
      setPassword('havenly123');
    } else if (targetRole === 'admin') {
      setEmail('admin@havenly.org');
      setPassword('havenly123');
    }
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
            className="relative w-full max-w-md rounded-2xl bg-[#191D1C] border border-[#C6A36A]/30 p-6 sm:p-8 shadow-2xl text-white my-auto max-h-[92vh] overflow-y-auto"
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
                  key="auth-success"
                  variants={tabContentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="text-center py-8 space-y-4"
                >
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={MICRO_SPRING}
                    className="w-12 h-12 rounded-full bg-[#C6A36A] text-[#101313] flex items-center justify-center mx-auto shadow-gold-glow"
                  >
                    <Check className="w-6 h-6 stroke-[2.5]" />
                  </motion.div>
                  <h3 className="font-serif text-2xl text-white">
                    {mode === 'login' ? 'Authentication Successful!' : 'Account Created!'}
                  </h3>
                  <p className="text-xs text-[#A6AAA4] leading-relaxed">
                    Signed in as <strong className="text-white">{email}</strong>. Session persisted via encrypted tokens.
                  </p>
                  <motion.button
                    whileHover={buttonHoverScale}
                    whileTap={buttonTapScale}
                    onClick={() => { setSubmitted(false); onClose(); }}
                    className="mt-4 px-6 py-2.5 bg-[#C6A36A] text-[#101313] text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-[#d8b57c]"
                  >
                    Continue to Platform
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="auth-form"
                  variants={tabContentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-sm bg-[#101313] border border-[#C6A36A] mb-3 shadow-gold-subtle">
                      <span className="font-serif text-[#C6A36A] text-lg font-bold">H</span>
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                      {mode === 'login' ? 'Havenly Portal Sign-In' : 'Join Havenly Student Living'}
                    </h3>
                    <p className="text-xs text-[#A6AAA4] mt-1">
                      {mode === 'login'
                        ? 'Access your student leases, host portfolio, or administrative dashboard'
                        : 'Register as a university scholar or certified property owner'}
                    </p>
                  </div>

                  {/* Quick Demo Credentials Autofill Banner */}
                  <div className="mb-5 p-3 rounded-lg bg-[#101313] border border-[#C6A36A]/20">
                    <span className="text-[10px] uppercase tracking-widest text-[#C6A36A] font-semibold block mb-1.5">
                      Quick 1-Click Demo Login:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                      <motion.button
                        whileTap={buttonTapScale}
                        type="button"
                        onClick={() => handleDemoFill('student')}
                        className="px-2 py-1.5 rounded bg-[#191D1C] hover:bg-[#C6A36A] hover:text-black text-white font-medium transition-colors truncate"
                      >
                        Student
                      </motion.button>
                      <motion.button
                        whileTap={buttonTapScale}
                        type="button"
                        onClick={() => handleDemoFill('owner')}
                        className="px-2 py-1.5 rounded bg-[#191D1C] hover:bg-[#C6A36A] hover:text-black text-white font-medium transition-colors truncate"
                      >
                        Owner
                      </motion.button>
                      <motion.button
                        whileTap={buttonTapScale}
                        type="button"
                        onClick={() => handleDemoFill('admin')}
                        className="px-2 py-1.5 rounded bg-[#191D1C] hover:bg-[#C6A36A] hover:text-black text-white font-medium transition-colors truncate"
                      >
                        Admin
                      </motion.button>
                    </div>
                  </div>

                  {/* Switch Tabs with Animated Pill */}
                  <div className="flex border border-white/10 rounded-sm p-1 mb-5 bg-[#101313]">
                    {[
                      { id: 'login', label: 'Log In' },
                      { id: 'signup', label: 'Register' }
                    ].map((tab) => {
                      const active = mode === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setMode(tab.id)}
                          className={`relative flex-1 py-2 text-xs uppercase tracking-wider font-medium transition-colors ${
                            active ? 'text-[#101313] font-semibold' : 'text-[#A6AAA4] hover:text-white'
                          }`}
                        >
                          {active && (
                            <motion.span
                              layoutId="authModePill"
                              transition={MICRO_SPRING}
                              className="absolute inset-0 bg-[#C6A36A] rounded-sm z-0"
                            />
                          )}
                          <span className="relative z-10">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Role Selection for Sign-Up */}
                  {mode === 'signup' && (
                    <div className="mb-4">
                      <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1.5">
                        I am registering as:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <motion.button
                          whileTap={buttonTapScale}
                          type="button"
                          onClick={() => setRoleSelection('student')}
                          className={`py-2 px-3 rounded text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                            roleSelection === 'student'
                              ? 'bg-[#C6A36A]/20 border-[#C6A36A] text-white font-semibold'
                              : 'bg-[#101313] border-white/10 text-[#A6AAA4]'
                          }`}
                        >
                          <User className="w-3.5 h-3.5 text-[#C6A36A]" />
                          <span>Student Scholar</span>
                        </motion.button>

                        <motion.button
                          whileTap={buttonTapScale}
                          type="button"
                          onClick={() => setRoleSelection('owner')}
                          className={`py-2 px-3 rounded text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                            roleSelection === 'owner'
                              ? 'bg-[#C6A36A]/20 border-[#C6A36A] text-white font-semibold'
                              : 'bg-[#101313] border-white/10 text-[#A6AAA4]'
                          }`}
                        >
                          <Building className="w-3.5 h-3.5 text-[#C6A36A]" />
                          <span>Property Owner</span>
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {(authError || validationError) && (
                    <div className="mb-4 p-3 rounded bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{validationError || authError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    {mode === 'signup' && (
                      <>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">
                            Full Legal Name
                          </label>
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Alex Morgan"
                            className="w-full bg-[#101313] border border-white/10 text-xs text-white px-3 py-2.5 rounded focus:outline-none focus:border-[#C6A36A]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 (555) 019-2834"
                            className="w-full bg-[#101313] border border-white/10 text-xs text-white px-3 py-2.5 rounded focus:outline-none focus:border-[#C6A36A]"
                          />
                        </div>

                        {roleSelection === 'student' ? (
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">
                              Enrolled University
                            </label>
                            <input
                              type="text"
                              required
                              value={college}
                              onChange={(e) => setCollege(e.target.value)}
                              placeholder="e.g. Stanford University"
                              className="w-full bg-[#101313] border border-white/10 text-xs text-white px-3 py-2.5 rounded focus:outline-none focus:border-[#C6A36A]"
                            />
                          </div>
                        ) : (
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">
                              Owner Type
                            </label>
                            <select
                              value={ownerType}
                              onChange={(e) => setOwnerType(e.target.value)}
                              className="w-full bg-[#101313] border border-white/10 text-xs text-white px-3 py-2.5 rounded focus:outline-none focus:border-[#C6A36A]"
                            >
                              <option value="individual">Individual Property Owner</option>
                              <option value="commercial">Commercial Housing Developer</option>
                              <option value="agency">Student Housing Agency</option>
                            </select>
                          </div>
                        )}
                      </>
                    )}

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#A6AAA4] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@domain.com"
                          className="w-full bg-[#101313] border border-white/10 text-xs text-white pl-9 pr-3 py-2.5 rounded focus:outline-none focus:border-[#C6A36A]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#A6AAA4] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full bg-[#101313] border border-white/10 text-xs text-white pl-9 pr-3 py-2.5 rounded focus:outline-none focus:border-[#C6A36A]"
                        />
                      </div>
                    </div>

                    {mode === 'signup' && (
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-[#A6AAA4] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full bg-[#101313] border border-white/10 text-xs text-white pl-9 pr-3 py-2.5 rounded focus:outline-none focus:border-[#C6A36A]"
                          />
                        </div>
                      </div>
                    )}

                    <motion.button
                      whileHover={buttonHoverScale}
                      whileTap={buttonTapScale}
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-[#C6A36A] hover:bg-[#d8b57c] text-[#101313] font-semibold text-xs uppercase tracking-[0.2em] rounded-sm transition-colors shadow-luxury flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                    >
                      <span>
                        {loading
                          ? 'Processing...'
                          : mode === 'login'
                            ? 'Sign In to Portal'
                            : `Register as ${roleSelection === 'owner' ? 'Owner' : 'Student'}`}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </motion.button>
                  </form>

                  <div className="mt-5 pt-4 border-t border-white/10 text-center text-[11px] text-[#A6AAA4]">
                    <div className="flex items-center justify-center gap-1.5 text-[#C6A36A]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Supabase Row Level Security & JWT Authorization</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
