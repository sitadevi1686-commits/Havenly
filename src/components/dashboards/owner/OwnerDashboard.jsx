import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, PlusCircle, Calendar, Bell,
  LogOut, ArrowLeft, Check, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { propertyService } from '../../../services/propertyService';
import { bookingService } from '../../../services/bookingService';
import { notificationService } from '../../../services/notificationService';
import {
  MICRO_SPRING,
  tabContentVariants,
  createStaggerContainer,
  fadeUpCardVariants,
  cardHoverLift,
  buttonHoverScale,
  buttonTapScale
} from '../../../lib/motion';

const kpiStagger = createStaggerContainer(0.06, 0.04);
const listStagger = createStaggerContainer(0.06, 0.04);

export default function OwnerDashboard({ onReturnHome }) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Add Property Form State
  const [propertyForm, setPropertyForm] = useState({
    name: '',
    category: 'Premium PG',
    description: '',
    address: '',
    city: 'Palo Alto',
    state: 'CA',
    postal_code: '94301',
    collegeNearby: 'Stanford University & Tech Campus',
    distanceKm: '0.6',
    monthlyRent: '980',
    deposit: '980',
    roomType: 'Single Studio',
    curfew: 'Flexible 24/7 Access',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
    amenities: ['Gigabit Fiber WiFi', 'Study Pods', 'Private En-Suite Bath', 'Daily Housekeeping', '24/7 Security']
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    const props = await propertyService.getOwnerProperties(user.id);
    setProperties(props);

    const bks = await bookingService.getOwnerBookings(user.id);
    setBookings(bks);

    const notifs = notificationService.getUserNotifications(user.id);
    setNotifications(notifs);
  };

  const handleAddPropertySubmit = async (e) => {
    e.preventDefault();
    await propertyService.createProperty(propertyForm, user.id);
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setActiveTab('properties');
      loadData();
    }, 1500);
  };

  const handleBookingDecision = async (bookingId, decision) => {
    const reason = decision === 'rejected' ? prompt("Reason for declining booking request:") || 'Unavailable dates' : '';
    await bookingService.updateBookingStatus(bookingId, decision, reason);
    loadData();
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const approvedProps = properties.filter(p => p.verification_status === 'approved');
  const pendingProps = properties.filter(p => p.verification_status === 'pending');

  return (
    <div className="min-h-screen bg-[#101313] text-[#A6AAA4] flex flex-col lg:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 bg-[#191D1C] border-r border-white/10 flex flex-col justify-between p-6 shrink-0">
        <div>
          {/* Logo & Return to Site */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-[#101313] border border-[#C6A36A] flex items-center justify-center">
                <span className="font-serif text-[#C6A36A] text-lg font-bold">H</span>
              </div>
              <div>
                <span className="font-serif text-xl text-white font-medium block">HAVENLY</span>
                <span className="text-[9px] uppercase tracking-widest text-[#C6A36A] font-semibold -mt-1 block">
                  Property Owner Portal
                </span>
              </div>
            </div>

            <motion.button
              whileHover={buttonHoverScale}
              whileTap={buttonTapScale}
              onClick={onReturnHome}
              className="p-1.5 rounded bg-[#101313] border border-white/10 hover:border-[#C6A36A] text-white transition-colors"
              title="Return to Public Website"
            >
              <ArrowLeft className="w-4 h-4 text-[#C6A36A]" />
            </motion.button>
          </div>

          {/* Owner Mini Badge */}
          <div className="py-5 flex items-center gap-3 border-b border-white/5">
            <div className="w-10 h-10 rounded-full bg-[#101313] border border-[#C6A36A]/40 overflow-hidden flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-[#C6A36A]" />
            </div>
            <div className="truncate">
              <span className="text-xs text-white font-medium block truncate">{user?.full_name || 'Property Owner'}</span>
              <span className="text-[10px] text-[#C6A36A] truncate block">Certified Property Manager</span>
            </div>
          </div>

          {/* Navigation Links with Shared Active Pill */}
          <nav className="mt-6 space-y-1.5">
            {[
              { id: 'overview', label: 'Overview', icon: Building2 },
              { id: 'properties', label: 'My Properties', icon: Building2, badge: properties.length },
              { id: 'add-property', label: 'Add New Property', icon: PlusCircle },
              { id: 'bookings', label: 'Booking Requests', icon: Calendar, badge: pendingBookings.length ? `${pendingBookings.length} new` : null },
              { id: 'notifications', label: 'Notifications', icon: Bell, badge: notifications.filter(n => !n.read).length || null },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileTap={buttonTapScale}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-sm text-xs font-medium transition-colors ${
                    isActive
                      ? 'text-[#101313] font-semibold'
                      : 'text-[#A6AAA4] hover:text-white hover:bg-[#101313]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="ownerSidebarPill"
                      transition={MICRO_SPRING}
                      className="absolute inset-0 bg-[#C6A36A] rounded-sm shadow-gold-subtle z-0"
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`relative z-10 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-[#101313] text-[#C6A36A]' : 'bg-[#C6A36A] text-[#101313]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-white/10 space-y-2">
          <motion.button
            whileHover={buttonHoverScale}
            whileTap={buttonTapScale}
            onClick={onReturnHome}
            className="w-full py-2 text-xs text-[#A6AAA4] hover:text-white flex items-center justify-center gap-2 border border-white/5 rounded-sm transition-colors"
          >
            <span>Public Site View</span>
          </motion.button>
          
          <motion.button
            whileTap={buttonTapScale}
            onClick={() => { logout(); onReturnHome(); }}
            className="w-full py-2 text-xs text-red-400 hover:text-red-300 flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </motion.button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 p-6 sm:p-8 lg:p-12 overflow-y-auto max-w-7xl">
        <AnimatePresence mode="wait">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div
              key="owner-overview"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8"
            >
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C6A36A]">
                  PORTFOLIO MANAGEMENT
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal mt-1">
                  Owner Command & Portfolio
                </h1>
                <p className="text-xs text-[#A6AAA4] mt-1">
                  Real-time tenant inquiries, room availability, and listing verification audits.
                </p>
              </div>

              {/* Overview Stats */}
              <motion.div variants={kpiStagger} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div variants={fadeUpCardVariants} whileHover={cardHoverLift} className="p-5 rounded-xl bg-[#191D1C] border border-white/10">
                  <span className="text-[10px] uppercase tracking-wider text-[#A6AAA4] block">Total Properties</span>
                  <span className="font-serif text-3xl text-white font-medium mt-1 block">{properties.length}</span>
                  <span className="text-[10px] text-[#C6A36A] mt-1 block">{approvedProps.length} verified live</span>
                </motion.div>
                <motion.div variants={fadeUpCardVariants} whileHover={cardHoverLift} className="p-5 rounded-xl bg-[#191D1C] border border-white/10">
                  <span className="text-[10px] uppercase tracking-wider text-[#A6AAA4] block">Pending Verification</span>
                  <span className="font-serif text-3xl text-amber-400 font-medium mt-1 block">{pendingProps.length}</span>
                  <span className="text-[10px] text-[#A6AAA4] mt-1 block">Awaiting admin audit</span>
                </motion.div>
                <motion.div variants={fadeUpCardVariants} whileHover={cardHoverLift} className="p-5 rounded-xl bg-[#191D1C] border border-white/10">
                  <span className="text-[10px] uppercase tracking-wider text-[#A6AAA4] block">Pending Requests</span>
                  <span className="font-serif text-3xl text-amber-300 font-medium mt-1 block">{pendingBookings.length}</span>
                  <span className="text-[10px] text-[#A6AAA4] mt-1 block">Requires your review</span>
                </motion.div>
                <motion.div variants={fadeUpCardVariants} whileHover={cardHoverLift} className="p-5 rounded-xl bg-[#191D1C] border border-white/10">
                  <span className="text-[10px] uppercase tracking-wider text-[#A6AAA4] block">Confirmed Tenants</span>
                  <span className="font-serif text-3xl text-emerald-400 font-medium mt-1 block">{confirmedBookings.length}</span>
                  <span className="text-[10px] text-[#A6AAA4] mt-1 block">Active semester leases</span>
                </motion.div>
              </motion.div>

              {/* Pending Requests Callout */}
              {pendingBookings.length > 0 && (
                <motion.div
                  variants={fadeUpCardVariants}
                  initial="hidden"
                  animate="visible"
                  className="p-5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                    <span className="text-xs">
                      You have <strong className="text-white">{pendingBookings.length} student booking inquiries</strong> awaiting approval.
                    </span>
                  </div>
                  <motion.button
                    whileHover={buttonHoverScale}
                    whileTap={buttonTapScale}
                    onClick={() => setActiveTab('bookings')}
                    className="px-4 py-1.5 bg-amber-400 text-black text-xs uppercase tracking-wider font-semibold rounded"
                  >
                    Review Requests
                  </motion.button>
                </motion.div>
              )}

              {/* Properties Quick Glance */}
              <motion.div
                variants={fadeUpCardVariants}
                initial="hidden"
                animate="visible"
                className="rounded-xl bg-[#191D1C] border border-white/10 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-xl text-white">Your Accommodation Listings</h3>
                  <button onClick={() => setActiveTab('properties')} className="text-xs text-[#C6A36A] hover:underline uppercase tracking-wider">
                    Manage Listings
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {properties.slice(0, 4).map((p) => (
                    <motion.div
                      key={p.id}
                      whileHover={{ y: -2 }}
                      className="p-4 rounded-lg bg-[#101313] border border-white/5 flex items-center gap-4"
                    >
                      <img src={p.image} alt={p.name} className="w-16 h-16 rounded object-cover" />
                      <div className="flex-1 truncate">
                        <span className="font-serif text-base text-white truncate block">{p.name}</span>
                        <span className="text-[11px] text-[#A6AAA4] truncate block">{p.category} &bull; ${p.monthlyRent}/mo</span>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-semibold uppercase ${
                          p.verification_status === 'approved' ? 'bg-emerald-950/80 text-emerald-300' : 'bg-amber-950/80 text-amber-300'
                        }`}>
                          {p.verification_status === 'approved' ? 'Approved & Public' : 'Under Verification'}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* MY PROPERTIES TAB */}
          {activeTab === 'properties' && (
            <motion.div
              key="owner-properties"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C6A36A]">
                    PORTFOLIO CATALOG
                  </span>
                  <h2 className="font-serif text-3xl text-white font-normal mt-1">My Managed Residences</h2>
                </div>

                <motion.button
                  whileHover={buttonHoverScale}
                  whileTap={buttonTapScale}
                  onClick={() => setActiveTab('add-property')}
                  className="px-4 py-2 bg-[#C6A36A] text-[#101313] text-xs uppercase tracking-widest font-semibold rounded flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Property</span>
                </motion.button>
              </div>

              <motion.div variants={listStagger} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map((p) => (
                  <motion.div
                    key={p.id}
                    variants={fadeUpCardVariants}
                    whileHover={cardHoverLift}
                    className="group rounded-xl overflow-hidden bg-[#191D1C] border border-white/10 hover:border-[#C6A36A]/40 transition-colors p-5 space-y-4 shadow-luxury"
                  >
                    <div className="relative h-44 rounded-lg overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                      <div className="absolute top-3 left-3">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase backdrop-blur-md ${
                          p.verification_status === 'approved'
                            ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-950/90 text-amber-300 border border-amber-500/40'
                        }`}>
                          {p.verification_status === 'approved' ? 'Verified & Public' : 'Pending Physical Audit'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-serif text-2xl text-white">{p.name}</h3>
                      <span className="text-xs text-[#A6AAA4] block mt-0.5">{p.location} &bull; {p.college_name || p.college}</span>
                      <div className="flex items-center justify-between text-xs text-white font-medium mt-3 pt-3 border-t border-white/5">
                        <span>Rent: ${p.monthlyRent}/mo</span>
                        <span>Deposit: ${p.deposit || p.security_deposit}</span>
                        <span>Curfew: {p.curfewCategory || p.curfew_policy}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* ADD PROPERTY TAB */}
          {activeTab === 'add-property' && (
            <motion.div
              key="owner-add-property"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6 max-w-3xl"
            >
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C6A36A]">
                  SUBMISSION WORKFLOW
                </span>
                <h2 className="font-serif text-3xl text-white font-normal mt-1">List New Student Accommodation</h2>
                <p className="text-xs text-[#A6AAA4]">
                  Submissions enter pending verification for Havenly's 42-point safety and lease transparency audit.
                </p>
              </div>

              <AnimatePresence>
                {formSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs rounded flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Property submitted! It is now pending administrative verification review.</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleAddPropertySubmit} className="space-y-5 rounded-xl bg-[#191D1C] border border-white/10 p-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">Property Name</label>
                    <input
                      type="text"
                      required
                      value={propertyForm.name}
                      onChange={(e) => setPropertyForm({ ...propertyForm, name: e.target.value })}
                      placeholder="e.g. Oxford Courtyard Lofts"
                      className="w-full bg-[#101313] border border-white/10 text-xs text-white p-3 rounded focus:outline-none focus:border-[#C6A36A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">Accommodation Category</label>
                    <select
                      value={propertyForm.category}
                      onChange={(e) => setPropertyForm({ ...propertyForm, category: e.target.value })}
                      className="w-full bg-[#101313] border border-white/10 text-xs text-white p-3 rounded focus:outline-none focus:border-[#C6A36A]"
                    >
                      <option value="Premium PG">Premium PG</option>
                      <option value="Student Apartments">Student Apartments</option>
                      <option value="Shared Accommodation">Shared Accommodation</option>
                      <option value="Independent Flats">Independent Flats</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">Architectural Description</label>
                  <textarea
                    rows={3}
                    required
                    value={propertyForm.description}
                    onChange={(e) => setPropertyForm({ ...propertyForm, description: e.target.value })}
                    placeholder="Describe building aesthetics, study environment, and amenities..."
                    className="w-full bg-[#101313] border border-white/10 text-xs text-white p-3 rounded focus:outline-none focus:border-[#C6A36A] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">Target University</label>
                    <input
                      type="text"
                      required
                      value={propertyForm.collegeNearby}
                      onChange={(e) => setPropertyForm({ ...propertyForm, collegeNearby: e.target.value })}
                      className="w-full bg-[#101313] border border-white/10 text-xs text-white p-3 rounded focus:outline-none focus:border-[#C6A36A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">Distance (km)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={propertyForm.distanceKm}
                      onChange={(e) => setPropertyForm({ ...propertyForm, distanceKm: e.target.value })}
                      className="w-full bg-[#101313] border border-white/10 text-xs text-white p-3 rounded focus:outline-none focus:border-[#C6A36A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">Curfew Policy</label>
                    <select
                      value={propertyForm.curfew}
                      onChange={(e) => setPropertyForm({ ...propertyForm, curfew: e.target.value })}
                      className="w-full bg-[#101313] border border-white/10 text-xs text-white p-3 rounded focus:outline-none focus:border-[#C6A36A]"
                    >
                      <option value="Flexible 24/7 Access">Flexible 24/7 Access</option>
                      <option value="11:00 PM Access">11:00 PM Access</option>
                      <option value="10:30 PM Access">10:30 PM Access</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">Monthly Rent ($)</label>
                    <input
                      type="number"
                      required
                      value={propertyForm.monthlyRent}
                      onChange={(e) => setPropertyForm({ ...propertyForm, monthlyRent: e.target.value })}
                      className="w-full bg-[#101313] border border-white/10 text-xs text-white p-3 rounded focus:outline-none focus:border-[#C6A36A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">Security Deposit ($)</label>
                    <input
                      type="number"
                      required
                      value={propertyForm.deposit}
                      onChange={(e) => setPropertyForm({ ...propertyForm, deposit: e.target.value })}
                      className="w-full bg-[#101313] border border-white/10 text-xs text-white p-3 rounded focus:outline-none focus:border-[#C6A36A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">Property Photograph URL</label>
                  <input
                    type="url"
                    required
                    value={propertyForm.image}
                    onChange={(e) => setPropertyForm({ ...propertyForm, image: e.target.value })}
                    className="w-full bg-[#101313] border border-white/10 text-xs text-white p-3 rounded focus:outline-none focus:border-[#C6A36A]"
                  />
                </div>

                <motion.button
                  whileHover={buttonHoverScale}
                  whileTap={buttonTapScale}
                  type="submit"
                  className="w-full py-3.5 bg-[#C6A36A] hover:bg-[#d8b57c] text-[#101313] font-semibold text-xs uppercase tracking-[0.2em] rounded-sm transition-colors shadow-luxury"
                >
                  Submit Listing for Havenly Verification
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* BOOKING REQUESTS TAB */}
          {activeTab === 'bookings' && (
            <motion.div
              key="owner-bookings"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C6A36A]">
                  TENANT INQUIRIES
                </span>
                <h2 className="font-serif text-3xl text-white font-normal mt-1">Student Booking Requests</h2>
                <p className="text-xs text-[#A6AAA4]">Approve or decline tenant applications for your accommodations.</p>
              </div>

              <motion.div variants={listStagger} initial="hidden" animate="visible" className="space-y-4">
                {bookings.map((b) => (
                  <motion.div
                    key={b.id}
                    variants={fadeUpCardVariants}
                    whileHover={cardHoverLift}
                    className="p-6 rounded-xl bg-[#191D1C] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-luxury"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-xl text-white">{b.student_name}</span>
                        <span className="text-xs text-[#A6AAA4]">({b.student_email})</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          b.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300' :
                          b.status === 'pending' ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'
                        }`}>
                          {b.status}
                        </span>
                      </div>

                      <span className="text-xs text-[#C6A36A] block mt-1">
                        Property: <strong>{b.property_name}</strong> &bull; Ref: {b.booking_reference}
                      </span>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#A6AAA4] mt-2">
                        <span>Room: <strong className="text-white">{b.room_sharing_type}</strong></span>
                        <span>&bull;</span>
                        <span>Check-In: <strong className="text-white">{b.check_in_date}</strong></span>
                        <span>&bull;</span>
                        <span>Rent: <strong className="text-white">${b.monthly_rent}/mo</strong></span>
                        <span>&bull;</span>
                        <span>Deposit: <strong className="text-white">${b.security_deposit}</strong></span>
                      </div>
                    </div>

                    {b.status === 'pending' ? (
                      <div className="flex items-center gap-3">
                        <motion.button
                          whileHover={buttonHoverScale}
                          whileTap={buttonTapScale}
                          onClick={() => handleBookingDecision(b.id, 'confirmed')}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-xs uppercase tracking-wider rounded"
                        >
                          Accept & Reserve Bed
                        </motion.button>
                        <motion.button
                          whileTap={buttonTapScale}
                          onClick={() => handleBookingDecision(b.id, 'rejected')}
                          className="px-3.5 py-2 border border-red-500/40 text-red-400 hover:text-red-300 text-xs uppercase tracking-wider rounded"
                        >
                          Decline
                        </motion.button>
                      </div>
                    ) : (
                      <span className="text-xs text-[#A6AAA4] font-medium">
                        Decision Recorded ({b.status})
                      </span>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <motion.div
              key="owner-notifications"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C6A36A]">
                    ACTIVITY FEED
                  </span>
                  <h2 className="font-serif text-3xl text-white font-normal mt-1">Host Notifications</h2>
                </div>
                <motion.button
                  whileTap={buttonTapScale}
                  onClick={() => {
                    notificationService.markAllAsRead(user.id);
                    loadData();
                  }}
                  className="text-xs text-[#C6A36A] hover:underline uppercase tracking-wider"
                >
                  Mark All as Read
                </motion.button>
              </div>

              <motion.div variants={listStagger} initial="hidden" animate="visible" className="space-y-3">
                {notifications.length === 0 ? (
                  <p className="text-xs text-[#A6AAA4]">No recent notifications.</p>
                ) : (
                  notifications.map((n) => (
                    <motion.div
                      key={n.id}
                      variants={fadeUpCardVariants}
                      whileHover={{ x: 3 }}
                      onClick={() => {
                        notificationService.markAsRead(n.id);
                        loadData();
                      }}
                      className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                        n.read ? 'bg-[#191D1C]/60 border-white/5 text-[#A6AAA4]' : 'bg-[#191D1C] border-[#C6A36A]/40 text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-base text-white">{n.title}</span>
                        <span className="text-[10px] text-[#A6AAA4]">{new Date(n.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-[#A6AAA4] mt-1">{n.message}</p>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
