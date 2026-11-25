import React, { useState, useMemo, useEffect } from 'react';
import { MotionConfig, AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FloatingStats from './components/FloatingStats';
import SearchFilterSection from './components/SearchFilterSection';
import FeaturedProperties from './components/FeaturedProperties';
import OurServices from './components/OurServices';
import HowItWorks from './components/HowItWorks';
import LivingInsights from './components/LivingInsights';
import PropertyDetailModal from './components/PropertyDetailModal';
import ListPropertyModal from './components/ListPropertyModal';
import AuthModal from './components/AuthModal';
import ArticleModal from './components/ArticleModal';
import BookingModal from './components/BookingModal';
import ReportModal from './components/ReportModal';
import Footer from './components/Footer';

// Portals & Dashboards
import StudentDashboard from './components/dashboards/student/StudentDashboard';
import OwnerDashboard from './components/dashboards/owner/OwnerDashboard';
import AdminDashboard from './components/dashboards/admin/AdminDashboard';

import { AuthProvider, useAuth } from './context/AuthContext';
import { propertyService } from './services/propertyService';
import { pageTransitionVariants, buttonTapScale } from './lib/motion';

function MainApp() {
  const { user, role } = useAuth();

  // Platform View State: 'public' | 'student' | 'owner' | 'admin'
  const [currentView, setCurrentView] = useState('public');

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Properties');
  const [selectedCollege, setSelectedCollege] = useState('All Colleges');
  const [maxDistance, setMaxDistance] = useState(999);
  const [selectedSharing, setSelectedSharing] = useState('All');
  const [maxBudget, setMaxBudget] = useState(2000);
  const [curfewFilter, setCurfewFilter] = useState('All');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Modals
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [bookingProperty, setBookingProperty] = useState(null);
  const [reportProperty, setReportProperty] = useState(null);
  const [isListPropertyOpen, setIsListPropertyOpen] = useState(false);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Properties list loaded from database service
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    loadProperties();
  }, [currentView]);

  const loadProperties = async () => {
    const data = await propertyService.getPublicProperties();
    setProperties(data);
  };

  // Favorites (persisted in localStorage)
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('havenly_saved_properties');
      return saved ? JSON.parse(saved) : ['prop-1', 'prop-4'];
    } catch {
      return ['prop-1', 'prop-4'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('havenly_saved_properties', JSON.stringify(favorites));
    } catch (e) {
      console.warn("Storage not available", e);
    }
  }, [favorites]);

  const toggleFavorite = (propertyId) => {
    setFavorites((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Properties');
    setSelectedCollege('All Colleges');
    setMaxDistance(999);
    setSelectedSharing('All');
    setMaxBudget(2000);
    setCurfewFilter('All');
    setSelectedAmenities([]);
    setSortBy('featured');
    setShowFavoritesOnly(false);
  };

  const isFilterActive = useMemo(() => {
    return (
      searchQuery.trim() !== '' ||
      selectedCategory !== 'All Properties' ||
      selectedCollege !== 'All Colleges' ||
      maxDistance !== 999 ||
      selectedSharing !== 'All' ||
      maxBudget < 2000 ||
      curfewFilter !== 'All' ||
      selectedAmenities.length > 0 ||
      showFavoritesOnly
    );
  }, [
    searchQuery,
    selectedCategory,
    selectedCollege,
    maxDistance,
    selectedSharing,
    maxBudget,
    curfewFilter,
    selectedAmenities,
    showFavoritesOnly
  ]);

  // Comprehensive Filter & Sorting Computation
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = prop.name.toLowerCase().includes(q);
        const matchesLoc = (prop.location || prop.address || '').toLowerCase().includes(q);
        const matchesCollege = (prop.college || prop.college_name || '').toLowerCase().includes(q);
        const matchesAmenity = prop.amenities?.some(a => a.toLowerCase().includes(q));
        if (!matchesName && !matchesLoc && !matchesCollege && !matchesAmenity) {
          return false;
        }
      }

      if (selectedCategory !== 'All Properties' && prop.category !== selectedCategory) {
        return false;
      }

      if (selectedCollege !== 'All Colleges' && (prop.college !== selectedCollege && prop.college_name !== selectedCollege)) {
        return false;
      }

      const distance = Number(prop.distance_km || prop.distanceKm || 0);
      if (distance > maxDistance) {
        return false;
      }

      if (selectedSharing !== 'All') {
        const options = prop.room_sharing_types || prop.sharingOptions || [];
        if (!options.includes(selectedSharing)) return false;
      }

      const rent = Number(prop.monthlyRent || prop.monthly_rent || 0);
      if (rent > maxBudget) {
        return false;
      }

      if (curfewFilter !== 'All') {
        const policy = prop.curfewCategory || prop.curfew_policy || '';
        if (!policy.includes(curfewFilter)) return false;
      }

      if (selectedAmenities.length > 0 && prop.amenities) {
        const hasAll = selectedAmenities.every((amenity) =>
          prop.amenities.some((pa) => pa.toLowerCase().includes(amenity.toLowerCase()))
        );
        if (!hasAll) return false;
      }

      if (showFavoritesOnly && !favorites.includes(prop.id)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const rentA = Number(a.monthlyRent || a.monthly_rent || 0);
      const rentB = Number(b.monthlyRent || b.monthly_rent || 0);
      const distA = Number(a.distance_km || a.distanceKm || 0);
      const distB = Number(b.distance_km || b.distanceKm || 0);

      if (sortBy === 'price-asc') return rentA - rentB;
      if (sortBy === 'price-desc') return rentB - rentA;
      if (sortBy === 'distance') return distA - distB;
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      return 0;
    });
  }, [
    properties,
    searchQuery,
    selectedCategory,
    selectedCollege,
    maxDistance,
    selectedSharing,
    maxBudget,
    curfewFilter,
    selectedAmenities,
    showFavoritesOnly,
    favorites,
    sortBy
  ]);

  const scrollToSection = (id) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#101313] text-[#A6AAA4] font-sans selection:bg-[#C6A36A] selection:text-[#101313] relative">
      
      {/* Smooth Portal & View Transitions */}
      <AnimatePresence mode="wait">
        {currentView === 'student' ? (
          <motion.div
            key="view-student"
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <StudentDashboard
              onReturnHome={() => setCurrentView('public')}
              onOpenPropertyDetails={(prop) => setSelectedProperty(prop)}
            />
          </motion.div>
        ) : currentView === 'owner' ? (
          <motion.div
            key="view-owner"
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <OwnerDashboard
              onReturnHome={() => setCurrentView('public')}
            />
          </motion.div>
        ) : currentView === 'admin' ? (
          <motion.div
            key="view-admin"
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <AdminDashboard
              onReturnHome={() => setCurrentView('public')}
              onOpenPropertyDetails={(prop) => setSelectedProperty(prop)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="view-public"
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Top Universal Role Quick Banner */}
            <div className="bg-[#191D1C] border-b border-[#C6A36A]/20 py-1.5 px-6 text-center text-xs text-[#A6AAA4] flex flex-wrap items-center justify-center gap-3">
              <span className="text-[10px] uppercase tracking-widest text-[#C6A36A] font-semibold">
                HAVENLY FULL-STACK PLATFORM
              </span>
              <span className="hidden sm:inline">&bull;</span>
              <span>Active User: <strong className="text-white">{user?.full_name || 'Guest'}</strong> ({role?.toUpperCase() || 'GUEST'})</span>
              <span className="hidden sm:inline">&bull;</span>
              <motion.button
                whileTap={buttonTapScale}
                onClick={() => {
                  if (role === 'admin') setCurrentView('admin');
                  else if (role === 'owner') setCurrentView('owner');
                  else setCurrentView('student');
                }}
                className="text-[#C6A36A] hover:underline font-semibold text-[11px] uppercase tracking-wider"
              >
                Open {role === 'admin' ? 'Admin Center' : role === 'owner' ? 'Owner Portal' : 'Student Dashboard'} &rarr;
              </motion.button>
            </div>

            {/* Navigation */}
            <Navbar
              onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
              onOpenListProperty={() => setIsListPropertyOpen(true)}
              favoriteCount={favorites.length}
              onToggleFavoritesOnly={() => {
                setShowFavoritesOnly(!showFavoritesOnly);
                scrollToSection('#properties-section');
              }}
              showFavoritesOnly={showFavoritesOnly}
              onOpenDashboard={(userRole) => {
                if (userRole === 'admin') setCurrentView('admin');
                else if (userRole === 'owner') setCurrentView('owner');
                else setCurrentView('student');
              }}
            />

            {/* Main Public Website */}
            <main>
              <Hero
                onExploreClick={() => scrollToSection('#search-section')}
                onListPropertyClick={() => setIsListPropertyOpen(true)}
              />

              <FloatingStats />

              <SearchFilterSection
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedCollege={selectedCollege}
                setSelectedCollege={setSelectedCollege}
                maxDistance={maxDistance}
                setMaxDistance={setMaxDistance}
                selectedSharing={selectedSharing}
                setSelectedSharing={setSelectedSharing}
                maxBudget={maxBudget}
                setMaxBudget={setMaxBudget}
                curfewFilter={curfewFilter}
                setCurfewFilter={setCurfewFilter}
                selectedAmenities={selectedAmenities}
                toggleAmenity={toggleAmenity}
                sortBy={sortBy}
                setSortBy={setSortBy}
                showFavoritesOnly={showFavoritesOnly}
                setShowFavoritesOnly={setShowFavoritesOnly}
                favoriteCount={favorites.length}
                onResetFilters={resetFilters}
                totalResults={filteredProperties.length}
              />

              <FeaturedProperties
                properties={filteredProperties}
                onViewDetails={(prop) => setSelectedProperty(prop)}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                isFilterActive={isFilterActive}
                onResetFilters={resetFilters}
              />

              <OurServices
                onConsultClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
              />

              <HowItWorks
                onStartJourney={() => scrollToSection('#search-section')}
              />

              <LivingInsights
                onReadArticle={(article) => setSelectedArticle(article)}
              />
            </main>

            <Footer
              onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
              onOpenListProperty={() => setIsListPropertyOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Interactive Modals */}
      <AnimatePresence>
        {selectedProperty && (
          <PropertyDetailModal
            key={selectedProperty.id}
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
            isFavorite={favorites.includes(selectedProperty.id)}
            onToggleFavorite={toggleFavorite}
            onBookNow={(prop) => {
              setSelectedProperty(null);
              setBookingProperty(prop);
            }}
            onReportProperty={(prop) => {
              setSelectedProperty(null);
              setReportProperty(prop);
            }}
          />
        )}
      </AnimatePresence>

      <BookingModal
        property={bookingProperty}
        isOpen={Boolean(bookingProperty)}
        onClose={() => setBookingProperty(null)}
        onBookingSuccess={() => {
          loadProperties();
        }}
      />

      <ListPropertyModal
        isOpen={isListPropertyOpen}
        onClose={() => {
          setIsListPropertyOpen(false);
          loadProperties();
        }}
      />

      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
      />

      <AnimatePresence>
        {selectedArticle && (
          <ArticleModal
            key={selectedArticle.id}
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
          />
        )}
      </AnimatePresence>

      <ReportModal
        property={reportProperty}
        isOpen={Boolean(reportProperty)}
        onClose={() => setReportProperty(null)}
      />

    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </MotionConfig>
  );
}
