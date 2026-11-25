import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Compass, Calendar, Bookmark, Bell, User,
  LogOut, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { bookingService } from '../../../services/bookingService';
import { notificationService } from '../../../services/notificationService';
import { mockDb } from '../../../services/mockDatabase';
import PropertyCard from '../../PropertyCard';
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

export default function StudentDashboard({ onReturnHome, onOpenPropertyDetails }) {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    college: user?.college || '',
    email: user?.email || ''
  });
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    const bks = await bookingService.getStudentBookings(user.id);
    setBookings(bks);

    const notifs = notificationService.getUserNotifications(user.id);
    setNotifications(notifs);

    const props = mockDb.getProperties();
    const favIds = mockDb.getFavourites(user.id);
    setSavedProperties(props.filter(p => favIds.includes(p.id)));
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you wish to cancel this reservation request?")) {
      await bookingService.updateBookingStatus(bookingId, 'cancelled', 'Cancelled by student');
      loadData();
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');

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
                  Student Portal
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

          {/* User Profile Mini Badge */}
          <div className="py-5 flex items-center gap-3 border-b border-white/5">
            <div className="w-10 h-10 rounded-full bg-[#101313] border border-[#C6A36A]/40 overflow-hidden flex items-center justify-center shrink-0">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-[#C6A36A]" />
              )}
            </div>
            <div className="truncate">
              <span className="text-xs text-white font-medium block truncate">{user?.full_name}</span>
              <span className="text-[10px] text-[#C6A36A] truncate block">{user?.college || 'Scholar'}</span>
            </div>
          </div>

          {/* Navigation Links with Shared Active Pill */}
          <nav className="mt-6 space-y-1.5">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'bookings', label: 'My Bookings', icon: Calendar, badge: pendingBookings.length ? `${pendingBookings.length} pending` : null },
              { id: 'saved', label: 'Saved Sanctuaries', icon: Bookmark, badge: savedProperties.length },
              { id: 'notifications', label: 'Notifications', icon: Bell, badge: notifications.filter(n => !n.read).length || null },
              { id: 'profile', label: 'My Profile', icon: User },
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
                      layoutId="studentSidebarPill"
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
            <Compass className="w-3.5 h-3.5 text-[#C6A36A]" />
            <span>Browse All Properties</span>
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

      {/* Main Content Dashboard Workspace */}
      <main className="flex-1 p-6 sm:p-8 lg:p-12 overflow-y-auto max-w-7xl">
        <AnimatePresence mode="wait">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div
              key="student-overview"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8"
            >
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C6A36A]">
                  STUDENT COMMAND
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal mt-1">
                  Welcome back, {user?.full_name?.split(' ')[0] || 'Scholar'}
                </h1>
                <p className="text-xs text-[#A6AAA4] mt-1">
                  Your campus housing reservations, shortlisted properties, and verified host communications.
                </p>
              </div>

              {/* 4 Overview Statistics Cards */}
              <motion.div
                variants={kpiStagger}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              >
                <motion.div variants={fadeUpCardVariants} whileHover={cardHoverLift} className="p-5 rounded-xl bg-[#191D1C] border border-white/10">
                  <span className="text-[10px] uppercase tracking-wider text-[#A6AAA4] block">Total Bookings</span>
                  <span className="font-serif text-3xl text-white font-medium mt-1 block">{bookings.length}</span>
                  <span className="text-[10px] text-[#C6A36A] mt-1 block">Lifetime requests</span>
                </motion.div>
                <motion.div variants={fadeUpCardVariants} whileHover={cardHoverLift} className="p-5 rounded-xl bg-[#191D1C] border border-white/10">
                  <span className="text-[10px] uppercase tracking-wider text-[#A6AAA4] block">Pending Reviews</span>
                  <span className="font-serif text-3xl text-amber-400 font-medium mt-1 block">{pendingBookings.length}</span>
                  <span className="text-[10px] text-[#A6AAA4] mt-1 block">Awaiting host review</span>
                </motion.div>
                <motion.div variants={fadeUpCardVariants} whileHover={cardHoverLift} className="p-5 rounded-xl bg-[#191D1C] border border-white/10">
                  <span className="text-[10px] uppercase tracking-wider text-[#A6AAA4] block">Confirmed Stays</span>
                  <span className="font-serif text-3xl text-emerald-400 font-medium mt-1 block">{confirmedBookings.length}</span>
                  <span className="text-[10px] text-[#A6AAA4] mt-1 block">Verified leases</span>
                </motion.div>
                <motion.div variants={fadeUpCardVariants} whileHover={cardHoverLift} className="p-5 rounded-xl bg-[#191D1C] border border-white/10">
                  <span className="text-[10px] uppercase tracking-wider text-[#A6AAA4] block">Saved Sanctuaries</span>
                  <span className="font-serif text-3xl text-[#C6A36A] font-medium mt-1 block">{savedProperties.length}</span>
                  <span className="text-[10px] text-[#A6AAA4] mt-1 block">Shortlisted homes</span>
                </motion.div>
              </motion.div>

              {/* Recent Bookings List Preview */}
              <motion.div
                variants={fadeUpCardVariants}
                initial="hidden"
                animate="visible"
                className="rounded-xl bg-[#191D1C] border border-white/10 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-xl text-white">Active Housing Inquiries</h3>
                  <button onClick={() => setActiveTab('bookings')} className="text-xs text-[#C6A36A] hover:underline uppercase tracking-wider">
                    View All ({bookings.length})
                  </button>
                </div>

                {bookings.length === 0 ? (
                  <div className="text-center py-10">
                    <Calendar className="w-8 h-8 text-[#A6AAA4] mx-auto mb-2 opacity-40" />
                    <p className="text-xs text-[#A6AAA4]">You have no active housing inquiries.</p>
                    <motion.button
                      whileHover={buttonHoverScale}
                      whileTap={buttonTapScale}
                      onClick={onReturnHome}
                      className="mt-3 px-4 py-2 bg-[#C6A36A] text-[#101313] text-xs uppercase tracking-wider rounded font-medium"
                    >
                      Explore Campuses
                    </motion.button>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {bookings.slice(0, 3).map((b) => (
                      <div key={b.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img src={b.property_image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=150&q=80'} alt="" className="w-12 h-12 rounded object-cover" />
                          <div>
                            <span className="text-xs text-white font-medium block">{b.property_name}</span>
                            <span className="text-[10px] text-[#A6AAA4]">Ref: {b.booking_reference} &bull; Check-in: {b.check_in_date}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <span className={`px-2.5 py-1 rounded text-[10px] font-semibold uppercase ${
                            b.status === 'confirmed' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40' :
                            b.status === 'pending' ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40' :
                            'bg-red-950/60 text-red-300 border border-red-500/40'
                          }`}>
                            {b.status}
                          </span>
                          <span className="font-serif text-sm text-white">${b.monthly_rent}/mo</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* MY BOOKINGS TAB */}
          {activeTab === 'bookings' && (
            <motion.div
              key="student-bookings"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C6A36A]">
                  RESERVATION PORTFOLIO
                </span>
                <h2 className="font-serif text-3xl text-white font-normal mt-1">My Bookings & Inquiries</h2>
                <p className="text-xs text-[#A6AAA4]">Manage all active and past campus accommodation leases.</p>
              </div>

              <motion.div variants={listStagger} initial="hidden" animate="visible" className="space-y-4">
                {bookings.map((b) => (
                  <motion.div
                    key={b.id}
                    variants={fadeUpCardVariants}
                    whileHover={cardHoverLift}
                    className="p-6 rounded-xl bg-[#191D1C] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-luxury"
                  >
                    <div className="flex items-start gap-4">
                      <img src={b.property_image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80'} alt="" className="w-24 h-20 rounded-lg object-cover" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-xl text-white">{b.property_name}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            b.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300' :
                            b.status === 'pending' ? 'bg-amber-500/20 text-amber-300' :
                            'bg-red-500/20 text-red-300'
                          }`}>
                            {b.status}
                          </span>
                        </div>
                        <span className="text-xs text-[#C6A36A] block mt-0.5">Booking Ref: {b.booking_reference}</span>
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
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-center">
                      {b.status === 'pending' && (
                        <motion.button
                          whileTap={buttonTapScale}
                          onClick={() => handleCancelBooking(b.id)}
                          className="px-3.5 py-2 text-xs uppercase tracking-wider text-red-400 hover:text-red-300 border border-red-500/30 rounded"
                        >
                          Cancel Request
                        </motion.button>
                      )}
                      <span className="text-xs text-[#A6AAA4]">
                        {b.status === 'confirmed' ? 'Verified Room Reserved' : 'Awaiting Landlord Confirmation'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* SAVED PROPERTIES TAB */}
          {activeTab === 'saved' && (
            <motion.div
              key="student-saved"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C6A36A]">
                  FAVORITES
                </span>
                <h2 className="font-serif text-3xl text-white font-normal mt-1">Saved Sanctuaries</h2>
                <p className="text-xs text-[#A6AAA4]">Your hand-picked student residences for upcoming semesters.</p>
              </div>

              {savedProperties.length === 0 ? (
                <div className="p-12 text-center rounded-xl bg-[#191D1C] border border-white/10">
                  <Bookmark className="w-8 h-8 text-[#A6AAA4] mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-[#A6AAA4]">You have not bookmarked any properties yet.</p>
                </div>
              ) : (
                <motion.div
                  variants={listStagger}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {savedProperties.map((p) => (
                    <PropertyCard
                      key={p.id}
                      property={p}
                      onViewDetails={() => onOpenPropertyDetails(p)}
                      isFavorite={true}
                      onToggleFavorite={() => {
                        const updated = savedProperties.filter(sp => sp.id !== p.id);
                        setSavedProperties(updated);
                        mockDb.saveFavourites(updated.map(u => u.id));
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <motion.div
              key="student-notifications"
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
                  <h2 className="font-serif text-3xl text-white font-normal mt-1">Notifications</h2>
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
                {notifications.map((n) => (
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
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <motion.div
              key="student-profile"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6 max-w-xl"
            >
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C6A36A]">
                  SCHOLAR CREDENTIALS
                </span>
                <h2 className="font-serif text-3xl text-white font-normal mt-1">My Account Profile</h2>
                <p className="text-xs text-[#A6AAA4]">Ensure your details match your university student identification.</p>
              </div>

              <AnimatePresence>
                {profileSaved && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs rounded"
                  >
                    Profile changes successfully updated.
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleProfileSubmit} className="space-y-4 rounded-xl bg-[#191D1C] border border-white/10 p-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                    className="w-full bg-[#101313] border border-white/10 text-xs text-white p-3 rounded focus:outline-none focus:border-[#C6A36A]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">University Email</label>
                  <input
                    type="email"
                    disabled
                    value={profileForm.email}
                    className="w-full bg-[#101313]/60 border border-white/5 text-xs text-[#A6AAA4] p-3 rounded cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">Enrolled College / Campus</label>
                  <input
                    type="text"
                    value={profileForm.college}
                    onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
                    className="w-full bg-[#101313] border border-white/10 text-xs text-white p-3 rounded focus:outline-none focus:border-[#C6A36A]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#A6AAA4] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full bg-[#101313] border border-white/10 text-xs text-white p-3 rounded focus:outline-none focus:border-[#C6A36A]"
                  />
                </div>

                <motion.button
                  whileHover={buttonHoverScale}
                  whileTap={buttonTapScale}
                  type="submit"
                  className="w-full py-3 bg-[#C6A36A] hover:bg-[#d8b57c] text-[#101313] font-semibold text-xs uppercase tracking-widest rounded-sm transition-colors"
                >
                  Save Profile Updates
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
