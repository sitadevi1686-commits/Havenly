import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Menu, X, ArrowUpRight, LogIn, User, Building2, ShieldCheck, ChevronDown, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LUXURY_EASE, MICRO_SPRING, dropdownVariants, drawerVariants, buttonHoverScale, buttonTapScale } from '../lib/motion';

export default function Navbar({
  onOpenAuth,
  onOpenListProperty,
  favoriteCount,
  onToggleFavoritesOnly,
  showFavoritesOnly,
  onOpenDashboard
}) {
  const { isAuthenticated, role, switchRoleDemo } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [activeSection, setActiveSection] = useState('Home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Discover', href: '#search-section' },
    { name: 'Properties', href: '#properties-section' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Services', href: '#services-section' },
    { name: 'Insights', href: '#insights-section' },
  ];

  // Track active section gently on scroll
  useEffect(() => {
    const sections = navLinks
      .map((l) => ({ name: l.name, el: document.querySelector(l.href) }))
      .filter((s) => s.el);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) {
          const match = sections.find((s) => s.el === visible.target);
          if (match) setActiveSection(match.name);
        }
      },
      { rootMargin: '-35% 0px -55% 0px' }
    );

    sections.forEach((s) => observer.observe(s.el));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e, link) => {
    e.preventDefault();
    setActiveSection(link.name);
    setMobileMenuOpen(false);
    const element = document.querySelector(link.href);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const highlightedNav = hoveredLink || activeSection;

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: LUXURY_EASE }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#101313]/92 backdrop-blur-md py-3.5 border-b border-[#C6A36A]/20 shadow-luxury'
          : 'bg-gradient-to-b from-[#101313]/90 via-[#101313]/50 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        
        {/* Left: Havenly Brand Logo */}
        <motion.a
          href="#hero"
          onClick={(e) => handleNavClick(e, { name: 'Home', href: '#hero' })}
          whileHover={{ opacity: 0.92 }}
          className="flex items-center gap-3 group"
        >
          <div className="relative w-9 h-9 rounded-sm bg-[#191D1C] border border-[#C6A36A]/40 flex items-center justify-center transition-all duration-300 group-hover:border-[#C6A36A] group-hover:shadow-[0_0_15px_rgba(198,163,106,0.3)]">
            <span className="font-serif text-[#C6A36A] text-lg font-bold tracking-widest">H</span>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#C6A36A] rotate-45"></div>
          </div>
          
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl font-medium tracking-[0.22em] text-[#FFFFFF] group-hover:text-[#F4F0E8] transition-colors">
              HAVENLY
            </span>
            <span className="text-[9px] uppercase tracking-[0.28em] text-[#C6A36A] font-light -mt-1">
              Student Housing, Simplified
            </span>
          </div>
        </motion.a>

        {/* Center: Desktop Navigation Links with Gold Sliding Underline */}
        <nav
          className="hidden lg:flex items-center gap-7 xl:gap-9"
          onMouseLeave={() => setHoveredLink(null)}
        >
          {navLinks.map((link) => {
            const isHighlighted = highlightedNav === link.name;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                onMouseEnter={() => setHoveredLink(link.name)}
                className={`text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-300 relative py-1.5 ${
                  isHighlighted ? 'text-[#FFFFFF]' : 'text-[#A6AAA4] hover:text-[#FFFFFF]'
                }`}
              >
                {link.name}
                {isHighlighted && (
                  <motion.span
                    layoutId="navGoldUnderline"
                    transition={MICRO_SPRING}
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C6A36A]"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right: Actions Suite */}
        <div className="hidden sm:flex items-center gap-3.5">
          
          {/* Favourites toggle pill */}
          <motion.button
            whileHover={buttonHoverScale}
            whileTap={buttonTapScale}
            onClick={onToggleFavoritesOnly}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs tracking-wider transition-colors duration-300 border ${
              showFavoritesOnly
                ? 'bg-[#C6A36A] text-[#101313] border-[#C6A36A] font-semibold'
                : 'bg-[#191D1C]/60 text-[#A6AAA4] border-white/10 hover:border-[#C6A36A]/50 hover:text-white'
            }`}
            title="View saved properties"
          >
            <Bookmark className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-[#101313]' : favoriteCount > 0 ? 'fill-[#C6A36A] text-[#C6A36A]' : ''}`} />
            <span>Saved</span>
            <AnimatePresence mode="popLayout">
              {favoriteCount > 0 && (
                <motion.span
                  key={favoriteCount}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={MICRO_SPRING}
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${showFavoritesOnly ? 'bg-[#101313] text-[#C6A36A]' : 'bg-[#C6A36A] text-[#101313] font-bold'}`}
                >
                  {favoriteCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Quick Platform Switcher Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={buttonHoverScale}
              whileTap={buttonTapScale}
              onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
              className="px-2.5 py-1.5 rounded-sm bg-[#191D1C] border border-[#C6A36A]/40 text-[#C6A36A] text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1 hover:border-[#C6A36A]"
              title="Switch demo persona (Student / Owner / Admin)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>{role ? `${role.toUpperCase()} PORTAL` : 'GUEST'}</span>
              <ChevronDown className={`w-3 h-3 ml-0.5 transition-transform duration-200 ${showRoleSwitcher ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {showRoleSwitcher && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-[#191D1C] border border-[#C6A36A]/40 shadow-2xl py-2 z-50 text-xs text-white origin-top-right"
                >
                  <span className="px-3 py-1 text-[9px] uppercase tracking-widest text-[#A6AAA4] block border-b border-white/5">
                    Switch Active Portal:
                  </span>
                  <button
                    onClick={() => { switchRoleDemo('student'); setShowRoleSwitcher(false); }}
                    className="w-full px-3 py-2 text-left hover:bg-[#101313] flex items-center gap-2 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-[#C6A36A]" />
                    <span>Student (Alex Morgan)</span>
                  </button>
                  <button
                    onClick={() => { switchRoleDemo('owner'); setShowRoleSwitcher(false); }}
                    className="w-full px-3 py-2 text-left hover:bg-[#101313] flex items-center gap-2 transition-colors"
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#C6A36A]" />
                    <span>Property Owner (Marcus)</span>
                  </button>
                  <button
                    onClick={() => { switchRoleDemo('admin'); setShowRoleSwitcher(false); }}
                    className="w-full px-3 py-2 text-left hover:bg-[#101313] flex items-center gap-2 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C6A36A]" />
                    <span>Admin (Elena Rostova)</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Logged In vs Logged Out State */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={buttonHoverScale}
                whileTap={buttonTapScale}
                onClick={() => onOpenDashboard(role)}
                className="px-4 py-2 rounded-sm bg-[#C6A36A] hover:bg-[#d8b57c] text-[#101313] font-semibold text-xs uppercase tracking-widest transition-colors shadow-sm flex items-center gap-1.5"
              >
                <span>Open {role === 'admin' ? 'Admin Center' : role === 'owner' ? 'Owner Hub' : 'My Portal'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={buttonHoverScale}
                whileTap={buttonTapScale}
                onClick={() => onOpenAuth('login')}
                className="text-xs uppercase tracking-[0.18em] font-medium text-[#FFFFFF] hover:text-[#C6A36A] transition-colors px-3 py-2 flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-[#C6A36A]" />
                <span>Login</span>
              </motion.button>

              <motion.button
                whileHover={buttonHoverScale}
                whileTap={buttonTapScale}
                onClick={() => onOpenAuth('signup')}
                className="border border-[#C6A36A] px-4 py-2 rounded-sm bg-transparent hover:bg-[#C6A36A] text-[#C6A36A] hover:text-[#101313] text-xs uppercase tracking-[0.2em] font-medium transition-colors"
              >
                Get Started
              </motion.button>
            </div>
          )}

          {/* List Your Property Button */}
          <motion.button
            whileHover={buttonHoverScale}
            whileTap={buttonTapScale}
            onClick={onOpenListProperty}
            className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 rounded-sm border border-white/10 hover:border-[#C6A36A] text-[#A6AAA4] hover:text-white text-xs uppercase tracking-wider transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#C6A36A]" />
            <span>List Property</span>
          </motion.button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex sm:hidden items-center gap-2">
          {isAuthenticated && (
            <motion.button
              whileTap={buttonTapScale}
              onClick={() => onOpenDashboard(role)}
              className="px-2.5 py-1 rounded bg-[#C6A36A] text-[#101313] text-[10px] font-bold uppercase tracking-wider"
            >
              Dashboard
            </motion.button>
          )}
          <motion.button
            whileTap={buttonTapScale}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#F4F0E8] hover:text-[#C6A36A] focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="sm:hidden bg-[#101313]/98 backdrop-blur-xl border-b border-[#C6A36A]/20 px-6 overflow-hidden"
          >
            <div className="py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className="text-sm uppercase tracking-[0.2em] font-medium text-[#A6AAA4] hover:text-[#C6A36A] py-1.5 border-b border-white/5 transition-colors"
                >
                  {link.name}
                </a>
              ))}

              <div className="pt-2 flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-widest text-[#C6A36A]">Switch User Mode:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => { switchRoleDemo('student'); setMobileMenuOpen(false); }}
                    className={`py-2 text-[10px] uppercase font-bold rounded ${role === 'student' ? 'bg-[#C6A36A] text-black' : 'bg-[#191D1C] text-white'}`}
                  >
                    Student
                  </button>
                  <button
                    onClick={() => { switchRoleDemo('owner'); setMobileMenuOpen(false); }}
                    className={`py-2 text-[10px] uppercase font-bold rounded ${role === 'owner' ? 'bg-[#C6A36A] text-black' : 'bg-[#191D1C] text-white'}`}
                  >
                    Owner
                  </button>
                  <button
                    onClick={() => { switchRoleDemo('admin'); setMobileMenuOpen(false); }}
                    className={`py-2 text-[10px] uppercase font-bold rounded ${role === 'admin' ? 'bg-[#C6A36A] text-black' : 'bg-[#191D1C] text-white'}`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenDashboard(role); }}
                  className="w-full text-center py-2.5 text-xs uppercase tracking-widest text-[#101313] font-semibold bg-[#C6A36A] rounded-sm"
                >
                  Open {role === 'admin' ? 'Admin Center' : role === 'owner' ? 'Owner Hub' : 'Student Portal'}
                </button>

                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenListProperty(); }}
                  className="w-full text-center py-2.5 text-xs uppercase tracking-widest text-[#FFFFFF] border border-white/20 rounded-sm"
                >
                  List Your Property
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
